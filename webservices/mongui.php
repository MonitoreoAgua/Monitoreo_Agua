<?php
//require 'Database.php';

header('Content-Type: application/json');

$interDir='';

require $_SERVER['DOCUMENT_ROOT'].$interDir.'/webservices/databaseConnection.php';

$collection = null;

class Mongui
{
  /**
  *   Clase que contiene los métodos de las consultas con la base de MongoDB
  **/
  public function __construct()
  {}

    /**
    * Retorna todos los documentos de la colección "sitiosMuestreo"
    * @return MongoCursor con el resultado de la consulta
    **/
    public static function getAll()
    {
      //$collection = Database::getInstance()->getDb()->sitiosMuestreo;
      $collection=connectDatabaseCollection('MonitoreoAgua','puntosMuestreo',0);
      $cursor     = $collection->find();
      return ($cursor);
    }

    /**
    * Retorna todos los documentos de la colección "sitiosMuestreo" cuya fecha esté entre fI y fF
    * @param fI Fecha Inicial
    * @param fF Fecha Final
    * @return MongoCursor con el resultado de la consulta
    **/
    public static function getPorRangoFechas($fI, $fF, $par1)
    {
      //$collection = Database::getInstance()->getDb()->sitiosMuestreo;
      $collection=connectDatabaseCollection('MonitoreoAgua','puntosMuestreo',0);
      $fInicial   = new MongoDB\BSON\UTCDateTime($fI);
      $fFinal     = new MongoDB\BSON\UTCDateTime($fF);

      $parte1 = array( '$or' => array( array('Muestra.obligatorios.$par1' => ['$ne' =>"ND"]), array('Muestra.opcionales.$par1' => ['$ne' =>"ND"]) ) );
      $parte3     = array('Muestra.fecha' => array('$gt' => $fInicial, '$lte' => $fFinal));

      $query = array( '$and' => array( $parte3, array( '$and' => array( $parte1  ))  ) );

      $options    = ['sort' => ['Muestra.fecha' => 1]];



      $cursor = $collection->find($query, $options);
      return ($cursor);
    }

    /**
    * Retorna todos los documentos de la colección "sitiosMuestreo" cuya nombre sea [nombre]
    * @param nombre del punto a buscar
    * @return MongoCursor con el resultado de la consulta
    **/
    public static function getPorNombre($nombres,$par1)
    {
      //$collection = Database::getInstance()->getDb()->sitiosMuestreo;
      $collection=connectDatabaseCollection('MonitoreoAgua','puntosMuestreo',0);

      $parte1 = array( '$or' => array( array('Muestra.obligatorios.$par1' => ['$ne' =>"ND"]), array('Muestra.opcionales.$par1' => ['$ne' =>"ND"]) ) );
      $parte2 = [];
      for ($i=0; $i < count($nombres); $i++) {
        $tmp = array('POI.nombre_estacion' => $nombres[$i] );
        array_push($parte2, $tmp);
      }
      $parte3 = array('$or' => $parte2);

      $query = array( '$and' => array( $parte3, array( '$and' => array( $parte1 ))  ) );



      $options    = ['sort' => ['Muestra.fecha' => 1]];

      $cursor = $collection->find($query, $options);
      return ($cursor);
    }

    //Método para insertar un documento de datos de gráfico a MongoDB
    public static function insertarDocumentoGrafico($datos)
    {
      $response = array();
      $response["success"] = false;
      try {
              $cliente = connectDatabaseClient('MonitoreoAgua',1);

              $insRec = new MongoDB\Driver\BulkWrite;

              $_id = $insRec->insert($datos);

              $result = $cliente->executeBulkWrite('MonitoreoAgua.graficos', $insRec);

          if (!is_null($result)) {
              $response["success"] = true;
          } else {
              $response["mensaje"] = "El registro falló. result = null";
          }
      } catch (MongoCursorException $e) {
          $response["mensaje"] = "El registro falló. MongoCursorException";
      } catch (MongoException $e) {
          $response["mensaje"] = "El registro falló. MongoException";
      } catch (MongoConnectionException $e) {
          $response["mensaje"] = "La conexión falló. MongoConnectionException";
      }

      return $response;
    }

    public static function actualizarDocumentoGrafico($datos,$_id)
    {
      $response = array();
      $response["success"] = false;
      try {
            $cliente = connectDatabaseClient('MonitoreoAgua',1);
            $updRec = new MongoDB\Driver\BulkWrite;
            $obj_id = new MongoDB\BSON\ObjectId($_id);

            $updRec->update(['_id' => $obj_id], ['$set' => $datos], ['multi' => false, 'upsert' => false]);
            $writeConcern = new MongoDB\Driver\WriteConcern(MongoDB\Driver\WriteConcern::MAJORITY, 1000);
            $result = $cliente->executeBulkWrite('MonitoreoAgua.graficos', $updRec, $writeConcern);

          if (!is_null($result)) {
              $response["success"] = true;
          } else {
              $response["mensaje"] = "El registro falló. result = null";
          }
      } catch (MongoCursorException $e) {
          $response["mensaje"] = "El registro falló. MongoCursorException";
      } catch (MongoException $e) {
          $response["mensaje"] = "El registro falló. MongoException";
      } catch (MongoConnectionException $e) {
          $response["mensaje"] = "La conexión falló. MongoConnectionException";
      }

      return $response;
    }


    public static function getGraficosPorIDUsuario($idUsuario){
      $collection=connectDatabaseCollection('MonitoreoAgua','graficos',0);

      $query = array('correoUsuario' => $idUsuario);

      $cursor = $collection->find($query);
      return ($cursor->toArray());
    }

    public static function getGraficoPorID($idGrafico){
      $collection=connectDatabaseCollection('MonitoreoAgua','graficos',0);
      $dato = new MongoDB\BSON\ObjectID($idGrafico);
      $parte3 = array('_id' => $dato);

      $query = $parte3;

      $options = ['sort' => ['_id' => 1]];

      $cursor = $collection->find($query, $options);
      return ($cursor->toArray());

    }

    public static function eliminarGrafico($id) {

      $client = connectDatabaseClient('MonitoreoAgua',1);
      $response["success"] = false;

      try {
      $delRec = new MongoDB\Driver\BulkWrite;

      $dato = new MongoDB\BSON\ObjectID($id);


      $delRec->delete(['_id' =>$dato], ['limit' => 1]);
      $writeConcern = new MongoDB\Driver\WriteConcern(MongoDB\Driver\WriteConcern::MAJORITY, 1000);
      $result = $client->executeBulkWrite('MonitoreoAgua.graficos', $delRec, $writeConcern);

      if($result->getDeletedCount()){
      $response["success"] = true;
      //echo 'deleted';
      }

      } catch(MongoCursorException $e){

      $response["mensaje"] = "Falló al borrar el documento.";
      } catch (MongoException $e){
      $response["mensaje"] = "Falló al borrar el documento.";
      }
    }

    //Método para insertar un documento de datos de token OTP a MongoDB
    public static function insertarDocumentoOTP($datos)
    {
      $response = array();
      $response["success"] = false;
      try {
              $cliente = connectDatabaseClient('MonitoreoAgua',1);

              $insRec = new MongoDB\Driver\BulkWrite;

              $_id = $insRec->insert($datos);

              $result = $cliente->executeBulkWrite('MonitoreoAgua.tokensOTP', $insRec);

          if (!is_null($result)) {
              $response["success"] = true;
          } else {
              $response["mensaje"] = "El registro falló. result = null";
          }
      } catch (MongoCursorException $e) {
          $response["mensaje"] = "El registro falló. MongoCursorException";
      } catch (MongoException $e) {
          $response["mensaje"] = "El registro falló. MongoException";
      } catch (MongoConnectionException $e) {
          $response["mensaje"] = "La conexión falló. MongoConnectionException";
      }

      return $response;
    }

    /**
    * Retorna el documento de la colección "tokensOTP" cuyo id de usuario sea [_id]
    * @param $_id El id del usuario del documento a consultar
    * @return MongoCursor con el resultado de la consulta
    **/
    public static function getOTP($_id)
    {
      $collection=connectDatabaseCollection('MonitoreoAgua','tokensOTP',0);

      $query = array('idUsuario' => $_id);

      $cursor = $collection->findOne($query);

      return ($cursor);
    }

    public static function eliminarOTP($id) {

      $client = connectDatabaseClient('MonitoreoAgua',1);
      $response["success"] = false;

      try {
      $delRec = new MongoDB\Driver\BulkWrite;

      $dato = new MongoDB\BSON\ObjectID($id);


      $delRec->delete(['_id' =>$dato], ['limit' => 1]);
      $writeConcern = new MongoDB\Driver\WriteConcern(MongoDB\Driver\WriteConcern::MAJORITY, 1000);
      $result = $client->executeBulkWrite('MonitoreoAgua.tokensOTP', $delRec, $writeConcern);

      if($result->getDeletedCount()){
      $response["success"] = true;
      //echo 'deleted';
      }

      } catch(MongoCursorException $e){

      $response["mensaje"] = "Falló al borrar el documento.";
      } catch (MongoException $e){
      $response["mensaje"] = "Falló al borrar el documento.";
      }
    }

  }
  ?>
