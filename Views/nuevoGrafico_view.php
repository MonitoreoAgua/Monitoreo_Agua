<?php require "Views/inc/header.php"; require "Views/inc/menu.php"; require 'Views/inc/login_cover.php';?>
<!-- Scripts requeridos -->
<script src="https://code.jquery.com/jquery-3.2.1.min.js"
   integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="
   crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.4/Chart.min.js"></script>
<script src="/js/llenarComboPuntos.js"></script>
<script>
   function findGetParameter(parameterName) {
     var result = null,
         tmp = [];
     var items = location.search.substr(1).split("&");
     for (var index = 0; index < items.length; index++) {
         tmp = items[index].split("=");
         if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
     }
     return result;
   }
</script>
<!-- Contenedor principal -->
<div class="container mt-4" style="margin-top: 10px; margin-bottom: 10px;">
   <!-- Parámetros -->
   <div class="row">
      <div class="col-md-6">
         <form action="/action_page.php">
            <label for="fechaI">Fecha Inicial: </label>
            <input type="date" id="fechaI" onchange="if(graficoGenerado && !graficoNombre) graficar('Fechas');"><br>
            <label for="fechaF">Fecha Final: </label>&nbsp;&nbsp;	
            <input type="date" id="fechaF"onchange="if(graficoGenerado && !graficoNombre) graficar('Nombres');"><br>
         </form>
         <script src="/js/graficador.js"></script>
         <br>
         <br>
      </div>
      <div class="col-md-5">
         <div id="comboParametros"></div>
         <script>llenarParametros();</script>
         <br>
         <label>Tipo de gr&aacutefico:&nbsp;</label>
         <input type="radio" id= "btnArea" name="tipoGrafico" value="area" checked="true" onclick="cambiarTipoGrafico('area');"> Por área &nbsp;
         <input type="radio" id= "btnXY" name="tipoGrafico" value="xy" onclick="cambiarTipoGrafico('xy');"> XY
      </div>
   </div>
   <!-- Información del gráfico -->
   <script> var vNombre = "Gráfico sin título"; var vDescripcion = "";</script>
  <div id =infoGrafico style="display: none">
     <form>
        <div class="form-group">
           <label for="nombreGrafico">Nombre del gr&aacutefico: </label>
           <input type="text" class="form-control" id="nombreGrafico" value="Gráfico sin título" onchange="if(this.value != vNombre) {document.getElementById('btnGuardarGraf').disabled = false; vNombre = this.value;}">
        </div>
        <div class="form-group">
           <label for="descripcionGrafico">Descripci&oacuten del gr&aacutefico:</label>
           <input type="text" class="form-control" id="descripcionGrafico" placeholder="Descripcion del gráfico" onchange="if(this.value != vDescripcion) {document.getElementById('btnGuardarGraf').disabled = false; vDescripcion = this.value;}">
        </div>
     </form>
  </div>
   <!-- Canvas del gráfico -->
   <div class=row id="canvasGrafico">
      <canvas id="myChart" width="100%" height="15"></canvas>
   </div>
   <!-- Menu con las fechas para el gráfico de burbuja -->
   <div class="scrollmenu" id="scrollFechas">
   </div>
   <!-- Botones para guardar el gráfico -->
   <div class=row id=botonesGuardar style="display: none">
      <div class="col-md-6">
         <script>
            function graficoAImagen(){
              var win=window.open();
              win.document.write("<b>" + document.getElementById("nombreGrafico").value + "</b><br><img src='"+myChart.toDataURL("image/jpge")+"'/>");
            }
         </script>
         <script src="/js/grafiMySQL.js"></script>
         <button onclick="guardarGrafi()" id="btnGuardarGraf" class="button btn btn-primary mt-4">Guardar Gr&aacutefico</button>
         <script type="text/javascript">var puntosMuestreo = findGetParameter("puntosMuestreo"); if (puntosMuestreo!=null) obtenerDatos(puntosMuestreo);</script>
      </div>
   </div>
</div>
<?php require "Views/inc/footer.php";?>