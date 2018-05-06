<!DOCTYPE html>
<html lang="en">
   <head>
      <!-- Se cargar los encabezados de la página -->
      <?php require 'Views/inc/header.php';?>
      <!--Estilos propios-->
   </head>
   <!-- El header contiene los generales mediante js se cargan los propios de la sección -->
   <body>
         <!-- Se carga el cover para control de login mediante firebase -->
         <?php require 'Views/inc/login_cover.php';?>
         <!-- Carga del menú del sitio web -->
         <?php require 'Views/inc/menu.php'; ?>
      <div class="container-fluid">
         <br>
         <br>
         <br>
         <form class="form-horizontal">
            <fieldset>
               <!-- Form Name -->
               <legend>Discharge Measurement Protocol</legend>
               <!-- Text input-->
               <div class="form-group">
                  <label class="col-md-4 control-label" for="Ubicacion">Ubicación</label>  
                  <div class="col-md-4">
                     <input id="Ubicacion" name="Ubicacion" type="text" placeholder="Ubicación" class="form-control input-md" required="">
                  </div>
               </div>
               <!-- Text input-->
               <div class="form-group">
                  <label class="col-md-4 control-label" for="Fecha">Fecha</label>  
                  <div class="col-md-4">
                     <input id="Fecha" name="Fecha" type="date" placeholder="Fecha" class="form-control input-md" required="">
                  </div>
               </div>
               <!-- Text input-->
               <div class="form-group">
                  <label class="col-md-4 control-label" for="tiempoFinal">Tiempo final</label>  
                  <div class="col-md-4">
                     <input id="tiempoFinal" name="tiempoFinal" type="time" placeholder="Tiempo final" class="form-control input-md" required="">
                  </div>
               </div>
               <!-- Text input-->
               <div class="form-group">
                  <label class="col-md-4 control-label" for="tiempoInicio">Tiempo inicio</label>  
                  <div class="col-md-4">
                     <input id="tiempoInicio" name="tiempoInicio" type="time" placeholder="Tiempo inicio" class="form-control input-md" required="">
                  </div>
               </div>
               <!-- Text input-->
               <div class="form-group">
                  <label class="col-md-4 control-label" for="medicionInicio">Inicio referencia nivel de agua (m)</label>  
                  <div class="col-md-4">
                     <input id="medicionInicio" name="medicionInicio" type="number" placeholder="Inicio medición" class="form-control input-md" required="">
                  </div>
               </div>
               <!-- Text input-->
               <div class="form-group">
                  <label class="col-md-4 control-label" for="medicionFinal">Final referencia nivel de agua (m)</label>  
                  <div class="col-md-4">
                     <input id="medicionFinal" name="medicionFinal" type="number" placeholder="Final medición" class="form-control input-md" required="">
                  </div>
               </div>
               <!-- Select Basic -->
               <div class="form-group">
                  <label class="col-md-4 control-label" for="metodoUsado">Método usado</label>
                  <div class="col-md-4">
                     <select id="metodoUsado" name="metodoUsado" class="form-control">
                        <option value="1">Punto reducido</option>
                        <option value="2">Distribución de velocidad</option>
                     </select>
                  </div>
               </div>
               <!-- Text input-->
               <div class="form-group">
                  <label class="col-md-4 control-label" for="metodoMedicion">Método de medición</label>  
                  <div class="col-md-4">
                     <input id="metodoMedicion" name="metodoMedicion" type="text" placeholder="Método de Médicion" class="form-control input-md" required="">
                  </div>
               </div>
               <!-- Textarea -->
               <div class="form-group">
                  <label class="col-md-4 control-label" for="comments">Comentarios</label>
                  <div class="col-md-4">                     
                     <textarea class="form-control" id="comments" name="comments"></textarea>
                  </div>
               </div>
               <!-- Text input-->
               <div class="form-group">
                  <label class="col-md-4 control-label" for="descargaCalculada">Descarga calculada</label>  
                  <div class="col-md-4">
                     <input id="descargaCalculada" name="descargaCalculada" type="number" class="form-control input-md" disabled>
                  </div>
               </div>
               <!-- Text input-->
               <div class="form-group">
                  <label class="col-md-4 control-label" for="crossDescarga">Área cross seccional</label>  
                  <div class="col-md-4">
                     <input id="crossDescarga" name="crossDescarga" type="number" class="form-control input-md" disabled>
                  </div>
               </div>               
            </fieldset>
         </form>
         <br><br>
         <table class="table">
            <thead>
               <tr>
                  <th>
                     Distancia sobre el río (m)
                  </th>
                  <th>
                     Profundidad (m)
                  </th>
                  <th>
                     Velocidad (m/s)
                  </th>
                  <th>
                     Área por sección (m2)
                  </th>
                  <th>
                     Descarga por sección (m3/s)
                  </th>
                  <th>
                     Comentarios
                  </th>
                  <th>
                     Acción
                  </th>
               </tr>
            </thead>
            <tbody id='tablaDescarga'>
               <tr>
                  <td>
                     <input type="number" class="form-control" name="distancia"/>
                  </td>
                  <td>
                     <input type="number" class="form-control" name="profundidad"/>
                  </td>
                  <td>
                     <input type="number"   class="form-control"name="velocidad"/>
                  </td>
                  <td>
                     <input type="number" class="form-control" name="area" disabled/>
                  </td>
                  <td>
                     <input type="number" class="form-control" name="descarga" disabled/>
                  </td>
                  <td>
                     <textarea class="form-control" name="comentarios"/> </textarea>
                  </td>
                  <td>
                     <button type="button" class="btn btn-danger btn-md" onClick="$(this).closest('tr').remove();">Eliminar</button>
                  </td>
               </tr>
            </tbody>
         </table>
         <button class="btn btn-success" onclick="agregarFilaDescarga();">Agregar</button>
         <button class="btn btn-primary" onClick="procesarDescarga();">Procesar</button>
         <br>
         <br>
         <br>
        </div>
         <?php require 'Views/inc/footer.php';?>
         <?php require 'Views/inc/firebase.php';?>
         <script type="text/javascript" src="/js/descarga.js"></script>
   </body>
</html>