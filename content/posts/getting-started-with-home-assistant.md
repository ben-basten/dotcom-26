---
title: "Getting Started With Home Assistant"
date: 2022-11-15T18:20:36-05:00
tags: ["home-assistant", "raspberry-pi"]
---

I have been spending some time learning more about cybersecurity, and the more I learn the more I become suspicious of the internet connected devices that I use on a daily basis. For example, I'm a daily user of WiFi smart plugs. I love being able to remotely schedule my lights to turn on and off, or simply just turn on all of the living room lights without having to individually toggle all of the lamps. But are they secure?

How often are these plugs sending requests to the remote server? Is their network traffic encrypted with SSL? Are my daily usage patterns being tracked? Is the remote server logging my location? Who is managing this remote server?

...are a couple of questions that come to mind. After doing some reading, I found a solution for many of these problems - hosting the home automation server myself using the free and open-source "Home Assistant" software.

## So... what is Home Assistant?

Home Assistant puts the power of smart home automation in your hands, where the central controller is a local server. HA can integrate with a variety of different devices, including thermostats, plugs, lights, solar panels, and more.

There's alternative home automation ecosystems like Samsung SmartThings, but there were a couple of factors that led me to choose Home Assistant:

- **Active community:** I've found all sorts of forum posts, Reddit threads, and GitHub repos with folks sharing about their experiences.
- **Open source:** the software is out in the open for anyone to see. It's also empowering - anyone can open an issue report in GitHub or propose solutions.
- **Solid device support:** from what I've seen so far, it seems like Home Assistant supports integrations with a wide variety of devices out of the box. Some require more setup than others....

All that being said, I've found that this experiment isn't for the faint of heart. It's still up to you to configure and maintain your personal setup.

## Installation Background

For this HA installation, I will be installing the software on a Raspberry Pi.

There are a couple of different methods for installing Home Assistant, as outlined by [the documentation](https://www.home-assistant.io/installation/raspberrypi/). Options include:

1. Installing the Home Assistant operating system
2. Running Home Assistant in a Docker container
3. Installing Home Assistant Core, which is essentially a Python package

I opted for #2, creating a docker container. One thing to note is that the Docker installation of Home Assistant _does not_ include "Supervisor" functionality, which gives you access to the addon store. This functionality is only available with the Home Assistant OS, read more about it [here](https://www.home-assistant.io/integrations/hassio/). I didn't know about this going into the installation, but so far it hasn't been a showstopper and I've been able to setup everything that I need.

## Setting up Home Assistant with Docker Container

A prerequisite to this task is to make sure that the Raspbian OS is installed on your machine. See installation options [here](https://www.raspberrypi.com/documentation/computers/getting-started.html#installing-the-operating-system).

Before firing up the Docker Container, I did a couple of things to prepare the system.

**Setup SSH access**

1. `sudo apt-get install openssh-server` - installs the SSH software
2. `sudo systemctl enable ssh` - enable the service
3. `sudo systemctl start ssh` - start the SSH service
4. Edit your `/etc/ssh/sshd_config` file, and set the `PermitRootLogin` property to `no`. This will prevent remote users from trying to login as the `root` user.
5. `sudo apt install fail2ban` - install the fail2ban software that protects the computer from malicious logins by scanning log files.
6. `sudo systemctl status fail2ban` - verify that the service is active.

**Setup the firewall**

1. `sudo apt install ufw` - install ufw, AKA "uncomplicated firewall"
2. `sudo ufw allow 22` - allow access through the firewall on port 22. This will allow you to remotely access your computer over SSH, without requiring a monitor.
3. `sudo ufw enable` - enable the service
4. `sudo ufw status` - you should see a message indicating that the firewall is now active

**Install Docker**

Since Docker is being installed on Raspbian OS, the documentation indicates that the "convenience script" is required for installing Docker. [Find the instructions here](https://docs.docker.com/engine/install/debian/#install-using-the-convenience-script). Those steps will probably be more up-to-date than this documentation.

One thing to note is that this installation unfortunately requires running Docker as the `root` user. There's additional post-installation steps required to set it up more securely in root-less mode.

## Starting the Home Assistant container

We'll be using Docker Compose to start Home Assistant. This requires a `compose.yml` file with your Docker configurations.

1. `mkdir home-assistant` - create a directory for all of the Home Assistant-related installation files. Feel free to create it wherever you'd like.
2. `mkdir home-assistant/config` - create the `config/` directory, which will shortly be where the Home Assistant will be storing all of its configuration files.
3. `touch home-assistant/compose.yml` - file for the Docker settings
4. Modify `home-assistant/compose.yml` with the following:
   ```yml
   version: "3"
   services:
     homeassistant:
       container_name: homeassistant
       image: "ghcr.io/home-assistant/home-assistant:stable"
       volumes:
         - YOUR_PATH_TO_CONFIG:/config
         - /etc/localtime:/etc/localtime:ro
       restart: unless-stopped
       privileged: false
       network_mode: host
   ```
   - Note: YOUR_PATH_TO_CONFIG needs to be replaced with the path to the `config/` directory that was just created. It could look something like this: `/home/yourUsername/home-assistant/config`
5. `docker pull ghcr.io/home-assistant/home-assistant:stable` - make sure the Docker image is up to date
6. `sudo docker compose up -d` - start your Docker container! Your Home Assistant server will be listening on port 8123 by default. Check it out at http://localhost:8123/!

## Onboarding

Now that Docker is up and running, you're good to get started with the Onboarding process! The web client will guide you through the process of creating a local user account and doing the initial setup. You can read more about that process [here](https://www.home-assistant.io/getting-started/onboarding/).

With these initial setup steps, your Home Assistant instance will only be accessible from your internal network.

## On my radar to try next...

- Setting up Zigbee devices with HA
- Setting up external access to the HA instance
- Connecting HA to Google Assistant, primarily to enable voice commands with a smart speaker. This requires external access to the server with https enabled.
