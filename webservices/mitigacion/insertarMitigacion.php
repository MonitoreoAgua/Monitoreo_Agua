<?php
require 'mitigacion.php';

//Sacar Datos
$longitud = $_POST['longitud'];
$latitud = $_POST['latitud'];
$fecha_inicio = $_POST['fecha_inicio'];
$fecha_fin = $_POST['fecha_fin'];
$tipo_actividad = $_POST['tipo_actividad'];
$responsable = $_POST['responsable'];
$email = $_POST['email'];
$institucion_promotora = $_POST['institucion_promotora'];
$fotos = $_POST['fotos'];
$palabrasClave = $_POST['palabrasClave'];
$descripcion = $_POST['descripcion'];
$cantidad_participantes = $_POST['cantidad_participantes'];
$ponderacion_resultados = $_POST['ponderacion_resultados'];
$idUsuario = $_POST['idUsuario'];
$timestampAhora = new MongoDB\BSON\UTCDateTime();

$documento = array();
$location = array();
$location['lat'] = floatval($latitud);
$location['lng'] = floatval($longitud);
$documento['location'] = $location;
$documento['fecha_inicio'] = new DateTime($fecha_inicio);
$documento['fecha_fin'] = new DateTime($fecha_fin);
$documento['tipo_actividad'] = $tipo_actividad;
$documento['responsable'] = $responsable;
$documento['email'] = $email;
$documento['institucion_promotora'] = $institucion_promotora;
$lasFotos = array();
$lasFotos['urlFotos'] = $fotos;
$lasFotos['palabrasClave'] = $palabrasClave;
$documento['fotos'] = $lasFotos;
$documento['descripcion'] = $descripcion;
$documento['cantidad_participantes'] = intval($cantidad_participantes);
$documento['ponderacion_resultados'] = floatval($ponderacion_resultados);
$documento['color'] = 'Mitigacion';
$documento['idUsuario'] = $idUsuario;
$documento['fechaCreacion'] = $timestampAhora;

$response = array();
$response = Mitigacion::insertarDocumentoMitigacion($documento);
    
echo json_encode($response);
