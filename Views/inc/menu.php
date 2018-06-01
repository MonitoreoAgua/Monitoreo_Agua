<?php
  $interDir='';
  $grafica =  $_SERVER['DOCUMENT_ROOT'].$interDir."aguas/";
?>

<nav class="navbar navbar-dark navbar-expand-md sticky-top bg-aguas-navbar">
    <a class="navbar-brand py-0" href="/index.php/busqueda"><img src="/data/monitoreo_logo.png" width="64" height="64"></a>
    <span class="navbar-text py-0">
        Monitoreo de aguas UCR
    </span>

    <ul class="navbar-nav navbar ml-auto">
        <li id="navMapa" class="nav-item active"><a href="/index.php/busqueda" class="nav-link py-0">Mapa</a></li>
        <li id="navAforo" class="nav-item"><a onclick='agregarMail();' href='/index.php/medicionDescarga?accion=ver&ini=1&pag=1&user=' class="nav-link py-0 verAforo">Aforo</a></li>
        <li id="navGraficas" class="nav-item"><a href='/index.php/listaGraficas' class="nav-link py-0">Gráficas</a></li>
        <li class="nav-item">
            <button class="btn-logout background_primario btn btn-raised btn-seconday" onclick="signOut();">
                <i class="button-left-icon material-icons">account_circle</i>Cerrar Sesión
            </button>
        </li>
    </ul>    
</nav>