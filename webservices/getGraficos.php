<?php
require 'mongui.php';


//Sacar Datos
$_id = $_GET['idUsuario'];

$response = array();
$response = Mongui::getGraficosPorIDUsuario($_id);
    
echo json_encode($response);
