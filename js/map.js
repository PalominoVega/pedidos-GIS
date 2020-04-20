require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/BasemapGallery",
    "esri/widgets/Locate",
    "esri/widgets/Expand",
    "esri/widgets/Home",
    "esri/tasks/support/Query",
    "esri/tasks/QueryTask",
    "esri/Graphic",
    "dojo/domReady!"
  ],
  function(
    Map, 
    MapView,
    FeatureLayer,
    BasemapGallery,
    Locate,
    Expand,
    Home,
    Query,
    QueryTask,
    Graphic
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

///************ VISOR *************

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

  //******************** UX *****************************/

  var qtask_pedidos = new QueryTask({
    url : url_f_tienda
  });

  $(window).bind('keypress', function(event){
    if (event.keyCode == 13){
      var palabra = $('#buscar').val();            
      sql = ` nombre_comercial like '%${palabra}%' or 
        mis_productos_o_servicios like '%${palabra}%' or 
        nota_adicional like '%${palabra}%' or 
        categorias_de_mis_productos like '%${palabra}%' 
      `;      
      //validar si hay resultados 
      var params = new Query();
      params.where = sql;
      params.returnGeometry = true;
      params.outFields = ["objectid"];
      qtask_pedidos.execute(params).then(function(response){  
        var features = response.features;
        if(features.length != 0) {
          var arr_latituds = [];
          var arr_longituds = [];
          for (var i = 0 ; i < response.features.length ; i++ ){
            var latitud = response.features[i].geometry.latitude;
            var longitud = response.features[i].geometry.longitude;
            arr_latituds.push(latitud);
            arr_longituds.push(longitud);
          }
          fl_tienda.definitionExpression = sql;
          if(jQuery.uniqueSort(arr_latituds).length==1 && jQuery.uniqueSort(arr_longituds).length==1){
            paintZoom(features[0].attributes['objectid']);                
          }else{
            zoomTolayer(fl_tienda);                  
          }
        }else{
          console.log("no hay resultados");
          fl_tienda.definitionExpression = "1=2";
          view.goTo({
              center:[-75,-10],
              zoom:5
          });
        }        
      });
    }
  }); 

  function paintZoom(codigo){
    var params = new Query();
    params.where = "objectid = "+codigo+"";
    params.outFields = ["*"];
    params.returnGeometry = true;
    qtask_pedidos.execute(params).then(function(response){
      const graphics = response.features;      
      view.goTo({
        target: graphics,
        zoom:12
      });
    });
  }

  function zoomTolayer(layer){
    return layer.queryExtent().then(function(response){
      view.goTo(response.extent);
    });
  }

});

