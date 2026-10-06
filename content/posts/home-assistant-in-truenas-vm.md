---
title: "How to host Home Assistant in a TrueNAS Scale VM"
date: 2024-10-14T19:10:49-04:00
excerpt: "Unlocking the full capabilities of Home Assistant Operating System using a TrueNAS virtual machine."
---

**Objective:** migrate an existing Home Assistant Container installation to Home Assistant OS using a virtual machine on a TrueNAS Scale host.

Additional requirements:

- USB passthrough to the VM for a Zigbee controller
- VM is on a different VLAN than the TrueNAS host
- VM allows network requests to the TrueNAS host to allow for file share access
- Restore prior Home Assistant backup from a Home Assistant Container installation

Instructions for creating a Home Assistant VM in TrueNAS Scale were largely inspired by this forum post - kudos to all of the documentation there.

<https://community.home-assistant.io/t/installing-haos-in-a-vm-on-truenas-scale/511393>

## Backup the existing Home Assistant installation

For this tutorial, the existing installation is using the HA Docker container. These steps may work with other installation methods as well.

1. Sign in to the existing HA installation, and navigate to Settings > System > Backups
2. Click the "Create Backup" button, then press "Create" in the confirmation modal.
3. Once the backup is complete, it will appear in the list. Download a copy of the latest backup.
4. `docker compose down` - stop the running Home Assistant container.

## Create the storage location

1. In the TrueNAS admin UI, create a new Zvol under "Datasets > New Zvol". Make sure the Zvol is 32GiB or greater in size. Take note of the resulting Zvol path.
2. Take note of the latest `*.qcow2` installation media link from [the installation documentation](https://www.home-assistant.io/installation/alternative).
3. Start a terminal session in the TrueNAS host.
4. `wget https://github.com/home-assistant/operating-system/releases/download/13.1/haos_ova-13.1.qcow2.xz` - download the installation media, replacing the URL with the latest link found in step 2.
5. `unxz haos_ova-13.1.qcow2.xz` - decompress installation media
6. `qemu-img convert -O raw haos_ova-13.1.qcow2 /dev/zvol/[PATH/TO/ZVOL]` - write the raw image to your Zvol, using the path from step 1.

## Create the network adapter

This will create the bridged network adapter that allows the VM to access shares on its host, and puts the VM on a different VLAN.

1. Navigate to Network > Interfaces > Add
2. Create the interface
   - Type: VLAN
   - Name: `vlan[vlan tag]`
   - DHCP: enable (unless a static IP has already been allocated)
   - Parent interface: select your network adapter, ex. `enp7s0`
   - VLAN tag: your VLAN tag
   - Leave everything else at default
3. Save > Test Changes. "Save Changes" if successful. Take note of the IP address.
4. Create the bridge interface: Network > Interfaces > Add
   - Type: Bridge
   - Name: br0
   - Bridge members: `vlan[vlan tag]` (the VLAN that was just created)
   - Aliases: add an entry for the IP address that was just assigned to the VLAN
     - ex. 192.168.2.10/24
5. Save > Test Changes. "Save Changes" if successful.
6. Edit the VLAN interface and disable DHCP. Save the changes.

## Create the VM

1. Navigate to Virtualization > Add
2. Operating System
   - Guest Operating System: Linux
   - Name: home_assistant_os
   - Boot method: UEFI
   - Password: set a password, which will be used to access the VM display
   - Leave all other settings at defaults
3. CPU and Memory
   - Choose at least 2 cores and 1 thread
   - CPU Mode: Host Passthrough
   - Memory size: at least 2GiB, more is better
4. Disks
   - Use existing disk image
   - Set the path to the path of the Zvol (from prior steps, this would be PATH/TO/ZVOL)
5. Network Interface
   - Adapter Type: VirtIO
   - Mac Address: leave as-is
   - Attach NIC: br0
6. Installation Media: skip
7. GPU: defaults are ok
8. Confirm Options > Save

## Restore Home Assistant backup

Find the new Home Assistant instance, and restore the previous backup.

1. In the new VM, choose "Display" then enter the password you set for accessing the VM display
2. Once Home Assistant is loaded, it should show the IP address that it is running on.
3. Navigate to the instance in a web browser, ex. <http://192.168.2.22:8123>
4. Follow the instructions to create an account with your desired username and password.
5. After setup is completed, navigate to Settings > System > Backups
6. Under the ellipses menu in the top right, choose "Upload backup"
7. Upload the backup file that was downloaded from the previous instance. This may take a couple of minutes to restore.
8. The previous Home Assistant configurations should now be visible, with failures in Zigbee due to the missing Zigbee controller.

## Pass USB Zigbee controller into the VM

The VM needs to be given access to the Zigbee controller from the TrueNAS host. I am using the "ConBee II Zigbee Controller", which has known issues with the virtual machine. Rather than using USB Passthrough, the PCI controller needs to be passed through directly instead. The forum post with the instructions for PCI passthrough can be found here:

<https://community.home-assistant.io/t/installing-haos-in-a-vm-on-truenas-scale/511393/51>

1. Plug the Zigbee controller into the host machine. If the USB port is using USB 3, consider using a USB 2 extension cable to prevent interference with the Zigbee signal.
2. In the TrueNAS Scale UI, navigate to Virtualization
3. For the `home_assistant_os` VM, set state to off.
4. Open a shell in the TrueNAS host.
5. `ls /dev/serial/*` - list out all the serial devices. Take note of the USB PCI path. The path will look something like `pci-0000:09:00.3 ...`
6. In the TrueNAS UI, navigate to Virtualization, expand the entry for home_assistant_os, then choose Devices. Click "Add".

- Type: PCI Passthrough Device
- PCI Passthrough Device: find the entry that matches the ID from step 5. This will look something like `0000:09:00.3 'USB controller': Matisse USB 3.0 Host Controller`
- Device Order: increment this to the next ID that's not already being used by a device. In my case, this was `1004`.

7. Save. Navigate back to the "Virtualization" page, then set the state toggle for home_assistant_os to ON.
8. Once Home Assistant boots, check that Zigbee is working. You should be all set!

## Troubleshooting issues with USB controller

It's possible that the path for the USB controller in the Docker container was mapped to a different path than it is in the new Docker VM. This path is set in the `/config/.storage/core.config_entries` file for further troubleshooting.

Consider installing the "Visual Studio Code" addon for easy access to a terminal and a text editor for config files or logs.

## Configuring backups to a network share

1. In Home Assistant, navigate to Settings > System > Storage
2. Click "Add network storage"
3. Fill in the details for your network share, using the IP address of the TrueNAS Scale host
4. Navigate to Settings > System > Backups
5. Under the ellipses menu in the top right, choose "Change default backup location"
6. Select the network share that was just added

## Configuring automatic nightly backups

1. Navigate to Settings > Automations & scenes > Create automation
2. Use the following YAML:

```yml
alias: Nightly backup
description: ""
mode: single
triggers:
  - at: "23:00:00"
    trigger: time
conditions: []
actions:
  - action: hassio.backup_full
    metadata: {}
    data:
      compressed: true
      homeassistant_exclude_database: false
```

3. Save, and run the automation once to test that it worked.

## Next steps

See the ["Common Tasks - Operating System"](https://www.home-assistant.io/common-tasks/os/) documenation for ideas what to do next!
