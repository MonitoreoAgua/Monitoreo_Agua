<?php
require '../databaseConnection.php';

$extension = array("jpeg","jpg","png","gif");
$_id = $_POST["idDocumento"];
 mkdir("..".DIRECTORY_SEPARATOR."..".DIRECTORY_SEPARATOR."pictures".DIRECTORY_SEPARATOR."$_id".DIRECTORY_SEPARATOR, 0777);
// $ruta = "http://monitoreoagua.ucr.ac.cr/pictures/".$_id."/";
 $ruta = "http://localhost/pictures/".$_id."/";
 $fotos_array = array();
$destino = "..".DIRECTORY_SEPARATOR."..".DIRECTORY_SEPARATOR."pictures".DIRECTORY_SEPARATOR."$_id".DIRECTORY_SEPARATOR;
$counter = 0;

foreach($_FILES["fotos"]["tmp_name"] as $key=>$tmp_name){
	$temp = $_FILES["fotos"]["tmp_name"][$key];
	$name = $_FILES["fotos"]["name"][$key];
	
	if(empty($temp))
	{
		break;
	}
	$counter++;
	$UploadOk = true;

	//Error de extensión inválida
	$ext = pathinfo($name, PATHINFO_EXTENSION);
	if(in_array($ext, $extension) == false){
		$UploadOk = false;
		//Reportar error aquí
	}

	//Si cumplen los criterios, se guardan en el directorio
	if($UploadOk){
		$nombre_foto = $counter.".".$ext;
		move_uploaded_file($temp,$destino.$nombre_foto);
		$fotos_array[$counter-1] = $ruta.$nombre_foto;
	}
}
chmod("..".DIRECTORY_SEPARATOR."..".DIRECTORY_SEPARATOR."pictures".DIRECTORY_SEPARATOR."$_id".DIRECTORY_SEPARATOR, 0777);
try {
    $cliente = connectDatabaseClient('MonitoreoAgua',1);

    $updRec = new MongoDB\Driver\BulkWrite;
    $updRec2 = new MongoDB\Driver\BulkWrite;
    $obj_id = new MongoDB\BSON\ObjectId($_id);

    $updRec->update(['_id' => $obj_id], ['$set' => ['fotos' => $fotos_array]], ['multi' => false, 'upsert' => false]);
    // $updRec2->update(['_id' => $obj_id], ['$set' => ['Muestra.palabras_claves' => $palabras_clave_array]], ['multi' => false, 'upsert' => false]);
    $writeConcern = new MongoDB\Driver\WriteConcern(MongoDB\Driver\WriteConcern::MAJORITY, 1000);
    $result = $cliente->executeBulkWrite('MonitoreoAgua.accionesMitigacion', $updRec, $writeConcern);
    // $result2 = $cliente->executeBulkWrite('MonitoreoAgua.puntosMuestreo', $updRec2, $writeConcern);
    // if ($result->getModifiedCount()) {
    //     agregarQR($_id, $count);
    // }
} catch (MongoConnectionException $e) {
    echo "Error: " . $e->getMessage();
}