var map;
var taskpoints=[]; 
var count=0;
var lattitude;
var longitude;
var mapZoomConstant = 9;
var mapZoom = mapZoomConstant;
var markerchanged;
var eee;
var locked = false;
var lines = [];

function initialize() {
    console.log("#initialize");

    $("[name='my-checkbox']").on('switchChange.bootstrapSwitch', function(event, state) {
      locked = state;
    });

  var mapOptions = {
    zoom: mapZoomConstant,
    center: new google.maps.LatLng(-23.3695439,-69.8597406),
    mapTypeId: google.maps.MapTypeId.SATELLITE
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
  google.maps.event.addListener(map, 'click', function(event) {

        if(locked == false)
        {
            latitude = event.latLng.lat();
            longitude = event.latLng.lng();
            mapZoom = map.getZoom();
            /*var marker = new google.maps.Marker({
                position: event.latLng,
                map: map
            });*/
           // placeMarker(latitude,longitude);
           setTimeout("placeMarker("+latitude+","+longitude+","+null+")", 600);
         }    
  });//function for map click
}

function saveTaskDetails () {

  console.log("trying to save task");
  var latitudeValue = document.getElementById("lat").value;
  var longitudeValue = document.getElementById("lng").value;

   for(i=0;i<taskpoints.length;i++)
      {
        console.log(taskpoints[i].lat+" && "+latitudeValue);
        if(latitudeValue==taskpoints[i].lat&&longitudeValue==taskpoints[i].lng)
          {
            console.log("Yes they are the same");
            fillTaskDetails(latitudeValue,longitudeValue); //To fill the task points based on the input field values
          }
      } 
}

function clearTaskTextFields() {
  //also to clear radios drillAndSave, onlyDrill, 
  //also to clear checkboxes drillImage, spectraAngularCamera, spectraNavcamRecord, spectraSmartTarget , preciseMove 
  //also to iterate drillAndSaveValue, onlyDrillValue
  $("[name='drillType']").removeAttr("checked");
  
  $("#drillImage").removeAttr("checked");
  $("#spectraAngularCamera").removeAttr("checked");
  $("#spectraNavcamRecord").removeAttr("checked");
  $("#spectraSmartTarget").removeAttr("checked");
  $("#preciseMove").removeAttr("checked");


  var taskTextFieldIds = ["bufValue", 
  "mmrsExposureValue","mmrsAccumulationValue","mmrsNumberValue","sciencePanValue", "scienceTiltValue","imageStartAzimuthValue",
  "imageEndAzimuthValue","imageStartElevationValue","imageEndElevationValue","spectraStartAzimuthValue",
  "spectraEndAzimuthValue","spectraStartElevationValue","spectraEndElevationValue", "spectraAngularValue", "preciseMoveValue"];

  for(iterator in taskTextFieldIds) {
    document.getElementById(taskTextFieldIds[iterator]).value = "";
  }
}


function fillTaskPane(marker) {
  //TODO - clear all the text fields
    clearTaskTextFields();
   for(i=0;i<taskpoints.length;i++)
      {
        if(marker.position.lat()==taskpoints[i].lat&&marker.position.lng()==taskpoints[i].lng)
          {
            fillValue(taskpoints[i]); //To fill text fields if already exists
          }
      }  
}

function fillValue(taskDetails){

        console.log("Fill value");
        for(i in taskDetails){

            var key = i;
            var value = taskDetails[i];

            console.log("**key is "+key+" value is "+value);
            if(key && key!= undefined && key!= null) {
              var documentNode = document.getElementById(key);
              if(documentNode && documentNode!= undefined && documentNode!= null) {
                document.getElementById(key).value = value;             
              }
            }
        }     
}
function fillTaskDetails(latitudeValue,longitudeValue) {
 //also to clear radios drillAndSave, onlyDrill, 
  //also to clear checkboxes drillImage, spectraAngularCamera, spectraNavcamRecord, spectraSmartTarget 
  //also to iterate drillAndSaveValue, onlyDrillValue

  console.log("Fill task Details");

  var taskCheckBoxIds = ["drillImage", "spectraAngularCamera", "spectraNavcamRecord", "spectraSmartTarget" , "preciseMove" ];

  var taskTextFieldIds = ["bufValue", 
  "mmrsExposureValue","mmrsAccumulationValue","mmrsNumberValue","sciencePanValue", "scienceTiltValue","imageStartAzimuthValue",
  "imageEndAzimuthValue","imageStartElevationValue","imageEndElevationValue","spectraStartAzimuthValue",
  "spectraEndAzimuthValue","spectraStartElevationValue","spectraEndElevationValue", "spectraAngularValue", "preciseMoveValue"];

  for(taskDetailsIterator in taskpoints) {
        console.log("lat "+taskpoints[taskDetailsIterator].lat+ " inp "+latitudeValue);
        console.log("lng "+taskpoints[taskDetailsIterator].lng+ " inp "+longitudeValue);
        if(taskpoints[taskDetailsIterator].lat == latitudeValue && taskpoints[taskDetailsIterator].lng == longitudeValue) {
          for(iterator in taskTextFieldIds) {
            var taskValue = document.getElementById(taskTextFieldIds[iterator]).value;
            if(taskValue!="" && taskValue!=null && taskValue!= undefined) {
              
              var taskDetails = taskpoints[taskDetailsIterator];
              var keyValue = taskTextFieldIds[iterator];
              console.log("taaaa"+taskDetails);
              console.log("taa2 "+keyValue);
              console.log("key "+taskDetails[keyValue]);
              console.log("setting "+taskpoints[taskDetailsIterator].lat+" key "+taskDetails[keyValue]+" value "+taskValue);
              taskDetails[keyValue] = taskValue;    
            }
          }
        }
      }
}

function placeMarker(latitude,longitude,backEndJson) {
  
  console.log("Map zoom "+mapZoom+" map.getZoom "+map.getZoom());
  if(mapZoom == map.getZoom()){
    console.log("placing marker"+latitude+" "+longitude);
       var marker = new google.maps.Marker({
          position: new google.maps.LatLng(latitude,longitude),
          map: map,
          title: "Lat : "+latitude+" Long : "+longitude,
          draggable:true
      });
      // map.panTo(marker.getPosition());
       //console.log("getPos" +marker.getPosition());
       var taskDetails = {};


       if(backEndJson!=null) {
        taskpoints = backEndJson;
       }
       else {
         taskDetails.lat = latitude;
         taskDetails.lng = longitude;
          //taskpoints.push(new google.maps.LatLng(latitude,longitude));
         taskpoints.push(taskDetails);
        } 
          count++;
          if(count>1 ) {
            drawline();
           }

  $("[name='my-checkbox']").on('switchChange.bootstrapSwitch', function(event, state) {
    marker.setDraggable(!state);
  });

   google.maps.event.addListener(marker,'click',function(event){
    if(locked == false)
      {
          $('.row-task-offcanvas').toggleClass('taskdisappear');
          $('.task-group-item').attr('tabindex', '');

          fillTaskPane(marker);


          //Task point population
      }
  });

    google.maps.event.addListener(marker, 'rightclick', function(event) {
        
          //map.removeOverlay(marker);
      if(locked == false)
      {
          bootbox.dialog({
              message: "Do you want to duplicate or delete the marker?",
              title: "Alert box",
              buttons: {
                success: {
                  label: "Duplicate",
                  className: "btn-success",
                  callback: function() {
                  var location = new google.maps.LatLng(marker.position.lat() + 0.05,marker.position.lng() + 0.05);
                  var marker = new google.maps.Marker({
                  position: location,
                  map: map,
                  title: "Lat : "+marker.position.lat() + 0.05+" Long : "+marker.position.lng() + 0.05,
                  draggable:true,
                  animation:google.maps.Animation.DROP
                  });
                  var taskDetails = {};
                  taskDetails.lat = marker.position.lat() + 0.05;
                  taskDetails.lng = marker.position.lng() + 0.05;
                  taskpoints.push(taskDetails);
                  drawline();
                 
                }
                },
                danger: {
                  label: "Delete",
                  className: "btn-danger",
                  callback: function() {
                    marker.setMap(null);
                    // console.log(taskpoints);
                    var i=0;
                    for(i=0;i<taskpoints.length;i++)
                      {
                        if(marker.position.lat()==taskpoints[i].lat&&marker.position.lng()==taskpoints[i].lng)
                        {
                          
                          for(j=i;j<taskpoints.length;j++)
                          {
                            taskpoints[j]=taskpoints[j+1];
                          }
                          taskpoints.pop();
                          drawline();

                          toastr.options.positionClass ="toast-bottom-right";
                          toastr.success('Marker deleted!','');
                        }
                      }//for
                  }
                }
              }
            });
      }
    });//function for right click

    google.maps.event.addListener(marker, 'dragstart', function(event) {
      if(locked == false)
      {
          for(i=0;i<taskpoints.length;i++)
            {
              if(marker.position.lat()==taskpoints[i].lat&&marker.position.lng()==taskpoints[i].lng)
              {
                markerchanged=i;
              }
            }//for    
      }

    });
    google.maps.event.addListener(marker, 'drag', function(event) {
      if(locked == false)
      {
          marker.title = "Lat : "+marker.position.lat()+" Long : "+marker.position.lng();
          taskpoints[markerchanged]=(new google.maps.LatLng(marker.position.lat(),marker.position.lng()));
          drawline();
      }

    });
    google.maps.event.addListener(marker, 'dragend', function(event) {
      if(locked == false)
      {
         marker.title = "Lat : "+marker.position.lat()+" Long : "+marker.position.lng();
         taskpoints[markerchanged] = (new google.maps.LatLng(marker.position.lat(),marker.position.lng()));
         drawline(); 
      }                  
    });

  }

 }//place marker


function drawline() {

  for(var i = 0;i<lines.length;i++)   {
      lines[i].setMap(null);
  }


  var lineSymbol = {
      path:google.maps.SymbolPath.FORWARD_OPEN_ARROW,
      strokeColor:"#DB0000",
      strokeWeight:3,
      scale:2
  };
  var polylineOptions={
              path:taskpoints,
                strokeColor: '#0026b3',
                strokeOpacity: 1.0,
                strokeWeight: 2,
                geodesic: true,
                icons: [{
                    icon: lineSymbol,
                    repeat: '100px',
                    offset: '50%'
                }],
                zIndex: 10
              };
              //}]};
  var polyline= new google.maps.Polyline(polylineOptions);
  lines.push(polyline);
  polyline.setMap(map);
} //function drawline   

function drawMarker() {
  if(locked == false)
  {
    var latitudeValue = parseFloat(document.getElementById('latValue').value);
    var longitudeValue = parseFloat(document.getElementById('lngValue').value);
    placeMarker(latitudeValue,longitudeValue,null);
  }
 } //draw marker    

  var eee;

function viewMarkers(markerJSON, planName){
  var i =0;
  //locked = true;
  //location.reload();  
  clearMap();


  for(i=0;i<markerJSON.length;i++){
    placeMarker(markerJSON[i].lat,markerJSON[i].lng,markerJSON);
    eee = markerJSON;
    fillValue(markerJSON[i]);
  }
      locked = true;
  $("[name='my-checkbox']").bootstrapSwitch('state', true); //applying bootstrapswitch CSS to checkbox
  $('#planNameDisplay').text(planName);
}//function to call placemarker for viewing plan

function clearMap()
{

  lines = [];
  taskpoints = [];

  locked = false;  
  $("[name='my-checkbox']").bootstrapSwitch('state', false);
  $('#planNameDisplay').text('');       //clearing plan name
    var mapOptions = {
    zoom: mapZoomConstant,
    center: new google.maps.LatLng(-23.3695439,-69.8597406),
    mapTypeId: google.maps.MapTypeId.SATELLITE
  };

    map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);

    google.maps.event.addListener(map, 'click', function(event) {

        if(locked == false)
        {
            latitude = event.latLng.lat();
            longitude = event.latLng.lng();
            mapZoom = map.getZoom();
            /*var marker = new google.maps.Marker({
                position: event.latLng,
                map: map
            });*/
           // placeMarker(latitude,longitude);
           setTimeout("placeMarker("+latitude+","+longitude+","+null+")", 600);
         }    
  });
    console.log("clear map")
}

function mapPanToAtacama()
{
  var ltLg = new google.maps.LatLng(-23.3695439,-69.8597406);
  map.panTo(ltLg);
  map.setZoom(mapZoomConstant);
}

function mapPanToPittsburgh()
{
  var ltLg = new google.maps.LatLng(40.4433,-79.9436);
  map.panTo(ltLg);
  map.setZoom(mapZoomConstant);
}

 google.maps.event.addDomListener(window, 'load', initialize);