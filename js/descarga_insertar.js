function agregarFilaDescarga() {
    $('#tablaDescarga').append("<tr>"+
                  "<td>"+
                  "   <input type='number' class='form-control' name='distancia'/>"+
                  "</td>"+
                  "<td>"+
                  "   <input type='number' class='form-control' name='profundidad'/>"+
                  "</td>"+
                  "<td>"+
                  "   <input type='number' class='form-control' name='velocidad'/>"+
                  "</td>"+
                  "<td>"+
                  "   <input type='number' class='form-control' name='area' disabled/>"+
                  "</td>"+
                  "<td>"+
                  "   <input type='number' class='form-control' name='descarga' disabled/>"+
                  "</td>"+
                  "<td>"+
                  "   <textarea class='form-control' name='comentarios'/></textarea>"+
                  "</td>"+
                  "<td>"+
                     " <button class=\"btn btn-danger btn-sm\" onClick=\"eliminarFila($(this));\">Eliminar</button>"+
                  "</td>"+
               "</tr>");
}


function eliminarFila(arg) {
   if($('#aforoTabla tr').length > 2){
      console.log("eliminar");
      arg.closest('tr').remove();
   }
}

function procesarDescarga() {
   var dataDescarga = [];
   var areaSecciones = [];
   var descargaSecciones = [];
   $("#tablaDescarga > tr").each(function() {
      var distancia = $(this).find("input[name=distancia]").val();
      var profundidad = $(this).find("input[name=profundidad]").val();
      var velocidad = $(this).find("input[name=velocidad]").val();
      dataDescarga.push([distancia,profundidad,velocidad]);
   });
   
   for (var i = 0; i<dataDescarga.length; i++) {
      var areaSeccion;
      if(i+1==dataDescarga.length){
         areaSeccion = (dataDescarga[i][0]-0)*dataDescarga[i][1];
         areaSecciones.push(areaSeccion);
      }else{
         areaSeccion = (dataDescarga[i][0]-dataDescarga[i+1][0])*dataDescarga[i][1];
         areaSecciones.push(areaSeccion);   
      }
      descargaSecciones.push(dataDescarga[i][2]*areaSeccion);
   }
   
   
   console.log(areaSecciones);
   console.log(descargaSecciones);
   var contador = 0;
   $("#tablaDescarga > tr").each(function() {
      $(this).find("input[name=area]").val(areaSecciones[contador]);
      $(this).find("input[name=descarga]").val(descargaSecciones[contador]);
      contador++;
   });
   
   $("#crossDescarga").val(areaSecciones.reduce(function(acc, val) { return acc + val; }));
   $("#descargaCalculada").val(descargaSecciones.reduce(function(acc, val) { return acc + val; }));
   
}

function fueProcesado() {
   if($("#descargaCalculada").val()!="0" && $("#crossDescarga").val()!="0"){
      return true;
   }else{
      alert("Datos aún no procesados");
      return false;
   }
}

