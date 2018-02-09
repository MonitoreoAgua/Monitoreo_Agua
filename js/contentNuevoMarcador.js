var contentNuevoMarcador = "<form class=\"go-right\">" +
	"<div class=\"entrada\">"  +
		"<label for=\"fechaI\">Fecha de inicio:</label> <input id=\"fechaI\" name=\"fechaI\" type=\"date\" required>" +
	"</div>" +
	"<div class=\"entrada\">" +
		"<label for=\"fechaF\">Fecha de finalización:</label> <input id=\"fechaF\" name=\"fechaF\" type=\"date\" required>"				 +
	"</div>" +
	"<div class=\"entrada\">" +
		"<label for=\"tipoAct\">Tipo de actividad:</label> <input id=\"tipoAct\" name=\"tipoAct\" type=\"text\" required>" +
		
	"</div>" +
	"<div class=\"entrada\">" +
		"<label for=\"responsable\">Responsable:</label> <input id=\"responsable\" name=\"responsable\" type=\"text\" required>" +
		
	"</div>" +
	"<div class=\"entrada\">" +
		"<label for=\"email\">Correo electrónico:</label> <input id=\"email\" name=\"email\" type=\"email\" required>" +				
	"</div>" +
	"<div class=\"entrada\">" +
		"<label for=\"institucion\">Institución promotora:</label> <input id=\"institucion\" name=\"institucion\" type=\"text\" required>" +
		
	"</div>" +
	"<div class=\"entrada\">" +
		"<label for=\"descripcion\">Descripción:</label> <textarea id=\"descripcion\" name=\"descripcion\" required></textarea>" +
		
	"</div>" +
	"<div class=\"entrada\">" +
		"<label for=\"nParticipantes\">Cantidad de participantes:</label> <input id=\"nParticipantes\" name=\"nParticipantes\" type=\"number\" required>" +
		
	"</div>" +
	"<div class=\"entrada\">" +
		"<label for=\"ponderacionRes\">Ponderación de resultados:</label> <input id=\"ponderacionRes\" name=\"ponderacionRes\" type=\"number\">" +				
	"</div>" +
	"</form>" +	
	"<div>" +
		"<button class=\'btn btn-primary\' style=\'width:300px; margin-left:10%; margin-top:10px\' onclick=\'agregarNuevoPunto()\' id=\"btnAccionMitigacion\">  Agregar nuevo punto  </button>" +
		"<button class=\'btn btn-primary\' style=\'width:300px; margin-left:10%; margin-top:10px; display:none; background-color:red\' onclick=\'eliminarDatosMitigacion()\' id=\"btnBorrarPunto\">  Borrar punto  </button>" +
	"</div>";