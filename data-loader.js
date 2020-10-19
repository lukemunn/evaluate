const { jsPDF } = window.jspdf;

CLIENT_ID = '559576953817-0drd9ji65as2gc750tpvuj5hcfglsrod.apps.googleusercontent.com';
API_KEY = 'AIzaSyDJqo5JL9MxUqHBVdkAn6DhgKcfGaVam4w';
SPREADSHEET_ID = '1NLdHWSQjWVZKCyQxjDx3jK9FbfFGvl5YGCxFSJnN1lQ';
INDICATOR_RANGE = "'Matrix of possible indicators & measures'!A3:O100"

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
                let issue = row[1];
                let name = row[2];
                let desc = row[3];
                let recommend = row[9];
                recommend = recommend == '' ? 'N/A' : recommend;
                let plus = row[10];
                let minus = row[11];
                let candidate = row[13];
                let level = row[14].toLowerCase();
                let cite = row[12];

                if (candidate == 'Y') {
                    $('.drag-column-approved > .drag-inner-list').append( 
                        `<li class="drag-item ${level}">
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
                    console.log("rollover");
                    var innerhtml = $( this ).html();
                  $( "#infopanel" ).html(innerhtml);
                }, function() {
                    $( "#infopanel" ).html("");
                }
              );

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

    doc.setFontSize(30);
    doc.text("Evaluation Framework", 10, 20);
    doc.setFontSize(20);
    doc.setFont(doc.getFont().fontName, "italic");
    doc.text("[Add title page details here]", 10, 40);
    doc.setFont(doc.getFont().fontName, "normal");

    doc.addPage();
    doc.setFontSize(20);
    doc.text("Behavioural Indicators", 10, 20);
    generateIndicators(doc, $('#drag-1'));

    doc.addPage();
    doc.setFontSize(20);
    doc.text("Individual Indicators", 10, 20);
    
    generateIndicators(doc, $('#drag-2'));

    doc.addPage();
    doc.setFontSize(20);
    doc.text("Relational / Institutional / Societal Indicators", 10, 20);
    
    generateIndicators(doc, $('#drag-3'));
    doc.save("Evaluation-Framework-2020.pdf");
}

function generateIndicators(doc, element) {
    let initialYOffset = 40;
    let yo = initialYOffset;
    let indicatorsPerPage  = 4;
    let counter = 0;
    element.find('li').each((index, value) => {
        doc.setFontSize(12);
        doc.text(value.innerText, 10, yo);
        let desc = $(value).find('span.desc')[0];
        let plus = $(value).find('span.plus')[0];
        let minus = $(value).find('span.minus')[0];
        let recommend = $(value).find('span.recommend')[0];
        let cite = $(value).find('span.cite')[0];
        doc.setFontSize(12);
        yo += 8;
        doc.setFont(doc.getFont().fontName, "bold");
        doc.text("Description: ", 10, yo);
        doc.setFont(doc.getFont().fontName, "normal");
        doc.text(desc.innerText, 50, yo);
        yo += 8;
        doc.setFont(doc.getFont().fontName, "bold");
        doc.text("Pros: ", 10, yo);
        doc.setFont(doc.getFont().fontName, "normal");
        doc.text(plus.innerText, 50, yo);
        yo += 8;
        doc.setFont(doc.getFont().fontName, "bold");
        doc.text("Cons: ", 10, yo);
        doc.setFont(doc.getFont().fontName, "normal");
        doc.text(minus.innerText, 50, yo);
        yo += 8;
        doc.setFont(doc.getFont().fontName, "bold");
        doc.text("Recommendation: ", 10, yo);
        doc.setFont(doc.getFont().fontName, "normal");
        doc.text(recommend.innerText, 50, yo);
        yo += 8;
        doc.setFont(doc.getFont().fontName, "bold");
        doc.text("Reference: ", 10, yo);
        doc.setFont(doc.getFont().fontName, "normal");
        doc.text(cite.innerText, 50, yo);
        yo += 16;

            

        counter++;
        if (counter % indicatorsPerPage == 0) {
            doc.addPage();
            yo = initialYOffset;
        }
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