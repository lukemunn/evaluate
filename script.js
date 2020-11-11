
/*
var containers = new Array();
containers.push(document.getElementById('drag-1'));
containers.push(document.getElementById('drag-2'));
containers.push(document.getElementById('drag-3'));
containers.push(document.getElementById('drag-4'));
containers.push(document.getElementById('drag-5'));

var containersRemoveable = new Array();
containersRemoveable.push(document.getElementById('drag-1'));
containersRemoveable.push(document.getElementById('drag-2'));
containersRemoveable.push(document.getElementById('drag-3'));
containersRemoveable.push(document.getElementById('drag-4'));
*/
var containers = $( ".drag-inner-list" ).toArray();
containers.push(document.getElementById('indicators-list'));

var containersRemoveable = $( ".drag-inner-list" ).toArray();

var drake = dragula({ 
	containers: containers,
	revertOnSpill: true,
	copy: true, 
	copySortSource: true,
	accepts: function (el, target, source, sibling) {
		// Check if the container has the item already
		let children = $(target).children();
		for (let i = 0; i < children.length; i++) {
			if (children[i].id == el.id && !$(children[i]).hasClass('gu-transit')) {
				// Don't accept
				return false;
			}
		}
		// Make sure we are not copying back to the original list
		// return target.id !== 'drag-5';
		return true;
	}
});


drake.on('cloned', function(cloned, original, type) {
	


	// glitch because isotope uses absolute positioning when filtering, so change to relative when dropped
	$(cloned).css({position: 'relative'}).css({opacity: '100%'}).css('top', '').css('left', '');	

	// Dim an indicator if already used. Can be used again, so perhaps unclear semantics. 
	if ($(original).parent().attr('id') === 'indicators-list')
		$(original).css({opacity: '50%'});

});


drake.on('drag', function(el) {
	
	// add 'is-moving' class to element being dragged
	// el.classList.add('is-moving');
});
drake.on('dragend', function(el) {

	$(el).css({position: 'relative'}).css('top', '').css('left', '');	

	// remove 'is-moving' class from element after dragging has stopped
	el.classList.remove('is-moving');

	// Regenerate heatmap
	console.log(el.id);
	selectedIndicators.push(indicators[el.id]);
	generateHeatmap();

});

// Another dragula instance 
var wyvern = dragula({ 
	containers: containersRemoveable,
	removeOnSpill: true
});
wyvern.on('remove', function(el, container, source) {
	$('#indicators-list #' + el.id).css({opacity: '100%'});
});

$(document).on({
    mouseenter: function () {
        //stuff to do on mouse enter
        // console.log("rollover");
        var innerhtml = $( this ).html();
		var x = $(this).offset().left;
		var y = $(this).offset().top;
		$(" #infopanel").show();
		$(" #infopanel:before").show();
		$( "#infopanel" ).html(innerhtml).css("top", y).css("left", x+230);
    },
    mouseleave: function () {
        //stuff to do on mouse leave
        $(" #infopanel").hide();
		$(" #infopanel:before").hide();
    }
}, ".drag-item");