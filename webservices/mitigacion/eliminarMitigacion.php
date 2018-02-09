<?php
require 'mitigacion.php';


//Sacar Datos
$id = $_POST['idAccion'];

$response = array();
$response = Mitigacion::eliminarDocumentoMitigacion($id);
    
echo json_encode($response);
