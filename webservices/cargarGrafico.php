<?php
require 'mongui.php';


//Sacar Datos
$id = $_GET['idGrafico'];

$response = array();
$response = Mongui::getGraficoPorID($id);
    
echo json_encode($response);
