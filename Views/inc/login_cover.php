<!-- <div class="login-cover"> -->
    <!-- MDL Spinner Component -->
    <!-- <div id="page_loader" class="page-loader mdl-spinner mdl-js-spinner is-active"></div>
    <div id="logindiv" class="page-loader">
        <h4 class="mdl-dialog__title">Monitoreo de agua UCR</h4>
        <p>Debes iniciar sesión para utilizar la plataforma.</p>
        <div id="loginData" class="mdl-dialog__content">
        </div>
    </div>
</div> -->
<style>
div.container2 {
	position: absolute;
top: 0;
right: 0;
bottom: 0;
left: 0;
margin: auto;
  width: 940px;
  height: 385px;
  overflow: hidden
}


div.container3 {
 width:30%;
    height:100%;
    float:left;
  background-color: rgba(85, 102, 51,0.6)
}

div.container3 img {
	margin-top: 40%;
	margin-left: -5%;
}

div.container4 {
width: 70%;
    height:100%;
  background-color: rgb(238, 238, 255);
  overflow: hidden
}

div.container4 h1 {
	font-size: 50px;
	color: rgb(51,170,221);
}
body, html {
    height: 100%;
}

.bg {
    /* The image used */
    background-image: url("/img/fondo.jpg");

    /* Full height */
    height: 100%;

    /* Center and scale the image nicely */
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;

		position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 100vh;
    z-index: 800;
    display: flex;
    justify-content: center;
    align-items: center;
}

.login-form {
  margin: 2rem 0 0 9rem;
  padding: 0.5rem;
}

.login-form p {
	font-size: 20px;
}

.loginBox {
	padding: 0.5rem 2.5rem;
}

.login-btn {
  position: absolute;
  left: 30rem;
  bottom: 1rem;
  border: 0.6rem solid transparent;
}
</style>
<script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script> <script src="../js/index.js"></script>
<!-- <div class="login-cover"> -->
	<div class="bg">
		<div class="container2">
			<div class="container3">
				<p><img src ="/img/logo.png"></p>
			</div>
			<div class="container4">
				<div align="left" class ="loginBox"> <h1>Monitoreo de agua UCR</h1> </div>
				<div class="login-form loginBox">
					<div id="page_loader" class="page-loader mdl-spinner mdl-js-spinner is-active"></div>
					<div id="login_content" style="display: none;">
						<p>Debes iniciar sesión para  utilizar la plataforma.</p>
						<div class="g-signin2" style="width: 420%; margin-top: 50px" data-onsuccess="onSignIn"></div>
					</div>
				</div>
				<!-- <div style="position: absolute; right: 1rem; bottom: 1.5rem;">O inicia sesión con <img src="img/google-icon.png" style="width:38px;height:38px;"> <img src="img/facebook-icon.png" style="width:32px;height:32px;"></div> -->
			</div>
		</div>
	</div>

<!-- </div> -->
