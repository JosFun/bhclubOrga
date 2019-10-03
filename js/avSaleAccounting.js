const electron = require('electron');
const {ipcRenderer} = electron;
const List = require("collections/list");
const jsonMapModule = require("../js/jsonMap");
const useFulFunctions = require("../js/usefulFunctions");
const avDb = require("../js/avSaleVariables");

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

selectAbrechnung.addEventListener("change", function(e) {
   e.preventDefault();
   console.log(selectAbrechnung.options[selectAbrechnung.selectedIndex].text);
   /* If the user has choosen to do a new accounting of the avVerkauf. */
   if ( selectAbrechnung.options[selectAbrechnung.selectedIndex].text === abrechnungNeu ) {
       console.log(34565)
       /* Create filters and orders in order to request sql selects from the database. */
       avDb.categoryIndex = 0;

       avDb.drinkOrder.set( avDb.drinkOrderColumn, "asc" );
       avDb.snackOrder.set( avDb.snackOrderColumn, "asc" );

       avDb.drinkFilter.set(avDb.avColumnName, 1);
       avDb.drinkFilter.set(avDb.avColumnName, 1);

       for ( let k = 0; k < avDb.drinkOuterCategories; ++k ) {
           avDb.drinkFilter.set(avDb.typeColumnName, avDb.drinkOuterCategories[i]);
           ipcRenderer.send("drinks:update", jsonMapModule.strMapToJson(avDb.drinkFilter), jsonMapModule.strMapToJson(avDb.drinkOrder));
           avDb.drinkFilter.delete(avDb.typeColumnName);
       }

       ipcRenderer.send("snacks:update", jsonMapModule.strMapToJson(avDb.snackFilter), jsonMapModule.strMapToJson(avDb.snackOrder));

       for ( let i = 0; i < avDb.drinkInnerCategories; ++i ) {
           avDb.drinkFilter.set(avDb.typeColumnName, avDb.drinkInnerCategories[i]);
           ipcRenderer.send("drinks:update", jsonMapModule.strMapToJson(avDb.drinkFilter), jsonMapModule.strMapToJson(avDb.drinkOrder));
           avDb.drinkFilter.delete(avDb.typeColumnName);
       }
   }
   /* Otherwise, if the user has choosen to load an old accountin of the avVerkauf into the software from the database.*/
   else {

   }
});

ipcRenderer.on("drinks:update", function ( e, data ) {
    e.preventDefault();
    if ( avDb.categoryIndex <= 4 ) {
        avDb.addItems( avDb.MODE.ABRECHNUNG_DRINKS_OUTER, "avVerkaufAbrechnungStrichlisteAussen", "avVerkaufAbrechnungStrichlisteInnen", data );
    }
    else {
        avDb.addItems( avDb.MODE.ABRECHNUNG_DRINKS_INNER, "avVerkaufAbrechnungStrichlisteAussen", "avVerkaufAbrechnungStrichlisteInnen", data );
    }
});

ipcRenderer.on("snacks:update", function( e, data ) {
   e.preventDefault();
   avDb.addItems( avDb.MODE.ABRECHNUNG_SNACKS_OUTER, "avVerkaufAbrechnungStrichlisteAussen", "avVerkaufAbrechnungStrichlisteInnen", data );
});

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
/* Store the string value of the select option for a new Abrechnung inside a variable in order to access it later for
* comparison.*/
let abrechnungNeu = "#NEU : " + useFulFunctions.getDate();
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