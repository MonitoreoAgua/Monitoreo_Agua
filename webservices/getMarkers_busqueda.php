<?php
	header('Content-Type: application/json');

	require 'databaseConnection.php';

	//Obtener la colección de los puntos de muestreo y de las acciones de mitigación
	$collectionPuntos = connectDatabaseCollection('MonitoreoAgua','puntosMuestreo',0);
	$collectionMitigacion = connectDatabaseCollection('MonitoreoAgua','accionesMitigacion',0);

	//Quitar comentarios para obtener timeStamp	  
	$result1 = $collectionPuntos->aggregate([
        [ '$sort' => ['Muestra.fecha'=> -1]],
        [ '$group' => ['_id' => '$POI.nombre_estacion', 'id'=>['$first'=>'$_id'],'color' => ['$first' => '$Muestra.color'],'location'=>['$first'=>'$POI.location']/*,'fecha'=>['$first'=>'$Muestra.fecha']*/  ] ]
    ]);

    //Obtener las acciones de mitigación en un iterator
    $result2 = $collectionMitigacion->aggregate([
    	[ '$sort' => ['fecha_inicio' => -1]],
        [ '$project' => ['_id' => '$tipo_actividad', 'id'=> '$_id','color' => '$color','location'=> '$location']]
    ]);
    
    //Convetir los iteradores a arreglos
    $result1 = iterator_to_array($result1);
    $result2 = iterator_to_array($result2);

    //Unir los arreglos
    $result = array_merge($result1,$result2);

	//Convertir los id a hileras
	foreach ($result as $doc) {
		$doc["id"]=(string)$doc["id"];
		//$doc["fecha"]=(string)$doc["fecha"];
	}

	//Retornar el resultado en formato JSON
    echo json_encode($result);
?>
