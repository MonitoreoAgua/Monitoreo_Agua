<?php
	require 'databaseConnection.php';

	$collection=connectDatabaseCollection('MonitoreoAgua','rivers',0);
	if($_SERVER['REQUEST_METHOD']=='GET'){	
		$lat=floatval(isset($_GET['lat'])?$_GET['lat']:0);
		$lng=floatval(isset($_GET['lng'])?$_GET['lng']:0);
		$dist=floatval(isset($_GET['dist'])?$_GET['dist']:1000);
		$query = ['location' => ['$near' => ['$geometry' =>['type' => 'Point','coordinates'=>[$lng,$lat]], '$minDistance' => intval(0), '$maxDistance' => $dist]]];
		$projection = ['projection'=>['name'=>1,'type'=>1]];

		try {
			$result = $collection->find($query,$projection);
			echo json_encode(iterator_to_array($result));
		} catch (Exception $e) {
		}
	}
?>

