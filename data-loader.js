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
				let theory = row[4];
				
                let plus = row[5];
                let minus = row[6];
				let cite = row[7];

                let indId = `indicator-${i+1}`;
                $('#indicators-list').append( 
                    `<li id="${indId}" class="drag-item ${issue}">
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

    prepopulated = false;
}


function generateReport() {

    const doc = new jsPDF();
    let yo = 40;

    doc.setFontSize(16);
    doc.setTextColor(28,171,226);
    doc.setFont(doc.getFont().fontName, "bold");
    doc.text("Cyberbullying", 20, 20);
    // Do causal diagram

    // Add Factor Indicators
    for (let i = 0; i < FACTORS.length; i++) {
        let factor = FACTORS[i];
        let draggable = $(`.cyberbullying.ecological > .flex-container > .${factor}`);
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

function printAndOffset(doc, str, reflow, xo, yo) {

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
            yo += 5;
        
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
        yo = printAndOffset(doc, plus.innerText.toString(), reflow, fieldOffset, yo);

        yo += 6;
        doc.setFont(doc.getFont().fontName, "bold");
        doc.text("Weaknesses: ", 20, yo);
        doc.setFont(doc.getFont().fontName, "normal");
        // doc.text(minus.innerText.toString(), fieldOffset, yo);
        yo = printAndOffset(doc, minus.innerText.toString(), reflow, fieldOffset, yo);

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
        yo = printAndOffset(doc, citeText, reflow, fieldOffset, yo);

        yo += 6;
        doc.setFont(doc.getFont().fontName, "bold");
        doc.text("Measures: ", 20, yo);
        doc.setFont(doc.getFont().fontName, "normal");
        
        for (let i = 0; i < measuresText.length; i++) {
            let mt = measuresText[i];
            mt = mt.trim().replace('\n', ' ');
            yo = printAndOffset(doc, mt, reflow, fieldOffset, yo);

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