function initializeData() {
	if (document.getElementsByClassName("bg")[0].style.display != "none") {
		setTimeout(initializeData, 50);
		return;
	}
	listarGraficos();
}


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
	document.getElementById('navGraficas').classList.add("active");
	document.getElementById('navMapa').classList.remove("active");
	document.getElementById('navAforo').classList.remove("active");
	var lista = [];
	console.log(email_google);
	$.ajax({
        url: "/webservices/getGraficos.php?idUsuario=" + email_google,
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
		html += "<a class=\"list-group-item list-group-item-action flex-column align-items-start\" href=\"graficoGuardado?idGrafico=" + lista[i]._id.$oid + "\">" +
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
