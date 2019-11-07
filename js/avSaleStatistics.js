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
 * The key for storing the start of the time period we want to receive the AV-Abrechnungen and drinks of.
 * @type {string}
 */
const dateStart = "datum_start";

/**
 * The key for storing the end of the time period we want to receive the AV-Abrechnungen and drinks of.
 * @type {string}
 */
const dateEnd = "datum_end";

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
 * The id column of the av_verkauf table.
 * @type {string}
 */
const avAbrechnungDateColumn = "av_abrechnung_datum";
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
    console.log("dfdsf");
    let selectBegin = document.getElementById("selectAVStatisticMonthBegin");
    let selectEnd = document.getElementById("selectAVStatisticMonthEnd");


    /* The dateFilter that is going to be passed on to the backend in order to receive all AV-Verkauf-Abrechnungen
    * that have been made between two specified months. */
    let dateFilter = new Map ( );

        for ( let i = 2019; i <= useFulFunctions.getYear(); ++i ) {
            console.log(i);
            for ( let j = 1; j <= useFulFunctions.getMonth() + 1; ++j ) {
                let dateString = i.toString();

                if ( j < 10 ) {
                    dateString = "01/0" + j + "/" + dateString;
                }
                else {
                    dateString = "01/" + j+ "/" + dateString;
                }

                let option1 = document.createElement("option");
                let option2 = document.createElement("option");
                let textNode1 = document.createTextNode(dateString);
                let textNode2 = document.createTextNode(dateString);
                option1.appendChild(textNode1);
                option2.appendChild(textNode2);
                selectBegin.appendChild(option1);
                selectEnd.appendChild(option2);
            }
        }

        selectBegin.addEventListener("change", function(e) {
            let selection = selectBegin.options[selectBegin.selectedIndex].text;

            if ( selection !== "ANFANGSMONAT AUSWÄHLEN" ) {
                if ( selectBegin.children.item(0).textContent === "BITTE ANFANGSMONAT AUSWÄHLEN") {
                    selectBegin.children.item(0).remove();
                }

                let filter = new Map();
                filter.set(dateStart, selection);
            }
        });

        selectEnd.addEventListener("change", function (e) {
            let selection = selectBegin.options[selectBegin.selectedIndex].text;

            if ( selection !== "ENDMONAT AUSWÄHLEN" ) {
                if ( selectEnd.children.item(0).textContent === "BITTE ENDMONAT AUSWÄHLEN") {
                    selectEnd.children.item(0).remove();
                }

                let filter = new Map();
                filter.set(dateEnd, selection);

                /* Request all the AV-Abrechnungen of the specified time period.*/
                ipcRenderer.send( "av_verkauf_abrechnungen_time_period:get", jsonMapModule.strMapToJson(filter), dateStart, dateEnd);

            }
        });

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

            let order = new Map ( );
            order.set( avAbrechnungDateColumn, "asc");

            ipcRenderer.send( "av_drink_statistics:get",
                jsonMapModule.strMapToJson(filter), jsonMapModule.strMapToJson(order));
        }
    });

}

/* Once the backend delivers the data from all the abrechnungen: fill the table with tahle corresponding data!*/
ipcRenderer.on( "av_verkauf_abrechnungen:deliver", function ( e, data ) {
    fillAbrechnungTable(data);
});

/* Once the backend delivers the data from all the drinks that are present in the database: Fill the html select with
* data from all the drinks. */
ipcRenderer.on("drinks:data", function (e, data ) {
    fillDrinkSelect(data);
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

function fillDrinkSelect ( ) {
     const htmlSelect = document.getElementById("selectAVStatisticDrink");
}