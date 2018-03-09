/**
* Crea una tag HTML para la opción del comboBox de tipos según el nombre ingresado
* @param Campo del JSON de tipos con un tipo específico
* @return la tag que representa la opción del tipo ingresado
**/


function llenarComboTipo(Tipo) {
	return "<option value=\"" + Tipo.tipo_actividad + "\">" + Tipo.tipo_actividad + "</option>"
}

/**
* Parsea un JSON para crear un HTML que representa un comboBox con los tipos
* @param tipos El JSON con los tipos
* @param html Hilera con el HTML que contiene el encabezado del comboBox
* @return El HTML con el comboBox
**/
function parsearTipos(tipos,html) {

	var nombres = [];
	for (var i = 0; i < tipos.length; i++) {
		if (!nombres.includes(tipos[i].tipo_actividad)) {
			nombres.push(tipos[i].tipo_actividad);
			html += llenarComboTipo(tipos[i]);
		}
	}
	return html;
}


/**
* Crea el código HTML para un comboBox con los tipos de acción de mitigación y lo coloca en la sección correspondiente
**/
function llenarTipos() {
	/** Obtener los datos de la base de MongoDB **/
	var json = {};

	$.ajax({
      async:false,
      url: "/webservices/mitigacion/getTiposMitigacion.php",//devuelve un json con los tipos que están en la base de datos.
      dataType: "json",
      success: function (data) {
					generarCombobox(data);
					json = data;
			},
      error: function (er) {
        console.log(er);
      },
      });
	return json.length;
}

function generarCombobox(jsonData){
	/** Generar el HTML **/
	var headerHtml = 	"<label for=\"tipoAct\">Tipo de actividad:</label>" +
			   			"<select id=\"tipoAct\" onchange=\"if(this.selectedIndex == this.length-1)ocultarCombobox();\" style=\"width: 200px\">";
	var html = parsearTipos(jsonData,headerHtml);
	html += "<option value=\"otro\">Otro</option></select>";
	/** Colocar el HTML en la sección correspondiente **/
	document.getElementById('divTipoAct').innerHTML = html;
	document.getElementById('divTipoAct').style.display="block";
}

function ocultarCombobox() {
	document.getElementById("divTipoAct").style.display = "none";
	document.getElementById("divOtroTipoAct").style.display = "block";
}
