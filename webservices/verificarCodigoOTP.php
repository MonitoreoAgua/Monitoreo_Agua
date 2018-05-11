<?php
  require 'mongui.php';

  $userID = $_GET['userID'];
  $userOTP = $_POST['userOTP'];
  $datoOTP = Mongui::getOTP($userID);
  $otpBaseDatos = $datoOTP['otpGenerado'];

  $result = array();
  if (password_verify($userOTP, $otpBaseDatos)) {
    $result['result'] = true;
    Mongui::eliminarOTP($datoOTP['_id']);
  } else {
    $result['result'] = false;
  }
  echo json_encode($result);
