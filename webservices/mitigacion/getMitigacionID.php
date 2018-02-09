<?php
require 'mitigacion.php';


//Sacar Datos
$_id = $_GET['idAccion'];

$response = array();
$response = Mitigacion::getByID($_id);
    
echo json_encode($response);
