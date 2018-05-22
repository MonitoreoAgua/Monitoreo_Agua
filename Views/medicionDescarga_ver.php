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
         <form class="form-horizontal" >
            <fieldset>
               <!-- Form Name -->
               <legend>Ver Aforo</legend>
               <!-- Text input-->
               <div class="form-group">
                  <label class="col-md-4 control-label" for="Ubicacion">Ubicación</label>  
                  <div class="col-md-4">
                     <input id="Ubicacion" name="ubicacion" type="text" class="form-control input-md" disabled="disabled" value="<?=$datosAforo['ubicacion']?>">
                  </div>
               </div>
               <!-- Text input-->
               <div class="form-group">
                  <label class="col-md-4 control-label" for="Fecha">Fecha</label>  
                  <div class="col-md-4">
                     <input id="Fecha" name="fecha" type="date" class="form-control input-md" disabled="disabled" value="<?=$datosAforo['fecha']?>">
                  </div>
               </div>
               <!-- Text input-->
               <div class="form-group">
                  <label class="col-md-4 control-label" for="tiempoFinal">Tiempo final</label>  
                  <div class="col-md-4">
                     <input id="tiempoFinal" name="tiempoFinal" type="time" class="form-control input-md" disabled="disabled" value="<?=$datosAforo['tiempoFinal']?>">
                  </div>
               </div>
               <!-- Text input-->
               <div class="form-group">
                  <label class="col-md-4 control-label" for="tiempoInicio">Tiempo inicio</label>  
                  <div class="col-md-4">
                     <input id="tiempoInicio" name="tiempoInicio" type="time" class="form-control input-md" disabled="disabled" value="<?=$datosAforo['tiempoInicio']?>">
                  </div>
               </div>
               <!-- Text input-->
               <div class="form-group">
                  <label class="col-md-4 control-label" for="medicionInicio">Inicio referencia nivel de agua (m)</label>  
                  <div class="col-md-4">
                     <input id="medicionInicio" name="medicionInicio" type="number" class="form-control input-md" disabled="disabled" value="<?=$datosAforo['medicionInicio']?>">
                  </div>
               </div>
               <!-- Text input-->
               <div class="form-group">
                  <label class="col-md-4 control-label" for="medicionFinal">Final referencia nivel de agua (m)</label>  
                  <div class="col-md-4">
                     <input id="medicionFinal" name="medicionFinal" type="number" class="form-control input-md" disabled="disabled" value="<?=$datosAforo['medicionFinal']?>">
                  </div>
               </div>
               <!-- Select Basic -->
               <div class="form-group">
                  <label class="col-md-4 control-label" for="metodoUsado">Método usado</label>
                  <div class="col-md-4">
                     <select id="metodoUsado" name="metodoUsado" class="form-control" disabled="disabled" value="<?=$datosAforo['metodoUsado']?>">
                        <option value="reducido">Punto reducido</option>
                        <option value="velocidad">Distribución de velocidad</option>
                     </select>
                  </div>
               </div>
               <!-- Text input-->
               <div class="form-group">
                  <label class="col-md-4 control-label" for="metodoMedicion">Método de medición</label>  
                  <div class="col-md-4">
                     <input id="metodoMedicion" name="metodoMedicion" type="text" class="form-control input-md" disabled="disabled" value="<?=$datosAforo['metodoMedicion']?>" >
                  </div>
               </div>
               <!-- Textarea -->
               <div class="form-group">
                  <label class="col-md-4 control-label" for="comments">Comentarios</label>
                  <div class="col-md-4">                     
                     <textarea class="form-control" id="comments" name="comments" disabled="disabled" value="<?=$datosAforo['comments']?>"></textarea>
                  </div>
               </div>
               <!-- Text input-->
               <div class="form-group">
                  <label class="col-md-4 control-label" for="descargaCalculada">Descarga calculada</label>  
                  <div class="col-md-4">
                     <input id="descargaCalculada" name="descargaCalculada" type="number" class="form-control input-md" disabled="disabled"  value="<?=$datosAforo['descargaCalculada']?>">
                  </div>
               </div>
               <!-- Text input-->
               <div class="form-group">
                  <label class="col-md-4 control-label" for="crossDescarga">Área cross seccional</label>  
                  <div class="col-md-4">
                     <input id="crossDescarga" name="crossDescarga" type="number" class="form-control input-md" disabled="disabled"  value="<?=$datosAforo['crossDescarga']?>">
                  </div>
               </div>               
            </fieldset>
 
            <br><br>
         </form>
         <nav class="text-center">
           <ul class="pagination">
             <li class="page-item <?= $pagina==1?disabled:enabled;?>">
               <a class="page-link" href="#" tabindex="-1">Previous</a>
             </li>
             <li class="page-item"><a class="page-link" href="#">1</a></li>
             <li class="page-item active"><a class="page-link" href="#">2</a></li>
             <li class="page-item"><a class="page-link" href="#">3</a></li>
             <li class="page-item">
               <a class="page-link" href="#">Next</a>
             </li>
           </ul>
         </nav>
        </div>
         <?php require 'Views/inc/footer.php';?>
         <?php require 'Views/inc/firebase.php';?>
         <script type="text/javascript" src="/js/descarga.js"></script>
   </body>
</html>