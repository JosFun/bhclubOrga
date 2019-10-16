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
 * The drink column of the rohgetraenke table.
 * @type {string}
 */
const drinkColumn = "drink_name";

/**
 * The avVerkauf column of the rohgetraenke table.
 * @type {string}
 */
const avVerkaufColumn = "avVerkauf";

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
    let selectYear = document.getElementById("selectAVStatisticYear");

        for ( let i = 2019; i <= useFulFunctions.getYear(); ++i ) {
            let option = document.createElement("option");
            let textNode = document.createTextNode(i.toString());

            option.appendChild(textNode);
            selectYear.appendChild(option);
        }

        selectYear.addEventListener("change", function ( e ) {
            let selection = selectYear.options[selectYear.selectedIndex].text;

            if ( selection !== "BITTE JAHR AUSWÄHLEN!" ) {
                /* If the placeholder is not being selected anymore: Remove it from the selectYear element. */
                if ( selectYear.children.item(0).textContent === "BITTE JAHR AUSWÄHLEN!" ) {
                    selectYear.children.item(0).remove();
                }

                let filter = new Map();

                /* If a specific year has been selected. */
                if ( selection !== "GESAMTER ZEITRAUM") {
                    /* Get the selected date from the selectYear element. */
                    let dateString = selection;
                    filter.set ( dateColumn, "%" + dateString);
                }

                ipcRenderer.send( "av_verkauf_abrechnungen:get", jsonMapModule.strMapToJson(filter));
            }
        } );

        let selectDrink = document.getElementById("selectAVStatisticDrink");

        let avSaleFilter = new Map ();
        avSaleFilter.set(avVerkaufColumn, true);

        let avSaleOrder = new Map ( );
        avSaleOrder.set(drinkColumn, "asc");

        /* Query the database for all the drinks that are present on the avSale. */
        ipcRenderer.send("drinks:update", jsonMapModule.strMapToJson(avSaleFilter), jsonMapModule.strMapToJson(avSaleOrder));

        selectDrink.addEventListener( "change", function ( e ) {
        let selection = selectDrink.options[selectDrink.selectedIndex].text;

        if ( selection !== "BITTE GETRÄNK AUSWÄHLEN!") {
            if ( selectDrink.children.item(0).textContent === "BITTE GETRÄNK AUSWÄHLEN!") {
                selectDrink.children.item(0).remove();
            }

            let filter = new Map ( );
            filter.set ( drinkColumn, selection );


        }
    });

}

/* Once the backend delivers the data from all the abrechnungen: fill the table with tahle corresponding data!*/
ipcRenderer.on( "av_verkauf_abrechnungen:deliver", function ( e, data ) {
    fillAbrechnungTable(data);
});
/**
 * Fill the table on the statistics page with content.
 */
function fillAbrechnungTable ( data ) {
    /* The sums of money and sold products in the selected period of time. */
    let moneySum = 0, productSum = 0;

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
        moneySum += parseFloat(data[i]["money"]);
        tds[3].textContent = data[i]["product_value"].toFixed(2) + "€";
        productSum += parseFloat(data[i]["product_value"]);

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

    const endRow = document.createElement("tr");
    endRow.className = "avStatisticsEvaluation";

    for ( let k = 0; k < ABRECHNUNG_TABLE_COL_COUNT; ++k ) {
        const td = document.createElement("td");
        td.className = "avStatisticsEvaluation";
        if ( k === 1 ) {
            td.textContent = "GESAMT";
        }
        else if ( k === 2 ) {
            td.textContent = moneySum.toFixed(2 ) + "€";
        }
        else if ( k === 3 ) {
            td.textContent = productSum.toFixed(2) + "€";
        }
        else if ( k === 4 ) {
            td.textContent = ( moneySum-productSum ).toFixed(2) + "€";
            if ( moneySum - productSum > 0 ) {
                td.style.color = "red";
            } else {
                td.style.color = "green";
            }
        }
        endRow.appendChild(td);
    }
    table.appendChild(endRow);


}