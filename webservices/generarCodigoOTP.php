<?php
  require 'mongui.php';

  $userID = $_GET['userID'];

  $hilera = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  $hileraRevuelta = str_shuffle($hilera);
  $otpGenerado = substr($hileraRevuelta, 1, 7);
  $otpEncriptado = password_hash($otpGenerado, PASSWORD_DEFAULT);

  //Guardar el OTP en la base de datos
  $documento = array();
  $documento['otpGenerado'] = $otpEncriptado;
  $documento['idUsuario'] = $userID;
  $documento['timestampGenerado'] = new MongoDB\BSON\UTCDateTime();
  Mongui::insertarDocumentoOTP($documento);

  echo $otpGenerado;
