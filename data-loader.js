var PDFDocument = PDFLib.PDFDocument;


const { jsPDF } = window.jspdf;

CLIENT_ID = '559576953817-0drd9ji65as2gc750tpvuj5hcfglsrod.apps.googleusercontent.com';
API_KEY = 'AIzaSyDJqo5JL9MxUqHBVdkAn6DhgKcfGaVam4w';
SPREADSHEET_ID = '1NLdHWSQjWVZKCyQxjDx3jK9FbfFGvl5YGCxFSJnN1lQ';
INDICATOR_RANGE = "'Indicators webtool'!A3:U100"

// Dynamic loading?
// $.get('/credentials.json').then((response) => {
//     CLIENT_ID = response.web.client_id;
//     console.log(CLIENT_ID);
// });


// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";


// Global variable for results - use for look-ups
let indicators = {};
let selectedIndicators = [];
let prepopulated = false;
const THEORIES = [
    'ecological', 
    'empowerment', 
    'strain', 
    'nudging'
];
const THEORY_DESCRIPTIONS = [
    "Account for the multiple environments that influence individuals and create the conditions for cyberbullying.", 
    "Reduce the strains or frustrations that cause individuals to adopt cyberbullying.", 
    "Redistribute power and promote agency and resiliency so individuals can deal with cyberbullying.", 
    "Influence individual behavior through positive reinforcement and indirect suggestion in order to reduce cyberbullying.",

    "Account for the multiple environments that influence individuals and create the conditions for grooming.",
    "Reduce the strains or frustrations that cause individuals to adopt grooming.",
    "Redistribute power and promote agency and resiliency so individuals can deal with grooming.",
    "Influence individual behavior through positive reinforcement and indirect suggestion in order to reduce grooming."
];

const FACTORS = [
    // UPSTREAM CAUSES
    'relationships', 
    'literacy', 
    'self-esteem', 
    'offline-norms', 
    'online-norms',
    'awareness-support',
    'monitor-block',
    'reduce-stress',
    'decrease-cybersexual',
    // ISSUES
    'cyberbullying-prevalence', 
    'grooming-prevalence', 
    // DOWNSTREAM IMPACTS
    'cyberbullying-impacts',  
    'grooming-impacts', 
];

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        // gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: INDICATOR_RANGE
          }).then((response) => {
            let result = response.result;
            let numRows = result.values ? result.values.length : 0;
			
			// remove the loading text 
			$('#indicators-list').html("");

            for (let i = 0; i < result.values.length; i++) {
                let row = result.values[i];
                let issue = row[0].toLowerCase();
				if (issue=="online grooming") {
					issue="grooming";
				}
				if (issue=="both") {
					issue="grooming cyberbullying";
				}
				
				/* redo variables based on simpler webtools spreadsheet */
                let name = row[1];
                let desc = row[2];
                let factors = row[3];
                let factorStr = factors.split(', ').join(' ');
				let theory = row[4];
				
                let plus = row[5];
                let minus = row[6];
				let cite = row[7];

                let indId = `indicator-${i+1}`;
                $('#indicators-list').append( 
                    `<li id="${indId}" class="drag-item ${issue} ${factorStr}">
                        <h4>${name}</h4>
                        <span class="desc">${desc}</span>
                        <span class="plus">${plus}</span>
                        <span class="minus">${minus}</span>
                        <span class="cite">${cite}</span>
                    </li>`
                );
                indicators[indId] = {
                    id: indId,
                    name: name,
                    issue: issue,
                    desc: desc,
                    plus: plus,
                    minus: minus,
                    cite: cite,                       
                    theory: theory,                       
                    factors: factors,                       
                };
            }
			
			$(document).on({
                mouseenter: function () {
                    //stuff to do on mouse enter
                    var innerhtml = $( this ).html();
                    $( "#infopanel" ).html(innerhtml);
                },
                mouseleave: function () {
                    //stuff to do on mouse leave
                    $( "#infopanel" ).html("");
                }
            }, ".drag-item");

			  
            $container.isotope({
                // options
                itemSelector: '.drag-item',
                layoutMode: 'vertical'		 
                
            });

            //console.log(`${result.values} .`);
            console.log(`${numRows} rows retrieved.`);
          });        


    }, function(error) {
        console.log(JSON.stringify(error, null, 2));
    });
}

function populateIndicators() {
    if (prepopulated)
        return;
    let values = Object.values(indicators);
    if (values.length <= 0)
        return;
    for (let i = 0; i < values.length; i++) {
        let indicator = values[i];
        let factors = indicator.factors.split(',');
        for (let j = 0; j < factors.length; j++) {
            let factor = factors[j].trim();
            if (factor.length > 0) {
                let source = $(`#${indicator.id}`);
                let target = $(`.topicpanes .${factor} > .drag-inner-list`);
                source.clone().appendTo(target);
            }
        }
    }

    prepopulated = true;
}


function depopulateIndicators() {
    $('.cyberbullying .drag-inner-list').empty();
    $('.grooming .drag-inner-list').empty();
    $('.cyberbullying-prevalence .drag-inner-list').empty();
    $('.grooming-prevalence .drag-inner-list').empty();
    $('.cyberbullying-impacts .drag-inner-list').empty();
    $('.grooming-impacts .drag-inner-list').empty();
    
    prepopulated = false;
}

function getBase64Image(img) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    return canvas.toDataURL("image/png");
}

function generateReport() {

    const doc = new jsPDF();
    let yo = 40;

    

    doc.setFontSize(16);
    doc.setTextColor(28,171,226);
    doc.setFont(doc.getFont().fontName, "bold");
    doc.text("Cyberbullying", 20, 20);

    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.setFont(doc.getFont().fontName, "normal");

    
    // Do causal diagram
    let facCount = 0, yOffset = 0, maxY = 0;
    for (let i = 0; i < FACTORS.length - 4; i++) {
        let factor = FACTORS[i];
        let draggable = $(`.cyberbullying.ecological > .flex-container > .${factor}`);
        let heading = draggable.find('.drag-column-header').text();
        let selected = draggable.find('li > h4');
        let ilen = selected !== undefined ? selected.length : 0;
        if (ilen <= 0)
            continue;


        let rectW = 42;
        // Do once to calculate
        let rectH = 12 + (ilen) * 6;
        doc.setFont(doc.getFont().fontName, "bold");
        doc.setFontSize(8);
        let yoh = 30 + yOffset;
        let yohn = printAndOffset(doc, heading, 28, 22 + facCount * (rectW + 2), yoh, 5);
        let headingOffsetY = (yohn - yoh);
        rectH += headingOffsetY;
        doc.setFont(doc.getFont().fontName, "normal");
        doc.setFontSize(7);
        let lineOffset = 0;
        for (let j = 0; j < ilen; j++) {
            let indText = selected[j].textContent;
            let yo = 36 + yOffset + headingOffsetY + lineOffset + j * 6;
            let yon = printAndOffset(doc, indText, 32, 22 + facCount * (rectW + 2), yo, 3);
            rectH += (yon - yo);
            lineOffset += (yon - yo);
        }
        if (rectH > maxY)
            maxY = rectH;

        doc.setDrawColor(28,171,226);
        if (factor === "relationships")
            doc.setFillColor("#ffc400");
        if (factor === "literacy")
            doc.setFillColor("#fbc920");
        if (factor === "self-esteem")
            doc.setFillColor("#eccd54");
        if (factor === "offline-norms")
            doc.setFillColor("#dbd07a");
        if (factor === "online-norms")
            doc.setFillColor("#c5d39c");
        if (factor === "awareness-support")
            doc.setFillColor("#a8d7bd");
        if (factor === "monitor-block")
            doc.setFillColor("#7fdade");
        if (factor === "reduce-stress")
            doc.setFillColor("#1cdeff");
        if (factor === "decrease-cybersexual")
            doc.setFillColor("#00e3ff");
        if (factor === "cyberbullying-prevalence")
            doc.setFillColor("#d7b1e2");
        if (factor === "grooming-prevalence")
            doc.setFillColor("#d7b1e2");
        if (factor === "cyberbullying-impacts")
            doc.setFillColor("#cfb3a5");
        if (factor === "grooming-impacts")
            doc.setFillColor("#cfb3a5");

        doc.roundedRect(20 + facCount * (rectW + 2), 24 + yOffset, rectW, rectH, 3, 3, 'DF');
        doc.setFillColor("#ffffff");

        // // Do again to write over the rect
        rectH = 12 + (ilen) * 6;
        doc.setFont(doc.getFont().fontName, "bold");
        doc.setFontSize(8);
        yoh = 30 + yOffset;
        yohn = printAndOffset(doc, heading, 28, 22 + facCount * (rectW + 2), yoh, 5);
        headingOffsetY = (yohn - yoh);
        doc.setFont(doc.getFont().fontName, "normal");
        doc.setFontSize(7);
        lineOffset = 0;
        for (let j = 0; j < ilen; j++) {
            let indText = selected[j].textContent;
            let yo = 36 + yOffset + headingOffsetY + lineOffset + j * 6;
            let yon = printAndOffset(doc, indText, 32, 22 + facCount * (rectW + 2), yo, 3);
            lineOffset += (yon - yo);
        }

        // Wrap around
        facCount++;
        if (facCount % 4 == 0) {
            facCount = 0;
            yOffset += maxY + 2;
            maxY = 0;
        }
    }
    
    // Add image
    const img = new Image();
    img.src = 'down-arrow.png';
    let arrowImg = getBase64Image(img);
    doc.addImage(arrowImg, 'PNG', 102, 90 + yOffset, 10, 10);


    let prevalence = $(`.cyberbullying-prevalence`).find('li > h4');
    let plen = prevalence !== undefined ? prevalence.length : 0;
    doc.setFillColor("#d7b1e2");
    doc.roundedRect(80, 106 + yOffset, 56, 20 + plen * 8, 3, 3, 'DF');
    doc.setFont(doc.getFont().fontName, "bold");
    doc.setFontSize(8);
    doc.text("Prevalence", 82, 112 + yOffset);
    doc.setFont(doc.getFont().fontName, "normal");
    doc.setFontSize(7);
    for (let j = 0; j < plen; j++) {
        let indText = prevalence[j].textContent;
        // doc.text(indText, 120, 140 + j * 8);
        let yo = 118 + yOffset + j * 8;
        let yon = printAndOffset(doc, indText, 52, 82, yo, 5);
        yOffset += (yon - yo);
    }
    doc.addImage(arrowImg, 'PNG', 102, 154 + yOffset, 10, 10);

    let impacts = $(`.cyberbullying-impacts`).find('li > h4');
    let mlen = impacts !== undefined ? impacts.length : 0;
    doc.setFillColor("#cfb3a5");
    doc.roundedRect(80, 170 + yOffset, 56, 20 + mlen * 8, 3, 3, 'DF');
    doc.setFont(doc.getFont().fontName, "bold");
    doc.setFontSize(8);
    doc.text("Impacts", 82, 176 + yOffset);
    doc.setFont(doc.getFont().fontName, "normal");
    doc.setFontSize(7);
    for (let j = 0; j < mlen; j++) {
        let indText = prevalence[j].textContent;
        // doc.text(indText, 120, 240 + j * 8);
        let yo = 182 + yOffset + j * 8;
        let yon = printAndOffset(doc, indText, 52, 82, yo, 5);
        yOffset += (yon - yo);
    }

    doc.addPage();
    // Add Factor Indicators
    for (let i = 0; i < FACTORS.length; i++) {
        let factor = FACTORS[i];
        let draggable = $(`.cyberbullying.ecological > .flex-container > .${factor}`);
        let heading = draggable.find('.drag-column-header').text();

        if (i > 0)
            doc.addPage();
        doc.setFontSize(13);
        doc.setTextColor(28,171,226);
        doc.setFont(doc.getFont().fontName, "bold");
        doc.text(heading, 20, 20);
        generateIndicators(doc, draggable);
    }
    
    doc.addPage();
    doc.setFontSize(16);
    doc.setTextColor(28,171,226);
    doc.setFont(doc.getFont().fontName, "bold");
    doc.text("Grooming", 20, 20);
    
    // Add Factor Indicators
    for (let i = 0; i < FACTORS.length; i++) {
        let factor = FACTORS[i];
        let draggable = $(`.grooming.ecological > .flex-container > .${factor}`);
        let heading = draggable.find('.drag-column-header').text();

        doc.addPage();
        doc.setFontSize(13);
        doc.setTextColor(28,171,226);
        doc.setFont(doc.getFont().fontName, "bold");
        doc.text(heading, 20, 20);
        generateIndicators(doc, draggable);
    }
    

   
	const arrayBuffer = doc.output('arraybuffer');
	
	mergePages(arrayBuffer);
	
    // doc.save("Evaluation-Framework-2020.pdf");
}

// function to save byte array as pdf
function saveByteArray(reportName, byte) {
    var blob = new Blob([byte], {type: "application/pdf"});
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    var fileName = reportName;
    link.download = fileName;
    link.click();
};

async function mergePages(myBuffer) {
	
	// attempt to merge 2 pdfs client side
	const mergedPdf = await PDFDocument.create();
	
	// load the static pdf 
	const url1 = 'static.pdf';
	
	// when we load it, convert to array buffer
	const staticBytes = await fetch(url1).then(res => res.arrayBuffer());
	
	// ok load it 
	const staticPDF = await PDFDocument.load(staticBytes);
	
	// how many pages does it have
	const copiedPages = await mergedPdf.copyPages(staticPDF, staticPDF.getPageIndices());
	
	// add each page to the merged PDF
  	copiedPages.forEach((page) => {
    console.log('page', page.getWidth(), page.getHeight());
    mergedPdf.addPage(page);
    });
	
	
	
	// dynamic buffer
	const dynamicBytes = myBuffer;
	
	// ok load it 
	const dynamicPDF = await PDFDocument.load(dynamicBytes);
	
	// how many pages does it have
	const dynamicPages = await mergedPdf.copyPages(dynamicPDF, dynamicPDF.getPageIndices());
	
	// add each page to the merged PDF
  	dynamicPages.forEach((page) => {
    console.log('page', page.getWidth(), page.getHeight());
    mergedPdf.addPage(page);
    });
		

	
	// save the merged PDF
	const mergedPdfFile = await mergedPdf.save();
	
	saveByteArray("My Evaluation Framework.pdf", mergedPdfFile);
	
};

function printAndOffset(doc, str, reflow, xo, yo, lead) {

    // Re-flow every 80 characters, or the previous space.
    let len = str.length;
    let offset = reflow;

    for (let j = 0; j < len; j += offset) {

        let tmp = str.substring(j, j + reflow);
        let lastSpace = tmp.lastIndexOf(' ');
        if (lastSpace > 0 && len > j + reflow) {
            tmp = tmp.substring(0, lastSpace);
            offset = lastSpace + 1;
        }
            
        doc.text(tmp, xo, yo);

        if (j < len - offset)
            yo += lead;
        
    }

    return yo;

}

function generateIndicators(doc, element) {
    
    doc.setTextColor(51,51,51);
    let initialYOffset = 40;
    let yo = initialYOffset;
    let indicatorsPerPage  = 4;
    let counter = 0;
    element.find('li').each((index, value) => {
        let desc = $(value).find('span.desc')[0];
        let measuresText = desc.innerText.split('\n');
        let plus = $(value).find('span.plus')[0];
        let minus = $(value).find('span.minus')[0];
        // let recommend = $(value).find('span.recommend')[0];
        let cite = $(value).find('span.cite')[0];

        let reflow = 80;
        let fieldOffset = 60;
        let longestLine = Math.max(...measuresText.map((mt) => mt.length));
        let lines = measuresText.map((mt) => mt.length / 80).reduce((acc, curr) => acc + curr, 0);
        // 102 = 16 * 5 fields + 22
        let estimatedYO = yo + 102 + (lines - 1) * 8;
        // A4 = 842 points
        counter++;
        if (counter % indicatorsPerPage == 0 || estimatedYO > 800) {
            doc.addPage();
            yo = initialYOffset;
            counter = 0;
        }
        doc.setFontSize(12);
        doc.setFont(doc.getFont().fontName, "bold");
        doc.text(value.innerText.toString(), 20, yo);

        doc.setFontSize(10);
        yo += 6;
        doc.setFont(doc.getFont().fontName, "bold");
        doc.text("Strengths: ", 20, yo);
        doc.setFont(doc.getFont().fontName, "normal");
        // doc.text(plus.innerText.toString(), fieldOffset, yo);
        yo = printAndOffset(doc, plus.innerText.toString(), reflow, fieldOffset, yo, 5);

        yo += 6;
        doc.setFont(doc.getFont().fontName, "bold");
        doc.text("Weaknesses: ", 20, yo);
        doc.setFont(doc.getFont().fontName, "normal");
        // doc.text(minus.innerText.toString(), fieldOffset, yo);
        yo = printAndOffset(doc, minus.innerText.toString(), reflow, fieldOffset, yo, 5);

        /*
        yo += 6;
        doc.setFont(doc.getFont().fontName, "bold");
        doc.text("Recommendation: ", 20, yo);
        doc.setFont(doc.getFont().fontName, "normal");
        // doc.text(recommend.innerText.toString(), fieldOffset, yo);
        yo = printAndOffset(doc, recommend.innerText.toString(), reflow, fieldOffset, yo);
        */

        yo += 6;
        doc.setFont(doc.getFont().fontName, "bold");
        doc.text("Reference: ", 20, yo);
        doc.setFont(doc.getFont().fontName, "normal");
        // doc.text(cite.innerText.toString(), fieldOffset, yo);
        let citeText = cite.innerText.toString();
        citeText = citeText.trim().replace('\n', ' ');
        yo = printAndOffset(doc, citeText, reflow, fieldOffset, yo, 5);

        yo += 6;
        doc.setFont(doc.getFont().fontName, "bold");
        doc.text("Measures: ", 20, yo);
        doc.setFont(doc.getFont().fontName, "normal");
        
        for (let i = 0; i < measuresText.length; i++) {
            let mt = measuresText[i];
            mt = mt.trim().replace('\n', ' ');
            yo = printAndOffset(doc, mt, reflow, fieldOffset, yo, 5);

        }
        
        yo += 8;

    });
  

}
/* Test text
    
    let vals = [];
    $('#drag-1').find('li').each((index, value) => {
        vals.push(value);
        console.log(index);
    });    
*/

function hideReport() {
    $('.report-fixed').hide();
}