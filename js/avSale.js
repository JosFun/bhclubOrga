const electron = require('electron');
const {ipcRenderer} = electron;
const List = require("collections/list");
const jsonMapModule = require("../js/jsonMap");

/**
 * The enum for the MODE
 * @type {{DRINKS: string, SNACKS: string}}
 */
const MODE = {
    DRINKS_OUTER: "drinksOuter",
    SNACKS_OUTER: "snacks",
    DRINKS_INNER: "drinksInner"
};

/**
 * The number of columns in the list for AV-Außen
 * @type {number}
 */
const COL_AUSSEN_COUNT = 13;

/**
 * The number of columns in the list for AV-Innen
 * @type {number}
 */
const COL_INNEN_COUNT = 10;

/**
 * The categories of drinks that are to be printed out on the outer side of the TED
 * @type {string[]}
 */
const drinkOuterCategories = [ "Bier", "AFG", "Saft", "Wein/Sekt" ];

/**
 * The categories of drinks that are to be printed out on the inner side of the TED
 * @type {string[]}
 */
const drinkInnerCategories = [ "Barschnaps", "Schnaps-eiskalt", "Likör-gekühlt"];

/**
 * The index that refers to the current category of drinks that is to be received next.
 * @type {number}
 */
let categoryIndex = 0;
/**
 * The filter map, that is about to be passed on to the main process of the app
 * @type {Map<string, string>}
 */
const drinkFilter = new Map ();

/**
 * The filter map, that is about to be passed on to the main process of the app
 * @type {Map<string, string>}
 */
const snackFilter = new Map();

/**
 * The name of the type column of the rohgetraenke-table
 * @type {string}
 */
const typeColumnName = "drink_type";

/**
 * The name of the column indicating whether or not a specific drink is to be sold in the AV-Verkauf
 * @type {string}
 */
const avColumnName = "avVerkauf";

/**
 * The order map, that is about to be passed on to the main process of the app, so that the items are being put out
 * in the correct order.
 * @type {Map<string, string>}
 */
const drinkOrder = new Map ();
/**
 * The name of the drink database column, by which the output is about to be ordered.
 * */
const drinkOrderColumn = "drink_name";

/**
 * The order map, that is about to be passed on to the main process of the app, so that the items are being put out in
 * the correct order
 * @type {Map<string, string>}
 */
const snackOrder = new Map ();
/**
    The name of the snack database column, by which the output is about to be ordered.
 */
const snackOrderColumn = "snack_name";

drinkOrder.set(drinkOrderColumn,"asc");
snackOrder.set(snackOrderColumn, "asc");

drinkFilter.set(avColumnName, 1);
snackFilter.set(avColumnName, 1);

/* Iterate through all the drinkCategories that are supposed to be printed out on the outer side of the TED and send
corresponding update requests to the sql database in the backend.
 */
for ( let i = 0; i < drinkOuterCategories.length; ++i ) {
    drinkFilter.set ( typeColumnName, drinkOuterCategories[i]);

    ipcRenderer.send( "drinks:update", jsonMapModule.strMapToJson(drinkFilter), jsonMapModule.strMapToJson(drinkOrder));

    drinkFilter.delete(typeColumnName);
}

ipcRenderer.send("snacks:update", jsonMapModule.strMapToJson(snackFilter), jsonMapModule.strMapToJson(snackOrder));

/* Iterate through all the drinkCategories that are supposed to be printed out on the inner side of the TED and send
* update requests to the sql database in the backend.
*  */
for ( let i = 0; i < drinkInnerCategories.length; ++i ) {
    drinkFilter.set( typeColumnName, drinkInnerCategories[i]);

    ipcRenderer.send("drinks:update", jsonMapModule.strMapToJson(drinkFilter), jsonMapModule.strMapToJson(drinkOrder));

    drinkFilter.delete ( typeColumnName );
}


/**
 * Add the passed items to the corresponding tables for the inner and outer list of the TEDDI
 * @param mode Whether the passed items are snacks or drinks
 * @param items The items that are about to be made visible on the app
 */
function addItems ( mode, ...data ) {
    let table;
    /* The start row of the table */
    const startRow = document.createElement("tr");

    if ( mode === MODE.DRINKS_OUTER || mode === MODE.SNACKS_OUTER ) {
        table = document.getElementById("avAußen");

        for ( let i = 0; i < COL_AUSSEN_COUNT; ++i ) {
            const td = document.createElement("td");
            if ( i === 0 ) {
                if ( mode === MODE.DRINKS_OUTER ) {
                    td.textContent = drinkOuterCategories[categoryIndex++];
                }
                else if ( mode === MODE.SNACKS_OUTER ) {
                    td.textContent = "Snacks";
                    categoryIndex++;
                }
            }
            td.className = "avAußenListeCategory";

            startRow.className = "avAußenListeCategory";
            startRow.appendChild(td);
        }
        table.appendChild(startRow);
    }
    else if ( mode === MODE.DRINKS_INNER ) {
        table = document.getElementById("avInnen");

        for ( let i = 0; i < COL_INNEN_COUNT; ++i ) {
            const td = document.createElement("td");
            if ( i === 0 ) {
                td.textContent = drinkInnerCategories[categoryIndex++ - drinkOuterCategories.length - 1];
            }
            td.className = "avInnenListeCategory";

            startRow.className = "avInnenListeCategory";
            startRow.appendChild(td);
        }
        table.appendChild(startRow);
    }

    for ( let i = 0; i < data[0].length; ++i ) {
        const tr = document.createElement("tr");
        let tds;

        if ( mode === MODE.DRINKS_OUTER || mode === MODE.SNACKS_OUTER ) {
            tds = new Array(COL_AUSSEN_COUNT);
        }
        else if ( mode === MODE.DRINKS_INNER ) {
            tds = new Array(COL_INNEN_COUNT);
        }

        for ( let k = 0; k < tds.length; ++k ) {
            tds[k] = document.createElement('td');
        }

        if ( mode === MODE.DRINKS_OUTER ) {
            tds[0].textContent = data[0][i]["drink_name"];
            tds[1].textContent = data[0][i]["bottle_size"].toFixed(2) + "l";
            tds[2].textContent = data[0][i]["internal_price"].toFixed(2) + "€";
        }
        else if ( mode === MODE.SNACKS_OUTER ) {
            tds[0].textContent = data[0][i]["snack_name"];
            tds[1].textContent = "1 Packung";
            tds[2].textContent = data[0][i]["snack_price"].toFixed(2) + "€";
        }
        else if ( mode === MODE.DRINKS_INNER ) {
            tds[0].textContent = data[0][i]["drink_name"];
            tds[1].textContent = data[0][i]["bottle_size"].toFixed(2) + "l";
            tds[2].textContent = data[0][i]["internal_price"].toFixed(2) + "€";
        }

        for ( let k = 0; k < tds.length; ++k ) {
            tr.appendChild(tds[k]);
        }
        table.appendChild(tr);
    }
    /* Add an empty row at the end. */
    table.appendChild(document.createElement('tr'));

    let lastRow = document.createElement('tr');
    for ( let i = 0; i < COL_COUNT; ++i ) {
        lastRow.appendChild(document.createElement('td'));
    }
    /* Add an empty row at the end. */
    table.appendChild(lastRow);


}

ipcRenderer.on( "drinks:data", function(e, data) {
    if ( categoryIndex <= 4 ) {
        addItems( MODE.DRINKS_OUTER, data );
    }
   else {
       addItems ( MODE.DRINKS_INNER, data );
    }
});

ipcRenderer.on( "snacks:data", function(e, data) {
    addItems ( MODE.SNACKS_OUTER, data );
});






