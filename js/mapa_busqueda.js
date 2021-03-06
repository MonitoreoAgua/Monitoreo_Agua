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
// variables que guardan los datos asociados a un punto de mitigación que se va a guardar en la bas e de datos
var flagFileChange = false;
// variable que representa un círculo alrededor del centroide en el mapa
var centroidCircle;
var isFilterToggle=false;
//-------------FUNCTIONS FOR CONTROLING THE TOP BUTTON ON THE MAP--------------------//
   
        /**
       * The CenterControl adds a control to the map that recenters the map on
       * Chicago.
       * This constructor takes the control DIV as an argument.
       * @constructor
       */
      function CenterControl(controlDiv, map) {

        /*ControlUI to control all content of menu*/
        var controlUI = document.createElement('div');
        controlUI.className = 'anidar';
        controlDiv.style.width="100%";
        controlDiv.id = "controlDiv";
        controlDiv.style.left = '0px';
        controlDiv.appendChild(controlUI);
        controlDiv.style.backgroundColor = '#039BE5';
        
        /*BTN to control menu over the map*/
        var anidarMenu = document.createElement('SPAN');
        anidarMenu.id = 'anidarMenu';
        anidarMenu.innerHTML = "<a>&#9776;</a>";
        //anidarMenu.className = "btn";
        anidarMenu.addEventListener('click', function() {
          $( ".filters" ).toggle( "slow", function() {
            if(isFilterToggle){
              $("#controlDiv").css('width','100%');
              $("#controlDiv").css('border-radius','0px');
              $("#controlDiv").css('margin-top','0px');
              $("#controlDiv").css('margin-left','0px');
              isFilterToggle=!isFilterToggle; 
            }else{
              $("#controlDiv").css('width','4%');
              $("#controlDiv").css('border-radius','5px');
              $("#controlDiv").css('margin-top','15px');
              $("#controlDiv").css('margin-left','15px');
              isFilterToggle=!isFilterToggle;            
            }
          });
        });
        
        //<button class="btn" id="btnMitigacion" onclick="nuevoPuntoMitigacion(this);"><img class="iconMiMu" src="/data/Templatic-map-icons/MitigacionAdd.png"></img></button>
        var btnMitigacion = document.createElement('button');
        btnMitigacion.className = 'btn filters';
        btnMitigacion.id ='btnMitigacion';
        btnMitigacion.innerHTML = '<img class="iconMiMu" src="/data/Templatic-map-icons/MitigacionAdd.png"></img>';
        btnMitigacion.addEventListener("click", function() {
          nuevoPuntoMitigacion(this);
        });
        
        //<button class="btn" id="btnToggleMitigacion" onclick="toggleMitigacion();"><img class="iconMiMu" id=toggleMitigacion src="/data/Templatic-map-icons/mi.png"></img></button>
        var btnToggleMitigacion = document.createElement('button');
        btnToggleMitigacion.className = 'btn filters';
        btnToggleMitigacion.id ='btnToggleMitigacion';
        btnToggleMitigacion.innerHTML = '<img class="iconMiMu" id=toggleMitigacion src="/data/Templatic-map-icons/mi.png"></img>';
        btnToggleMitigacion.addEventListener('click',function () {
          toggleMitigacion();
        });
        //<button class="btn" id="btnToggleMuestreo" onclick="toggleMuestreo();"><img class="iconMiMu" id=toggleMuestreo src="/data/Templatic-map-icons/mu.png"></img></button>
        var btnToggleMuestreo = document.createElement('button');
        btnToggleMuestreo.className = 'btn filters';
        btnToggleMuestreo.id ='btnToggleMuestreo';
        btnToggleMuestreo.innerHTML = '<img class="iconMiMu" id=toggleMuestreo src="/data/Templatic-map-icons/mu.png"></img>';
        btnToggleMuestreo.addEventListener('click',function () {
          toggleMuestreo();
        });  
        //<button class="btn" id="btnCentrarRectangulo" onclick="centrarRectangulo();"><i style="font-size: 12px">Centrar</i></button>
        var btnCentrarRectangulo = document.createElement('button');
        btnCentrarRectangulo.className = 'btn filters';
        btnCentrarRectangulo.id ='btnCentrarRectangulo';
        btnCentrarRectangulo.innerHTML = '<i style="font-size: 12px">Centrar</i>';
        btnCentrarRectangulo.addEventListener('click',function () {
          centrarRectangulo();
        });  

        //<button class="btn" id="btnChart" onclick="graficar();" disabled="true"><i class="fa fa-area-chart"></i></button>
        var btnChart = document.createElement('button');
        btnChart.className = 'btn filters';
        btnChart.id ='btnChart';
        btnChart.innerHTML = '<i class="fa fa-area-chart"></i>';
        btnChart.addEventListener('click',function () {
          graficar();
        });       
        
        //River checkbox
        var riversCheck = document.createElement('dl');
        riversCheck.className = 'dropdown filters';
        riversCheck.innerHTML="<dt onclick='riverDropDownClicked();'><a><span class='hida'>Rios:</span></a></dt><dd><div class='mutliSelect'><ul id='checkBoxRiverNames'></ul></div></dd>";
        
        //<input type='number' min='1' id='inputFilterRadio' placeholder='Radio' value=1 onchange='changeCircleRadius(this.value);'>
        var riverInput=document.createElement('input');
        riverInput.className='filters';
        riverInput.style.height = '30px';
        riverInput.style.width = '4%';
        riverInput.type='number';
        riverInput.min = '1';
        riverInput.id='inputFilterRadio';
        riverInput.placeholder='Radio';
        riverInput.value='1';
        riverInput.addEventListener('change',function() {
            changeCircleRadius(this.value);
        });
        
        //<button class='btn botonFiltroR' onclick='aplicarFiltro(document.getElementById('inputFilterRadio').value,1)'><i class='fa fa-filter'></i></button>
        var riverBtnAplicar = document.createElement('button');
        riverBtnAplicar.className='btn botonFiltroR filters';
        riverBtnAplicar.addEventListener('click', function() {
            aplicarFiltro(document.getElementById('inputFilterRadio').value,1);
        });
        riverBtnAplicar.innerHTML = "<i class='fa fa-filter'></i>";
        
        
        //<button class='btn reset' id='reset'><i class='fa fa-eraser'></i></button>
        var riverBtnReset = document.createElement('button');
        riverBtnReset.className='btn reset filters';
        riverBtnReset.id='reset';
        riverBtnReset.addEventListener('click',function() {
            reset_radio_filter();
        });
        riverBtnReset.innerHTML = "<i class='fa fa-eraser'></i>";
        
        controlUI.appendChild(anidarMenu);
        controlUI.appendChild(btnMitigacion);
        controlUI.appendChild(btnToggleMitigacion);
        controlUI.appendChild(btnToggleMuestreo);
        controlUI.appendChild(btnCentrarRectangulo);
        controlUI.appendChild(btnChart);
        controlUI.appendChild(riversCheck);
        controlUI.appendChild(riverInput);
        controlUI.appendChild(riverBtnAplicar);
        controlUI.appendChild(riverBtnReset);
        // Setup the click event listeners: simply set the map to Chicago.

      }
      

//-----------------------------------------INICIALIZACION DEL MAPA----------------------------------------------------------------//
function initMap() {

    var container = $('#map').get(0);
	  //creación del mapa
	 map = new google.maps.Map(container, {
	    zoom: 11,
	    center: {"lat":9.876711,"lng":-84.104376},
	    radius:19,
      gestureHandling: 'cooperative',
      mapTypeControl: false

	  });


    // Create the DIV to hold the control and call the CenterControl()
    // constructor passing in this DIV.
    var centerControlDiv = document.createElement('div');
    var centerControl = new CenterControl(centerControlDiv, map);

    centerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

        
        
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
    centrarRectangulo();
    rectangle.setMap(map);
    rectangle.addListener('bounds_changed', revisarLimitesRectangulo);

    //circulo alrededor del centroide
    centroidCircle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.5,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: map,
      center: filterMarker.getPosition(),
      radius: 2 * 1000
    });
    //evento asociado al movimiento del centroide en el mapa para redibujar el círculo a su alrededor
    google.maps.event.addListener(filterMarker, 'dragend', function() {
        centroidCircle.setCenter(filterMarker.getPosition());
    });

}


  $( window ).resize(function() {
      if(isFilterToggle){
          $( ".filters" ).toggle( "slow", function() {
              $("#controlDiv").css('width','100%');
              $("#controlDiv").css('border-radius','0px');
              $("#controlDiv").css('margin-top','0px');
              $("#controlDiv").css('margin-left','0px');
              $("#controlDiv").css('left','0px');
              isFilterToggle=!isFilterToggle;
          })
      }
  });



function revisarLimitesRectangulo() {
  $('#checkBoxRiverNames').empty();
  puntosMuestreo = [];
  rivers={};
  var boundsSelectionArea = new google.maps.LatLngBounds(rectangle.getBounds().getSouthWest(), rectangle.getBounds().getNorthEast());
  var hilera = "";
  for (var key in markers) {
    if (jsonDatosBD[markers[key].id].color != "Mitigacion") {
      if (rectangle.getBounds().contains(markers[key].getPosition())) {
        markers[key].setIcon("/data/Templatic-map-icons/default.png");
        var riverKey = jsonDatosBD[markers[key].id]._id;
        var river_name = jsonDatosBD[markers[key].id].river_name;
        if(rivers[river_name] == undefined){
          rivers[river_name]=[];
          rivers[river_name].push(riverKey);
          //New section: set checkbox with selected rivers names.
          var riverToCheckBox = "<li><input type='checkbox' onclick='riverChecked(this);' value='"+river_name+"' checked/>"+river_name+"</li>";
          $('#checkBoxRiverNames').append(riverToCheckBox);
        }else{
          rivers[river_name].push(riverKey);
        }
        puntosMuestreo.push(riverKey);
      } else {
        markers[key].setIcon(markers[key].oldIcon)
      }
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
    document.getElementById("btnMitigacion").className = "btnMitigacion btn filters";
    google.maps.event.addListener(infowindowNuevoMarcador, 'closeclick', function() {
      //Si no se guardaron los cambios
      nMarcador.setMap(null);
      nuevoPunto = !nuevoPunto;
			photosArray.clearStructure();
    });

    infowindowNuevoMarcador.setContent(contentNuevoMarcador);
    infowindowNuevoMarcador.open(map, nMarcador);
    document.getElementById("responsable").value = name_google;
    document.getElementById("email").value = email_google;
    var cTipos = llenarTipos();
		if (cTipos < 1) {
			ocultarCombobox();
		}
	  var posicion = new google.maps.LatLng(nMarcador.getPosition().lat()+(0.12),nMarcador.getPosition().lng());
    map.setCenter(posicion);
  }
  else {
    window.alert("Ha excedido el límite de banderas por año");
    document.getElementById("btnMitigacion").className = "btnMitigacion btn filters";
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
    document.getElementById(element.id).className = "btnMitigacion btn filters";
  }
  else {
   document.getElementById(element.id).className = "btnMitigacion_Pressed btn filters";
  }

  nuevoPunto = !nuevoPunto;
}

function agregarNuevoPunto() {
  var fecha_inicio = document.getElementById('fechaI').value;
  var fecha_fin = document.getElementById('fechaF').value;
  if (document.getElementById('divTipoAct').style.display == "block")
    var tipo_actividad = document.getElementById('tipoAct').value;
  else
    var tipo_actividad = document.getElementById('otroTipoAct').value;
  var responsable = document.getElementById('responsable').value;
  var email = document.getElementById('email').value;
  var institucion_promotora = document.getElementById('institucion').value;
  var fotos = "";
  var palabrasClave = JSON.stringify(storeKeywordsInArray());
  var descripcion = document.getElementById('descripcion').value;
  var cantidad_participantes = document.getElementById('nParticipantes').value;
  var ponderacion_resultados = document.getElementById('ponderacionRes').value;
  var periodicidad = $("input[name=periodicidad]:checked").val();
  var obsPeriodicidad = document.getElementById('obsPeriodicidad').value;

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
      '&idUsuario=' + id_google +
      '&periodicidad=' + periodicidad +
      '&obsPeriodicidad=' + obsPeriodicidad;

    //**TODO: Esto debería ser una función de validación aparte para todos los campos, no solo las fotos.
  if (false) {

  }
  else {
    var idDocumento = "";
    var longitud = nMarcador.getPosition().lng();
    var latitud = nMarcador.getPosition().lat();
    var datos_geograficos = obtenerZonasAdministrativas(latitud,longitud);
    urlPHP += '&longitud=' + longitud +
              '&latitud=' + latitud +
              '&datos_geograficos=' + JSON.stringify(datos_geograficos);
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

          var formularioDatos = storePhotosInForm(data.elID);

          //Guardar fotos
          $.ajax({
            type: 'POST',
            processData: false,
            url: '/webservices/mitigacion/subirFotos.php',
            contentType: false,
            data: formularioDatos,
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
    flagFileChange = false;
    palabrasClaveMitigacion = [];
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
      '&idUsuario=' + id_google;

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
  if (jsonPalabrasClave["w1"] != undefined && jsonPalabrasClave["w1"] != "") {
    lasPalabras.push(jsonPalabrasClave["w1"])
  }
  if (jsonPalabrasClave["w2"] != undefined && jsonPalabrasClave["w2"] != "") {
    lasPalabras.push(jsonPalabrasClave["w2"])
  }
  if (jsonPalabrasClave["w3"] != undefined && jsonPalabrasClave["w3"] != "") {
    lasPalabras.push(jsonPalabrasClave["w3"])
  }

  for (var i = lasPalabras.length - 1; i >= 0; i--) {
    strPalabrasClave += lasPalabras[i] + ", "
  }
  return strPalabrasClave.substr(0,strPalabrasClave.length-2);
}

function getDatosMitigacion(idAccion) {
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

  if (datos.idUsuario != id_google) {
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
  document.getElementById("obsPeriodicidad").value = datos.observaciones_periodicidad;

  var rdbPeriodicidad = document.getElementsByName("periodicidad");
  for (var i = rdbPeriodicidad.length - 1; i >= 0; i--) {
    if (datos.periodicidad === rdbPeriodicidad[i].value) {
      rdbPeriodicidad[i].checked = true;
      break;
    }
  }

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
  var contadorUsuario = [];
  $.ajax({
      url: "/webservices/mitigacion/getContadorBanderas.php?idUsuario=" + id_google,
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

  $.ajax({
      url: "/webservices/mitigacion/getContadorBanderas.php?idUsuario=" + id_google,
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

  var urlPHP = '&idUsuario=' + id_google +
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


function reset_radio_filter(){
  for(var i=0;i<markers.length;i++){
    markers[i].setVisible(true);
  }
}

function graficar() {
  window.location = "/index.php/nuevoGrafico?puntosMuestreo=" + encodeURIComponent(puntosMuestreo);
}

//=================Función utilizada para ocultar o mostrar los puntos de mitigación en el mapa======
function toggleMitigacion() {
  if (verMitigacion) {
    for (var key in markers) {
      if (markers[key].getIcon() == "/data/Templatic-map-icons/Mitigacion.png") {
        markers[key].setVisible(false);
      }
    }
    console.log("changing to miS");
    document.getElementById("toggleMitigacion").src = "/data/Templatic-map-icons/miSlash.png";
  }
  else {
   for (var key in markers) {
      if (markers[key].getIcon() == "/data/Templatic-map-icons/Mitigacion.png") {
        markers[key].setVisible(true);
      }
    }
    console.log("changing to mi");
    document.getElementById("toggleMitigacion").src = "/data/Templatic-map-icons/mi.png";
  }
  verMitigacion = !verMitigacion;
}

//=================Función utilizada para ocultar o mostrar los puntos de muestreo en el mapa======
function toggleMuestreo() {
  if (verMuestreo) {
    for (var key in markers) {
      if (markers[key].getIcon() != "/data/Templatic-map-icons/Mitigacion.png") {
        markers[key].setVisible(false);
      }
    }
    document.getElementById("toggleMuestreo").src = "/data/Templatic-map-icons/muSlash.png";
  }
  else {
   for (var key in markers) {
      if (markers[key].getIcon() != "/data/Templatic-map-icons/Mitigacion.png") {
        markers[key].setVisible(true);
      }
    }
    document.getElementById("toggleMuestreo").src = "/data/Templatic-map-icons/mu.png";
  }
  verMuestreo = !verMuestreo;
}

//-----------------------------------------FILTRO POR RADIO-MARCADOR MOVIBLE ASOCIADO----------------------------------------------------------------//
//filtrado por radio de influencia. Se busca dentro del mapa por un radio brindado por el usuario.
function aplicarFiltro(valor,flag){
      for(var i =0;i<markers.length;i++){
        markers[i].setVisible(true);
      }
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

function photoChosen(numeroFoto) {
  switch (numeroFoto) {
    case 1:
      if (photosArray.ph1 == null)
        return false;
      break;
    case 2:
      if (photosArray.ph2 == null)
        return false;
      break;
    case 3:
      if (photosArray.ph3 == null)
        return false;
      break;
    case 4:
      if (photosArray.ph4 == null)
        return false;
      break;
  }
  return true;
}


function dialogoSubirFoto(numeroFotoClick, cambioFoto) {
  if (!photoChosen(numeroFotoClick) || cambioFoto) {
    $('#imgupload'+numeroFotoClick).trigger('click');
      $(":file").change(function(e){
        var reader = new FileReader();
        var idTarget = e.target.id;
        photosArray.appendPhoto(idTarget,document.getElementById(idTarget).files[0]);

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

        mostrarModal(idTarget,true);
      });
  }
  else {
    console.log("Ya hay una foto escogida.");
    mostrarModal("imgupload"+numeroFotoClick,false);
  }
}

function mostrarModal(idTarget, nuevaFoto) {
	document.getElementById('ipKW1').value = "";
	document.getElementById('ipKW2').value = "";
	document.getElementById('ipKW3').value = "";
  document.getElementById('chPhoto').style.display = "none";
  elModalKW.style.display = "block";
  if (!nuevaFoto) {
    switch (idTarget) {
      case "imgupload1":
        document.getElementById('ipKW1').value = photosArray.kw1.w1;
        document.getElementById('ipKW2').value = photosArray.kw1.w2;
        document.getElementById('ipKW3').value = photosArray.kw1.w3;
        break;
      case "imgupload2":
        document.getElementById('ipKW1').value = photosArray.kw2.w1;
        document.getElementById('ipKW2').value = photosArray.kw2.w2;
        document.getElementById('ipKW3').value = photosArray.kw2.w3;
        break;
      case "imgupload3":
        document.getElementById('ipKW1').value = photosArray.kw3.w1;
        document.getElementById('ipKW2').value = photosArray.kw3.w2;
        document.getElementById('ipKW3').value = photosArray.kw3.w3;
        break;
      case "imgupload4":
        document.getElementById('ipKW1').value = photosArray.kw4.w1;
        document.getElementById('ipKW2').value = photosArray.kw4.w2;
        document.getElementById('ipKW3').value = photosArray.kw4.w3;
        break;
    }

    document.getElementById('chPhoto').style.display = "block";
    document.getElementById('chPhoto').onclick = function() {
      switch (idTarget) {
        case "imgupload1":
          dialogoSubirFoto(1,true);
          break;
        case "imgupload2":
          dialogoSubirFoto(2,true);
          break;
        case "imgupload3":
          dialogoSubirFoto(3,true);
          break;
        case "imgupload4":
          dialogoSubirFoto(4,true);
          break;
      }
    }
  }
  document.getElementById('smtKW').onclick = function() {
    var arrayPalabrasClave = {
      "w1": document.getElementById('ipKW1').value,
      "w2": document.getElementById('ipKW2').value,
      "w3": document.getElementById('ipKW3').value
    };
    switch (idTarget) {
      case "imgupload1":
        photosArray.kw1 = arrayPalabrasClave;
        break;
      case "imgupload2":
        photosArray.kw2 = arrayPalabrasClave;
        break;
      case "imgupload3":
        photosArray.kw3 = arrayPalabrasClave;
        break;
      case "imgupload4":
        photosArray.kw4 = arrayPalabrasClave;
        break;
    }
		elModalKW.style.display = "none";
  }
}
elSpanKWCerrar.onclick = function() {
  elModalKW.style.display = "none";
}



//dropdown checkbox for river filtered rivers names.

function riverDropDownClicked() {
  $("#checkBoxRiverNames").slideToggle('fast');
  $("#checkBoxRiverNames").style.display = 'block';
}
       
$(".dropdown dd ul li a").on('click', function() {
  $("#checkBoxRiverNames").hide();
});

$(document).bind('click', function(e) {
  var $clicked = $(e.target);
  if (!$clicked.parents().hasClass("dropdown")) $(".dropdown dd ul").hide();
});


//This function receive the element with value equal to station name
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

function centrarRectangulo() {
  var latCenter = map.getCenter().lat();
  var lngCenter = map.getCenter().lng();
  var difZoom = 11 - map.getZoom();
  var tamanoHori = 0.05;
  var tamanoVert = 0.025;
  if (difZoom > 0) {
    tamanoHori *= (2*difZoom);
    tamanoVert *= (2*difZoom);
  }
  else if (difZoom < 0) {
    tamanoHori /= (-2*difZoom);
    tamanoVert /= (-2*difZoom);
  }

  var bounds = {
    north: latCenter - tamanoVert,
    south: latCenter + tamanoVert,
    east: lngCenter + tamanoHori,
    west: lngCenter - tamanoHori
  };
  rectangle.setBounds(bounds);
}


function obtenerZonasAdministrativas(latPunto, lngPunto) {
  var res = {};
  var country = "";
  var zonaAdm1 = "";
  var zonaAdm2 = "";
  var zonaAdm3 = "";
  $.ajax({
    url: "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latPunto + "," + lngPunto + "&key=AIzaSyBF0VFFF-7ojo6bKf_G81kq2cazEhaB2cc",
    async: false,
    dataType: 'json',
    success: function(data) {
      if (data.status == "OK") {
        var jsonArrayGeo = data.results[0].address_components;
        for (var i = 0; i < jsonArrayGeo.length; i++) {
          var objGeo = jsonArrayGeo[i];
          var jsonArrayType = objGeo.types;
          var tipo = jsonArrayType[0];
          if (tipo == "country") {
            country = objGeo.long_name;
          }
          else if (tipo == "administrative_area_level_1") {
            zonaAdm1 = objGeo.long_name;
          }
          else if (tipo == "administrative_area_level_2") {
            zonaAdm2 = objGeo.long_name;
            zonaAdm3 = jsonArrayGeo[i-1].long_name;
          }
        }
        res = {"pais": country, "area_administrativa_1": zonaAdm1, "area_administrativa_2": zonaAdm2, "area_administrativa_3": zonaAdm3};
      }
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      console.log(XMLHttpRequest);
    }
  });

  return res;
}


function changeCircleRadius(newRadius) {
  centroidCircle.setRadius(newRadius*1000);
}

function agregarMail() {
    var newHref = $(".verAforo").attr('href');
    $(".verAforo").attr("href",newHref+email_google);
}