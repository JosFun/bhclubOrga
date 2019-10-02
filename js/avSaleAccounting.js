const electron = require('electron');
const {ipcRenderer} = electron;
const List = require("collections/list");
const jsonMapModule = require("../js/jsonMap");
const useFulFunctions = require("../js/usefulFunctions");

/**
 * References to all the input fields for the amounts of the different types of coins and bank notes, the user will
 * count.
 * @type {HTMLCollectionOf<Element>}
 */
const moneyCounts = document.getElementsByClassName("avMoneyCount");
/**
 * A Reference to the field where all the counted money will be added together.
 * @type {HTMLElement}
 */
const moneyOverallField = document.getElementById("avMoneyCountOverall");

/**
 * The different moneyValues of all the coins and bank notes one can count.
 * @type {number[]}
 */
const moneyValues = [ 100, 50, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01 ];

/**
 * The amount of money the user has counted so far
 * @type {number}
 */
let moneyOverAll = 0;

/**
 * A reference to the select field for selecting the current AV-Abrechnung
 * @type {HTMLElement}
 */
const selectAbrechnung = document.getElementById("select_av_abrechnung");

for ( let i = 0; i < moneyCounts.length; ++i ) {
    moneyCounts.item(i).addEventListener( "focusin", function(e) {
        e.preventDefault();
        if ( moneyCounts.item(i).textContent === "ANZAHL" ) {
            moneyCounts.item(i).textContent = "";
        }
    });
    moneyCounts.item(i).addEventListener("focusout", function(e) {
        e.preventDefault();
        let numString = moneyCounts.item(i).textContent;

            if ( !isNaN(parseInt(numString))) {
                moneyOverAll+= parseInt(numString) * moneyValues [i];
            }
            else if ( numString === "") {
                moneyCounts.item(i).textContent = "ANZAHL";
            }
            moneyOverallField.textContent = moneyOverAll.toFixed(2) + "€";
    });
}

/* Create a new options entry with the current date as the description string. */
let newOption = document.createElement("option");
newOption.appendChild(document.createTextNode("#NEU : " + useFulFunctions.getDate()));
selectAbrechnung.appendChild(newOption);

/* Fetch the options for the select button from the database. */
ipcRenderer.send("av_verkauf_abrechnungen:get");

ipcRenderer.on("av_verkauf_abrechnungen:deliver", function (e, data) {
    console.log("hello");
    addAbrechnungSelectOptions(data);
});

/**
 * Use the passed data in order to add select options to the select field for selecting the avVerkaufAbrechnung
 * @param data
 */
function addAbrechnungSelectOptions ( ...data ) {
    for ( let i = 0; i < data[0].length; ++i ) {
        console.log(i);
        let option = document.createElement("option");
        let optionText = "#" + data[0][i]["av_abrechnung_id"] + " : " + data[0][i]["av_abrechnung_datum"];
        option.appendChild(document.createTextNode(optionText));

        selectAbrechnung.appendChild(option);
    }
}