<?php
	require 'webservices/databaseConnection.php';

    $coleccion = connectDatabaseCollection("MonitoreoAgua", "aforo", 1);

    switch ($_GET["accion"]) {
        case 'insertar':
            if($_SERVER['REQUEST_METHOD'] == 'POST'){//data in
                insertar($coleccion);
                header ('Location: /index.php/medicionDescarga?accion=ver');
            }else{//lets insert data
                 require 'Views/medicionDescarga_insertar.php';
            }
            break;
        case 'ver':
                 require 'Views/medicionDescarga_ver.php';
            break;        
        default:
            header ('Location: /index.php/busqueda');
    }


    
    /**
     * Funciones de cada accion para el controlador
     * */
     
     /**
      * Ver
      * */
     function ver(){
         
     }
     
     /**
      * Insertar
      **/ 
    function insertar($coleccion){
         $Ubicacion = filter_var($_POST["Ubicacion"], FILTER_SANITIZE_STRING);
         $Fecha = filter_var($_POST["Fecha"], FILTER_SANITIZE_STRING);
         $tiempoFinal = filter_var($_POST["tiempoFinal"], FILTER_SANITIZE_STRING);
         $tiempoInicio = filter_var($_POST["tiempoInicio"], FILTER_SANITIZE_STRING);
         $medicionInicio = filter_var($_POST["medicionInicio"], FILTER_SANITIZE_STRING);
         $medicionFinal = filter_var($_POST["medicionFinal"], FILTER_SANITIZE_STRING);
         $metodoUsado = filter_var($_POST["metodoUsado"], FILTER_SANITIZE_STRING);
         $metodoMedicion = filter_var($_POST["metodoMedicion"], FILTER_SANITIZE_STRING);
         $comments = filter_var($_POST["comments"], FILTER_SANITIZE_STRING);
         $descargaCalculada = filter_var($_POST["descargaCalculada"], FILTER_SANITIZE_STRING);
         $crossDescarga = filter_var($_POST["crossDescarga"], FILTER_SANITIZE_STRING);
        
        $resultado = $coleccion->insertOne( ["Ubicacion"=>$Ubicacion,"Fecha"=>$Fecha,"tiempoFinal"=>$tiempoFinal,
        "tiempoInicio"=>$tiempoInicio,"medicionInicio"=>$medicionInicio,"medicionFinal"=>$medicionFinal,
        "metodoUsado"=>$metodoUsado,"metodoMedicion"=>$metodoMedicion,"comments"=>$comments,
        "descargaCalculada"=>$descargaCalculada,"crossDescarga"=>$crossDescarga] );
    }
   
 ?>