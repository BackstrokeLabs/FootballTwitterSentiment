$(document).ready(function () {

$.ajax({
         type:"POST",
         url:'/',
         data: {
                'planName': 'lol',  //plan name
                },
         success: function(response){
               populatePlan(response)
         }
});

$(document).click(function () {
      $contextMenu.hide();
  });

$('body').on('click', function (e) {
    $('[data-toggle=popover]').each(function () {
        // hide any open popovers when the anywhere else in the body is clicked
        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
            $(this).popover('destroy');
        }
    });
});

document.getElementById('close').onclick = function(){
        $('.row-task-offcanvas').toggleClass('taskdisappear');
          $('.task-group-item').attr('tabindex', '');

        return false;
  };


/****************************************************Right Click menu Start********************************************************/
  var $contextMenu = $("#contextMenu");
  
  $("body").on("contextmenu", ".list-group-item", function(e) {
    $contextMenu.css({
      display: "block",
      left: e.pageX,
      top: e.pageY
    });
    $('#contextMenu').attr("name",e.currentTarget.firstChild.data);
    return false;
  });
  
  $contextMenu.on("click", "a", function(e) {
    if(e.currentTarget.firstChild.data == "Delete Plan"){
      console.log($('#contextMenu').attr("name"));
      bootbox.confirm("Are you sure you want to delete " + $('#contextMenu').attr("name") + "?", function(result) {
        if(result == true){
          $.ajax({
             type:"POST",
             url:"/DBOperation/",
             data: {
                    'planName': $('#contextMenu').attr("name"),
                    'operation': 'deletePlan',
                    },
             success: function(response){
                toastr.options.positionClass ="toast-top-full-width";
                toastr.success('Plan Deleted!','');
                populatePlan(response)
             }
          });
        //clearMap();
        }
      });
    }

    if(e.currentTarget.firstChild.data == "Rename Plan"){
      $('#planRename').val('')
      $('#planNameErr').html('')
      $('#myRenameModal').modal('show');
    }

    if(e.currentTarget.firstChild.data == "Duplicate Plan"){
      
      $("#createPlan").attr("name","duplicate");
      $("#myModalLabel").text("Duplicate Plan"); 
      $('#planName').val('')
      $('#planDesc').val('')
      $('#planNameError').html('')
      $('#myModal').modal('show');
    }

    if(e.currentTarget.firstChild.data == "Plan Details"){

      $.ajax({
         type:"POST",
         url:"/DBOperation/",
         data: {
                'planName': $('#contextMenu').attr("name"),
                'operation': 'getPlanInfo',
                },
         success: function(response){
               
               pName = $('#contextMenu').attr("name")
               response.planDescription==null ? desc = "" : desc = response.planDescription

               dataContent = "<div style='width:500px; word-wrap:break-word'><b>Description:</b>"+desc + "<br/><b>Created Time : </b> " + response.timeStamp+"</div>"
              
              $('.'+pName).attr("data-toggle", "popover")

                $('.'+pName).popover({ 
                  html : true,
                  title : "Plan Details",
                  content: dataContent,
              })

                $('.'+pName).popover('show')
         }
      });
    }
    $contextMenu.hide();
  });

/******************************************************Right Click menu End*************************************************************/

// Lock/unlock Toggle button
  $("[name='my-checkbox']").bootstrapSwitch();  //applying bootstrapswitch CSS to checkbox
  $("#save-button").hide();     // hiding save button at start
  $('.row-task-offcanvas').toggleClass('taskdisappear');
  $('[data-toggle=offcanvas]').click(function () {
    if ($('.sidebar-offcanvas').css('background-color') == 'rgb(255, 255, 255)') {
      $('.plan-group-item').attr('tabindex', '-1');
    } else {
      $('.plan-group-item').attr('tabindex', '');
    }
    $('.row-plan-offcanvas').toggleClass('active');
    $('.row-task-offcanvas').toggleClass('taskactive');
  });



/* AJAX call and save the plan to DB*/
  $("#save-button").click(function(){
    if(taskpoints.length == 0)
    {
      toastr.options.positionClass ="toast-bottom-right";
      toastr.error('No markers placed!','');
    }
    else
    {
      $.ajax({
         type:"POST",
         url:"/DBOperation/",
         data: {
                'markers': JSON.stringify(taskpoints),    //constains lat, lon
                'planName': $('#planName').val().trim(),  //plan name
                'planDesc': $('#planDesc').val().trim(),
                'operation': 'save',
                },
         success: function(response){
             populatePlan(response)
         }
      });
      $("#save-button").hide();
      $('#planNameDisplay').text("");
      $('.row-plan-offcanvas').toggleClass('active');
      $('.row-task-offcanvas').toggleClass('taskactive');
      toastr.options.positionClass ="toast-bottom-right";
      toastr.success('Plan Saved Successfully!','');
    }
  return false;         //for stopping the page from refreshing
  });


   //proceed button in Create Plan Modal
  /* data validation inside createplan modal and display saveplan button*/
  $("#createPlan").click(function(){

    if($('#planName').val().trim().length === 0) {
       $('#planNameError').html("<span class=\"label label-danger\">Plan name cannot be empty!</span>");
    }
    else if($('#planName').val().length > 0 )
    {
        $.ajax({                              //ajax call for validating if planname already exist
         type:"POST",
         url:"/DBOperation/",
         data: {
                'planName': $('#planName').val().trim(),   
                'operation': 'validatePlanName',
                },
         success: function(response){
            if(response.count == 0)
            {
              if($("#createPlan").attr("name") === "duplicate")                  //ajax call for duplicate plan
              {
                console.log($('#planName').val().trim())

                $.ajax({
                   type:"POST",
                   url:"/DBOperation/",
                   data: {
                          'planName': $('#contextMenu').attr("name"),
                          'newPlanName': $('#planName').val().trim(),
                          'planDesc': $('#planDesc').val().trim(),
                          'operation': 'duplicate',
                          },
                   success: function(response){
                      toastr.options.positionClass ="toast-top-full-width";
                      toastr.success('Plan Duplicated!','');
                      populatePlan(response)
                   }
                });
              }
              else    //create plan actions
              {
                $("#save-button").show();

                $('.plan-group-item').attr('tabindex', '-1');
                $('.row-plan-offcanvas').toggleClass('active');
                $('.row-task-offcanvas').toggleClass('taskactive');
              }             
              $('#myModal').modal('hide')
              $('#planNameDisplay').text($('#planName').val());
            } 
            else{
              $('#planNameError').html("<span class=\"label label-danger\">There exists a plan by the same name. </span>");
            }
         }
        });
    }
  });

   //"Create Plan" button in base1.html
  /* reset the data inside create plan modal*/
  $("#createPlanModal").click(function(){
    $("#createPlan").attr("name","");
    $("#myModalLabel").text("New Plan");
    $('#planName').val('')
    $('#planDesc').val('')
    $('#planNameError').html('')
    $('#myModal').modal('show');
  });


$("#renamePlan").click(function(){

    if($('#planRename').val().trim().length === 0) {
       $('#planNameErr').html("<span class=\"label label-danger\">Plan name cannot be empty!</span>");
    }
    else if($('#planRename').val().length > 0 )
    {
      $.ajax({                              //ajax call for validating if planname already exist
       type:"POST",
       url:"/DBOperation/",
       data: {
              'planName': $('#planRename').val().trim(),   
              'operation': 'validatePlanName',
              },
       success: function(response){
          if(response.count == 0)
          {
                $.ajax({
               type:"POST",
               url:"/DBOperation/",
               data: {
                      'planName': $('#contextMenu').attr("name"),
                      'newName' : $('#newName').val(),  
                      'operation': 'renamePlan',
                      },
               success: function(response){
                  toastr.options.positionClass ="toast-top-full-width";
                  toastr.success('Rename Successfull!','');
                  populatePlan(response)
               }
              });          
            $('#myRenameModal').modal('hide')
            $('#planNameDisplay').text($('#planRename').val());
          } 
          else{
            $('#planNameError').html("<span class=\"label label-danger\">There exists a plan by the same name. </span>");
          }
       }
      });
    }
  });


  $('#planMenu').on('click', '.abcd', function (event) {
   var target = event.target || event.srcElement;
   console.log ( event.currentTarget.firstChild.data ); 

   $.ajax({
       type:"POST",
       url:"/DBOperation/",
       data: {
                'planName': event.currentTarget.firstChild.data,  //plan name
                'operation': 'getMarkerInfo',
              },
       success: function(response){
           console.log(response);
           viewMarkers(response,event.currentTarget.firstChild.data);
       }
    });

});

});

function populatePlan(response)
{
  $("#planMenu").empty()

  for(i = 0; i < response.planName.length; i++)
  {
    $("#planMenu").append('<a href="#" class="list-group-item abcd '+ response.planName[i] +'">' + response.planName[i] + '<span class="badge">'+ response.totalMarkers[i] +'</span> </a>');  
  }
}