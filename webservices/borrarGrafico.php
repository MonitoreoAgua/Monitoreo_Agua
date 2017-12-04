<?php
require 'mongui.php';


//Sacar Datos
$id = $_POST['idGrafico'];

$response = array();
$response = Mongui::eliminarGrafico($id);
    
echo json_encode($response);
