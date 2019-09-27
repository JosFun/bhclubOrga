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

