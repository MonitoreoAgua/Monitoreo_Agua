<?php session_start();
//require '../vendor/autoload.php';
if (isset($_SESSION['correo'])) {
    header('Location: index.php/busqueda');
}

    require 'Views/recuperar_view.php';
 ?>