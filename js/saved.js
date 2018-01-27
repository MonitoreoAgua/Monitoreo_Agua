
function strTipoGrafico(tipo) {
	if (tipo == "Area")
		return "de &aacuterea";
	else if (tipo == "XY")
		return "de tipo XY";
}

function strTipoConsulta(tipo) {
	if (tipo == "Fechas")
		return "rango de fechas";
	else
		return "punto de muestreo espec&iacutefico";
}

function listarGraficos() {
	var lista = [];
	const userKey = Object.keys(window.localStorage)
  	.filter(it => it.startsWith('firebase:authUser'))[0];
	const user = userKey ? JSON.parse(localStorage.getItem(userKey)) : undefined;
	$.ajax({
        url: "/webservices/getGraficos.php?idUsuario=" + user.email,
        async: false,
        dataType: 'json',
        success: function(data) {
        	console.log(data);
            lista = data;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
        	console.log(XMLHttpRequest);
    	}   
    });
	var html = "";
	for (var i = 0 ; i < lista.length ; i++) {
		html += "<a class=\"list-group-item list-group-item-action flex-column align-items-start\" href=\"graficoGuardado.php?idGrafico=" + lista[i]._id.$oid + "\">" +
					"<div class=\"d-flex w-100 justify-content-between\">" +
						"<h5 class=\"mb-1\">" +
							lista[i].nombreGrafico +
						"</h5>" +
					"</div>" +
					"<p class=\"mb-1\">" +
						lista[i].descripcion +
					"</p>" +
					"<small class=\"text-muted\">" +
						"Gráfico " + strTipoGrafico(lista[i].tipoGrafico) + ", consultado por " + strTipoConsulta(lista[i].tipoConsulta) +
					"</small>" +
				"</a>";
	}
document.getElementById('listaGraficos').innerHTML = html;
}