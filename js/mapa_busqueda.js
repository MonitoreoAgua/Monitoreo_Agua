/*Código para crear un mapa de google y sobre él indicar marcadores que indican puntos de muestreo sobre calidad de agua, además en este archivo
se crean los eventos y consultas a la BD mongoDB con ayuda de PHP.*/
//--------------------------------------------VARIABLES GLOBALES-------------------------------------------------------------//
var jsonDatosBD='';//variable global con la finalidad de guardar los datos de las consultas y así poder anidar consultas. Guarda los valores en formato JSON.
var map; //mapa general
var rivers = {};//array to store rivers currently selected
var markers=[];//marcadores indicadores de calidad del agua
var niveles=[];//es paralelo a vector de marcadores acá se guardan las calidades del agua del marcador i, se utiliza para buscar sobre él y no sobre los marcadores
var filterMarker;//marcador movible para indicar areas de filtro
//var colors = ["null","blue","green","yellow","orange","red"];//colores asociados a cada calidad
//var calidad = ["null","excelente","buena calidad","aceptable","contaminada","fuertemente contaminada"];//nombres asociados a cada calidad
//Esta varible es muy importante ya que indica y controla los eventos de clic sobre los marcadores. Para saber en que estado está la selección.
var contadorClicks = 0; //evento de aritmetica de POIS, lleva un conteo de los clicks porque solo deben haber dos seleccionados.
var first;//Respaldo para mantener el marcador en ser presionado primero.
var second;//Respaldo para mantener el marcador en ser presionado segundo.
/*para indexar datos traídos de la BD*/
//var parametrosObligatorios=["% O2","DBO","pts DBO","NH4","pts NH4"];//no utilizado
//var parametrosOpcionales=["CF","DQO","EC","PO4","GYA","Ph","SD", "Ssed", "SST","SAAM","T","Aforo","ST","pts PSO"];//no utilizado
var contentVerMas="<div><button class='btn btn-primary' style='width:200px' onclick='mostrarVerMas()' id='btnVerMuestra'>Ver muestra</button></div>";
var contentCalcularDiferencia= "<div><button class='btn btn-primary' style='width:200px'onclick='mostrarVerMas()' id='btnVerMuestra'>Ver muestra</button><br><button class='btn btn-success' style='width:200px' onclick='mostrarAritmetica()'>Calcular diferencia</button></div>";
//variable que se inicializa al cargar el init map, indican la ventana de información a ser cargada.
var infowindowVerMas;
var infowindowCalcularDiferencia;
//variable que representa el rectángulo de selección en el mapa
var rectangle;
//array que contiene los puntos de muestreo seleccionados actualmente en el mapa
var puntosMuestreo = [];
//flags que determinan si los puntos de muestreo y de mitigación se visualizan o no en el mapa
var verMitigacion = true;
var verMuestreo = true;
//variables utilizadas para la inserción de un nuevo marcador en el mapa
var nuevoPunto = false;
var nMarcador;
var infowindowNuevoMarcador;
//arreglos que guardan las palabras claves asociadas a las fotos de un punto de mitigacion, así como las fotos
var palabrasClaveMitigacion = [];
var fotosMarcador = [];
var formularioDatos = null;
var flagFileChange = false;



//-----------------------------------------INICIALIZACION DEL MAPA----------------------------------------------------------------//
function initMap() {

	  //creación del mapa
	 map = new google.maps.Map(document.getElementById('map'), {
	    zoom: 11,
	    center: {"lat":9.876711,"lng":-84.104376},
	    radius:19,
      gestureHandling: 'cooperative'
	  });


	//marcador draggable para aplicar filtro
	 filterMarker = new google.maps.Marker({
	    map: map,
	    draggable:true,
	    icon: "/data/Templatic-map-icons/arts-crafts.png",
	    title:"colocar en area de filtro",
	    position:{"lat":9.928119,"lng":-84.107810}
	  });
	  //se inicializan las ventanas de información
  infowindowVerMas = new google.maps.InfoWindow();
  infowindowCalcularDiferencia = new google.maps.InfoWindow();
  infowindowNuevoMarcador = new google.maps.InfoWindow();
	 //inserción de todos los marcadores presentes en la BD
	 insertMarker();


	  //evento para limpiar el mapa.
	  map.addListener('click', function(e) {
      //mayor a cero indica que hay algun marcador seleccionado.
      if(contadorClicks>0){
        if(contadorClicks==1){//solamente existe uno en seleccion
          //se agregó el cambio de marcador para el caso de gris que es el único que es un recurso externo
          var icon1 = "/data/Templatic-map-icons/"+jsonDatosBD[first.id].color+".png";
          infowindowVerMas.close();
          first.setIcon(icon1);
        }else{//ambos están selecionados
          //se agregó el cambio de marcador para el caso de gris que es el único que es un recurso externo
          var icon1 = "/data/Templatic-map-icons/"+jsonDatosBD[first.id].color+".png";
          var icon2 = "/data/Templatic-map-icons/"+jsonDatosBD[second.id].color+".png";
          first.setIcon(icon1);
          second.setIcon(icon2);
          infowindowCalcularDiferencia.close();
        }
        contadorClicks=0;
        document.getElementById("btnChart").disabled = true;
        puntosMuestreo = [];
      }
      if (nuevoPunto)
        placeMarker(e.latLng, map);
  });
    //rectangulo de seleccion
    var bounds = {
          north: 9.949835778560997,
          south: 9.916332528326867,
          east: -84.08193743896476,
          west: -84.12855075073242
        };
    rectangle = new google.maps.Rectangle ({
          bounds: bounds,
          editable: true,
          draggable: true
        });

        rectangle.setMap(map);
        rectangle.addListener('bounds_changed', revisarLimitesRectangulo);

}

function revisarLimitesRectangulo() {
  $('#checkBoxRiverNames').empty();
  puntosMuestreo = [];
  rivers={};
  var boundsSelectionArea = new google.maps.LatLngBounds(rectangle.getBounds().getSouthWest(), rectangle.getBounds().getNorthEast());
  var hilera = "";
  for (var key in markers) {
    if (rectangle.getBounds().contains(markers[key].getPosition())) {
      markers[key].setIcon("/data/Templatic-map-icons/default.png");
      var riverKey = jsonDatosBD[markers[key].id]._id;
      var river_name = jsonDatosBD[markers[key].id].river_name;
      if(rivers[river_name] == undefined){
        rivers[river_name]=[];
        rivers[river_name].push(riverKey);
        //New section: set checkbox with selected rivers names.
        var riverToCheckBox = "<li><input type='checkbox' onclick='riverChecked(this)' value='"+river_name+"' checked/>"+river_name+"</li>";
        $('#checkBoxRiverNames').append(riverToCheckBox);
      }else{
        rivers[river_name].push(riverKey);
      }
      puntosMuestreo.push(riverKey); 
    } else {
      markers[key].setIcon(markers[key].oldIcon)
    }
  }
  if (puntosMuestreo.length > 0) {
    document.getElementById("btnChart").disabled = false;
  }
  else {
    document.getElementById("btnChart").disabled = true;
  }
}

//------------------------------------------MOSTRAR LOS MARCADORES EN EL MAPA---------------------------------------------------------------//

function  insertMarker(){
//peticion ajax al servidor
  $.ajax({
    async:true,
    url: "/webservices/getMarkers_busqueda.php",//devuelve un json con los marcadores que están en la base de datos.
    dataType: "json",
    success:pintar
  });
}


function pintar(jsonData){
  jsonDatosBD=jsonData;//temporal; es solo para que aparezcan los marcadores.
//se insertan en el mapa los marcadores elegidos
  for (var i = 0; i < jsonDatosBD.length; i++) {
      var titulo = "";
      if (jsonDatosBD[i].color == "Mitigacion") {
        titulo = jsonDatosBD[i]._id;
      }
      else {
        titulo = "Calidad del agua: " + jsonDatosBD[i].color;
      }
	    markers[i] = new google.maps.Marker({
	    map: map,
	    position:jsonDatosBD[i].location,
	    title: titulo,
	    icon:"/data/Templatic-map-icons/"+jsonDatosBD[i].color+".png",
	    id:i,//parametro que identifica de forma única a cada marcador, con él se puede encontrar el id real del objeto.
      oldIcon: "/data/Templatic-map-icons/"+jsonDatosBD[i].color+".png"
	  });

      //se hace una asociación indice color.
	    niveles[i]=jsonDatosBD[i].color;
      //se asocia un evento a cada marcador.
      google.maps.event.addListener(markers[i], 'click', function() {
      	aritmeticaPOIS(this);
      });
  }
}

function placeMarker(position, map) {
  if (checkContadorBanderasUsuario()) {
    nMarcador = new google.maps.Marker({
        position: position,
        map: map,
        draggable:true,
        icon: "/data/Templatic-map-icons/Mitigacion.png",
        title: "Acción de Mitigacion",
        oldIcon: "/data/Templatic-map-icons/Mitigacion.png",
        id: markers.length
    });
    google.maps.event.addListener(nMarcador, 'click', function() {
        aritmeticaPOIS(this);
      });
    map.panTo(position);
    document.getElementById("btnMitigacion").className = "btnMitigacion btn";
    google.maps.event.addListener(infowindowNuevoMarcador, 'closeclick', function() {
      //Si no se guardaron los cambios
      nMarcador.setMap(null);
      nuevoPunto = !nuevoPunto;
    });
    infowindowNuevoMarcador.setContent(contentNuevoMarcador);
    infowindowNuevoMarcador.open(map, nMarcador);
		formularioDatos = new FormData();
    var cTipos = llenarTipos();
		if (cTipos < 1) {
			ocultarCombobox();
		}
  }
  else {
    window.alert("Ha excedido el límite de banderas por año");
    document.getElementById("btnMitigacion").className = "btnMitigacion btn";
    nuevoPunto = !nuevoPunto;
  }
}

//----------------------------------------ARITMETICA DE PUNTOS-----------------------------------------------------------------//
function aritmeticaPOIS(marcador) {
    if(contadorClicks<2){//Se puede seleccionar otro
        var iconColor = "/data/Templatic-map-icons/default.png";
        var flagColor = "/data/Templatic-map-icons/Mitigacion-Selected.png";
        if(contadorClicks==0){//es el primer marcador en ser seleccionado.
            first=marcador;
            //se cambia el color del marcador
            marcador.setIcon(iconColor);

            //se abre la ventana de informacion para ver más
            infowindowVerMas.setContent(contentVerMas);
            infowindowVerMas.open(map, marcador);

            //se cambia el color del marcador
            if (jsonDatosBD[marcador.id].color == "Mitigacion") {
              marcador.setIcon(flagColor);
              document.getElementById("btnVerMuestra").innerHTML = "Ver detalles";
            }
            else
              marcador.setIcon(iconColor);

            document.getElementById("btnChart").disabled = false;
            puntosMuestreo.push(jsonDatosBD[marcador.id]._id);
            contadorClicks++;
        }else{//==1
            if(!(marcador.id==first.id)){//se debe dar clic sobre uno distinto.
                puntosMuestreo.push(jsonDatosBD[marcador.id]._id);
                second=marcador;

                //se cierra el marcador de ver más
                infowindowVerMas.close();
                infowindowCalcularDiferencia.setContent(contentCalcularDiferencia);
                infowindowCalcularDiferencia.open(map, marcador);

                if (jsonDatosBD[marcador.id].color == "Mitigacion"){
                  marcador.setIcon(flagColor);
                  document.getElementById("btnVerMuestra").innerHTML = "Ver detalles";
                }
                else
                  marcador.setIcon(iconColor);
                contadorClicks++;
            } else {//se retorna seleccionar otro ya que se dio clic sonbre el mismo, además no se aumenta el contador
                //btnWindows.setText(String.valueOf(getString(R.string.seleccionar_otro)));
            }
        }
        //return view;
    }else{//ya se han seleccionado los dos, se resetean y se llama recursivo para seleccionar el actual.
        //En este punto está abierta la ventana de información de calcular diferencia; se debe cerrar.
        infowindowCalcularDiferencia.close();
        contadorClicks=0;
        //se agregó el cambio de marcador para el caso de gris que es el único que es un recurso externo
        var icon1 = "/data/Templatic-map-icons/"+jsonDatosBD[first.id].color+".png";
        var icon2 = "/data/Templatic-map-icons/"+jsonDatosBD[second.id].color+".png";

        first.setIcon(icon1);
        second.setIcon(icon2);
        aritmeticaPOIS(marcador);
    }
}

//evento para el boton de cerrar el contenedor donde se muestra la información luego de realizar un filtro de dos marcadores
$("#btnCloseArPOI").click(function(){
	$(".arPOIBig").css("display","none");
  $(".contenidoArPOIShort").text("");
});



//=================Función utilizada para mostrar la ventana con la información correspondiente al calculo de la diferencia entre los dos puntos seleccionados======
function mostrarAritmetica() {
  	if(contadorClicks==2){//se permite filtrar, aquí se debe traer la información desde la BD.
        var parametros = {
        	"id1" : jsonDatosBD[first.id].id,
        	"id2" : jsonDatosBD[second.id].id
        };
        $.ajax({
                async:true,
                data:  parametros,
                dataType:"json",
                url:   '/webservices/datosArPOI_busqueda.php',
                success:  calcularDiferencia
        });
	}else{//no se permite
		alert("debe seleccionar dos marcadores");
	}
}



function calcularDiferencia(datos){
  //alert(JSON.stringify(datos[0].POI.location));
  if (datos[0]&&datos[1]) {
    var elevator = new google.maps.ElevationService;
    var locations = [];
    locations.push(datos[0].POI.location);
    locations.push(datos[1].POI.location);
    var positionalRequest = {
      'locations': locations
    }
    elevator.getElevationForLocations(positionalRequest, function (results, status) {
        if (status == google.maps.ElevationStatus.OK && results[0]&&results[1]){
          var puntoBajo=0;
          var puntoAlto=0;
          if(results[0].elevation>results[1].elevation){
            puntoAlto=0;
            puntoBajo=1;
          }else{
            puntoAlto=1;
            puntoBajo=0;
          }
          var texto="";
          texto=texto+"<h1 class='tituloArPOI'>Aritmética de POI's</h1>";
          texto=texto+"<h6 class='tituloArPOI'><b>Punto más alto:</b> "+results[puntoAlto].elevation+" msnm";
          texto=texto+". <b>Ubicación:</b> "+datos[puntoAlto].POI.nombre_institucion;
          texto=texto+" <b>Estación:</b> "+datos[puntoAlto].POI.nombre_estacion+"<br>";

          texto=texto+"<br> <b>Punto más bajo:</b> "+results[puntoBajo].elevation+" msnm";
          texto=texto+". <b>Ubicación:</b> "+datos[puntoBajo].POI.nombre_institucion;
          texto=texto+" <b>Estación:</b> "+datos[puntoBajo].POI.nombre_estacion+"</h6>";
          texto=texto+"<table class='tablaArPOI'><tr><th>Elemento</th><th>Diferencia</th><th>Diferencia porcentual</th></tr>";

          //se obtienen los parametros obligatorios y opcionales para cada uno.
          var POIOne={};
          var POITwo={};
          // using jQuery extend to join documents
          $.extend(POIOne, datos[puntoBajo].Muestra.obligatorios, datos[puntoBajo].Muestra.opcionales);
          $.extend(POITwo, datos[puntoAlto].Muestra.obligatorios, datos[puntoAlto].Muestra.opcionales);
          //la lógica es iterar sobre los datos de un punto y buscar si existe ese valor en el otro para restarlo
          for (var key in POIOne){//Se itera sobre cada uno de los elementos
            if(POITwo[key]){//Si el parametro del primero también está en los obligatorios del segundo.
              var dif = POIOne[key]-POITwo[key];
              if(!isNaN(dif)){
              	dif = dif.toFixed(2);
              	var percent=dif/POITwo[key];//=((POIOne[key]/POITwo[key])*100).toFixed(0);
              	percent=percent.toFixed(2);
                texto=texto+"<tr>"+"<td>"+key+"</td>"+"<td>"+dif+"</td>"+"<td>"+percent+"</td>"+"</tr>";
              }
            }
          }

          texto=texto+"</table>";

          $(".contenidoArPOIShort").append(texto);
          $(".arPOIBig").css("display","block");
        }
    });
  }
}

//=================Función utilizada para mostrar los datos asociados a un marcador======
function mostrarVerMas() {
  var identificador = "";
  var colorMarcador = "";
  if (contadorClicks==2) {
    identificador = jsonDatosBD[second.id].id;
    colorMarcador = jsonDatosBD[second.id].color;
  }
  else {
    identificador = jsonDatosBD[first.id].id;
    colorMarcador = jsonDatosBD[first.id].color;
  }
  if (colorMarcador == "Mitigacion") {
    getDatosMitigacion(identificador);
  }
  else {
    var parametros = {
      "id1" : identificador
    };
    $.ajax({
      async:true,
      data:  parametros,
      dataType:"json",
      url: "/webservices/datosMarker_busqueda.php",
      success:  calcularVerMas
    });
  }
}



function calcularVerMas(datos){

  var muestra = datos[0].Muestra;
  var POI = datos[0].POI;
  var texto="<h2>Datos asociados a la muestra seleccionada</h2><br><br>";
  texto=texto+"<table class='tablaArPOI'>";
  texto = texto+"<tr><th colspan='2'>Datos generales</th></tr>"
    for (var key in muestra){//Se itera sobre cada uno de los elementos
      if(key!="obligatorios"&&key!="opcionales"){
        if(key=='fotos'){
          for(var fkey in muestra[key]){
            //texto=texto+"<tr><td>"+'foto'+"</td><td>"+muestra[key][fkey]+"</td></tr>";
          }
        }else if(key=='palabras_claves'){
          for(var pckey in muestra[key]){
            //texto=texto+"<tr><td>"+'foto'+"</td><td>"+muestra[key][pckey]+"</td></tr>";
          }
        }else{
          texto=texto+"<tr><td>"+key+"</td><td>"+muestra[key]+"</td></tr>";
        }

      }/*else if(key=='obligatorios'){
        texto = texto+"<tr><th colspan='2'>Datos obligatorios</th></tr>"
        var obligatorios = muestra['obligatorios'];
        for(var key in obligatorios){
          texto=texto+"<tr><td>"+key+"</td><td>"+obligatorios[key]+"</td></tr>";
        }
      }else{//opcionales
        texto = texto+"<tr><th colspan='2'>Datos opcionales</th></tr>"
        var opcionales = muestra['obligatorios'];
        for(var key in obligatorios){
          texto=texto+"<tr><td>"+key+"</td><td>"+opcionales[key]+"</td></tr>";
        }
      }*/
    }
  texto=texto+"</table>";

  $(".contenidoArPOIShort").append(texto);
  $(".arPOIBig").css("display","block");
}

//----------------------------------------INSERCION Y MODIFICACION DE PUNTO DE MITIGACION-----------------------------------------------------------------//
function nuevoPuntoMitigacion(element) {
  if (nuevoPunto) {
    document.getElementById(element.id).className = "btnMitigacion btn";
  }
  else {
   document.getElementById(element.id).className = "btnMitigacion_Pressed btn";
  }

  nuevoPunto = !nuevoPunto;
}

function agregarNuevoPunto() {
  var fecha_inicio = document.getElementById('fechaI').value;
  var fecha_fin = document.getElementById('fechaF').value;
  if (document.getElementById('divTipoAct').style.display == "block")
    var tipo_actividad = document.getElementById('tipoAct').value
  else
    var tipo_actividad = document.getElementById('otroTipoAct').value;
  var responsable = document.getElementById('responsable').value;
  var email = document.getElementById('email').value;
  var institucion_promotora = document.getElementById('institucion').value;
  var fotos = "";
  var palabrasClave = JSON.stringify(palabrasClaveMitigacion);
  var descripcion = document.getElementById('descripcion').value;
  var cantidad_participantes = document.getElementById('nParticipantes').value;
  var ponderacion_resultados = document.getElementById('ponderacionRes').value;

  const userKey = Object.keys(window.localStorage)
    .filter(it => it.startsWith('firebase:authUser'))[0];
  const idUsuario = userKey ? JSON.parse(localStorage.getItem(userKey)) : undefined;

  var urlPHP = 'fecha_inicio=' + fecha_inicio +
      '&fecha_fin=' + fecha_fin +
      '&tipo_actividad=' + tipo_actividad +
      '&responsable=' + responsable +
      '&email=' + email +
      '&institucion_promotora=' + institucion_promotora +
      '&fotos=' + fotos +
      '&palabrasClave=' + palabrasClave + 
      '&descripcion=' + descripcion +
      '&cantidad_participantes=' + cantidad_participantes +
      '&ponderacion_resultados=' + ponderacion_resultados +
      '&idUsuario=' + idUsuario.uid;

    //**TODO: Esto debería ser una función de validación aparte para todos los campos, no solo las fotos.
  if (false) {
    
  }
  else {
    var idDocumento = "";
    var longitud = nMarcador.getPosition().lng();
    var latitud = nMarcador.getPosition().lat();
    urlPHP += '&longitud=' + longitud +
              '&latitud=' + latitud;
    $.ajax({
      type: 'POST',
      url: '/webservices/mitigacion/insertarMitigacion.php',
      cache: false,
      data: urlPHP,
      success: function( data ) {
        if (!data.success) {
          console.log("Hubo un problema al guardar el punto de mitigación.\nMensaje: " + data.mensaje);
        } else {
          jsonDatosBD.push({
            "_id": tipo_actividad,
            "color": "Mitigacion",
            "location": {
              "lat": latitud,
              "lng": longitud
            },
            "id": data.elID
          });
          formularioDatos.append("idDocumento",data.elID);

          //Guardar fotos
          $.ajax({
            type: 'POST',
            processData: false,
            url: '/webservices/mitigacion/subirFotos.php',
            contentType: false,
            data: formularioDatos,
            success: function( data ) {
              console.log('Todo bien ' + data);
            },
            error: function(err) {
              console.log(err);
            }
          });
        }
      },
      error: function(err) {
        console.log(err);
      }
    });
    nMarcador.setDraggable(false);
    markers.push(nMarcador);

    infowindowNuevoMarcador.close();
    nuevoPunto = !nuevoPunto;
    actualizarContadorBanderasUsuario(1);
  }
}

function modificarPunto() {
  var fecha_inicio = document.getElementById('fechaI').value;
  var fecha_fin = document.getElementById('fechaF').value;
  var tipo_actividad = document.getElementById('tipoAct').value;
  var responsable = document.getElementById('responsable').value;
  var email = document.getElementById('email').value;
  var institucion_promotora = document.getElementById('institucion').value;
  var descripcion = document.getElementById('descripcion').value;
  var cantidad_participantes = document.getElementById('nParticipantes').value;
  var ponderacion_resultados = document.getElementById('ponderacionRes').value;
  var idAccion = "";
  var ventanaAbierta = null;

	const userKey = Object.keys(window.localStorage)
    .filter(it => it.startsWith('firebase:authUser'))[0];
  const idUsuario = userKey ? JSON.parse(localStorage.getItem(userKey)) : undefined;

  var urlPHP = 'fecha_inicio=' + fecha_inicio +
      '&fecha_fin=' + fecha_fin +
      '&tipo_actividad=' + tipo_actividad +
      '&responsable=' + responsable +
      '&email=' + email +
      '&institucion_promotora=' + institucion_promotora +
      '&fotos=' + JSON.stringify(fotosMarcador) +
      '&descripcion=' + descripcion +
      '&cantidad_participantes=' + cantidad_participantes +
      '&ponderacion_resultados=' + ponderacion_resultados +
      '&idUsuario=' + idUsuario.uid;

  if (contadorClicks==2)  {
    idAccion = jsonDatosBD[second.id].id;
    var latitud = second.getPosition().lat();
    var longitud = second.getPosition().lng();
    ventanaAbierta = infowindowCalcularDiferencia;
  }
  else {
    idAccion = jsonDatosBD[first.id].id;
    var latitud = first.getPosition().lat();
    var longitud = first.getPosition().lng();
    ventanaAbierta = infowindowVerMas;
  }

  urlPHP += '&longitud=' + longitud +
            '&latitud=' + latitud +
            '&idAccion=' + idAccion;
  $.ajax({
    type: 'POST',
    url: '/webservices/mitigacion/modificarMitigacion.php',
    cache: false,
    data: urlPHP,
    success: function( data ) {
      if (!data.success) {
        console.log("Hubo un problema al guardar los cambios en el punto de mitigación.\nMensaje: " + data.mensaje);
      }
    },
    error: function(err) {
      console.log(err);
    }
  });
  ventanaAbierta.close();
}

function hileraPalabrasClave(jsonPalabrasClave) {
  var strPalabrasClave = "";
  var lasPalabras = [];
  if (jsonPalabrasClave["1"] != undefined) {
    lasPalabras.push(jsonPalabrasClave["1"])
  }
  if (jsonPalabrasClave["2"] != undefined) {
    lasPalabras.push(jsonPalabrasClave["2"])
  }
  if (jsonPalabrasClave["3"] != undefined) {
    lasPalabras.push(jsonPalabrasClave["3"])
  }

  for (var i = lasPalabras.length - 1; i >= 0; i--) {
    strPalabrasClave += lasPalabras[i] + ", "
  }
  return strPalabrasClave.substr(0,strPalabrasClave.length-2);
}

function getDatosMitigacion(idAccion) {
  const userKey = Object.keys(window.localStorage)
    .filter(it => it.startsWith('firebase:authUser'))[0];
  const idUsuario = userKey ? JSON.parse(localStorage.getItem(userKey)) : undefined;

  var datos = [];

  if (contadorClicks == 2)
    infowindowCalcularDiferencia.setContent(contentDatosMarcador);
  else
    infowindowVerMas.setContent(contentDatosMarcador);

  $.ajax({
      url: "/webservices/mitigacion/getMitigacionID.php?idAccion=" + idAccion,
      async: false,
      dataType: 'json',
      success: function(data) {
          datos = data;
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.log(XMLHttpRequest);
    }
  });

  if (datos.idUsuario != idUsuario.uid) {
    document.getElementById("btnAccionMitigacion").style.display = "none";
    document.getElementById("btnBorrarPunto").style.display = "none";
  }

  document.getElementById("fechaI").valueAsDate = new Date(datos.fecha_inicio.date);
  document.getElementById("fechaF").valueAsDate = new Date(datos.fecha_fin.date);
  document.getElementById("tipoAct").value = datos.tipo_actividad;
  document.getElementById("responsable").value = datos.responsable;
  document.getElementById("email").value = datos.email;
  document.getElementById("institucion").value = datos.institucion_promotora;
  document.getElementById("descripcion").value = datos.descripcion;
  document.getElementById("nParticipantes").value = datos.cantidad_participantes;
  document.getElementById("ponderacionRes").value = datos.ponderacion_resultados;

	fotosMarcador = [];
  
  for (var i = datos.fotos.urlFotos.length - 1; i >= 0; i--) {
    var palabrasClavePunto = JSON.parse(datos.fotos.palabrasClave)[i];
    var strPalabrasClave = hileraPalabrasClave(palabrasClavePunto);
		fotosMarcador.push(datos.fotos.urlFotos[i]);
    document.getElementById("divFotos").innerHTML +=
      "<div class=\"gallery\">" +
        "<a target=\"_blank\" href=\"" + datos.fotos.urlFotos[i] + "\">" +
          "<img src=\"" + datos.fotos.urlFotos[i] + "\" width=\"100\" height=\"100\" title=\"" + strPalabrasClave + "\">" +
        "</a>" +
      "</div>";
  }
  if (datos.fotos.urlFotos.length < 4) {
    for (var i = 4-(datos.fotos.urlFotos.length) - 1; i >= 0; i--) {
      document.getElementById("divFotos").innerHTML +=
      "<div class=\"gallery\">" +
          "<img width=\"100\" height=\"100\">" +
        "</a>" +
      "</div>";
    }
  }
}

function eliminarDatosMitigacion() {
  var elMarcador = null;
    if (contadorClicks==2)  {
      elMarcador = second;
    }
    else {
      elMarcador = first;
    }
    $.ajax({
      type: 'POST',
      url: '/webservices/mitigacion/eliminarMitigacion.php',
      cache: false,
      data: 'idAccion=' +  jsonDatosBD[elMarcador.id].id,
      success: function( res ) {
        if (!res.success) {
          console.log("Hubo un problema al borrar el punto de mitigación.\nMensaje: " + res.mensaje);
        }
      },
      error: function(err) {
        console.log(err);
      }
    });
    elMarcador.setMap(null);
    contadorClicks = 0;
    actualizarContadorBanderasUsuario(-1);
}

function checkContadorBanderasUsuario(idDocumento) {
  var puedeInsertar = true;
  idContadorBanderas = "";
  const userKey = Object.keys(window.localStorage)
    .filter(it => it.startsWith('firebase:authUser'))[0];
  const idUsuario = userKey ? JSON.parse(localStorage.getItem(userKey)) : undefined;
  var contadorUsuario = [];
  $.ajax({
      url: "/webservices/mitigacion/getContadorBanderas.php?idUsuario=" + idUsuario.uid,
      async: false,
      dataType: 'json',
      success: function(data) {
          contadorUsuario = data;
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.log(XMLHttpRequest);
    }
  });

  if (contadorUsuario != null) {
    idContadorBanderas = contadorUsuario._id.$oid;
    if (contadorUsuario.cantidadBanderas >= 10 && contadorUsuario.anioActual == String(new Date().getFullYear())) {
      puedeInsertar = false;
    }
  }

  return puedeInsertar;
}

function actualizarContadorBanderasUsuario(operacion) {
  var contadorUsuario = [];
  var anioActual = new Date().getFullYear();
  var cantidadBanderas = 1;
  var _id = "";
  const userKey = Object.keys(window.localStorage)
    .filter(it => it.startsWith('firebase:authUser'))[0];
  const idUsuario = userKey ? JSON.parse(localStorage.getItem(userKey)) : undefined;

  $.ajax({
      url: "/webservices/mitigacion/getContadorBanderas.php?idUsuario=" + idUsuario.uid,
      async: false,
      dataType: 'json',
      success: function(data) {
          contadorUsuario = data;
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.log(XMLHttpRequest);
    }
  });

  if (contadorUsuario != null) {
    if (contadorUsuario.anioActual == String(anioActual)) {
      cantidadBanderas = contadorUsuario.cantidadBanderas;
      cantidadBanderas += 1*operacion;
    }
    _id = contadorUsuario._id.$oid;
  }

  var urlPHP = '&idUsuario=' + idUsuario.uid +
              '&anioActual=' + anioActual +
              '&cantidadBanderas=' + cantidadBanderas;
  if (_id != "") {
    urlPHP += '&idDocumento=' + _id;
  }

  $.ajax({
    type: 'POST',
    url: '/webservices/mitigacion/actualizarContadorBanderas.php',
    cache: false,
    data: urlPHP,
    success: function( data ) {
      if (!data.success) {
        console.log("Hubo un problema al actualizar el contador de banderas.\nMensaje: " + data.mensaje);
      }
    },
    error: function(err) {
      console.log(err);
    }
  });
}

//---------------------------------------EVENTOS DE LOS BOTONES DENTRO DE LA PÁGINA------------------------------------------------------------------//

//eventos de los botones de calidades de agua
document.getElementById("calidad1").onclick = function(){
  if(document.getElementById("calidad1").value==0){
    for(var i=0;i<niveles.length;i++){
      if(niveles[i]=="Azul"){
      markers[i].setVisible(false);
      }
    }
    document.getElementById("calidad1").value=1;
  }else{
    for(var i=0;i<niveles.length;i++){
      if(niveles[i]=="Azul"){
       markers[i].setVisible(true);
      }
    }
    document.getElementById("calidad1").value=0;
  }
}


document.getElementById("calidad2").onclick = function(){
  if(document.getElementById("calidad2").value==0){
  	for(var i=0;i<niveles.length;i++){
  		if(niveles[i]=="Verde"){
  		markers[i].setVisible(false);
  		}
  	}
    document.getElementById("calidad2").value=1;
  }else{
    for(var i=0;i<niveles.length;i++){
      if(niveles[i]=="Verde"){
       markers[i].setVisible(true);
      }
    }
    document.getElementById("calidad2").value=0;
  }
}


document.getElementById("calidad3").onclick = function(){
  if(document.getElementById("calidad3").value==0){
    for(var i=0;i<niveles.length;i++){
      if(niveles[i]=="Amarillo"){
      markers[i].setVisible(false);
      }
    }
    document.getElementById("calidad3").value=1;
  }else{
    for(var i=0;i<niveles.length;i++){
      if(niveles[i]=="Amarillo"){
       markers[i].setVisible(true);
      }
    }
    document.getElementById("calidad3").value=0;
  }
}


document.getElementById("calidad4").onclick = function(){
  if(document.getElementById("calidad4").value==0){
    for(var i=0;i<niveles.length;i++){
      if(niveles[i]=="Anaranjado"){
      markers[i].setVisible(false);
      }
    }
    document.getElementById("calidad4").value=1;
  }else{
    for(var i=0;i<niveles.length;i++){
      if(niveles[i]=="Anaranjado"){
       markers[i].setVisible(true);
      }
    }
    document.getElementById("calidad4").value=0;
  }
}


document.getElementById("calidad5").onclick = function(){
  if(document.getElementById("calidad5").value==0){
    for(var i=0;i<niveles.length;i++){
      if(niveles[i]=="Rojo"){
      markers[i].setVisible(false);
      }
    }
    document.getElementById("calidad5").value=1;
  }else{
    for(var i=0;i<niveles.length;i++){
      if(niveles[i]=="Rojo"){
       markers[i].setVisible(true);
      }
    }
    document.getElementById("calidad5").value=0;
  }
}


document.getElementById("reset").onclick = function(){
  for(var i=0;i<markers.length;i++){
    markers[i].setVisible(true);
  }
}

function graficar() {
  window.location = "/index.php/nuevoGrafico?puntosMuestreo=" + encodeURIComponent(puntosMuestreo);
}

//=================Función utilizada para ocultar o mostrar los puntos de mitigación en el mapa======
function toggleMitigacion() {
  verMitigacion = !verMitigacion;
  if (!verMitigacion) {
    for (var key in markers) {
      if (markers[key].getIcon() == "/data/Templatic-map-icons/Mitigacion.png") {
        markers[key].setVisible(false);
      }
    }
    document.getElementById("toggleMitigacion").className = "fa fa-eye";
  }
  else {
   for (var key in markers) {
      if (markers[key].getIcon() == "/data/Templatic-map-icons/Mitigacion.png") {
        markers[key].setVisible(true);
      }
    }
    document.getElementById("toggleMitigacion").className = "fa fa-eye-slash";
  }
}

//=================Función utilizada para ocultar o mostrar los puntos de muestreo en el mapa======
function toggleMuestreo() {
  verMuestreo = !verMuestreo;
  if (!verMuestreo) {
    for (var key in markers) {
      if (markers[key].getIcon() != "/data/Templatic-map-icons/Mitigacion.png") {
        markers[key].setVisible(false);
      }
    }
    document.getElementById("toggleMuestreo").className = "fa fa-eye";
  }
  else {
   for (var key in markers) {
      if (markers[key].getIcon() != "/data/Templatic-map-icons/Mitigacion.png") {
        markers[key].setVisible(true);
      }
    }
    document.getElementById("toggleMuestreo").className = "fa fa-eye-slash";
  }
}

//-----------------------------------------FILTRO POR RADIO-MARCADOR MOVIBLE ASOCIADO----------------------------------------------------------------//
//filtrado por radio de influencia. Se busca dentro del mapa por un radio brindado por el usuario.
function aplicarFiltro(valor,flag){
  if (flag&&valor>=1) {//caso filtro de radio de influencia
    var dist=0;
    for(var i =0;i<markers.length;i++){
      dist = distance(markers[i].position.lat(), markers[i].position.lng(), filterMarker.position.lat(),  filterMarker.position.lng(), 'K');
      if (dist>valor) {
        markers[i].setVisible(false);
      }
    }
  }else{//caso filtro de rios
  }
}


//calcula la distancia entre dos puntos, retorna en está situación un valor en KM
function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1/180;
    var radlat2 = Math.PI * lat2/180;
    var radlon1 = Math.PI * lon1/180;
    var radlon2 = Math.PI * lon2/180;
    var theta = lon1-lon2;
    var radtheta = Math.PI * theta/180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit=="K") { dist = dist * 1.609344; }
    if (unit=="N") { dist = dist * 0.8684; }
    return dist;
}


//---------------------------------------------AUTOCOMPLETADO DEL DIV DONDE SE REALIZAN FILTROS------------------------------------------------------------//

//Completado de campos de filtro traídos desde la BD.

$.ajax({
        async:true,
        dataType:"json",
        url:   '/php/completadoFiltro_busqueda.php',
        success:  completar
});


function completar(datos){
  //alert(datos.length);
    $("#institucion").append("<option value='hh'>seleccione</option>");
  for(var i =0;i<datos.length;i++){
    $("#institucion").append("<option value='hh'>"+datos[i]+"</option>");
  }
  var styles = {
    width:"80%"
  };
  $("#institucion").css( styles );
}


//---------------------------------------------FUNCIONES PARA MODAL DE PALABRAS CLAVE------------------------------------------------------------//
var elModalKW = document.getElementById('modalKeywords');
var elSpanKWCerrar = document.getElementById("closeModal");

function dialogoSubirFoto(numeroFoto) {
  $('#imgupload'+numeroFoto).trigger('click');
  if (!flagFileChange) {
    $(":file").change(function(e){    
      var reader = new FileReader();
      var idTarget = e.target.id;
      formularioDatos.append("fotos[]", document.getElementById(idTarget).files[0]);

      reader.onload = function(ee) {
        if (idTarget == "imgupload1")
          $('#picUpd1').attr('src', ee.target.result);
        else if (idTarget == "imgupload2")
          $('#picUpd2').attr('src', ee.target.result);
        else if (idTarget == "imgupload3")
          $('#picUpd3').attr('src', ee.target.result);
        else if (idTarget == "imgupload4")
          $('#picUpd4').attr('src', ee.target.result);
      }
      reader.readAsDataURL(document.getElementById(idTarget).files[0]);

      mostrarModal();
    });
    flagFileChange = true;
  }
}

function mostrarModal() {
  elModalKW.style.display = "block";
  document.getElementById('smtKW').onclick = function() {
    var arrayPalabrasClave = [];
    palabrasClaveMitigacion.push({
      "1": document.getElementById('ipKW1').value,
      "2": document.getElementById('ipKW2').value,
      "3": document.getElementById('ipKW3').value
    });
		document.getElementById('ipKW1').value = "";
		document.getElementById('ipKW2').value = "";
		document.getElementById('ipKW3').value = "";
		elModalKW.style.display = "none";
  }
}
elSpanKWCerrar.onclick = function() {
  elModalKW.style.display = "none";
}



//dropdown checkbox for river filtered rivers names.

$(".dropdown dt a").on('click', function() {
  $(".dropdown dd ul").slideToggle('fast');
});

$(".dropdown dd ul li a").on('click', function() {
  $(".dropdown dd ul").hide();
});

$(document).bind('click', function(e) {
  var $clicked = $(e.target);
  if (!$clicked.parents().hasClass("dropdown")) $(".dropdown dd ul").hide();
});


/*function riverChecked(elem){
  console.log(elem.value);
  console.log(rivers);
  console.log("-----------------");
  console.log(puntosMuestreo);
  //If element is checked it is necessary to return values back to puntosMuestreo array
  if($(elem).is(':checked')){
      for(var river in rivers){
        if(river!=elem.value){
          console.log(river);
        }
      }
  }else{//If river is unchecked it is necessary to remove stations from puntosMuestreo array
      for(var river in rivers){
        if(river!=elem.value){
          console.log(river);
        }
      }
  }
  console.log(puntosMuestreo);
  console.log("-----------------");
}*/


function riverChecked(elem){
  //If element is checked it is necessary to return values back to puntosMuestreo array
  if($(elem).is(':checked')){
    puntosMuestreo = puntosMuestreo.concat(rivers[elem.value]);
  }else{//If river is unchecked it is necessary to remove stations from puntosMuestreo array
      var tempSt = [];
      var stations = rivers[elem.value];
      for(var i = 0; i < puntosMuestreo.length;i++){
        //se buscan todos excepto los que están en stations
        if(stations.indexOf(puntosMuestreo[i])==-1){//No está en stations se guarda.
          tempSt.push(puntosMuestreo[i]);
        }
      }
      puntosMuestreo=tempSt;
  }
  if (puntosMuestreo.length > 0) {
    document.getElementById("btnChart").disabled = false;
  }
  else {
    document.getElementById("btnChart").disabled = true;
  }

}
