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
         <?php require 'Views/inc/menu.php';?>
      <div class="container-fluid">
         <br>
         <br>
         <br>
         <?php if($datosAforo['cantidad']==0):?>
            <?=$datosAforo['cantidad']==0?"<h2> <span class=\"label label-warning\"><a style='text-decoration: none;' href='/index.php/medicionDescarga?accion=insertar&user=".$_GET['user']."'>No hay datos para mostrar, clic para insertar.</a></span></h2>":""?>
         <?php else:?>
         <div class="text-right"><button class="btn btn-primary" onclick="window.location.href='/index.php/medicionDescarga?accion=insertar&user=<?=$_GET['user'];?>'">Insertar Aforo</button></div>
            <form class="form-horizontal" >
               
               <fieldset>
                  <!-- Form Name -->
                  <legend>Ver Aforo </legend>
                  <!-- Text input-->
                  <div class="form-group">
                     <label class="col-md-4 control-label" for="Ubicacion">Latitud</label>  
                     <div class="col-md-4">
                        <input id="latitud" name="latitud" type="text" class="form-control input-md" disabled="disabled" value="<?=$datosAforo['latitud']?>">
                     </div>
                  </div>
                  <div class="form-group">
                     <label class="col-md-4 control-label" for="Ubicacion">Longitud</label>  
                     <div class="col-md-4">
                        <input id="longitud" name="longitud" type="text" class="form-control input-md" disabled="disabled" value="<?=$datosAforo['longitud']?>">
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
                        <textarea class="form-control" id="comments" name="comments" disabled="disabled" ><?=$datosAforo['comments']?></textarea>
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
                <li class="page-item <?=$pagina==1?disabled:enabled;?>" style="<?=$pagina==1?'pointer-events:none':''?>" >
                  <a class="verAforo page-link" href="/index.php/medicionDescarga?accion=ver&ini=<?=$pagina==$inicio?$inicio-1:$inicio?>&pag=<?=$pagina-1?>&user=" tabindex="-1">Previous</a>
                </li>
                <?php for($i = $inicio; $i < $fin; $i++): ?>
                  <li class="page-item <?=$i==$pagina?'active':''?>"><a class=" verAforo page-link" href="/index.php/medicionDescarga?accion=ver&ini=<?=$inicio?>&pag=<?=$i?>&user="><?=$i?></a></li>
                <?php endfor; ?>
                <li class="page-item <?= $pagina==$datosAforo['cantidad']?disabled:enabled;?>" style="<?=$pagina==$datosAforo['cantidad']?'pointer-events:none':''?>">
                  <a class="verAforo page-link" href="/index.php/medicionDescarga?accion=ver&ini=<?=$pagina==$fin-1?$inicio+1:$inicio?>&pag=<?=$pagina+1?>&user=">Next</a>
                </li>
              </ul>
            </nav>
         <?php endif;?>
        </div>
         <?php require 'Views/inc/footer.php';?>
         <?php require 'Views/inc/firebase.php';?>
         <script type="text/javascript" src="/js/descarga_ver.js"></script>
   </body>
</html>