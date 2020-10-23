var PDFDocument = PDFLib.PDFDocument;


const { jsPDF } = window.jspdf;

CLIENT_ID = '559576953817-0drd9ji65as2gc750tpvuj5hcfglsrod.apps.googleusercontent.com';
API_KEY = 'AIzaSyDJqo5JL9MxUqHBVdkAn6DhgKcfGaVam4w';
SPREADSHEET_ID = '1NLdHWSQjWVZKCyQxjDx3jK9FbfFGvl5YGCxFSJnN1lQ';
INDICATOR_RANGE = "'Matrix of possible indicators & measures'!A3:Q100"

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
let indicators = null;


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
            indicators = result;
            let numRows = result.values ? result.values.length : 0;

            for (let i = 0; i < result.values.length; i++) {
                let row = result.values[i];
                let issue = row[1].toLowerCase();
				if (issue=="online grooming") {
					issue="grooming";
				}
				if (issue=="both") {
					issue="grooming cyberbullying";
				}
                let name = row[2];
                let desc = row[3];
                let recommend = row[9];
                recommend = recommend == '' ? 'N/A' : recommend;
                let plus = row[10];
                let minus = row[11];
                let candidate = row[13];
                let level = row[14].toLowerCase();
                let cite = row[12];
				var involving = row[15];
				var targeting = row[16];

                if (candidate == 'Y') {
                    $('#drag-4').append( 
                        `<li class="drag-item ${issue} ${level} ${involving} ${targeting}">
                            <h4>${name}</h4>
                            <span class="desc">${desc}</span>
                            <span class="plus">${plus}</span>
                            <span class="minus">${minus}</span>
                            <span class="recommend">${recommend}</span>
                            <span class="cite">${cite}</span>
                        </li>`
                    );
                }
            }
			
			
            $( ".drag-item" ).hover(
                function() {
                    var innerhtml = $( this ).html();
                  $( "#infopanel" ).html(innerhtml);
                }, function() {
                    $( "#infopanel" ).html("");
                }
              );
			  
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


function generateReport() {
    let report = '<h3>Evaluation Framework</h3>';

    report += '<h4>Behavioural Indicators</h4>';
    $('#drag-1').find('li').each((index, value) => {
        report += `<p>${value.innerText }</p>`;
    });
    report += '<h4>Individual Indicators</h4>';
    $('#drag-2').find('li').each((index, value) => {
        report += `<p>${value.innerText }</p>`;
    });
    report += '<h4>Relational / Institutional / Societal Indicators</h4>';
    $('#drag-3').find('li').each((index, value) => {
        report += `<p>${value.innerText }</p>`;
    });
    report += '<p><a style="font-size: 11px" href="#" onclick="hideReport()">Hide</a></p>';

    $(".report-fixed").html(report);
    // $(".report-fixed").show();


    const doc = new jsPDF();
    let yo = 40;

    doc.setFontSize(13);
	doc.setTextColor(28,171,226);
	doc.setFont(doc.getFont().fontName, "bold");
    doc.text("Behavioural Indicators", 20, 20);
    generateIndicators(doc, $('#drag-1'));

    doc.addPage();
    doc.setFontSize(13);
	doc.setTextColor(28,171,226);
	doc.setFont(doc.getFont().fontName, "bold");
    doc.text("Individual Indicators", 20, 20);   
    generateIndicators(doc, $('#drag-2'));

    doc.addPage();
    doc.setFontSize(13);
	doc.setTextColor(28,171,226);
	doc.setFont(doc.getFont().fontName, "bold");
    doc.text("Relational / Institutional / Societal Indicators", 20, 20);
    generateIndicators(doc, $('#drag-3'));
	
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
        let recommend = $(value).find('span.recommend')[0];
        let cite = $(value).find('span.cite')[0];

        let reflow = 80;
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
        doc.text(value.innerText, 20, yo);

        doc.setFontSize(10);
        yo += 6;
        doc.setFont(doc.getFont().fontName, "bold");
        doc.text("Pros: ", 20, yo);
        doc.setFont(doc.getFont().fontName, "normal");
        doc.text(plus.innerText, 50, yo);
        yo += 6;
        doc.setFont(doc.getFont().fontName, "bold");
        doc.text("Cons: ", 20, yo);
        doc.setFont(doc.getFont().fontName, "normal");
        doc.text(minus.innerText, 50, yo);
        yo += 6;
        doc.setFont(doc.getFont().fontName, "bold");
        doc.text("Recommendation: ", 20, yo);
        doc.setFont(doc.getFont().fontName, "normal");
        doc.text(recommend.innerText, 50, yo);
        yo += 6;
        doc.setFont(doc.getFont().fontName, "bold");
        doc.text("Reference: ", 20, yo);
        doc.setFont(doc.getFont().fontName, "normal");
        doc.text(cite.innerText, 50, yo);
        yo += 6;
        doc.setFont(doc.getFont().fontName, "bold");
        doc.text("Measures: ", 20, yo);
        doc.setFont(doc.getFont().fontName, "normal");
        
        for (let i = 0; i < measuresText.length; i++) {
            let mt = measuresText[i];

            // Re-flow every 80 characters
            let len = mt.length;
            
            for (let j = 0; j < len; j += reflow) {
                doc.text(mt.substring(j, j+reflow), 50, yo);
                yo += 5
            }
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