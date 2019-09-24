const electron = require('electron');
const {ipcRenderer} = electron;
const List = require("collections/list");
const jsonMapModule = require("../js/jsonMap");

/**
 * The number of columns in the SK-Liste
 * @type {number}
 */
const COL_COUNT = 13;

/**
 * This Array contains all the categories a drink in the system can belong to.
 * @type {string[]}
 */
const drinkCategories = ["Barschnaps", "Schnaps-eiskalt", "Likör-gekühlt", "Wein/Sekt"];

/**
 * The index that references the category which is to be added to the list the next.
 * @type {number}
 */
let categoryIndex = 0;

/**
 * The name of the type column by which the sql query is about to be filtered.
 * @type {string}
 */
const typeColumnName ="drink_type";

/**
 * The name of the drink column by which the sql query is about to be ordered.
 * @type {string}
 */
const drinkColumnName = "drink_name";

/**
 * The name of the snack column by which the sql query is about to be ordered.
 * @type {string}
 */
const snackColumnName = "snack_name";

/**,
 * The Map that is meant to store the current filter for drink selection.
 * @type {Map<string, string>}
 */
let drinkFilter = new Map();

/**
 * The Map that is meant to store the current order for drink selection.
 * @type {Map<any, any>}
 */
let drinkOrder = new Map();
drinkOrder.set(drinkColumnName, "asc");

/**
 * The Map that is meant to store the current order for snack selection.
 * @type {Map<any, any>}
 */
let snackOrder = new Map();
snackOrder.set(snackColumnName, "asc");

for ( let i = 0; i < drinkCategories.length; ++i ) {
    /* Set up the drinkFilter properly */
    drinkFilter.set(typeColumnName, drinkCategories[i]);

    ipcRenderer.send("drinks:update", jsonMapModule.strMapToJson(drinkFilter), jsonMapModule.strMapToJson(drinkOrder));
    /* Reset the drinkFilter again.*/
    drinkFilter.delete(typeColumnName);


}

/* Since a snackFilter is not present at all, an empty Map is passed on to the main process. */
ipcRenderer.send("snacks:update", jsonMapModule.strMapToJson(new Map()), jsonMapModule.strMapToJson(snackOrder));

/**
 * Add the passed drinkData to the SK-Liste
 * @param drinkData
 */
function addDrinks(...drinkData) {
    const table = document.getElementById('skListe');
    const startRow = document.createElement('tr');

    for ( let k = 0; k < COL_COUNT; ++k ){
        const td = document.createElement('td');
        if ( k === 0 ) {
            /* Set the first column in the first row of the current category to contain the name of the category itself. */
            td.textContent = drinkCategories[categoryIndex++];
        }
        td.className="skListeCategory";

        startRow.className = "skListeCategory";
        startRow.appendChild(td);
    }
    table.appendChild(startRow);

    for ( let i = 0; i < drinkData[0].length; ++i ) {
        const tr = document.createElement( 'tr' );
        const tds = new Array(COL_COUNT);

        for ( let k = 0; k < COL_COUNT; ++k ) {
            tds[k] = document.createElement('td' );
            tds[k].contentEditable = false;
        }

        tds[0].textContent = drinkData[0][i]["drink_name"];
        tds[1].textContent = drinkData[0][i]["bottle_size"].toFixed(2) + "l";
        tds[2].textContent = drinkData[0][i]["internal_price"].toFixed(2) + "€";

        for ( let k = 0; k < COL_COUNT; ++k ) {
            tr.appendChild(tds[k]);
        }
        table.appendChild(tr);
    }
}

/**
 * Add the passed snackData to the SK-Liste
 * @param snackData
 */
function addSnacks(...snackData) {

}

ipcRenderer.on("drinks:data", function(e, drinkData) {
    console.log("hello");
    addDrinks(drinkData);
});

ipcRenderer.on("snacks:data", function(e, snackData) {
   addSnacks(snackData);
});




