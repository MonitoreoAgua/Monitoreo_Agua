<?php

header('Content-Type: application/json');
 
$interDir='';

require '../databaseConnection.php';

/**
* Imprime un JSON con todos los diferentes tipos de acciones de mitigación de la colección "accionesMitigacion"
**/
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
	$collection=connectDatabaseCollection('MonitoreoAgua','accionesMitigacion',0);
	
    $cursor = $collection->find();
    
    $cursor = iterator_to_array($cursor);
    
    foreach($cursor as $item){
    	if(isset($item->Muestra->val_indice)){
			unset($item->Muestra->val_indice);
		}
    }

	echo json_encode($cursor);
}
?>
