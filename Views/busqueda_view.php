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
                     <!-- SubMenu para el mapa, principalmente para anidar consultas -->
                     <div class="anidar">
                        <button class="btn" id="btnChart" onclick="graficar();" disabled="true"><i class="fa fa-area-chart"></i></button>
                        <button class="btn" id="btnMitigacion" onclick="nuevoPuntoMitigacion(this);"><i class="fa fa-plus"></i></button>
                        <button class="btn" id="btnToggleMitigacion" onclick="toggleMitigacion();"><i class="fa fa-eye-slash" id="toggleMitigacion">Mi</i></button>
                        <button class="btn" id="btnToggleMuestreo" onclick="toggleMuestreo();"><i class="fa fa-eye-slash" id="toggleMuestreo">Mu</i></button>
                        <button class="btn" id="btnCentrarRectangulo" onclick="centrarRectangulo();"><i style="font-size: 12px">Centrar</i></button>
                        <dl class="dropdown">
                           <dt>
                              <a>
                              <span class="hida">Rios:</span>    
                              </a>
                           </dt>
                           <dd>
                              <div class="mutliSelect">
                                 <ul id="checkBoxRiverNames">
                                 </ul>
                              </div>
                           </dd>
                        </dl>
                        <input type="number" min="1" id="inputFilterRadio" placeholder="Radio" value=1 onchange="changeCircleRadius(this.value);">
                        <button class="btn botonFiltroR" onclick="aplicarFiltro(document.getElementById('inputFilterRadio').value,1)"><i class="fa fa-filter"></i></button>
                        <button class="btn reset" id="reset"><i class="fa fa-eraser"></i></button>
                     </div>
                     <!-- Contenedor del mapa, cargado desde js -->
                     <div id="map"></div>
                     <!-- Contenedor utilizado para mostrar los resultados del evento de seleccionar dos marcadores, cargado desde js -->
                     <div class="container-fluid arPOIBig">
                        <div class="col-md-9 arPOIShort">
                           <button class="btn" id="btnCloseArPOI">
                              <h5>X</h5>
                           </button>
                           <br>
                           <div class="contenidoArPOIShort"></div>
                        </div>
                     </div>
                     <!-- Contenedor utilizado para ingresar las palabras clave pertenecientes a una fotode una acción de mitigación -->
                     <div id="modalKeywords" class="modal">
                        <!-- Modal content -->
                        <div class="modal-content">
                           <span class="close" id="closeModal">&times;</span>
                           <h4>Ingrese máximo tres palabras claves asociadas a esta imagen</h4>
                           <form>
                              <div class ="entrada">
                                 <input type="text" id="ipKW1" style="width: 310px">
                              </div>
                              <div class ="entrada">
                                 <input type="text" id="ipKW2" style="width: 310px">
                              </div>
                              <div class ="entrada">
                                 <input type="text" id="ipKW3" style="width: 310px">
                              </div>
                           </form>
                           <div class ="entrada" style="margin-top: 15px; margin-left: 25%">
                              <button id="smtKW" style="width: 155px">Aceptar</button>
                              <button id="chPhoto" style="width: 155px; display:none; margin-top: 10px">Cambiar Foto</button>
                           </div>
                        </div>
                     </div>
                     <!-- Contenedor utilizado para mostrar la simbología usada en el mapa -->
                     <div class="anidar">
                        <h3 class="wo-line-height bold">Calidad del agua:</h3>
                        <img value=5 id="calidad0" src="/data/Templatic-map-icons/Gris.png"></img>
                        <h7>Contaminación Neutral</h7>
                        <img value=0 id="calidad1" src="/data/Templatic-map-icons/Azul.png"></img>
                        <h7>Sin Contaminación</h7>
                        <img value=1 id="calidad2" src="/data/Templatic-map-icons/Verde.png"></img>
                        <h7>Contaminación Incipiente</h7>
                        <img value=2 id="calidad3" src="/data/Templatic-map-icons/Amarillo.png"></img>
                        <h7>Contaminación Moderada</h7>
                        <img value=3 id="calidad4" src="/data/Templatic-map-icons/Anaranjado.png"></img>
                        <h7>Contaminación Severa</h7>
                        <img value=4 id="calidad5" src="/data/Templatic-map-icons/Rojo.png"></img>
                        <h7>Contaminación Muy Severa</h7>
                     </div>
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