<?php session_start();
//require '../vendor/autoload.php';
if (isset($_SESSION['correo'])) {
    header('Location: busqueda.php');
}

    require '../Views/recuperar_view.php';
 ?>