---
title: "Debian Linux Initial Setup Guide"
date: 2023-11-12T16:48:29-05:00
tags: ["linux"]
---

Whenever I buy a computer or have to re-install the operating system, I find myself gravitating towards Debian-based Linux distributions for the operating system. In the recent past, this has included Ubuntu, Raspberry Pi OS, and Pop!\_OS. I have to run through very similar initial steps to get started with all of these, so it's about time to document them! <!--more-->

## Update the computer! ⬆

Run the command: `sudo apt-get update && sudo apt-get upgrade`

This will check for updates and install them.

## Add firewall and disable unnecessary services 🛡️

Install ufw (uncomplicated firewall): `sudo apt install ufw`

For Ubuntu devices, remove the Apache web server: `sudo apt purge apache2`

## Setup remote access 🌐

I have 2 use cases for machines - headless servers, and daily drivers PCs that I need the graphical user interface for. Setup varies slightly for the different use cases.

1. Install Tailscale VPN: https://tailscale.com/download
2. Install SSH (for headless systems)

- `sudo apt install openssh-server` - installs the SSH server
- `sudo systemctl start ssh` - start the SSH server
- `sudo systemctl enable ssh` - enable SSH on computer boot

3. Install fail2ban SSH intrusion software, using default settings

- `sudo apt install fail2ban` - install the software
- `sudo systemctl enable fail2ban` - enable fail2ban on computer boot
- `sudo systemctl start fail2ban` - start the fail2ban service

4. Setup key-based SSH login

- On any client devices, generate SSH keys using `ssh-keygen` and copy the public key to the server using `ssh-copy-id`
- Disable root login and password login in the SSH configuration file `/etc/ssh/sshd_config`
  - Set: `PasswordAuthentication no`
  - Set: `PermitRootLogin no`
  - Save changes
  - `sudo systemctl restart ssh` - restart the SSH service to apply changes

## Install dev tools 🛠️

- Git: version control tool
  - `sudo apt install git`
  - If using GitHub repositories:
    - setup fine-grained Git access tokens, for scoped access to private Git information
    - setup signed commits
- net-tools: utilities for managing network, including `ifconfig` to get network adapter information
  - `sudo apt install net-tools`
- Neovim: a more feature rich version of Vim, which is a terminal text editor
  - `sudo apt-get install neovim`
- Docker: containerization tool, which I use to run many services on my network
  - Installation instructions: https://docs.docker.com/engine/install/

## Setup user session scripts 📄

Add the following to the `~/.bash_profile` file:

```bash
# Quickly navigate to Git repository directory
alias repo='cd ~/repos'
# Quickly clear the screen input, using the Windows command
alias cls='clear'
# Checkout the main branch and pull
alias main='git checkout main && git pull'
# Set my terminal prompt, so it has Git branch information and looks consistent across devices
export PS1='\n\[\e[1;37m\]\[\e[1;32m\]\u\[\e[0;39m\]@\[\e[1;36m\]\h\[\e[0;39m\]:\[\e[1;33m\]\w\[\e[0;39m\]\[\e[1;35m\]$(__git_ps1 " (%s)")\[\e[0;39m\]\[\e[1;37m\]\[\e[0;39m\]\n$ '
# Simplify the computer update process with an "update" command
alias update='sudo apt update && sudo apt upgrade'
```

## Disable Ubuntu crash reporting and telemetry 🕶️

Run the following commands:

```bash
sudo apt purge -y apport
sudo apt remove -y popularity-contest
sudo apt autoremove -y
```

## Setup computer backups 🔄

The methods for backing up your machine can widely vary here. My usual go-to is running [syncthing](https://github.com/syncthing/syncthing) with Docker to keep important files backed up with a storage server.

## Other 😄

For headed systems: set keyboard shortcuts! Ideas for shortcuts to add usually include:

- opening applications menu, search, workspaces
- play, pause, next song, previous song
- mute microphone
