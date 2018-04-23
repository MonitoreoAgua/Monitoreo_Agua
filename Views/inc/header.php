<!--
  Material Design Lite
  Copyright 2015 Google Inc. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
      https://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License
-->

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Monitoreo de Aguas UCR</title>

    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">

    <link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.teal-blue.min.css" />
    <script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>
    <link href="https://fonts.googleapis.com/css?family=Raleway:400,500,700" rel="stylesheet">
    <script src="https://www.gstatic.com/firebasejs/ui/2.3.0/firebase-ui-auth__es.js"></script>
    <link type="text/css" rel="stylesheet" href="https://www.gstatic.com/firebasejs/ui/2.3.0/firebase-ui-auth.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="/css/styles.css">

    <meta name="google-signin-client_id" content="611331689699-kscvghuqg1c8rtj6utj5mshofsma7kjg.apps.googleusercontent.com">
    <script src="https://apis.google.com/js/platform.js" async defer></script>

    <script>
    // Client ID and API key from the Developer Console
          var CLIENT_ID = '611331689699-kscvghuqg1c8rtj6utj5mshofsma7kjg.apps.googleusercontent.com';
          var API_KEY = 'AIzaSyBF0VFFF-7ojo6bKf_G81kq2cazEhaB2cc';

          // Array of API discovery doc URLs for APIs used by the quickstart
          var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

          // Authorization scopes required by the API; multiple scopes can be
          // included, separated by spaces.
          var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

          var authorizeButton = document.getElementById('authorize-button');
          var signoutButton = document.getElementById('signout-button');

          /**
           *  On load, called to load the auth2 library and API client library.
           */
          function handleClientLoad() {
            gapi.load('client:auth2', initClient);
          }

          /**
           *  Initializes the API client library and sets up sign-in state
           *  listeners.
           */
          function initClient() {
            gapi.client.init({
              apiKey: API_KEY,
              clientId: CLIENT_ID,
              discoveryDocs: DISCOVERY_DOCS,
              scope: SCOPES
            }).then(function () {
              // Listen for sign-in state changes.
              gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

              // Handle the initial sign-in state.
              updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
              // authorizeButton.onclick = handleAuthClick;
              // signoutButton.onclick = handleSignoutClick;
            });
          }

          /**
           *  Called when the signed in status changes, to update the UI
           *  appropriately. After a sign-in, the API is called.
           */
          function updateSigninStatus(isSignedIn) {
            // authorizeButton = document.getElementById('authorize-button');
            // signoutButton = document.getElementById('signout-button');
            // if (isSignedIn) {
            //   authorizeButton.style.display = 'none';
            //   signoutButton.style.display = 'block';
            // } else {
            //   authorizeButton.style.display = 'block';
            //   signoutButton.style.display = 'none';
            // }
          }

          /**
           *  Sign in the user upon button click.
           */
          function handleAuthClick(event) {
            gapi.auth2.getAuthInstance().signIn();
          }

          /**
           *  Sign out the user upon button click.
           */
          function handleSignoutClick(event) {
            gapi.auth2.getAuthInstance().signOut();
          }

          /**
           * Append a pre element to the body containing the given message
           * as its text node. Used to display the results of the API call.
           *
           * @param {string} message Text to be placed in pre element.
           */
          function appendPre(message) {
            var pre = document.getElementById('content');
            var textContent = document.createTextNode(message + '\n');
            pre.appendChild(textContent);
          }

           function addEvent()
           {
             var event = {
  'summary': 'Google I/O 2015',
  'location': '800 Howard St., San Francisco, CA 94103',
  'description': 'A chance to hear more about Google\'s developer products.',
  'start': {
    'dateTime': '2015-05-28T09:00:00-07:00',
    'timeZone': 'America/Los_Angeles'
  },
  'end': {
    'dateTime': '2015-05-28T17:00:00-07:00',
    'timeZone': 'America/Los_Angeles'
  },
  'recurrence': [
    'RRULE:FREQ=DAILY;COUNT=2'
  ],
  'attendees': [
    {'email': 'lpage@example.com'},
    {'email': 'sbrin@example.com'}
  ],
  'reminders': {
    'useDefault': false,
    'overrides': [
      {'method': 'email', 'minutes': 24 * 60},
      {'method': 'popup', 'minutes': 10}
    ]
  }
};

var request = gapi.client.calendar.events.insert({
  'calendarId': 'primary',
  'resource': event
});

request.execute(function(event) {
  appendPre('Event created: ' + event.htmlLink);
});
           }
        
</script>
    <script async defer src="https://apis.google.com/js/api.js"
      onload="this.onload=function(){};handleClientLoad()"
      onreadystatechange="if (this.readyState === 'complete') this.onload()">
    </script>
