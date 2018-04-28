<!DOCTYPE html>
<html lang="en">
   <head>
      <!-- Se cargar los encabezados de la página -->
      <?php require 'Views/inc/header.php';?>
      <!--Estilos propios-->
      <link rel="stylesheet" type="text/css" href="/css/estilo_busqueda.css">
   </head>
   <!-- El header contiene los generales mediante js se cargan los propios de la sección -->
   <body>
      <!-- Se carga el cover para control de login mediante firebase -->
      <?php require 'Views/inc/login_cover.php';?>
      <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
         <!-- Carga del menú del sitio web -->
         <?php require 'Views/inc/menu.php'; ?>
         <main class="mdl-layout__content">
            <div class="page-content">
               <div class="mdl-grid">
                  <div class="main">
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
                       <input id="Fecha" name="Fecha" type="text" placeholder="Fecha" class="form-control input-md" required="">
                         
                       </div>
                     </div>
                     
                     <!-- Text input-->
                     <div class="form-group">
                       <label class="col-md-4 control-label" for="tiempoFinal">Tiempo final</label>  
                       <div class="col-md-4">
                       <input id="tiempoFinal" name="tiempoFinal" type="text" placeholder="Tiempo final" class="form-control input-md" required="">
                         
                       </div>
                     </div>
                     
                     <!-- Text input-->
                     <div class="form-group">
                       <label class="col-md-4 control-label" for="tiempoInicio">Tiempo inicio</label>  
                       <div class="col-md-4">
                       <input id="tiempoInicio" name="tiempoInicio" type="text" placeholder="Tiempo inicio" class="form-control input-md" required="">
                         
                       </div>
                     </div>
                     
                     <!-- Text input-->
                     <div class="form-group">
                       <label class="col-md-4 control-label" for="medicionInicio">Inicio referencia nivel de agua (m)</label>  
                       <div class="col-md-4">
                       <input id="medicionInicio" name="medicionInicio" type="text" placeholder="Inicio medición" class="form-control input-md" required="">
                         
                       </div>
                     </div>
                     
                     <!-- Text input-->
                     <div class="form-group">
                       <label class="col-md-4 control-label" for="medicionFinal">Final referencia nivel de agua (m)</label>  
                       <div class="col-md-4">
                       <input id="medicionFinal" name="medicionFinal" type="text" placeholder="Final medición" class="form-control input-md" required="">
                         
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
                     
                     </fieldset>
                     </form>
                                                           
                  </div>
               </div>
            </div>
            <?php require 'Views/inc/footer.php';?>
         </main>
      </div>
      <?php require 'Views/inc/firebase.php';?>
      <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
      <script src="/js/contentNuevoMarcador.js"></script>
      <script src="/js/llenarComboTipoMitigacion.js"></script>
      <script src="/js/structPhotos.js"></script>
      <script type="text/javascript" src="/js/mapa_busqueda.js"></script>
      <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBF0VFFF-7ojo6bKf_G81kq2cazEhaB2cc&signed_in=true&callback=initMap"></script>
   </body>
</html>