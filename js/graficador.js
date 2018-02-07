var datosGrafico = "";
var indFechaAct = 0;
var tamannofechas = 0;
var elGrafico;
var datosBurbuja = [];
var fechas = [];
var fechasN = [];
var indices = [];
var nombres = [];
var colores = [];
var coloresUsados = [];
var datasets = [];
var graficoGenerado = false;
var graficoNombre = false;
var graficoNuevo = true;
var arrayOfObjects = [];

/**
*
**/
function generarColor(){
		
	if(colores.length == 0)
	{
		var color1 = (Math.floor(Math.random() * 256));
		var color2 = (Math.floor(Math.random() * 256));
		var color3 = (Math.floor(Math.random() * 256));
		var colorPunto = "rgba(" + color1 + "," + color2 + "," + color3 + ","+ 0.4 +")";
		var colorUsado = color1 + "," + color2 + "," + color3;
		coloresUsados.push(colorUsado);
		colores.push(colorPunto);
	}
	else {
		var color1 = (Math.floor(Math.random() * 256));
		var color2 = (Math.floor(Math.random() * 256));
		var color3 = (Math.floor(Math.random() * 256));
		while(colorRepetido(color1,color2,color3)){
			var color1 = (Math.floor(Math.random() * 256));
			var color2 = (Math.floor(Math.random() * 256));
			var color3 = (Math.floor(Math.random() * 256));
		}
		var colorPunto = "rgba(" + color1 + "," + color2 + "," + color3 + ","+ 0.4 +")";
		var colorUsados = color1 + "," + color2 + "," + color3;
		coloresUsados.push(coloresUsados);
		colores.push(colorPunto);		
	}	
		
}
	
/**
*
**/	
function colorRepetido(color1,color2,color3){
	var repetido = false;
	var tamano = 0;
	while(tamano < colores.length && !repetido){
		var color = colores[tamano].split(",");
		if(color[0] == color1 && color[1] == color2 && color[2]==color3){
			repetido = true;
		}
		else {
			tamano++;
		}
	}
	return repetido; 
}

/**
* Crea el dataset para el graficador cuando se pide un gráfico por área
* @return Un arreglo con los datos a graficar
**/
function datosAreaF() {
	colores = [];
	coloresUsados = [];
	datasets = [];
	for (var i = 0; i < nombres.length; i++)
		generarColor();
	
	var datasets = [];
	for (var i = 0; i < nombres.length; i++) {
		var array = {"label": nombres[i], "backgroundColor": colores[i], "data":indices[i]};
		datasets.push(array);
	}
	return {labels: fechas,
			datasets: datasets};
}

/**
* Crea el dataset para el graficador cuando se pide un gráfico XY
* @return Un arreglo con los datos a graficar
**/
function datosXYF() {
	colores = [];
	coloresUsados = [];
	datasets = [];
	for (var i = 0; i < nombres.length; i++)
		generarColor();
	
	var datasets = [];
	for (var i = 0; i < nombres.length; i++) {
		var array = {"label": nombres[i], "borderColor": colores[i], "fill": false, "data":indices[i]};
		datasets.push(array);
	}
	return {labels: fechas,
			datasets: datasets};
}


function obtenerDatos(puntosMuestreo) {
	var puntosM = puntosMuestreo.split(",");
	var parametro = document.getElementById("parametro").value;
	$.ajax({
		url:"/webservices/buscarPorNombre.php",
	    type:"GET",
	    data:{puntos:puntosM, par1: parametro},
	    success:function(data){
			arrayOfObjects = data;
			graficar("nombres");
		},
		error:function(err) {
			console.log(err);
		}
	});
}


/**
* Crea un gráfico según el tipo de consulta realizada y sus respectivos parámetros
**/
function graficar(tConsulta) {	
	if (graficoNuevo) {
		document.getElementById("btnGuardarGraf").disabled = false;		
	}
	//Reinicializar canvas del gráfico
	$('#myChart').remove();
	$('#canvasGrafico').append('<canvas id="myChart" width="100%" height="15"></canvas>');
	
	/** Inicializar variables **/
	datosBurbuja = [];
	fechas = [];
	fechasN = [];
	indices = [];
	nombres = [];
	var tipoGrafico = '';
	var ctx = document.getElementById('myChart').getContext('2d');
	ctx.canvas.width = 1200;
	ctx.canvas.height = 400;
	
	if (tConsulta == "Fechas") graficoNombre = false;
	else if (tConsulta == "Nombres") graficoNombre = true;

	/** Obtener variables de la página **/
	var fechaIni = new Date(document.getElementById('fechaI').value).getTime();
	var fechaFin = new Date(document.getElementById('fechaF').value).getTime();
	var parametro = document.getElementById("parametro").value;
	if (document.getElementById("btnArea").checked || document.getElementById("btnXY").checked) {
		tipoGrafico = 'line';
	} else {
		tipoGrafico = 'bubble';
	}

	/**
	* Realizar consulta con Mongo para obtener los datos
	* Se guarda en arrayOfObjects
	**/
	if (arrayOfObjects != []) {
		if (graficoNombre) {
			//Si se quiere graficar por punto de muestreo
			var lugar = document.getElementById("punto").value;
			$.ajax({
				url: "/webservices/buscarPorNombre.php?nombre=" + lugar + "&par1=" + parametro,
				async: false,
				dataType: 'json',
				success: function(data) {
					arrayOfObjects = data;
				}
			});
		} else {
			//Si se quiere graficar por rango de fechas
			$.ajax({
				url: "/webservices/buscarPorFechas.php?fechaIni=" + fechaIni + "&fechaFin=" + fechaFin + "&par1=" + parametro,
				async: false,
				dataType: 'json',
				success: function(data) {
					arrayOfObjects = data;
				}
			});
		}		
	}

	/**
	* Llena los arreglos con los valores según los parámetros elegidos
	* @param El nombre del punto cuyo parámetro se quiere obtener
	**/
	function obtenerParametro(nombre) {
		var aux = [];
		var aux2 = [];
		for (var i = 0; i < arrayOfObjects.length; i++) {
			var object = arrayOfObjects[i];
			if (object.POI.nombre_estacion == nombre) {
				if(object.Muestra.obligatorios.hasOwnProperty(parametro)){
					aux[fechasN.indexOf(Number(object.Muestra.fecha.$date.$numberLong))] = object.Muestra.obligatorios[parametro];
				}else if(object.Muestra.opcionales.hasOwnProperty(parametro)){
					aux[fechasN.indexOf(Number(object.Muestra.fecha.$date.$numberLong))] = object.Muestra.opcionales[parametro];
				}else{
					aux[fechasN.indexOf(Number(object.Muestra.fecha.$date.$numberLong))] = "Sin Dato";
				}
			}
		}
		indices.push(aux);
	}

	/**
	* Guardar en el arreglo de nombres todos los puntos de muestreo no repetidos,
	* en el arreglo de fechas las fechas no repetidas y
	* en el arreglo de fechasN las fechas en formato UNIX
	**/
	for (var i = 0; i < arrayOfObjects.length; i++) {
		var object = arrayOfObjects[i];
		if (!nombres.includes(object.POI.nombre_estacion)) {
			nombres.push(object.POI.nombre_estacion);
		}
		if (!fechasN.includes(Number(object.Muestra.fecha.$date.$numberLong))) {
			fechasN.push(Number(object.Muestra.fecha.$date.$numberLong));
		}
		var fechaObj = new Date(Number(object.Muestra.fecha.$date.$numberLong));
		fechaObj.setHours(fechaObj.getHours()+24);
		var fechai = fechaObj.toDateString();
		if (!fechas.includes(fechai)) {
			fechas.push(fechai);
		}
	}
	

	/** Llenar los arreglos de parámetros para cada punto de muestreo **/
	for (var i = 0; i < nombres.length; i++) {
		obtenerParametro(nombres[i]);
	}

	/** Formar el dataset para el gráfico a partir de los datos obtenidos **/
	var data = {};
	if (document.getElementById("btnXY").checked) {
		data = datosXYF();
	} else {
		data = datosAreaF();
	}

	/** Establecer las opciones del gráfico **/
	if (tipoGrafico == 'bubble' && graficoNombre) {
		//Si el gráfico es de burbuja y por punto de muestreo, mostrar las fechas en el eje X
		var opciones = {
			scales: {
			yAxes: [{
				ticks: {
					beginAtZero: true
				},
				scaleLabel: {
					display: true,
					labelString: parametro
				}
			}],
			xAxes: [{
				ticks: {
					userCallback: function(valor) {
						var fechaObj = new Date(Number(valor));
						fechaObj.setHours(fechaObj.getHours()+24);
						return fechaObj.toDateString();
					}
				}
			}]
		}};
	} else if (tipoGrafico != 'bubble' || graficoNombre) {
		//Si el gráfico no es de burbuja o si es por nombre mostrar normalmente
		var opciones = {
			scales: {
			yAxes: [{
				ticks: {
					beginAtZero: true
				},
				scaleLabel: {
					display: true,
					labelString: parametro
				}
			}]
		}
			
		};
		document.getElementById('scrollFechas').style.display = 'none';
	} else {
		//Si el gráfico es de burbuja no mostrar las etiquetas del eje X
		var opciones = {
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true
					},
					scaleLabel: {
						display: true,
						labelString: parametro
					}
				}],
				xAxes: [{
					display: false
				}]
			},
			 animation: {
                    duration: 10,
                    easing: 'easeOutElastic'
                }
		};
	}

	/** Crear el gráfico **/
	elGrafico = new Chart(ctx, {
		type: tipoGrafico,
		data: data,
		options: opciones
	});

	/** Mostrar y Ocultar elementos según el tipo de consulta realizada **/
	//Mostar el textbox para el nombre y los botones para guardar
	document.getElementById('infoGrafico').style.display = 'block';
	document.getElementById('botonesGuardar').style.display = 'block';
	graficoGenerado = true;
}

/**
* Mostar u ocultar caja para segundo parámetro, según tipo de gráfico
* @param Tipo de gráfico seleccionado
**/
function cambiarTipoGrafico(tipoGrafico) {
	if (graficoGenerado) 
		if (graficoNombre)
			graficar("Nombres",true);
		else
			graficar("Fechas",true);
}
