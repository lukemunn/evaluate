dragula([
	document.getElementById('1'),
	document.getElementById('2'),
	document.getElementById('3'),
	document.getElementById('4'),
	document.getElementById('5')
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
