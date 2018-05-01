<?php
  $interDir='';
  $grafica =  $_SERVER['DOCUMENT_ROOT'].$interDir."aguas/";
?>

    <!-- Always shows a header, even in smaller screens. -->
    <header class="mdl-layout__header">
        <div class="mdl-layout__header-row">
            <!-- Title -->
            <img src="/data/monitoreo_logo.png" style="height: 100%; margin-left:-70px; padding-left:0px;"></img>
            <span class="mdl-layout-title"><a href="/index.php/busqueda" style="text-decoration:none;">Monitoreo de aguas UCR</a></span>
            
            <!-- Add spacer, to align navigation to the right -->
            <div class="mdl-layout-spacer"></div>
            <!-- Navigation. We hide it in small screens. -->
            <nav class="mdl-navigation mdl-layout--large-screen-only">
                <a class="mdl-navigation__link" href='/index.php/medicionDescarga' style='margin-left:20px;'>MedicionDescarga Tmp</a>
                <a class="mdl-navigation__link" href='/index.php/listaGraficas'>Gráficas</a>
                <a class="mdl-navigation__link" href="/index.php/busqueda">Búsqueda</a>
                <button class="btn-logout background_primario mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--primary">
                    <i class="button-left-icon material-icons">account_circle</i>Cerrar Sesión
                </button>
            </nav>
        </div>
    </header>
    <div class="mdl-layout__drawer mdl-layout--small-screen-only">
        <nav class="mdl-navigation">
            <a class="mdl-navigation__link" href="/index.php/listaGraficas">Gráficas</a>
            <span class="btn-logout mdl-navigation__link">
            <i class="button-left-icon material-icons">account_circle</i>Cerrar Sesión
        </span>

        </nav>
    </div>