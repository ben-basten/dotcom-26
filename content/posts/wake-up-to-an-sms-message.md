---
title: "Wake Up to an SMS Message"
date: 2024-02-18T20:05:35-05:00
tags: ["home-assistant", "tutorial"]
---

**Problem statement:**

Automate a way to guarantee waking up when an SMS message is received from specified phone numbers.<!--more-->

**Solution overview:**

When SMS is received, phone volume will be increased, a song will play, and lights will be turned on using the Home Assistant REST API. This solution only works with Android phones.

**How to set this up:**

1. Create a Home Assistant "Group" with all of the lights to turn on
   1. In the Home Assistant app, navigate to Settings > Devices & services > Helpers > Create helper
   2. Choose "Group" > "Switch group"
   3. Give it a name, and input all of the light switch entities to turn on.
   4. "Submit" to save this new group!
2. Generate Home Assistant access token
   1. In the Home Assistant app, select your profile photo to navigate to "Profile" settings.
   2. Find "Long-lived access tokens", then choose "Create token".
   3. Copy the shown token to use later.
3. Set up lights automation
   1. Download the "[Tasker](https://play.google.com/store/apps/details?id=net.dinglisch.android.taskerm)" Android app. At the time of writing, it is $3.49 on the Google Play Store.
   2. In the "Tasks" tab, select the "+" floating action button. Give it a name, like "Notification Task"
   3. In the "Task Edit" screen, select the "+" floating action button > "Net" > "HTTP Request"
   4. Fill in the HTTP request details:
      - URL: `http://your_ha_ip:8123/api/services/switch/turn_on`
      - Headers
        ```
        Authorization:Bearer your_access_token
        Content-Type:application/json
        ```
      - Body
        ```json
        { "entity_id": "switch.your_light_group" }
        ```
      - Check the box "Continue Task After Error"
   5. Select the back button to save changes
   6. There is a play button in the bottom left corner to test that your HTTP request actually turns on the lights :)
4. Set up sound automation
   1. Select the "+" floating action button to create a new Action.
   2. Choose Audio > Media Volume > Set "Level" slider to desired volume.
   3. Create another action, then choose Media > Music Play
   4. In the "File" field, input the file path to your desired audio file to play.
   5. Press the back button 2x to save the Action and Task, which should now include turning on the lights, turning up the phone volume, and playing a song.
5. Set up SMS trigger
   1. In the "Profiles" tab, press the "+" floating action button > Create > Event > Phone > Received Text
   2. In the "Sender" field, select all contacts that you would like to receive notifications from in the event of a text message
   3. Press the back button to save. You will now be prompted to choose a Task that is kicked off when the trigger SMS is received.
   4. Choose the "Notification Task" (or whatever name was assigned in step 3.2) that was just created.
   5. Press the check mark button in the top nav to save. You're ready to go! 🎉
