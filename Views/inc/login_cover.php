<link rel="stylesheet" type="text/css" href="/css/estilo_login.css">
<script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script> <script src="../js/index.js"></script>
<div class="bg">
	<div class="container2">
		<div class="container3">
			<p><img src ="/data/monitoreo_logo.png" style="width: 312px; height: 312px;"></p>
			
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
			<!-- Tal vez se puede poner la información de los créditos acá: -->
			<!-- <div style="position: absolute; right: 1rem; bottom: 1.5rem;">Creado por ....</div> -->
		</div>
	</div>
</div>