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
 * The names of the tables that are important on the av_verkauf_abrechnung page.
 * @type {string}
 */
const tableAussen = "avVerkaufAbrechnungStrichlisteAussen", tableInnen = "avVerkaufAbrechnungStrichlisteInnen";

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
 * The ID of the currently loaded Abrechnung in the database.
 * @type {number}
 */
let currentAbrechnungID = 0;


/**
 * The text in the select element that represents a new Abrechnung the user can make.
 */
let abrechnungNeu;

/**
 * A reference to the select field for selecting the current AV-Abrechnung
 * @type {HTMLElement}
 */
const selectAbrechnung = document.getElementById("select_av_abrechnung");

selectAbrechnung.addEventListener("change", function(e) {
   e.preventDefault();

   for ( let i = 0; i < selectAbrechnung.children.length; ++i ) {
       if ( selectAbrechnung.children.item(i).textContent === "BITTE AUSWÄHLEN!") {
           selectAbrechnung.children.item(i).remove();
       }
   }
   /* If the user has choosen to do a new accounting of the avVerkauf. */
   if ( selectAbrechnung.options[selectAbrechnung.selectedIndex].text === abrechnungNeu ) {
       /* Create filters and orders in order to request sql selects from the database. */
       avDb.categoryIndex = 0;

       avDb.removeTableRows("avVerkaufAbrechnungStrichlisteInnen", "avVerkaufAbrechnungStrichlisteAussen");

       avDb.drinkOrder.set( avDb.drinkOrderColumn, "asc" );
       avDb.snackOrder.set( avDb.snackOrderColumn, "asc" );

       avDb.drinkFilter.set(avDb.avColumnName, 1);
       avDb.drinkFilter.set(avDb.avColumnName, 1);

       for ( let i = 0; i < avDb.drinkOuterCategories.length; ++i ) {
           avDb.drinkFilter.set(avDb.typeColumnName, avDb.drinkOuterCategories[i]);
           ipcRenderer.send("drinks:update", jsonMapModule.strMapToJson(avDb.drinkFilter), jsonMapModule.strMapToJson(avDb.drinkOrder));
           avDb.drinkFilter.delete(avDb.typeColumnName);
       }

       ipcRenderer.send("snacks:update", jsonMapModule.strMapToJson(avDb.snackFilter), jsonMapModule.strMapToJson(avDb.snackOrder));

       for ( let i = 0; i < avDb.drinkInnerCategories.length; ++i ) {
           avDb.drinkFilter.set(avDb.typeColumnName, avDb.drinkInnerCategories[i]);
           ipcRenderer.send("drinks:update", jsonMapModule.strMapToJson(avDb.drinkFilter), jsonMapModule.strMapToJson(avDb.drinkOrder));
           avDb.drinkFilter.delete(avDb.typeColumnName);
       }
   }
   /* Otherwise, if the user has choosen to load an old accounting of the avVerkauf into the software from the database.*/
   else {
       let abrechnungString = selectAbrechnung.options[selectAbrechnung.selectedIndex].text;

       /* Try to get access to the id of the abrechnung the user has selected */
       let textParts = abrechnungString.split(" ");
       let id = parseInt(textParts[0].substring(1,textParts[0].length));

       currentAbrechnungID = id;

       /* Now load the abrechnung with the specified id from the database of the system */
       ipcRenderer.send("av_verkauf_abrechnungen:load", id);
   }
});

ipcRenderer.on("drinks:data", function ( e, data ) {
    if ( avDb.categoryIndex <= 4 ) {
        console.log(avDb.categoryIndex);
        avDb.addItems( avDb.MODE.ABRECHNUNG_DRINKS_OUTER, "avVerkaufAbrechnungStrichlisteAussen", "avVerkaufAbrechnungStrichlisteInnen", data );
    }
    else {
        avDb.addItems( avDb.MODE.ABRECHNUNG_DRINKS_INNER, "avVerkaufAbrechnungStrichlisteAussen", "avVerkaufAbrechnungStrichlisteInnen", data );
    }
});

ipcRenderer.on("snacks:data", function( e, data ) {
   avDb.addItems( avDb.MODE.ABRECHNUNG_SNACKS_OUTER, "avVerkaufAbrechnungStrichlisteAussen", "avVerkaufAbrechnungStrichlisteInnen", data );
});

/* Take care of the table for counting the money in the register in the AV-Raum */
for ( let i = 0; i < moneyCounts.length; ++i ) {
    moneyCounts.item(i).addEventListener( "focusin", function(e) {
        e.preventDefault();
        if ( moneyCounts.item(i).textContent === "ANZAHL" ) {
            moneyCounts.item(i).textContent = "";
        }
    });
    moneyCounts.item(i).addEventListener("focusout", function(e) {
        e.preventDefault();
        moneyOverAll = 0;
        for ( let k = 0; k < moneyCounts.length; ++k ) {
            let numString = moneyCounts.item(k).textContent;
            if (!isNaN(parseInt(numString))) {
                moneyOverAll += parseInt(numString) * moneyValues [k];
            } else if (numString === "") {
                moneyCounts.item(i).textContent = "ANZAHL";
            }
        }
            moneyOverallField.textContent = moneyOverAll.toFixed(2) + "€";

            let moneyAuswertung = document.getElementById("avVerkaufMoneyAuswertung");
            moneyAuswertung.textContent = moneyOverAll.toFixed(2) + "€";

        /* Finish the accounting by doing the profit and loss account */
        avDb.finishAccounting();
    });
}

updateSelectAbrechnung();
/**
 * Update the selectAbrechnung-element with a row for a new abrechnung
 */
function updateSelectAbrechnung ( ) {
    /* Create a new options entry with the current date as the description string. */
    let newOption = document.createElement("option");
    newOption.appendChild(document.createTextNode("#NEU : " + useFulFunctions.getDate()));
    /* Store the string value of the select option for a new Abrechnung inside a variable in order to access it later for
    * comparison.*/
    abrechnungNeu = "#NEU : " + useFulFunctions.getDate();
    selectAbrechnung.appendChild(newOption);

    /* Fetch the options for the select button from the database. */
    ipcRenderer.send("av_verkauf_abrechnungen:get");
}


/* React to the avAbrechnung data this process receives from the underlying database. */
ipcRenderer.on("av_verkauf_abrechnungen:deliver", function (e, data) {
    addAbrechnungSelectOptions(data);
});

/**
 * Use the passed data in order to add select options to the select field for selecting the avVerkaufAbrechnung
 * @param data
 */
function addAbrechnungSelectOptions ( ...data ) {
    for ( let i = 0; i < data[0].length; ++i ) {
        let option = document.createElement("option");
        let optionText = "#" + data[0][i]["av_abrechnung_id"] + " : " + data[0][i]["av_abrechnung_datum"];
        option.appendChild(document.createTextNode(optionText));

        selectAbrechnung.appendChild(option);
    }
}

/* Once the storeButton has been hit, the abrechnung is being put into the database. */
let storeButton = document.getElementById("storeAbrechnung");
storeButton.addEventListener( "click", function(e) {
   e.preventDefault();
   if ( selectAbrechnung.options[selectAbrechnung.selectedIndex].text === "BITTE AUSWÄHLEN!") {
       alert("Wähle bitte zuerst eine gültige Abrechnung aus oder erstelle eine neue!");
       location.reload();
       return;
   }
   let avAbrechnungFields = new Array (moneyCounts.length + 1 );

   avAbrechnungFields[0] = useFulFunctions.getDate();
   /* Get access to the different moneyCountings for the different bank notes and coin values.  */
    for ( let i = 1; i < moneyCounts.length +1; ++i ) {
        let moneyVal = parseInt(moneyCounts.item(i-1).textContent);
        if ( !isNaN(moneyVal)) {
            avAbrechnungFields[i] = moneyVal;
        }
        else {
            avAbrechnungFields[i] = 0;
        }
    }

    /* Send the moneyData to the database. */
    ipcRenderer.send("av_verkauf_abrechnungen:create_abrechnung", avAbrechnungFields);
});

/**
 * Get the specified amounts of all the drinks in the Abrechnung from the corresponding html elements and write
 * them into the database properly.
 */
function getDrinkAmounts ( ) {
    const table1 = document.getElementById("avVerkaufAbrechnungStrichlisteAussen");
    const table2 = document.getElementById("avVerkaufAbrechnungStrichlisteInnen");
    /* The index of the amount-td in each of the table's rows. */
    let amountIndex = 4;

    for ( let k = 0; k < 2; ++k ) {
        let rows;
        if ( k === 0 ) {
             rows = table1.children;
        }
        else {
            rows = table2.children;
        }
        let i;
        /* Iterate through all the rows from the second to the last until you are in the snacks rows */
        for (i = 1; i < rows.length && rows[i].children.item(0).textContent !== "Snacks"; ++i) {
            /* If the editable span in the ith row does contain a valid number: write into the database*/
            if (rows[i].children.item(amountIndex).className !== "avAbrechnungAussenCategory" &&
            rows[i].children.item(amountIndex).className !== "avAbrechnungInnenCategory") {
                let amount = parseInt(rows[i].children.item(amountIndex).children.item(0).textContent);
                /* Extract the drinkID from the row where an amount has been specified. */
                let drinkString = rows[i].children.item(0).textContent;
                drinkString = drinkString.substring(1, drinkString.length );
                let drinkID = parseInt ( drinkString );
                if (!isNaN(amount)) {
                    /* Request the storage of the data in the database of the system.*/
                    ipcRenderer.send("av_drinks_abrechnungen:store", currentAbrechnungID,drinkID,amount);
                }
                else {
                    ipcRenderer.send("av_drinks_abrechnungen:store", currentAbrechnungID, drinkID, 0);
                }
            }
        }

        for( ; i < rows.length; ++i ) {
            /* If the editable span in the ith row does contain a valid number: write into the database*/
            if (rows[i].children.item(amountIndex).className !== "avAbrechnungAussenCategory" &&
                rows[i].children.item(amountIndex).className !== "avAbrechnungInnenCategory") {
                let amount = parseInt(rows[i].children.item(amountIndex).children.item(0).textContent);
                /* Extract the drinkID from the row where an amount has been specified. */
                let snackString = rows[i].children.item(0).textContent;
                snackString = snackString.substring(1, snackString.length );
                let snackID = parseInt ( snackString );
                if (!isNaN(amount)) {
                    /* Request the storage of the data in the database of the system.*/
                    ipcRenderer.send("av_snacks_abrechnungen:store", currentAbrechnungID,snackID,amount);
                }
                else {
                    ipcRenderer.send("av_snacks_abrechnungen:store", currentAbrechnungID, snackID, 0);
                }
            }
        }
    }
}

/* Reload the page after successfully inserting the necessary data into the database.*/
ipcRenderer.on("av_verkauf_abrechnungen:confirm_abrechnung_creation", function(e, data ) {
    currentAbrechnungID = data[0]["MAX(av_abrechnung_id)"];
    /* Now update the amounts of all the drinks, that belong to the currentAbrechnungID, in the database */

    /* Now we have to delete all the entries in the av_drinks database table that are associated
      * with this abrechnung since it could be the case that the abrechnung has been opened in order
      * to update it, so that an update of all the drink amounts would be necessary. */
    ipcRenderer.send ( "av_drinks_abrechnungen:delete", currentAbrechnungID);
    if ( confirm("Möchtest du die Abrechnung fertigstellen?") ) {
        location.reload();
    }
});

/* Once the deletion of hypothetically existing av_drinks entries with the current av_abrechnung_id has been completed,
* one can take care of the storage of the actual amounts of every product inside the database table, so that the most
* recent data will be stored. */
ipcRenderer.on("av_drinks_abrechnungen:deletion_complete", function(e) {
    getDrinkAmounts();
});

/* Once an already existing abrechnung has been successfully fetched from the database system, one has to take care
* that all the html elements on the page will be filled with the according content properly. */
ipcRenderer.on( "av_verkauf_abrechnungen:deliver_abrechnung", function(e, abrechnung) {

    /* Load the amounts of the counted coins and bank notes into the corresponding html elements.*/
    for ( let i = 0; i < moneyCounts.length; ++i ) {
        if ( i === 0 ) {
            moneyCounts.item(i).textContent = abrechnung[0]["money_count_100"];
        }
        else if ( i === 1 ) {
            moneyCounts.item(i).textContent = abrechnung[0]["money_count_50"];
        }
        else if ( i === 2 ) {
            moneyCounts.item(i).textContent = abrechnung[0]["money_count_20"];
        }
        else if ( i === 3 ) {
            moneyCounts.item(i).textContent = abrechnung[0]["money_count_10"];
        }
        else if ( i === 4 ) {
            moneyCounts.item(i).textContent = abrechnung[0]["money_count_5"];
        }
        else if ( i === 5 ) {
            moneyCounts.item(i).textContent = abrechnung[0]["money_count_2"];
        }
        else if ( i === 6 ) {
            moneyCounts.item(i).textContent = abrechnung[0]["money_count_1"];
        }
        else if ( i === 7 ) {
            moneyCounts.item(i).textContent = abrechnung[0]["money_count_05"];
        }
        else if ( i === 8 ) {
            moneyCounts.item(i).textContent = abrechnung[0]["money_count_02"];
        }
        else if ( i === 9 ) {
            moneyCounts.item(i).textContent = abrechnung[0]["money_count_01"];
        }
        else if ( i === 10 ) {
            moneyCounts.item(i).textContent = abrechnung[0]["money_count_005"];
        }
        else if ( i === 11 ) {
            moneyCounts.item(i).textContent = abrechnung[0]["money_count_002"];
        }
        else if ( i === 12 ) {
            moneyCounts.item(i).textContent = abrechnung[0]["money_count_001"];
        }
    }

    let filter = new Map ( );
    avDb.categoryIndex = 0;
    /* First, clear the tables. */
    avDb.removeTableRows(tableInnen, tableAussen);

    /* Second, add the drinks to the table representing the outside of the TED*/

    for ( let i = 0; i < avDb.drinkOuterCategories.length; ++i ) {
        filter.set(avDb.typeColumnName, avDb.drinkOuterCategories[i]);
        ipcRenderer.send("av_drinks_abrechnungen:deliver_drink_amounts", currentAbrechnungID, jsonMapModule.strMapToJson(filter));
        filter.delete(avDb.typeColumnName);
    }

    /* Now request the delivery of the snacks from the database to the frontend of the app.*/
    ipcRenderer.send("av_snacks_abrechnungen:deliver_snack_amounts", currentAbrechnungID);
});

/* Once the av_verkauf_drinks have been delivered, add them to the corresponding tables, depending on the current
* categoryIndex*/
ipcRenderer.on("av_verkauf_drinks:update", function(e, data) {
    if ( avDb.categoryIndex <= 4 ) {
        avDb.addItems(avDb.MODE.ABRECHNUNG_DRINKS_OUTER, tableAussen, tableInnen, data );
    }
    else {
        avDb.addItems(avDb.MODE.ABRECHNUNG_DRINKS_INNER, tableAussen, tableInnen, data );
    }
});

/* Once the snacks have been delivered, add them to the table as well.
* Do also request the delivery of the drinks that are supposed to go into the table inside of the TED. */
ipcRenderer.on("av_verkauf_snacks:update", function(e, data) {

    let filter = new Map();

    avDb.addItems(avDb.MODE.ABRECHNUNG_SNACKS_OUTER, tableAussen, tableInnen, data);
    for ( let i = 0; i < avDb.drinkInnerCategories.length; ++i ) {
        filter.set(avDb.typeColumnName, avDb.drinkInnerCategories[i]);
        ipcRenderer.send("av_drinks_abrechnungen:deliver_drink_amounts", currentAbrechnungID, jsonMapModule.strMapToJson(filter));
        filter.delete(avDb.typeColumnName);
    }
});
