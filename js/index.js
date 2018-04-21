var name_google, email_google;

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  document.getElementsByClassName("login-cover")[0].style.display = "none";
  name_google = profile.getName();
  email_google = profile.getEmail();
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function() {
    document.getElementsByClassName("login-cover")[0].style.display = "block";
  });
}
