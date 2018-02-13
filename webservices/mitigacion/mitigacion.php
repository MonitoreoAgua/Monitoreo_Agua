<?php

header('Content-Type: application/json');
 
$interDir='';

require $_SERVER['DOCUMENT_ROOT'].$interDir.'/webservices/databaseConnection.php';

$collection = null;

class Mitigacion
{
  /**
  *   Clase que contiene los métodos de las consultas con la base de MongoDB
  **/
  public function __construct()
  {}

    /**
    * Retorna todos los documentos de la colección "accionesMitigacion"
    * @return MongoCursor con el resultado de la consulta
    **/
    public static function getAll()
    {
      //$collection = Database::getInstance()->getDb()->accionesMitigacion;
      $collection=connectDatabaseCollection('MonitoreoAgua','accionesMitigacion',0);
      $cursor     = $collection->find();
      return ($cursor);
    }

    /**
    * Retorna el documento de la colección "accionesMitigacion" cuyo id sea [_id]
    * @param $_id El id del documento a consultar
    * @return MongoCursor con el resultado de la consulta
    **/
    public static function getByID($_id)
    {
      $collection=connectDatabaseCollection('MonitoreoAgua','accionesMitigacion',0);
      
      $query = array('_id' => new MongoDB\BSON\ObjectId($_id));
      
      $cursor = $collection->findOne($query);

      return ($cursor);
    }

    /**
    * Retorna todos los documentos de la colección "accionesMitigacion" cuya fecha de inicio esté entre fI y fF
    * @param fI Fecha Inicial
    * @param fF Fecha Final
    * @return MongoCursor con el resultado de la consulta
    **/
    public static function getPorRangoFechas($fI, $fF)
    {
      //$collection = Database::getInstance()->getDb()->accionesMitigacion;
      $collection=connectDatabaseCollection('MonitoreoAgua','accionesMitigacion',0);
      $fInicial   = new MongoDB\BSON\UTCDateTime($fI);
      $fFinal     = new MongoDB\BSON\UTCDateTime($fF);
      
      $query     = array('fecha_inicio' => array('$gt' => $fInicial, '$lte' => $fFinal));
      
      $options    = ['sort' => ['fecha_inicio' => 1]];     

      $cursor = $collection->find($query, $options);
      return ($cursor);
    }

    /**
    * Retorna todos los documentos de la colección "accionesMitigacion" en las que el tipo de actividad esté en el arreglo nombres
    * @param Nombres de las actividades 
    * @return MongoCursor con el resultado de la consulta
    **/
    public static function getPorNombre($nombres)
    {
      //$collection = Database::getInstance()->getDb()->accionesMitigacion;
      $collection=connectDatabaseCollection('MonitoreoAgua','accionesMitigacion',0);
      
      $parte1 = [];
      for ($i=0; $i < count($nombres); $i++) { 
        $tmp = array('tipo_actividad' => $nombres[$i] );
        array_push($parte1, $tmp);
      }
      $query = array('$or' => $parte1);
      
      $options    = ['sort' => ['fecha_inicio' => 1]];

      $cursor = $collection->find($query, $options);
      return ($cursor);
    }

    /**
    * Retorna el documento de la colección "banderasUsuario" cuyo id de usuario sea [_id]
    * @param $_id El id del usuario del documento a consultar
    * @return MongoCursor con el resultado de la consulta
    **/
    public static function getContadorBanderasUsuario($_id)
    {
      $collection=connectDatabaseCollection('MonitoreoAgua','banderasUsuario',0);
      
      $query = array('idUsuario' => $_id);
      
      $cursor = $collection->findOne($query);

      return ($cursor);
    }

    /**
    * Método para insertar un documento de datos de acción de mitigación a MongoDB,
    * @param $datos Datos a insertar
    * @return La respuesta del server
    */
    public static function insertarDocumentoMitigacion($datos)
    {
      $response = array();
      $response["success"] = false;
      try {
              $cliente = connectDatabaseClient('MonitoreoAgua',1);
              
              $insRec = new MongoDB\Driver\BulkWrite;

              $_id = $insRec->insert($datos);

              $result = $cliente->executeBulkWrite('MonitoreoAgua.accionesMitigacion', $insRec);
               
          if (!is_null($result)) {
              $response["success"] = true;
              $response["elID"] = (string)$_id;
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
    * Método para insertar un documento de contador de banderas por usuario en MongoDB
    * @param $datos Datos a insertar
    * @return La respuesta del server
    */
    public static function insertarContadorBanderas($datos)
    {
      $response = array();
      $response["success"] = false;
      try {
              $cliente = connectDatabaseClient('MonitoreoAgua',1);
              
              $insRec = new MongoDB\Driver\BulkWrite;

              $_id = $insRec->insert($datos);

              $result = $cliente->executeBulkWrite('MonitoreoAgua.banderasUsuario', $insRec);
               
          if (!is_null($result)) {
              $response["success"] = true;
              $response["elID"] = (string)$_id;
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
    * Método para actualizar un documento de contador de banderas por usuario en MongoDB
    * @param $datos Datos a actualizar
    * @return La respuesta del server
    */
    public static function actualizarContadorBanderas($datos, $_id)
    {
      $response = array();
      $response["success"] = false;
      try {
            $cliente = connectDatabaseClient('MonitoreoAgua',1);
            $updRec = new MongoDB\Driver\BulkWrite;
            $obj_id = new MongoDB\BSON\ObjectId($_id);

            $updRec->update(['_id' => $obj_id], ['$set' => $datos], ['multi' => false, 'upsert' => false]);
            $writeConcern = new MongoDB\Driver\WriteConcern(MongoDB\Driver\WriteConcern::MAJORITY, 1000);
            $result = $cliente->executeBulkWrite('MonitoreoAgua.banderasUsuario', $updRec, $writeConcern);             
               
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
    * Método para actualizar un documento de datos de acción de mitigación a MongoDB, según un id especificado
    * @param $datos Datos a actualizar
    * @param $_id   Id del documento a actualizar
    * @return La respuesta del server
    */
    public static function actualizarDocumentoMitigacion($datos,$_id)
    {
      $response = array();
      $response["success"] = false;
      try {
            $cliente = connectDatabaseClient('MonitoreoAgua',1);
            $updRec = new MongoDB\Driver\BulkWrite;
            $obj_id = new MongoDB\BSON\ObjectId($_id);

            $updRec->update(['_id' => $obj_id], ['$set' => $datos], ['multi' => false, 'upsert' => false]);
            $writeConcern = new MongoDB\Driver\WriteConcern(MongoDB\Driver\WriteConcern::MAJORITY, 1000);
            $result = $cliente->executeBulkWrite('MonitoreoAgua.accionesMitigacion', $updRec, $writeConcern);             
               
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
    * Método para eliminar un documento de datos de acción de mitigación a MongoDB, según un id especificado
    * @param $_id   Id del documento a eliminar
    * @return La respuesta del server
    */
    public static function eliminarDocumentoMitigacion($id) {
      
      $client = connectDatabaseClient('MonitoreoAgua',1);
      $response["success"] = false;
      
      try {
      $delRec = new MongoDB\Driver\BulkWrite;
      
      $dato = new MongoDB\BSON\ObjectID($id);
      
      
      $delRec->delete(['_id' =>$dato], ['limit' => 1]);
      $writeConcern = new MongoDB\Driver\WriteConcern(MongoDB\Driver\WriteConcern::MAJORITY, 1000);
      $result = $client->executeBulkWrite('MonitoreoAgua.accionesMitigacion', $delRec, $writeConcern);
      
      if($result->getDeletedCount()){
      $response["success"] = true;
      }
      
      } catch(MongoCursorException $e){
      
      $response["mensaje"] = "Falló al borrar el documento.";
      } catch (MongoException $e){
      $response["mensaje"] = "Falló al borrar el documento.";
      }
      return $response;
    }
    
    
  }
  ?>
