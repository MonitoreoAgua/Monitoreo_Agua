var name_google, email_google, id_google;

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  document.getElementsByClassName("bg")[0].style.display = "none";
  name_google = profile.getName();
  email_google = profile.getEmail();
  id_google = profile.getId();
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function() {
    document.getElementsByClassName("bg")[0].style.display = "block";
    $("#login_content").fadeIn("slow");
  });
}

$(window).on('load', function(){
  $("#page_loader").fadeOut("slow");
  if ($(".bg").is(":visible"))
  {
    $("#login_content").fadeIn("slow");
    handleClientLoad();
  }
  
  $("#correo").attr('value', email_google);

});


$(".verAforo").on('click',function(){
    var newHref = $(this).attr('href');
    $(this).attr("href",newHref+email_google);
}); 