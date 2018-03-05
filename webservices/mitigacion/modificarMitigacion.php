<?php
require 'mitigacion.php';


//Sacar Datos
$id = $_POST['idAccion'];
$longitud = $_POST['longitud'];
$latitud = $_POST['latitud'];
$fecha_inicio = $_POST['fecha_inicio'];
$fecha_fin = $_POST['fecha_fin'];
$tipo_actividad = $_POST['tipo_actividad'];
$responsable = $_POST['responsable'];
$email = $_POST['email'];
$institucion_promotora = $_POST['institucion_promotora'];
$fotos = $_POST['fotos'];
$descripcion = $_POST['descripcion'];
$cantidad_participantes = $_POST['cantidad_participantes'];
$ponderacion_resultados = $_POST['ponderacion_resultados'];

$documento = array();
$documento['longitud'] = $longitud;
$documento['latitud'] = $latitud;
$documento['fecha_inicio'] = $fecha_inicio;
$documento['fecha_fin'] = $fecha_fin;
$documento['tipo_actividad'] = $tipo_actividad;
$documento['responsable'] = $responsable;
$documento['email'] = $email;
$documento['institucion_promotora'] = $institucion_promotora;
$documento['fotos'] = json_decode($fotos);
$documento['descripcion'] = $descripcion;
$documento['cantidad_participantes'] = $cantidad_participantes;
$documento['ponderacion_resultados'] = $ponderacion_resultados;

$response = array();
$response = Mitigacion::actualizarDocumentoMitigacion($documento,$id);

echo json_encode($response);
