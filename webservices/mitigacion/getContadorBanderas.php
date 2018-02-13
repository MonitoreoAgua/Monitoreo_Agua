<?php
require 'mitigacion.php';


//Sacar Datos
$_id = $_GET['idUsuario'];

$response = array();
$response = Mitigacion::getContadorBanderasUsuario($_id);
    
echo json_encode($response);
