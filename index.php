<?php

	//Se obtiene el URI para obtener el nombre del controlador
	$url = $_SERVER['REQUEST_URI'];
	$_SERVER['REQUEST_URI']='';
	$url=split('/',$url);
	array_shift($url);
	
	
	//Siempre debe iniciar con index.php se verifica y si no se redirecciona
	if($url[0]==''){
	 	//verificar que tiene index.php
		//Caso 1, dirección root
		header('Location: index.php');
	 }
	
	
	//En el campo 1 del URI viene el controller y si viene parametro queda luego de get
	if(sizeof($url)==2){//tamano 2, de 0 a 1. Implica que hay controller.
		$url_params=split('\?',$url[1]);//Se obtienen los parámetros
		//verificar si existian parametros
		if(sizeof($url_params)>1){//caso positivo, hay parametros. 
			$url[1]=$url_params[0];//en posicion 1 está el controlador.
		}	
	}
	
	
	//Si hay dos indica que hay parámetro, verificar validez.
	if(sizeof($url)!=2){
		require 'Controllers/busqueda.php';
	}else{//si hay controller verificar existencia
		if(file_exists('Controllers/'.$url[1]).'.php'){
			require 'Controllers/'.$url[1].'.php';	
		}else{
			require 'Controllers/busqueda.php';
		}
	}
?>