// Client ID and API key from the Developer Console
var CLIENT_ID = '611331689699-kscvghuqg1c8rtj6utj5mshofsma7kjg.apps.googleusercontent.com';
var API_KEY = 'AIzaSyBF0VFFF-7ojo6bKf_G81kq2cazEhaB2cc';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar";

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
    // gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
  });
}
