
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

// Copy Ecological nodes
document.addEventListener("tabbis", e => {

	// DON'T DO THIS FOR NOW
	// TRICKY TO ENSURE INDICATORS DRAGGED INTO DIFFERENT DIVS ARE CLONED CORRECTLY
	// return;

    let data = e.detail;
	let cyberbullying = $(data.tab).hasClass('cyberbullying');
	let ecological = $(data.tab).hasClass('ecological');
	let strain = $(data.tab).hasClass('strain');
	let empowerment = $(data.tab).hasClass('empowerment');
	let nudge = $(data.tab).hasClass('nudge');
	
	// let cyberbullying = $(data.pane).hasClass('cyberbullying');
	// let ecological = $(data.pane).hasClass('ecological');
	// let strain = $(data.pane).hasClass('strain');
	// let empowerment = $(data.pane).hasClass('empowerment');
	// let nudge = $(data.pane).hasClass('nudge');
	// Default, so return
	// if (ecological)
	// 	return;
	if (cyberbullying) {
		if (ecological) {
			$('div.cyberbullying.ecological .toc-desc').text(THEORY_DESCRIPTIONS[0]);
			$('div.cyberbullying .relationships').show();
			$('div.cyberbullying .relationships').show();
			$('div.cyberbullying .literacy').show();
			$('div.cyberbullying .self-esteem').show();
			$('div.cyberbullying .offline-norms').show();
			$('div.cyberbullying .online-norms').show();
			$('div.cyberbullying .awareness-support').show();
			$('div.cyberbullying .monitor-block').show();
			$('div.cyberbullying .reduce-stress').show();
		}
		else if (strain) {
			$('div.cyberbullying.ecological .toc-desc').text(THEORY_DESCRIPTIONS[1]);
			$('div.cyberbullying .relationships').show();
			$('div.cyberbullying .literacy').hide();
			$('div.cyberbullying .self-esteem').show();
			$('div.cyberbullying .offline-norms').hide();
			$('div.cyberbullying .online-norms').hide();
			$('div.cyberbullying .awareness-support').hide();
			$('div.cyberbullying .monitor-block').hide();
			$('div.cyberbullying .reduce-stress').show();
		}
		else if (empowerment) {
			$('div.cyberbullying.ecological .toc-desc').text(THEORY_DESCRIPTIONS[2]);
			$('div.cyberbullying .relationships').show();
			$('div.cyberbullying .literacy').show();
			$('div.cyberbullying .self-esteem').show();
			$('div.cyberbullying .offline-norms').hide();
			$('div.cyberbullying .online-norms').hide();
			$('div.cyberbullying .awareness-support').show();
			$('div.cyberbullying .monitor-block').hide();
			$('div.cyberbullying .reduce-stress').hide();
		}
		else if (nudge) {
			$('div.cyberbullying.ecological .toc-desc').text(THEORY_DESCRIPTIONS[3]);
			$('div.cyberbullying .relationships').hide();
			$('div.cyberbullying .literacy').hide();
			$('div.cyberbullying .self-esteem').hide();
			$('div.cyberbullying .offline-norms').hide();
			$('div.cyberbullying .online-norms').hide();
			$('div.cyberbullying .awareness-support').show();
			$('div.cyberbullying .monitor-block').show();
			$('div.cyberbullying .reduce-stress').hide();
		}
		
	}
	else {
		if (ecological) {
			$('div.grooming.ecological .toc-desc').text(THEORY_DESCRIPTIONS[4]);
			$('div.grooming .relationships').show();
			$('div.grooming .literacy').show();
			$('div.grooming .self-esteem').show();
			$('div.grooming .offline-norms').show();
			$('div.grooming .online-norms').show();
			$('div.grooming .awareness-support').show();
			$('div.grooming .monitor-block').show();
			$('div.grooming .reduce-stress').show();
			$('div.grooming .decrease-cybersexual').show();
		}
		else if (strain) {
			$('div.grooming.ecological .toc-desc').text(THEORY_DESCRIPTIONS[5]);
			$('div.grooming .relationships').show();
			$('div.grooming .literacy').hide();
			$('div.grooming .self-esteem').show();
			$('div.grooming .offline-norms').hide();
			$('div.grooming .online-norms').hide();
			$('div.grooming .awareness-support').hide();
			$('div.grooming .monitor-block').hide();
			$('div.grooming .reduce-stress').show();
			$('div.grooming .decrease-cybersexual').show();
		}
		else if (empowerment) {
			$('div.grooming.ecological .toc-desc').text(THEORY_DESCRIPTIONS[6]);
			$('div.grooming .relationships').show();
			$('div.grooming .literacy').show();
			$('div.grooming .self-esteem').show();
			$('div.grooming .offline-norms').hide();
			$('div.grooming .online-norms').hide();
			$('div.grooming .awareness-support').show();
			$('div.grooming .monitor-block').hide();
			$('div.grooming .reduce-stress').hide();
			$('div.grooming .decrease-cybersexual').hide();
		}
		else if (nudge) {
			$('div.grooming.ecological .toc-desc').text(THEORY_DESCRIPTIONS[7]);
			$('div.grooming .relationships').hide();
			$('div.grooming .literacy').hide();
			$('div.grooming .self-esteem').hide();
			$('div.grooming .offline-norms').hide();
			$('div.grooming .online-norms').hide();
			$('div.grooming .awareness-support').show();
			$('div.grooming .monitor-block').show();
			$('div.grooming .reduce-stress').hide();
			$('div.grooming .decrease-cybersexual').hide();
		}
		
	}

}, false );