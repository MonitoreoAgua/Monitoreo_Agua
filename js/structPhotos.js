// estructura de datos que almacena las fotos y sus palabras clave que se van a ingresar
var photosArray = {
  'ph1': null,
  'ph2': null,
  'ph3': null,
  'ph4': null,
  'kw1': {},
  'kw2': {},
  'kw3': {},
  'kw4': {},
  appendPhoto: function(idTarget, foto) {
    switch(idTarget) {
      case "imgupload1":
        this.ph1 = foto;
        break;
      case "imgupload2":
        this.ph2 = foto;
        break;
      case "imgupload3":
        this.ph3 = foto;
        break;
      case "imgupload4":
        this.ph4 = foto;
        break;
    }
  },
  appendKeyword: function(idTarget, keyword) {
    switch(idTarget) {
      case "imgupload1":
        this.kw1 = keyword;
        break;
      case "imgupload2":
        this.kw2 = keyword;
        break;
      case "imgupload3":
        this.kw3 = keyword;
        break;
      case "imgupload4":
        this.kw4 = keyword;
        break;
    }
  },
  clearStructure: function() {
    this.ph1 = null;
    this.ph2 = null;
    this.ph3 = null;
    this.ph4 = null;
    this.kw1 = {};
    this.kw2 = {};
    this.kw3 = {};
    this.kw4 = {};
  }
};

function storePhotosInForm(idDocumento) {
  var formularioDatos = new FormData();
  formularioDatos.append("idDocumento",idDocumento);
  if (photosArray.ph1 != null) {    
    formularioDatos.append("fotos[]", photosArray.ph1);
  }
  if (photosArray.ph2 != null) {    
    formularioDatos.append("fotos[]", photosArray.ph2);
  }
  if (photosArray.ph3 != null) {    
    formularioDatos.append("fotos[]", photosArray.ph3);
  }
  if (photosArray.ph4 != null) {    
    formularioDatos.append("fotos[]", photosArray.ph4);
  }
  photosArray.clearStructure();
  return formularioDatos;
}

function storeKeywordsInArray() {
  var arregloRetorno = [];
  if (!jQuery.isEmptyObject(photosArray.kw1)) {
    arregloRetorno.push(photosArray.kw1);
  }
  if (!jQuery.isEmptyObject(photosArray.kw2)) {
    arregloRetorno.push(photosArray.kw2);
  }
  if (!jQuery.isEmptyObject(photosArray.kw3)) {
    arregloRetorno.push(photosArray.kw3);
  }
  if (!jQuery.isEmptyObject(photosArray.kw4)) {
    arregloRetorno.push(photosArray.kw4);
  }
  return arregloRetorno;
}