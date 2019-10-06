const electron = require('electron');
const {ipcRenderer} = electron;
const List = require("collections/list");
const jsonMapModule = require("../js/jsonMap");
const useFulFunctions = require("../js/usefulFunctions");
const avDb = require("../js/avSaleVariables");

/**
 * The date column of the av-verkauf table.
 * @type {string}
 */
const dateColumn = "av_abrechnung_datum";

/**
 * The numer of columns of the av_statistic_table
 * @type {number}
 */
const ABRECHNUNG_TABLE_COL_COUNT = 5;

fillSelectOptions();
/**
 * Fill the select element on the page with valid years as input.
 */
function fillSelectOptions ( ) {
    let select = document.getElementById("selectAVStatisticYear");

    for ( let i = 2019; i <= useFulFunctions.getYear(); ++i ) {
        let option = document.createElement("option");
        let textNode = document.createTextNode(i.toString());

        option.appendChild(textNode);
        select.appendChild(option);
    }

    select.addEventListener("change", function ( e ) {
        let selection = select.options[select.selectedIndex].text;

        if ( selection !== "BITTE JAHR AUSWÄHLEN!" ) {
            /* If the placeholder is not being selected anymore: Remove it from the select element. */
            if ( select.children.item(0).textContent === "BITTE JAHR AUSWÄHLEN!" ) {
                select.children.item(0).remove();
            }

            let filter = new Map();

            /* If a specific year has been selected. */
            if ( selection !== "GESAMTER ZEITRAUM") {
                /* Get the selected date from the select element. */
                let dateString = selection;
                filter.set ( dateColumn, "%" + dateString);
            }

            console.log(useFulFunctions.getDate());

            ipcRenderer.send( "av_verkauf_abrechnungen:get", jsonMapModule.strMapToJson(filter));
        }
    } );


}

/* Once the backend delivers the data from all the abrechnungen: fill the table with tahle corresponding data!*/
ipcRenderer.on( "av_verkauf_abrechnungen:deliver", function ( e, data ) {
    fillAbrechnungTable(data);
});
/**
 * Fill the table on the statistics page with content.
 */
function fillAbrechnungTable ( data ) {
    const table = document.getElementById("av_statistic_table");
    for ( let i = 0; i < data.length; ++i ) {
        const tr = document.createElement("tr");
        const tds = new Array ( ABRECHNUNG_TABLE_COL_COUNT );

        for ( let k = 0; k < tds.length; ++k ) {
            tds[k] = document.createElement("td");
        }

        tds[0].textContent = data[i]["av_abrechnung_id"];
        tds[1].textContent = data[i]["av_abrechnung_datum"];
        tds[2].textContent = data[i]["money"].toFixed(2) + "€";
        tds[3].textContent = data[i]["product_value"].toFixed(2) + "€";

        let profit = parseFloat(data[i]["money"]) - parseFloat(data[i]["product_value"]);
        console.log( profit );
        tds[4].textContent = profit.toFixed(2) + "€";

        if ( profit < 0 ) {
            tds[4].style.color = "red";
        }
        else {
            tds[4].style.color = "green";
        }
        for ( let k = 0; k < tds.length; ++k ) {
            tr.appendChild(tds[k]);
        }
        table.appendChild(tr);
    }


}