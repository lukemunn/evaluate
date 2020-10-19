dragula([
	document.getElementById('drag-1'),
	document.getElementById('drag-2'),
	document.getElementById('drag-3'),
	document.getElementById('drag-4'),
	document.getElementById('drag-5')
])

.on('drag', function(el) {
	
	// add 'is-moving' class to element being dragged
	el.classList.add('is-moving');
})
.on('dragend', function(el) {
	
	// remove 'is-moving' class from element after dragging has stopped
	el.classList.remove('is-moving');
	

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
