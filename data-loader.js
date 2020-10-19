
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
                let cite = row[row.length - 1];

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
        console.log('got here error');
        console.log(JSON.stringify(error, null, 2));
    });
}


function generateReport() {
    let report = '<h3>Evaluation Framework</h3>';

    report += '<h4>Behavioural Indicators</h4>';
    $('#1').find('li').each((index, value) => {
        console.log(value.innerText);
    });
    $('#1').find('li').each((index, value) => {
        report += `<p>${value.innerText }</p>`;
    });
    report += '<h4>Individual Indicators</h4>';
    $('#2').find('li').each((index, value) => {
        report += `<p>${value.innerText }</p>`;
    });
    report += '<h4>Relational / Institutional / Societal Indicators</h4>';
    $('#3').find('li').each((index, value) => {
        report += `<p>${value.innerText }</p>`;
    });
    report += '<p><a style="font-size: 11px" href="#" onclick="hideReport()">Hide</a></p>';
    console.log(report);

    $(".report-fixed").html(report);
    $(".report-fixed").show();
}

function hideReport() {
    $(".report-fixed").hide();
}