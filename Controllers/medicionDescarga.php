<?php
    //print_r ($_POST);
    echo $_POST["Ubicacion"];
    echo $_POST["Fecha"];
    echo $_POST["tiempoFinal"];
    echo $_POST["tiempoInicio"];
    echo $_POST["medicionInicio"];
    echo $_POST["medicionFinal"];
    echo $_POST["metodoUsado"];
    echo $_POST["metodoMedicion"];
    echo $_POST["comments"];
    echo $_POST["descargaCalculada"];
    echo $_POST["crossDescarga"];
    require 'Views/medicionDescarga_view.php';
?>