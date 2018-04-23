var name_google, email_google;

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  document.getElementsByClassName("bg")[0].style.display = "none";
  name_google = profile.getName();
  email_google = profile.getEmail();
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function() {
    document.getElementsByClassName("bg")[0].style.display = "block";
  });
}

$(window).on('load', function(){
  $("#page_loader").fadeOut("slow");
  if ($(".bg").is(":visible"))
    $("#login_content").fadeIn("slow");
});
