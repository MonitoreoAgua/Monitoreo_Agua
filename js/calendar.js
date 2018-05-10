var reminderDate = null;

function prepareReminder() {
	var valPeriodicidad = $("input[name=periodicidad]:checked").val();
	if (typeof valPeriodicidad != 'undefined' && $("#lblRecordatorio").html() != "Se creó un recordatorio.") {
		var now = new Date();
		switch (valPeriodicidad) {
			case 'Anual':
				now.setFullYear(now.getFullYear()+1);
				break;
			case 'Semestral':
				now.setMonth(now.getMonth()+6);
				break;
			case 'Mensual':
				now.setMonth(now.getMonth()+1);
				break;
		}
		reminderDate = new Date(now.getFullYear(),now.getMonth(), now.getDate());
		$("#lblRecordatorio").html("El recordatorio se creará para el " + reminderDate.toLocaleDateString("es-CR"));
		$("#crearRecordatorio").prop("disabled", false);
  	$("#lblRecordatorio").show();
	}
}

function addEvent() {
  if (document.getElementById('divTipoAct').style.display == "block")
    var summary = $("#tipoAct").val();
  else
    var summary = $("#otroTipoAct").val();
  var description = $("#descripcion").val() + "\n" + $("#obsPeriodicidad").val();
  var endDate = new Date(reminderDate);
  endDate.setDate(endDate.getDate()+1);

  var event = {
    'summary': summary,
    'description': description,
    'start': {
      'dateTime': reminderDate,
      'timeZone': 'America/Costa_Rica'
    },
    'end': {
      'dateTime': endDate,
      'timeZone': 'America/Costa_Rica'
    },
    'reminders': {
      'useDefault': false,
      'overrides': [
        {'method': 'email', 'minutes': 24 * 60}
      ]
    }
  };

  var request = gapi.client.calendar.events.insert({
    'calendarId': 'primary',
    'resource': event
  });

  request.execute(function(event) {
    $("#lblRecordatorio").html("Se creó un recordatorio.");
    $("#crearRecordatorio").prop("disabled", true);
  });
}
