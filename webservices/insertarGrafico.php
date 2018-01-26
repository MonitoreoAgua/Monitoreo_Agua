<?php
require 'mongui.php';


//Sacar Datos
$correo = $_POST['email'];
$nombreGrafico = $_POST['nombreGrafico'];
$descripcion = $_POST['descripcion'];
$tipoGrafico = $_POST['tipoGrafico'];
$parametro = $_POST['parametro'];
$fechaCreado = new DateTime();
$puntosMuestreo = $_POST['puntosMuestreo'];
$fechaInicio = $_POST['fechaInicio'];
$fechaFinal = $_POST['fechaFinal'];

$documento = array();
$documento['puntosMuestreo'] = $puntosMuestreo;
$documento['correoUsuario'] = $correo;
$documento['nombreGrafico'] = $nombreGrafico;
$documento['descripcion'] = $descripcion;
$documento['tipoGrafico'] = $tipoGrafico;
$documento['parametro'] = $parametro;
$documento['fechaCreado'] = $fechaCreado;
$documento['fechaInicio'] = $fechaInicio;
$documento['fechaFinal'] = $fechaFinal;

$response = array();
$response = Mongui::insertarDocumentoGrafico($documento);
    
echo json_encode($response);
