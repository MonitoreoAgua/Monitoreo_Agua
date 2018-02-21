var urlConsulta = "";

/**
* Guarda los metadatos ingresados
**/
function guardarGrafi() {
	const userKey = Object.keys(window.localStorage)
  	.filter(it => it.startsWith('firebase:authUser'))[0];
	const user = userKey ? JSON.parse(localStorage.getItem(userKey)) : undefined;
	/** Obtener parámetros básicos **/
	var nombreGrafico = document.getElementById('nombreGrafico').value;	
	var descripcion = document.getElementById('descripcionGrafico').value;	
	if (document.getElementById("btnArea").checked) {
		var tipoGrafico = 'Area';
	} else if (document.getElementById("btnXY").checked) {
		var tipoGrafico = 'XY';
	}	
    var primerPar = document.getElementById("parametro").value;
	
	/** Preparar los parámetros para el PHP, según el tipo de gráfico y de consulta **/
	var fechaInicio = new Date(document.getElementById('fechaI').value).getTime();
	var fechaFinal = new Date(document.getElementById('fechaF').value).getTime();
	urlConsulta = puntosMuestreo;
	var urlPHP = 'nombreGrafico=' + nombreGrafico +
			'&email=' + user.email +
			'&fechaInicio=' + fechaInicio +
			'&fechaFinal=' + fechaFinal +
			'&tipoGrafico=' + tipoGrafico +
			'&parametro=' + primerPar +
			'&puntosMuestreo=' + urlConsulta + 
			'&descripcion=' + descripcion;

	/** Llamar al PHP con los parámetros obtenidos **/
	$.ajax({
		type: 'POST',
		url: "/webservices/insertarGrafico.php",
        cache: false,
		data: urlPHP,
		success: function( data ) {
			if (data.success) {
				alert("Gráfico guardado correctamente.");
				document.getElementById("btnGuardarGraf").disabled = true;
			} 
			else {
				console.log("Hubo un problema al guardar el gráfico.\nMensaje: " + data.mensaje);
			}
		},
		error: function(err) {
			console.log(err);
		}
	});
}

/**
* Recorre la comboBox ingresada y marca el índice que corresponda al parámetro ingresado
* @param combo Objeto que contiene la comboBox
* @param parametro Parametro a buscar
* @return true si se encontró el parámetro en la comboBox
**/
function marcarCombo(combo,parametro) {
	var parametros = combo.options;
	for (var i = 0 ; i < parametros.length; i++) {
        if (parametros[i].value == parametro) {
            combo.selectedIndex = i;
            return true;
        }
    }
    return false;
}

/**
* Carga los metadatos de un gráfico y lo grafica
**/
function cargarGrafi() {
	/** Obtener ID del gráfico y los datos correspondientes **/
	var datosGrafico = [];
	$.ajax({
        url: "/webservices/cargarGrafico.php?idGrafico=" + idGrafico,
        async: false,
        dataType: 'json',
        success: function(data) {
            datosGrafico = data;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
        	console.log(XMLHttpRequest);
    	}   
    });
	
	/** Seleccionar los valores según lo obtenido **/
	marcarCombo(document.getElementById('parametro'),datosGrafico[0].parametro);
	if (datosGrafico[0].tipoGrafico == "Area") document.getElementById('btnArea').checked = true;
	else if (datosGrafico[0].tipoGrafico == "XY") document.getElementById('btnXY').checked = true;
	
	var fechaInicio = new Date(parseInt(datosGrafico[0].fechaInicio));
	var fechaFinal = new Date(parseInt(datosGrafico[0].fechaFinal));
	fechaInicio.setHours(fechaInicio.getHours()+24);
	fechaFinal.setHours(fechaFinal.getHours()+24);
	var sFechaI = fechaInicio.getFullYear() + "-" + (("0"+(fechaInicio.getMonth()+1)).slice(-2)) + "-" + (("0"+fechaInicio.getDate()).slice(-2));
	var sFechaF = fechaFinal.getFullYear() + "-" + (("0"+(fechaFinal.getMonth()+1)).slice(-2)) + "-" + (("0"+fechaFinal.getDate()).slice(-2));
	document.getElementById('fechaI').value = sFechaI;
	document.getElementById('fechaF').value = sFechaF;
	urlConsulta = datosGrafico[0].puntosMuestreo;
	
	/** Graficar según el tipo de consulta **/
	obtenerDatos(urlConsulta);
	document.getElementById('nombreGrafico').value = datosGrafico[0].nombreGrafico;
	document.getElementById('descripcionGrafico').value = datosGrafico[0].descripcion;
}

/**
* Guarda los cambios hechos a los metadatos de un gráfico cargado
**/
function modificarGrafi(idGrafico) {

	const userKey = Object.keys(window.localStorage)
  	.filter(it => it.startsWith('firebase:authUser'))[0];
	const user = userKey ? JSON.parse(localStorage.getItem(userKey)) : undefined;
	/** Obtener parámetros básicos **/
	var nombreGrafico = document.getElementById('nombreGrafico').value;	
	var descripcion = document.getElementById('descripcionGrafico').value;	
	if (document.getElementById("btnArea").checked) {
		var tipoGrafico = 'Area';
	} else if (document.getElementById("btnXY").checked) {
		var tipoGrafico = 'XY';
	}	
    var primerPar = document.getElementById("parametro").value;
	
	/** Preparar los parámetros para el PHP, según el tipo de gráfico y de consulta **/
	var fechaInicio = new Date(document.getElementById('fechaI').value).getTime();
	var fechaFinal = new Date(document.getElementById('fechaF').value).getTime();
	var urlPHP = 'nombreGrafico=' + nombreGrafico +
			'&email=' + user.email +
			'&fechaInicio=' + fechaInicio +
			'&fechaFinal=' + fechaFinal +
			'&tipoGrafico=' + tipoGrafico +
			'&parametro=' + primerPar +
			'&puntosMuestreo=' + urlConsulta + 
			'&descripcion=' + descripcion +
			'&idGrafico=' + idGrafico;

	/** Llamar al PHP con los parámetros obtenidos **/
	$.ajax({
		type: 'POST',
		url: "/webservices/modificarGrafico.php",
        cache: false,
		data: urlPHP,
		success: function( data ) {
			if (data.success) {
				alert("Cambios guardados correctamente.");
			} 
			else {
				console.log("Hubo un problema al guardar los cambios.\nMensaje: " + data.mensaje);
			}
		},
		error: function(err) {
			console.log(err);
		}
	});
}
	
/**
* Elimina el gráfico cargado
**/
function eliminarGrafi() {
	/** Llamar al PHP con el id del gráfico **/
	$.ajax({
		type: 'POST',
		url: "/webservices/borrarGrafico.php",
        cache: false,
		data: 'idGrafico=' + idGrafico,
		success: function( data ) {
				alert("El gráfico ha sido eliminado correctamente.");
				window.open("listaGraficas.php","_self");
		}
	});
}