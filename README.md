# Auto-Wrap-up

This project serves as an example of how to send an automated wrapup code with Webex Contact Center (WxCC) Agent Desktop when an interaction ends.

## [Watch the Video: Auto-Wrap-Up]()

Features:
  - Automatically wraps an interaction with the provided wrapup code
  - When on an interaction an agent can request after-call work, by clicking the header button
  - Works for blended agents with multiple simultaneous interactions
  - Correctly handles transfers and conferences when not the owner of the interaction is not the agent
  - On initialization the widget checks if the configured wrapup code is valid, else notifies the agent

Note:
This project is intended for demonstration and educational purposes.

## Getting Started
If you wish to run the widget without making any changes, use the pre-built version located in the dist folder and start with step six. Alternatively, follow the instructions below to build and deploy the widget.

1. Download this project or ```git clone https://github.com/dwfinnegan/auto-wrap-up```
2. From the project directory run ```npm install```
3. Modify the code to suit your needs
4. Run ```npm run build``` to build the widget
   - The build process dumps the output in the dist folder
5. Rename the file as needed, but I would suggest auto-wrap-up.js 
6. Copy the file auto-wrap-up.js to your preferred cloud storage platform
7. Add the widget to your Desktop Layout Advanced Header section (example snippet below). 
8. Define the following properties on the widget
   - darkMode: always set to $STORE.app.darkMode (required)
   - taskSelected: always set to $STORE.agentContact.taskSelected (required)
   - wrapupCodeId: the id of the automated wrapup code (required)

<pre lang="JSON">
  "advancedHeader": [
    {
      "comp": "auto-wrap-up",
      "properties": {
        "darkMode": "$STORE.app.darkMode",
        "taskSelected": "$STORE.agentContact.taskSelected",
        "wrapupCodeId": "7f7409d1-e1ea-3881-896d-a09495e16a13"
      },
      "script": "https://some-storage-location.com/auto-wrap-up.js"
    }
  ]
</pre>