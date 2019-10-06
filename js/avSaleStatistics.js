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

/**
 * Fill the table on the statistics page with content.
 */
function fillAbrechnungTable () {

}