<?php

	//Se obtiene el URI para obtener el nombre del controlador
	$url = $_SERVER['REQUEST_URI'];
	$url=split('/',$url);
	$url_params=split('\?',$url[2]);

	/**
	 * En la posición 1 y 2 viene el index.php y el nombre del controlador
	 * Si no tiene index.php entonces se carga el mapa busqueda
	 * Si viene campo 1 y 2 entonces se carga dicho controlador(siempre y cuando exista)
	 */
	 
	 //Caso 1, dirección root
	if($url[1]==''&&$url[2]==''){
		header('Location: index.php');
	}
	
	//verificar que no vengan parametros
	if(sizeof($url_params)>1){
		$request_site='Controllers'.'/'.$url_params[1].'.php';
	}else{
		$request_site='Controllers'.'/'.$url[2].'.php';
	}
		
	
	//Si solo viene index o el archivo no existe, se envía a busqueda
	if($url[2]==''|| !file_exists($request_site)){
		require 'Controllers/busqueda.php';
	}else{//se busca dicho controlador.
		require $request_site;	
	}
	
	
	//header('Location: Controllers/busqueda.php');
/*$_SESSION['correo']='johan';
if (isset($_SESSION['correo'])) {
	header('Location: busqueda.php');
}else {
	header('Location: login.php');
}*/
?>