const electron = require('electron');
const {ipcRenderer} = electron;
const List = require("collections/list");
const jsonMapModule = require("../js/jsonMap");

/**
 * The number of columns in the list for AV-Außen
 * @type {number}
 */
const COL_AUSSEN_COUNT = 13;

/**
 * The number of columns in the list for AV-Innen
 * @type {number}
 */
const COL_INNEN_COUNT = 5;

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
 * The filter map, that is about to be passed on to the main process of the app
 * @type {Map<string, string>}
 */
const drinkFilter = new Map ();

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



