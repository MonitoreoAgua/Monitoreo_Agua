<?php
require 'mitigacion.php';

function rrmdir($dir) { 
	if (is_dir($dir)) { 
	 $objects = scandir($dir); 
	 foreach ($objects as $object) { 
	   if ($object != "." && $object != "..") { 
	     if (is_dir($dir."/".$object))
	       rrmdir($dir."/".$object);
	     else
	       unlink($dir."/".$object); 
	   } 
	 }
	 rmdir($dir); 
	} 
}

//Sacar Datos
$id = $_POST['idAccion'];

$response = array();
$response = Mitigacion::eliminarDocumentoMitigacion($id);

rrmdir("..".DIRECTORY_SEPARATOR."..".DIRECTORY_SEPARATOR."pictures".DIRECTORY_SEPARATOR.$id.DIRECTORY_SEPARATOR);
    
echo json_encode($response);
