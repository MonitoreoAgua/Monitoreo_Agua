<?php require "Views/inc/header.php"; require "Views/inc/menu.php"; require 'Views/inc/login_cover.php';?>
<script>
    document.getElementById('navGraficas').classList.add("active");
    document.getElementById('navMapa').classList.remove("active");
    document.getElementById('navAforo').classList.remove("active");
</script>
<!-- Scripts requeridos -->
<script src="https://code.jquery.com/jquery-3.2.1.min.js"
  integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="
  crossorigin="anonymous"></script>
<script src="/js/saved.js"></script>
<div class="container mt-4">
    <div class="row">
        <div class="col-12">
            <h3>
                Gráficos guardados
            </h3>
            <hr class="my-3">
                <div class="list-group" id="listaGraficos">
                  <script type="text/javascript">
                    window.onload = initializeData;
                  </script>
                </div>
            </hr>
        </div>
    </div>
</div>
<?php require "Views/inc/footer.php";?>
