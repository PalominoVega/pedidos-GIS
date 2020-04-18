require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/BasemapGallery",
    "esri/widgets/Locate",
    "esri/widgets/Expand",
    "esri/widgets/Home",
    "dojo/domReady!"
  ],
  function(
    Map, 
    MapView,
    FeatureLayer,
    BasemapGallery,
    Locate,
    Expand,
    Home
  ){

    var url_f_tienda = "https://services9.arcgis.com/uP0Xsyi3TAkFo5MR/ArcGIS/rest/services/survey123_8179dc794ac445fc89b67f4ea9822142/FeatureServer/0";

    //// DEFINICION DE POPUPS ----------------------------
    
    var _popuap = {
      title: "{nombre_comercial}",
      content:[{
        type:"fields",
        fieldInfos:[{
          fieldName:"nombre_comercial",
          label:"Nombre Comercial",
        },{
          fieldName:"mis_productos_o_servicios",
          label:"Mis productos o servicios",
        },{
            fieldName:"nota_adicional",
            label:"Nota Complementaria",
          },{
            fieldName:"tel_fonos_de_contacto",
            label:"Teléfono(s) de contacto",
          },{
            fieldName:"categorias_de_mis_productos",
            label:"Categorias de mis productos",
          },{
            fieldName:"formas_de_venta_pago",
            label:"Formas de Venta / Pago",
          }]
      }]
    };

    
    var fl_tienda = new FeatureLayer({ 
      url: url_f_tienda,
      title: "Tienda",
      outFields: ["*"],
      visible:true,
      popupTemplate : _popuap,
      definitionExpression: "1=1" 
    });

///*************************

  var map = new Map({
    basemap: "streets"
  });

  var view = new MapView({
    container: "viewDiv",
    map: map,
    center:[-75,-10],
    zoom: 5,
    popup:{
      collapseEnabled:false,
    }
  });

  map.add(fl_tienda);
    
  var locateBtn = new Locate({ //Mi ubicacion
      view: view
  });

  var basemaps = new BasemapGallery({
    view: view
    // container: 'div-basemaps',
  });

  var expand = new Expand({
    expandIconClass: 'esri-icon-basemap',
    collapseTooltip: 'Mapas Base',
    expandTooltip: 'Mapas Base',
    view: view,
    content: basemaps,
    expanded: false
  });

  var home = new Home({
    view: view
  });
 
  view.ui.add(expand,{position: "top-left"});  
  view.ui.add(home,{position: "top-left"});  
  view.ui.add(locateBtn,{position: "top-left"});  
});

