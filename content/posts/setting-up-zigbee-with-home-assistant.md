---
title: "Setting Up Zigbee With Home Assistant"
date: 2022-11-22T22:01:08-05:00
excerpt: "Expanding my home automation with a network of Zigbee devices."
---

Now that my Home Assistant server is set up, it's time to start adding device integrations! But... there's some choices to make before diving into this and buying new smart devices. Let's break those down!

There are 3 main ways to connect a device to Home Assistant: Zigbee, Z-Wave, and WiFi. Zigbee has 2 different techniques that you can use to pair devices: Zigbee Home Automation (ZHA) and Zigbee2MQTT.

For starters, there's **WiFi**. Devices connect to your local network, and since your Home Assistant server _is on the same network_ they can see each other and integrate. These devices are very common. The downside here is that there's nothing stopping your WiFi device from talking to the external web. Possible solutions for preventing this include installing custom firmware onto the device (which may require some soldering) or blocking external access to the device from your router (which may lead to loss in device functionality).

Next up, there's **Z-Wave**. Z-Wave is a mesh network for devices, where all of your smart devices can talk to each other and communicate with your server through a USB receiver.

Finally, there's **Zigbee**. Zigbee is similar to Z-Wave in that it is a mesh network of devices that communicates to your server through a USB receiver. The range may be slightly less than Z-Wave, since it uses the same 2.4Ghz frequency as your WiFi network.

I ended up choosing to get into the Zigbee ecosystem because the compatible devices that I needed were easy to find, and the ZHA pairing process looked simple.

## The hardware I'm using

- **Zigbee receiver:** ConBee II Universal Zigbee USB Gateway, with USB 2.0 extension cable
- **Zigbee smart devices**
  - Sengled Smart Plugs - [Amazon link](https://www.amazon.com/Sengled-Compatible-Required-Appliances-Certified/dp/B08FJ5LHSN/ref=sr_1_5?keywords=sengled+zigbee+plug&qid=1669000687&sr=8-5)
    - _Note: this device can work as a Zigbee repeater. See "Using Zigbee device as a repeater" below._
  - THIRDREALITY Zigbee Smart Button - [Amazon link](https://www.amazon.com/THIRDREALITY-Compatible-SmartThings-Assistant-Included/dp/B09ZQGZX3G/ref=sr_1_4?crid=3V5I6WU6Q323F&keywords=third+reality+light+switch&qid=1669000776&sprefix=thirdreality+light+switc%2Caps%2C116&sr=8-4)

## Setting up the Zigbee receiver

Before getting started, it's important to note that Zigbee is very prone to interference from USB 3.0 ports. It is recommended to use a USB 2.0 extension cable to prevent connection issues and increase Zigbee reliability.

### Part 1: passing Zigbee receiver into Docker container

1. Plug your ConBee receiver USB stick into the extension cable, and plug the extension cable into an available USB port on the computer. The extension cable prevents signal interference from your computer.
2. Confirm that your ConBee receiver is talking with your Raspberry Pi.
   1. Enter the command `lsusb` (list USB devices), and you should see an entry saying something similar to "Dresden Elektronik ZigBee gateway".
   2. `ls -la /dev | grep ttyACM*` - list out all the devices in your "/dev" folder and find any that match the pattern "ttyACM\*". Your ConBee USB device will be one of these, and this is what needs to be passed to the Docker container.
3. Troubleshooting: if you're not seeing your device showing up, follow the [manufacturer's instruction](https://phoscon.de/en/conbee2/install#raspbian) to install the software for your ConBee II. Repeat step 2 to confirm that this worked.
4. Modify your `compose.yml` to pass through your USB Zigbee receiver into the Docker container. It'll look something like this:
   ```yml
   version: "3"
   services:
     homeassistant:
       container_name: homeassistant
       image: "ghcr.io/home-assistant/home-assistant:stable"
       volumes:
         - /home/joanna/dev/config:/config
         - /etc/localtime:/etc/localtime:ro
       devices: # New entry for your ConBee device
         - /dev/ttyACM0:/dev/ttyUSB0 # Taking the USB device in your file system, "/dev/ttyACM0",
           # and placing it in the container file system at "/dev/ttyUSB0"
       restart: unless-stopped
       privileged: false
       network_mode: host
   ```
5. In the same directory where your `compose.yml` lives, restart the Docker container with the new configuration. `sudo docker compose up -d`

### Part 2: setup receiver with Home Assistant

1. Log in to the Home Assistant UI, and go to "Settings > Devices & Services > Add Integration"
2. Search for "zha", and choose "Zigbee Home Automation".
3. You will be prompted to input the path to your USB device. Select `/dev/ttyUSB0` from the dropdown.
4. If prompted to inptu the type of radio hardware, choose "deconz".
5. Choose the "Area" in your home for your device (in my case, I made one called "Apartment" since this controller will be used for devices throughout the home), and click "Finish". Your receiver is ready to start pairing!

## How to connect Zigbee devices

These instructions are for pairing your Zigbee devices via "Zigbee Home Assistant", also known as "ZHA". I chose this technique because the integration ships with the default Home Assistant installation with no additional configuration. The easier the better!

1. Follow the instructions on your device to turn it on and start pairing mode. In the case of the Sengled smart plugs, they're in pairing mode by default when you plug them in.
2. Go into "Settings > Devices & Services > Add Integration", search for "zha" and select "Zigbee Home Automation".
3. Choose "Add Zigbee Device".
4. You'll see a message saying "Searching for Zigbee devices...". Your device should show up quickly. Give it a name and select the Area in the house that it belongs to for grouping (ex. "Living Room") and you're good to go! The new device will show up in your landing dashboard.

### Using Zigbee device as a repeater

Some Zigbee devices can be used as "repeaters", meaning that you can connect new devices to this repeater rather than to the USB receiver directly. Since they all connect in a mesh network, this will not cause any problems with communication to your Home Assistant server.

I used this functionality for rooms deeper in my apartment, and paired new devices to the nearest Zigbee device rather than the USB receiver directly.

1. Go to "Settings > Devices & Services".
2. Under "Zigbee Home Automation", click "Configure".
3. Click "Devices", then choose the device that you would like to connect to as a repeater.
4. In the "Device Info" card, click the three ellipses "...", then choose "Add devices via this device".
5. The pairing process is now the same as just adding another Zigbee device. Give the device a name and area assignment, and you're off to the races!
