<?php
require 'mitigacion.php';
$response = array();

//Sacar Datos
$idUsuario = $_POST['idUsuario'];
$anioActual = date_format(new DateTime(), 'Y');
$cantidadBanderas = $_POST['cantidadBanderas'];
$idDocumento = null;
if (isset($_POST['idDocumento'])) {
	$idDocumento = $_POST['idDocumento'];
}
$timestampAhora = new MongoDB\BSON\UTCDateTime();


$documento = array();
$documento['idUsuario'] = $idUsuario;
$documento['anioActual'] = $anioActual;
$documento['cantidadBanderas'] = intval($cantidadBanderas);
$documento['timestampModificado'] = $timestampAhora;
if (isset($idDocumento)) {
	$_id = new MongoDB\BSON\ObjectId($idDocumento);
	$response = Mitigacion::actualizarContadorBanderas($documento,$_id);
} 
else {
	$response = Mitigacion::insertarContadorBanderas($documento);
}

    
echo json_encode($response);
