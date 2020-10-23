
var containers = new Array();
containers.push(document.getElementById('drag-1'));
containers.push(document.getElementById('drag-2'));
containers.push(document.getElementById('drag-3'));
containers.push(document.getElementById('drag-4'));

var drake = dragula({ 
	containers: containers,
	revertOnSpill: true,
	copy: true, 
  	copySortSource: true 
});

drake.on('cloned', function(clone, original, type) {

	// glitch because isotope uses absolute positioning when filtering, so change to relative when dropped
	$(clone).css({position: 'relative'}).css('top', '').css('left', '');	
	
});

drake.on('drag', function(el) {
	
	// add 'is-moving' class to element being dragged
	// el.classList.add('is-moving');
});
drake.on('dragend', function(el) {
	
	// remove 'is-moving' class from element after dragging has stopped
	el.classList.remove('is-moving');
	
});
drake.on('dragend', function(el, target, source, sibling) {

	// if one item successfully dropped, then show step 3
	$(".step2").hide();
	$(".step3").show();
	
});


$( ".drag-item" ).hover(
  function() {
	  /*
	  var title = $( this ).find(".title").text;
	  var desc = $( this ).find(".desc").text;
	  var plus = $( this ).find(".title").text;
	  var minus = $( this ).find(".title").text;
	  var cite = $( this ).find(".title").text;
	  */
	  console.log("rollover");
	  var innerhtml = $( this ).html();
    $( "#infopanel" ).html(innerhtml);
  }, function() {
	  $( "#infopanel" ).html("");
  }
);
