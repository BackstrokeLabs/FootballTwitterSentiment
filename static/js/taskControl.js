var drillIterator = 1;


function addDrillDiv() {
	console.log("Calling addDrill");
	var drillType = $("[name='drillType']:checked").val();
	if(drillType == 'drillAndSave') {
		addDrillAndSaveDiv(drillIterator);
		drillIterator++;
	}
	else if(drillType == 'onlyDrill') {
		 addOnlyDrillDiv(drillIterator);
		 drillIterator++;
	}
}

function addDrillAndSaveDiv(drillIterator) {
	jQuery('<div/>', {
    id: 'drillAndSaveOperation'+drillIterator,
    class:'drillAndSaveOperation',
	}).appendTo('#drillDiv');
	
	jQuery('<input/>', {
	type:'text',
    id: 'drillAndSaveValue'+drillIterator,
    class:'form-control taskText',
    placeholder:'In Depth(cm)',
	}).appendTo('#drillAndSaveOperation'+drillIterator);
	
	$('#drillAndSaveOperation'+drillIterator).append('&nbsp;');

	jQuery('<input/>', {
	type:'button',
	value:'Save',
    id: 'drillAndSaveButton'+drillIterator,
    class:'btn btn-success'
	}).appendTo('#drillAndSaveOperation'+drillIterator);


	$('#drillAndSaveButton'+drillIterator).click(function(){
		saveDrillValueToJson(this);	
	});

}

function addOnlyDrillDiv(drillIterator) {
	jQuery('<div/>', {
    id: 'onlyDrillOperation'+drillIterator,
    class:'onlyDrillOperation',
	}).appendTo('#drillDiv');
	
	jQuery('<input/>', {
	type:'text',
    id: 'onlyDrillValue'+drillIterator,
    class:'form-control taskText',
    placeholder:'In Depth(cm)',
	}).appendTo('#onlyDrillOperation'+drillIterator);
	
	$('#onlyDrillOperation'+drillIterator).append('&nbsp;');

	jQuery('<input/>', {
	type:'button',
	value:'OK',
    id: 'onlyDrillButton'+drillIterator,
    class:'btn btn-success'
	}).appendTo('#onlyDrillOperation'+drillIterator);

	$('#onlyDrillButton'+drillIterator).click(function(){
		saveDrillValueToJson(this);
	});
}

function saveDrillValueToJson(obj) {
	console.log("the id for this is"+$(obj).attr('id'));
	//TODO - the validation for the text box 
	var buttonId = $(obj).attr('id');
	var textId = buttonId.replace('Button','Value');
	console.log("the text is"+textId);
	var textValue = $('#'+textId).val();
	console.log("the text value is"+textValue);
	//$('#'+textId).attr('readOnly',true);
	
	//Setting the json appropriately
	 var latitudeValue = document.getElementById("lat").value;
	 var longitudeValue = document.getElementById("lng").value;

	for(taskDetailsIterator in taskpoints) {
		console.log("1 "+taskpoints[taskDetailsIterator].lat+" and 2 "+latitudeValue);
        if(taskpoints[taskDetailsIterator].lat == latitudeValue && taskpoints[taskDetailsIterator].lng == longitudeValue) {
        	console.log("Yes they are the same");
        	var taskDetails = taskpoints[taskDetailsIterator];
          	taskDetails[textId] = textValue;    
          	console.log("eee"+taskDetails[textId]);
			}
		}
}