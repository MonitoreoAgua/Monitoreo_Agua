<?php
require 'mongui.php';


//Sacar Datos
$_id = $_POST['idGrafico'];
$correo = $_POST['email'];
$nombreGrafico = $_POST['nombreGrafico'];
$descripcion = $_POST['descripcion'];
$tipoGrafico = $_POST['tipoGrafico'];
$parametro = $_POST['parametro'];
$fechaCreado = new DateTime();
$tipoConsulta = $_POST['tipoConsulta'];

$documento = array();
$documento['tipoConsulta'] = $tipoConsulta;
$documento['correoUsuario'] = $correo;
$documento['nombreGrafico'] = $nombreGrafico;
$documento['descripcion'] = $descripcion;
$documento['tipoGrafico'] = $tipoGrafico;
$documento['parametro'] = $parametro;
$documento['fechaCreado'] = $fechaCreado;

if ($tipoConsulta == "Fechas") {
    $fechaInicio = $_POST['fechaInicio'];
    $fechaFinal = $_POST['fechaFinal'];

    $documento['fechaInicio'] = $fechaInicio;
    $documento['fechaFinal'] = $fechaFinal;
} else {
    $puntoMuestreo = $_POST['puntoMuestreo'];

    $documento['puntoMuestreo'] = $puntoMuestreo;
}

$response = array();
$response = Mongui::actualizarDocumentoGrafico($documento,$_id);
    
echo json_encode($response);
