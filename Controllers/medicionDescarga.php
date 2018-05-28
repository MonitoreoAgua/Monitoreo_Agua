<?php
	require 'webservices/databaseConnection.php';

    $coleccion = connectDatabaseCollection("MonitoreoAgua", "aforo", 1);

    switch ($_GET["accion"]) {
        case 'insertar':
            if($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_GET["user"]) && filter_var($_GET["user"], FILTER_VALIDATE_EMAIL)){//data in
                insertar($coleccion);
                header ('Location: /index.php/medicionDescarga?accion=ver&ini=1&pag=1&user='.$_GET['user']);
            }else{//lets insert data
                isset($_GET["user"]) && filter_var($_GET["user"], FILTER_VALIDATE_EMAIL)?require 'Views/medicionDescarga_insertar.php':header ('Location: /index.php/busqueda');
            }
            break;
            
            
        case 'ver':
            $email = isset($_GET["user"]) && filter_var($_GET["user"], FILTER_VALIDATE_EMAIL)?$_GET['user']: false ;
            if(!$email) header ('Location: /index.php/busqueda');
            
            $pagina = isset($_GET['pag']) && $_GET['pag'] > 0?filter_var($_GET['pag'], FILTER_SANITIZE_STRING):1;
            $datosAforo = ver($coleccion, $pagina, $email);
            $inicio = isset($_GET['ini'])?$_GET['ini']:$pagina;
            $fin = $datosAforo['cantidad']>4?$inicio+4:$datosAforo['cantidad']+1;
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
     function ver($coleccion, $pag, $email){
        $datos = iterator_to_array($coleccion->find(['correo'=>$email], ['skip'=> $pag-1,'limit'=>1]));
        if(count($datos[0])<1){
            return [];
        }else{
            $cantidad = $coleccion->count(['correo'=>$email]);
            $datos[0]['cantidad']=$cantidad;
            $datos[0]['fecha']=$datos[0]['fecha']->toDateTime()->format('Y-m-d');
            return $datos[0];
        }
     }
     
     /**
      * Insertar
      **/ 
    function insertar($coleccion){
        $correo = filter_var($_POST["correo"], FILTER_SANITIZE_STRING);
         $latitud = filter_var($_POST["latitud"], FILTER_SANITIZE_STRING);
         $longitud = filter_var($_POST["longitud"], FILTER_SANITIZE_STRING);
         $fecha = filter_var($_POST["fecha"], FILTER_SANITIZE_STRING);
         $fecha = new DateTime($fecha);
         $fecha = new MongoDB\BSON\UTCDateTime($fecha->getTimeStamp()*1000);
         $tiempoFinal = filter_var($_POST["tiempoFinal"], FILTER_SANITIZE_STRING);
         $tiempoInicio = filter_var($_POST["tiempoInicio"], FILTER_SANITIZE_STRING);
         $medicionInicio = filter_var($_POST["medicionInicio"], FILTER_SANITIZE_STRING);
         $medicionFinal = filter_var($_POST["medicionFinal"], FILTER_SANITIZE_STRING);
         $metodoUsado = filter_var($_POST["metodoUsado"], FILTER_SANITIZE_STRING);
         $metodoMedicion = filter_var($_POST["metodoMedicion"], FILTER_SANITIZE_STRING);
         $comments = filter_var($_POST["comments"], FILTER_SANITIZE_STRING);
         $descargaCalculada = filter_var($_POST["descargaCalculada"], FILTER_SANITIZE_STRING);
         $crossDescarga = filter_var($_POST["crossDescarga"], FILTER_SANITIZE_STRING);
        
        $resultado = $coleccion->insertOne( ["correo"=>$correo, "latitud"=>$latitud, "longitud"=>$longitud,"fecha"=>$fecha,"tiempoFinal"=>$tiempoFinal,
        "tiempoInicio"=>$tiempoInicio,"medicionInicio"=>$medicionInicio,"medicionFinal"=>$medicionFinal,
        "metodoUsado"=>$metodoUsado,"metodoMedicion"=>$metodoMedicion,"comments"=>$comments,
        "descargaCalculada"=>$descargaCalculada,"crossDescarga"=>$crossDescarga] );
    }
   
 ?>