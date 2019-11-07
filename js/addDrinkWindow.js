const electron = require('electron');
const {ipcRenderer} = electron;
const List = require("collections/list");
const jsonMapModule = require("../js/jsonMap");
/**
 * The number of columns that have to be specified for each drink
 * @type {number}
 * */
const DRINK_COLUMNS = 17;
/**
 * The number of columns that have to be specified for each snack
 * @type {number}
 */
const SNACK_COLUMNS = 8;

/**
 * The Maps that are meant to store the current filter for drink selection.
 * @type {Map<string, string>}
 */
let drinkFilter = new Map();
/**
 * The Maps that are meant to store the current filter for snack selection.
 * @type {Map<string, string>}
 */
let snackFilter = new Map();
/**
 * The Map that is meant to store the current order for drink selection.
 * @type {Map<string, string>}
 */
let drinkOrder = new Map();

/**
 * The Map that is meant to store the current order for snack selection.
 * @type {Map<string, string>}
 */
let snackOrder = new Map();

/* Ask the main process to send the id for the next drink that is to be added to the system. */
ipcRenderer.send('drinks:nextID');
ipcRenderer.send('snacks:nextID');

/* Ask the main process to send the most recent data in the database to this renderer process */
ipcRenderer.send('drinks:update', jsonMapModule.strMapToJson(drinkFilter), jsonMapModule.strMapToJson(drinkOrder));
ipcRenderer.send('snacks:update', jsonMapModule.strMapToJson(snackFilter), jsonMapModule.strMapToJson(snackOrder));

const drinkForm = document.querySelector('#drinkForm');
drinkForm.addEventListener('submit', submitDrinkForm);

const snackForm = document.querySelector('#snackForm');
snackForm.addEventListener('submit', submitSnackForm);

/**
 * Clear the fields that are used to input new drinks into the database
 */
function clearDrinkFields ( ) {
    let inputFields = document.getElementsByClassName("drinkInput");
    for ( let i = 0; i < inputFields.length; ++i ) {
        inputFields.item(i).innerHTML = ""
    }

    let checkFields = document.getElementsByClassName("drinkCheckInput");
    for ( let i = 0; i < checkFields.length; ++i ) {
        checkFields.item(i).setAttribute("checked", "true");
    }
}

/**
 * Clear the fields that are used to input new snack into the database
 */
function clearSnackFields ( ) {
    let snackFields = document.getElementsByClassName("snackInput");
    for ( let i = 0; i < snackFields.length; ++i ) {
        snackFields.item(i).textContent = "";
    }
}

function submitDrinkForm(e){
    e.preventDefault();
    const columnInfo = new Array ( DRINK_COLUMNS );
    {
        columnInfo[0] = document.querySelector('#drink').value;
        columnInfo[1] = document.querySelector('#drinkType').value;
        columnInfo[2] = document.querySelector('#bottleSize').value;
        columnInfo[3] = document.querySelector('#costBottle').value;
        columnInfo[4] = document.querySelector('#agentName').value;
        columnInfo[5] = parseFloat(document.getElementById('newInternalPrice').textContent);
        columnInfo[6] = document.querySelector('#portionSize').value;
        columnInfo[7] = document.querySelector('#externalAddition').value;
        columnInfo[8] = parseFloat(document.getElementById('calcPricePortion').textContent);
        columnInfo[9] = parseFloat(document.getElementById('externalBottle').textContent);
        columnInfo[10] = document.querySelector('#bottleWeight').value;
        columnInfo[11] = document.querySelector('#bottleDeposit').value;
        columnInfo[12] = document.getElementById('abrechnung').checked;
        columnInfo[13] = document.getElementById("skListe").checked;
        columnInfo[14] = document.getElementById("avVerkauf").checked;
        columnInfo[15] = document.getElementById("bierKarte").checked;
        columnInfo[16] = document.getElementById("barKarte").checked;
    }


    for ( let i = 0; i < DRINK_COLUMNS; ++i ) {
        if ( columnInfo [ i ] == null || columnInfo[i].length === 0 ) {
            alert ("You have to specify values for all the necessary fields if you want to input a new drink.");
            return;
        }
    }

    /*
    Send newly added drink to main.js
    Do also append the drinkFilter, so that after the adding process the current filter is still active
     */
    ipcRenderer.send('drink:add', columnInfo, jsonMapModule.strMapToJson(drinkFilter), jsonMapModule.strMapToJson(drinkOrder));
    /*
    Request the next ID from the database
     */
    ipcRenderer.send('drinks:nextID');
}

function submitSnackForm (e){
    e.preventDefault();
    const columnInfo = new Array ( SNACK_COLUMNS );
    {
        columnInfo[0] = document.querySelector('#snackName').value;
        columnInfo[1] = document.querySelector('#snackPrice').value;
        columnInfo[2] = document.querySelector( '#snackSellPrice' ).value;
        columnInfo[3] = document.getElementById("snack_sk").checked;
        columnInfo[4] = document.getElementById("snack_av").checked;
        columnInfo[5] = document.getElementById("snack_bier").checked;
        columnInfo[6] = document.getElementById("snack_bar").checked;
        columnInfo[7] = document.getElementById("snack_abrechnung").checked;
    }

    for ( let i = 0; i < SNACK_COLUMNS; ++i ) {
        if ( columnInfo[i] == null || columnInfo[i].length === 0 ) {
            alert ("You have to specify values for all the necessary fields if you want to input a new snack.");
            return;
        }
    }

    //send newly added snack to main.js, i.e. the main process of the electron application
    ipcRenderer.send('snack:add', columnInfo, jsonMapModule.strMapToJson(snackFilter), jsonMapModule.strMapToJson(snackOrder));
    ipcRenderer.send('snacks:nextID');
}

/**
 * Dynamically creates a checkbox that can be added to any other kind of html element
 * @return the checkbox that has been created
 */
function createCheckBox ( val, id_nmbr ) {
    let checkBox = document.createElement('input');
    with (checkBox){
        type = "checkbox";
        /* Try to set the checkbox to a possibly passed boolean value. */
        if ( val==1 )
        {
            checked = true;
        }
        id = id_nmbr;
    }
    return checkBox;
}

/**
 * Updates the drink data that is to be displayed within the drink table
 * @param fields - An 2D array that contains all the rows and columns of the drinkTable
 */
function updateDrinkData ( ...fields ) {

    const table = document.querySelector('#drinkTable');

    /* Remove all drinks that currently get displayed by removing all children of the table */
    while ( table.childElementCount > 1) {
        table.removeChild(table.childNodes[table.childNodes.length - 1 ]);
    }

    for ( let k = 0; k < fields[0].length; ++k) {
        /* Create a new row in the table */
        const tr = document.createElement('tr');

        /* Create the columns for every property of each drink plus its id. */
        const tds = new Array(DRINK_COLUMNS + 2);

        for (let i = 0; i < DRINK_COLUMNS + 2; ++i) {
            tds[i] = document.createElement('td');
            tds[i].contentEditable = 'true';
        }

        {
            tds[0].appendChild(document.createTextNode("#" + fields[0][k]["drink_id"]));
            /* Of course the id should not be editable */
            tds[0].contentEditable = 'false';
            tr.appendChild(tds[0]);

            tds[1].appendChild(document.createTextNode(fields[0][k]["drink_name"]));
            tds[1].addEventListener('input', function(e) {
                e.preventDefault();

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                let newName = tds[1].textContent;

                if ( newName.toString().length !== 0 ) {
                    ipcRenderer.send('drinks:alter',id, "drink_name", newName);
                }
            });
            tr.appendChild(tds[1]);

            tds[2].appendChild(document.createTextNode(fields[0][k]["drink_type"]));
            tds[2].addEventListener('focusout', function(e) {
               e.preventDefault();

               let idString = tds[0].textContent;
               idString = idString.slice(1, idString.length);
               let id = parseInt( idString );

               let drinkType = tds[2].textContent;
               if ( drinkType.toString().length !== 0 ) {
                   ipcRenderer.send('drinks:alter',id, "drink_type", drinkType);
               }
            });
            tr.appendChild(tds[2]);


            tds[3].appendChild(document.createTextNode(fields[0][k]["bottle_size"].toFixed(2) + "l"));
            tds[3].addEventListener('focusout', function(e) {
                e.preventDefault();

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                let strVal = tds[3].textContent;
                /* Parsing to float does also work if units are specified within the field */
                let bottleSize = parseFloat(strVal);

                if ( !isNaN(bottleSize) ) {
                    ipcRenderer.send('drinks:alter',id, "bottle_size", bottleSize);
                }

            });
            tr.appendChild(tds[3]);

            tds[4].appendChild(document.createTextNode(fields[0][k]["bottle_cost"].toFixed(2) + "€"));
            tds[4].addEventListener('input', function(e) {
                e.preventDefault();

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                let bottleCost = parseFloat(tds[4].textContent);

                /* Recalculate the new internal price for a bottle*/
                if ( !isNaN(bottleCost)) {
                    let newPrice = Math.ceil ( 10 * ( bottleCost * 1.19 + parseFloat(tds[12].textContent))) / 10;
                    tds[6].textContent = newPrice.toFixed(2) + "€";
                    ipcRenderer.send("drinks:alter", id, "internal_price", newPrice );
                }

                let externalAddition = parseFloat(tds[8].textContent);
                let bottleSize = parseFloat(tds[3].textContent);
                let portionSize = parseFloat(tds[7].textContent);

                /* Apply the correct formula to calculate the price for one portion of the drink. */
                let portionPrice = (( bottleCost + externalAddition * bottleSize ) * 1.19 * 1.1)/(bottleSize / portionSize);
                portionPrice = Math.ceil ( 10 * portionPrice ) / 10;

                if ( !isNaN(externalAddition)){
                    ipcRenderer.send("drinks:alter", id, "external_addition", externalAddition);
                }

                let bottlePrice = (Math.ceil(100 * portionPrice * bottleSize / portionSize) / 100);
                if ( !isNaN(portionPrice)) {
                    tds[9].textContent = portionPrice.toFixed(2) + "€";
                    ipcRenderer.send("drinks:alter", id, "portion_price", portionPrice);
                }
                if ( !isNaN(bottlePrice)) {
                    tds[10].textContent = bottlePrice.toFixed(2) + "€";
                    ipcRenderer.send("drinks:alter", id, "external_price_bottle", bottlePrice);
                }

                if ( !isNaN(bottleCost)) {
                    ipcRenderer.send('drinks:alter', id, "bottle_cost", bottleCost);
                }
            });
            tr.appendChild(tds[4]);

            tds[5].appendChild(document.createTextNode(fields[0][k]["trader"]));
            tds[5].addEventListener('input', function(e) {
                e.preventDefault();

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                let trader = tds[4].textContent;

                if ( !isNaN(trader)) {
                    ipcRenderer.send('drinks:alter', id, "trader", trader);
                }
            });
            tr.appendChild(tds[5]);

            tds[6].appendChild(document.createTextNode(fields[0][k]["internal_price"].toFixed(2) + "€"));
            tds[6].addEventListener('input', function(e) {
                e.preventDefault();

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                let bottleInternal = parseFloat(tds[5].textContent);

                /* Test whether or not the internal price is high enough to account for the VAT and the loss of deposit*/
                if ( bottleInternal < 1.19 * parseFloat(tds[4].textContent) + parseFloat(tds[12].textContent) ) {
                    tds[6].style.color = "red";
                }
                else {
                    tds[6].style.color = "green";
                }

                if ( !isNaN(bottleInternal)) {
                    ipcRenderer.send('drinks:alter', id, "internal_price", bottleInternal);
                }
            });
            tr.appendChild(tds[6]);

            tds[7].appendChild(document.createTextNode(fields[0][k]["portion_size"].toFixed(2) + "l"));
            /* Recalculate the price for one portion and one bottle if the external addition gets changed.*/
            tds[7].addEventListener('input', function(e) {
                e.preventDefault();

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                let bottleCost = parseFloat(tds[4].textContent);
                let externalAddition = parseFloat(tds[8].textContent);
                let bottleSize = parseFloat(tds[3].textContent);
                let portionSize = parseFloat(tds[7].textContent);

                /* Apply the correct formula to calculate the price for one portion of the drink. */
                let portionPrice = (( bottleCost + externalAddition * bottleSize ) * 1.19 * 1.1)/(bottleSize / portionSize);
                portionPrice = Math.ceil ( 10 * portionPrice ) / 10;

                let bottlePrice = (Math.ceil(100 * portionPrice * bottleSize / portionSize) / 100);

                if ( !isNaN(externalAddition)){
                    ipcRenderer.send("drinks:alter", id, "external_addition", externalAddition);
                }

                if ( !isNaN(portionPrice)) {
                    tds[9].textContent = portionPrice.toFixed(2) + "€";
                    ipcRenderer.send("drinks:alter", id, "portion_price", portionPrice);
                }
                if ( !isNaN(bottlePrice)) {
                    tds[10].textContent = bottlePrice.toFixed(2) + "€";
                    ipcRenderer.send("drinks:alter", id, "external_price_bottle", bottlePrice);
                }
            });
            tr.appendChild(tds[7]);

            tds[8].appendChild(document.createTextNode(fields[0][k]["external_addition"].toFixed(2) + "€"));
            /* Recalculate the price for one portion and one bottle if the external addition gets changed.*/
            tds[8].addEventListener('input', function(e) {
                e.preventDefault();

                console.log("hello there");

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                let bottleCost = parseFloat(tds[4].textContent);
                let externalAddition = parseFloat(tds[8].textContent);
                let bottleSize = parseFloat(tds[3].textContent);
                let portionSize = parseFloat(tds[7].textContent);

                /* Apply the correct formula to calculate the price for one portion of the drink. */
                let portionPrice = (( bottleCost + externalAddition * bottleSize ) * 1.19 * 1.1)/(bottleSize / portionSize);
                portionPrice = Math.ceil ( 10 * portionPrice ) / 10;

                if ( !isNaN(externalAddition)){
                    ipcRenderer.send("drinks:alter", id, "external_addition", externalAddition);
                }

                let bottlePrice = (Math.ceil(100 * portionPrice * bottleSize / portionSize) / 100);
                if ( !isNaN(portionPrice)) {
                    tds[9].textContent = portionPrice.toFixed(2) + "€";
                    ipcRenderer.send("drinks:alter", id, "portion_price", portionPrice);
                }
                if ( !isNaN(bottlePrice)) {
                    tds[10].textContent = bottlePrice.toFixed(2) + "€";
                    ipcRenderer.send("drinks:alter", id, "external_price_bottle", bottlePrice);
                }
            });
            tr.appendChild(tds[8]);

            tds[9].appendChild(document.createTextNode(fields[0][k]["portion_price"].toFixed(2) + "€"));
            tds[9].contentEditable = "false";
            tr.appendChild(tds[9]);

            tds[10].appendChild(document.createTextNode(fields[0][k]["external_price_bottle"].toFixed(2) + "€"));
            /* The external price for a bottle is being calculated and therefore not editable at all.*/
            tds[10].contentEditable = "false";
            tr.appendChild(tds[10]);

            tds[11].appendChild(document.createTextNode(fields[0][k]["weight_bottle"] + "g"));
            tds[11].addEventListener('focusout', function(e) {
                e.preventDefault();

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                let weight = parseFloat(tds[11].textContent);

                if ( !isNaN(weight) ) {
                    ipcRenderer.send("drinks:alter", id, "weight_bottle", weight);
                }

            });
            tr.appendChild(tds[11]);

            tds[12].appendChild(document.createTextNode(fields[0][k]["deposit_bottle"].toFixed(2) + "€"));
            tds[12].addEventListener('focusout', function(e) {
                e.preventDefault();

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                let deposit = parseFloat(tds[12].textContent);

                if ( !isNaN(deposit) ) {
                    ipcRenderer.send("drinks:alter", id, "deposit_bottle", deposit);
                }
            });
            tr.appendChild(tds[12]);

            tds[13].appendChild(createCheckBox(fields[0][k]["skListe"],"drinkSKBox" + k));
            tds[13].addEventListener('change', function(e) {
                e.preventDefault();

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                /* Get a reference to the checkbox that has just been created. */
                let sk = document.getElementById("drinkSKBox" + k).checked;

                console.log( "SK " + sk);

                ipcRenderer.send("drinks:alter", id, "skListe", sk);
            });
            tr.appendChild(tds[13]);

            tds[14].appendChild(createCheckBox(fields[0][k]["avVerkauf"],"drinkAVBox" + k));
            tds[14].addEventListener('change', function(e) {
                e.preventDefault();

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                let av = document.getElementById("drinkAVBox" + k).checked;

                console.log(av);

                ipcRenderer.send("drinks:alter", id, "avVerkauf", av);
            });
            tr.appendChild(tds[14]);

            tds[15].appendChild(createCheckBox(fields[0][k]["bierKarte"],"drinkBierBox" + k));
            tds[15].addEventListener('change', function(e) {
                e.preventDefault();

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                let bier = document.getElementById("drinkBierBox" + k).checked;

                ipcRenderer.send("drinks:alter", id, "bierKarte", bier);
            });
            tr.appendChild(tds[15]);

            tds[16].appendChild(createCheckBox(fields[0][k]["barKarte"],"drinkBarBox" + k));
            tds[16].addEventListener('change', function(e) {
                e.preventDefault();

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                let bar = document.getElementById("drinkBarBox" + k).checked;

                ipcRenderer.send("drinks:alter", id, "barKarte", bar);
            });
            tr.appendChild(tds[16]);

            tds[17].appendChild(createCheckBox(fields[0][k]["abrechnung"],"drinkAbrechnungBox" + k));
            tds[17].addEventListener('change', function(e) {
                e.preventDefault();

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                let abrechnung = document.getElementById("drinkAbrechnungBox" + k).checked;

                ipcRenderer.send("drinks:alter", id, "abrechnung", abrechnung);
            });

            tr.appendChild(tds[17]);

            /* Create the button that is used to delete drinks in the database */
            let imageButton = document.createElement("img");
            imageButton.src = "../pics/trash.svg";
            imageButton.width = 70;
            imageButton.height = 35;
            imageButton.class = "imageButton";
            imageButton.cursor = "pointer";
            tds[18].addEventListener("click", function(e) {
                e.preventDefault();

                console.log("Hallo");

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                ipcRenderer.send("drink:delete", id, jsonMapModule.strMapToJson(drinkFilter));
            });

            tds[18].appendChild(imageButton);
            tds[18].contentEditable = 'false';
            tds[18].style.cursor = "pointer";
            tr.appendChild(tds[18]);

        }
        table.appendChild(tr);
    }
}

/**
 * Updates the snack data that is to be displayed within the drink table
 * @param fields - An 2D array that contains all the rows and columns of the drinkTable
 */
function updateSnackData ( ...fields ) {

    const table = document.querySelector( '#snackDataBase');

    /* Remove all snacks that currently get displayed by removing all children of the table */
    while ( table.childElementCount > 1) {
        table.removeChild(table.childNodes[table.childNodes.length - 1 ]);
    }


    for ( let k = 0; k < fields[0].length; ++k) {
        /* Create a new row in the table */
        const tr = document.createElement('tr');

        /* Create the columns for every property of each drink plus its id. */
        const tds = new Array(SNACK_COLUMNS + 2);

        for ( let i = 0; i < SNACK_COLUMNS + 2; ++i ) {
            tds[i] = document.createElement('td');
            tds[i].contentEditable = 'true';
        }

        {
            tds[0].appendChild(document.createTextNode("#" + fields[0][k]["snack_id"]));
            tr.appendChild(tds[0]);
            tds[0].contentEditable = 'false';

            tds[1].appendChild(document.createTextNode(fields[0][k]["snack_name"]));
            tr.appendChild(tds[1]);
            tds[1].addEventListener('focusout', function(e) {
                e.preventDefault();

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                let snackName = parseFloat( tds[1].textContent );
                /* Send an sql update request to the main process*/
                ipcRenderer.send("snacks:alter", id, "snack_name", snackName);

            });

            tds[2].appendChild(document.createTextNode(fields[0][k]["snack_cost"].toFixed(2) + "€"));
            tr.appendChild(tds[2]);
            tds[2].addEventListener('focusout', function(e) {
                e.preventDefault();

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                let snackCost = parseFloat( tds[2].textContent );
                /* Send an sql update request to the main process */
                ipcRenderer.send("snacks:alter", id, "snack_cost", snackCost );
            });

            tds[3].appendChild(document.createTextNode(fields[0][k]["snack_price"].toFixed(2) + "€"));
            tr.appendChild(tds[3]);
            tds[3].addEventListener('focusout', function(e) {
                e.preventDefault();

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                console.log( "Alert" );
                let snackPrice = parseFloat( tds[3].textContent );
                /* Send an sql update request to the main process */
                ipcRenderer.send("snacks:alter", id, "snack_price", snackPrice );
            });

            tds[4].appendChild(createCheckBox(fields[0][k]["skListe"] == 1, "skSnackBox"));
            tr.appendChild(tds[4]);
            tds[4].contentEditable = 'false';
            tds[4].addEventListener('change', function(e) {
               e.preventDefault();

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                let sk = document.getElementById("skListe").checked;

                ipcRenderer.send("snacks:alter", id, "skListe", sk);


            });

            tds[5].appendChild(createCheckBox(fields[0][k]["avVerkauf"] == 1, "avSnackBox" + k));
            tr.appendChild(tds[5]);
            tds[5].contentEditable = 'false';
            tds[5].addEventListener('change', function(e) {
                e.preventDefault();

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                let av = document.getElementById("avVerkauf" + k).checked;

                ipcRenderer.send("snacks:alter", id, "avVerkauf", av );
            });

            tds[6].appendChild(createCheckBox(fields[0][k]["bierKarte"] == 1, "bierSnackBox" + k));
            tr.appendChild(tds[6]);
            tds[6].contentEditable = 'false';
            tds[6].addEventListener('change', function(e) {
                e.preventDefault();

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                let bier = document.getElementById("bierKarte" + k).checked;

                ipcRenderer.send("snacks:alter", id, "bierKarte", bier);
            });

            tds[7].appendChild(createCheckBox(fields[0][k]["barKarte"] == 1, "barSnackBox" + k));
            tr.appendChild(tds[7]);
            tds[7].contentEditable = 'false';
            tds[7].addEventListener('change', function(e) {
                e.preventDefault();

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                let bar = document.getElementById("barKarte" + k).checked;

                ipcRenderer.send( "snacks:alter", id, "barKarte", bar );
            });
            tds[8].appendChild(createCheckBox(fields[0][k]["abrechnung"] == 1, "abrechnungSnackBox" + k));
            tr.appendChild(tds[8]);
            tds[8].contentEditable = 'false';
            tds[8].addEventListener('change', function(e) {
                e.preventDefault();

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                let abrechnung = document.getElementById("abrechnungSnackBox" + k).checked;

                ipcRenderer.send("snacks:alter", id, "abrechnung", abrechnung );
            })

            /* Create the button that is used to delete drinks in the database */
            let imageButton = document.createElement("img");
            imageButton.src = "../pics/trash.svg";
            imageButton.class = "imageButton";
            imageButton.width = 70;
            imageButton.height = 35;
            imageButton.cursor = "pointer";
            tds[9].addEventListener("click", function(e) {
                e.preventDefault();

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                ipcRenderer.send("snack:delete", id, jsonMapModule.strMapToJson(snackFilter));
            });

            tds[9].appendChild(imageButton);
            tds[9].contentEditable = 'false';
            tds[9].style.cursor = "pointer";
            tr.appendChild(tds[9]);

        }
        table.appendChild(tr);
    }
}


/* Once the addDrinkWindow gets sent new data about snacks and drinks that are to be displayed, display them. */
ipcRenderer.on("snacks:data", function ( e, snackFields) {
    updateSnackData(snackFields);
});

ipcRenderer.on("drinks:data", function (e, drinkFields) {
    updateDrinkData(drinkFields);
});

ipcRenderer.on("snacks:nextID", function(e, nextID) {
    let newID = 1;
    if ( nextID [ 0 ] ["max(snack_id)"] != null ) {
        newID = nextID [ 0 ] [ "max(snack_id)"] + 1;
    }

    const snackInputs = document.getElementsByClassName("snackInput");
    for ( let i = 0; i < snackInputs.length; ++i ) {
        snackInputs.item(i).textContent = "";
        snackInputs.item(i).value = "";
    }

    document.getElementById("nextSnackID").textContent = "#" + newID.toString();
});

ipcRenderer.on("drinks:nextID", function(e, nextID) {
    let newID = 1;
    if ( nextID [ 0 ] ["max(drink_id)"] != null ) {
        newID = nextID [ 0 ] ["max(drink_id)"] + 1;
    }

    const drinkInputs = document.getElementsByClassName("drinkInput");
    for ( let i = 0; i < drinkInputs.length; ++i ) {
       if ( drinkInputs.item(i).id.localeCompare("drinkType") !== 0 && drinkInputs.item(i).id.localeCompare("agentName") !== 0 ) {
            /* Make sure that both the input fields and other items are */
            drinkInputs.item(i).value = "";
            drinkInputs.item(i).textContent = "";
            drinkInputs.item(i).checked = false;
        }
    }
    document.getElementById("nextDrinkID").textContent = "#" + newID.toString();
});

/**
 * Updates the field for the per litre costs of a bottle of the drink that is about to be added to the database.
 */
function costUpdate ( ) {
    let bottleCost = document.querySelector("#costBottle").value;
    let bottleSize = document.querySelector("#bottleSize").value;

    let litreCost = Math.round(100 * bottleCost / parseFloat(bottleSize)) / 100;

    document.getElementById("costLitre").textContent = litreCost.toString() + "€";
}

/* If either the costBottle or the bottleSize input field are changed, the per litre cost of the drink
   is being updated.
*/
document.getElementById("costBottle").addEventListener("change", function(e) {
    e.preventDefault();
    costUpdate();
});

document.getElementById("bottleSize").addEventListener("change", function(e) {
    e.preventDefault();
    costUpdate();
});

document.getElementById("bottleDeposit").addEventListener("change", function(e) {
    e.preventDefault();
    costUpdate();
})

/**
 * Updates the field for the internal profit the club is making with every internal sell.
 */
function internalProfitUpdate ( ) {
    let internalPrice = parseFloat(document.getElementById("newInternalPrice").textContent);
    let bottleCost = parseFloat(document.querySelector("#costBottle").value);

    console.log(internalPrice);
    console.log(bottleCost);
    /* Calculate the profit of the sell */
    let profit = Math.round( 100 * ( internalPrice - bottleCost ) ) / 100;

    document.getElementById("addition").textContent = profit.toString();
    document.getElementById("internalAdditionEuro").style.visibility = "visible";
}

document.getElementById("costBottle").addEventListener("change", function(e) {
    e.preventDefault();
    depositAddition();
    internalProfitUpdate();
});

/**
 * Updates the field for the price of the bottle according to the currently chosen external price for one portion
 * of the product.
 */
function bottlePriceUpdate ( ) {
    let portionPrice = parseFloat(document.getElementById("calcPricePortion").textContent);
    let bottleSize = parseFloat(document.querySelector("#bottleSize").value);
    let portionSize = parseFloat(document.querySelector("#portionSize").value);


    /* Return from the function if either of the values above is NaN*/
    if ( isNaN(portionPrice) || isNaN(bottleSize) || isNaN(portionSize)) {
        return;
    }

    let bottlePrice = Math.round ( 100 * portionPrice  * bottleSize / portionSize) / 100;

    document.getElementById("externalBottle").textContent = bottlePrice.toString( );
    document.getElementById("externalBottleEuro").style.visibility = "visible";
}

/**
 * Add the deposit to the internal price and round up as soon as a value for the deposit has been specified.
 */
function depositAddition ( ) {
    let internalPrice =  Math.round ( parseFloat(document.querySelector('#costBottle').value) * 119 ) / 100;
    let deposit = 0;
    /* If a deposit has been specified: Use that value to round up the internal price that will be applied at the end. */
    if ( document.querySelector("#bottleDeposit").value.length > 0) {
        deposit = parseFloat(document.querySelector("#bottleDeposit").value);
    }

    document.getElementById("internalPrice").textContent = internalPrice.toString();
    document.getElementById("internalEuro").style.visibility = "visible";

    console.log(internalPrice);
    console.log(deposit);

    /* Add the deposit to the current internal price and round up using Math.ceil */
    let newInternalPrice = Math.ceil( 10 * ( internalPrice + deposit ))/10;

    document.getElementById("newInternalPrice").textContent = newInternalPrice.toString( );
    document.getElementById("newInternalEuro").style.visibility = "visible";
}

/* Once the deposit for a bottle of the drink has been changed, the deposit has to be added to the internal price.
*  The internal price has to be updated as well.*/
document.getElementById("bottleDeposit").addEventListener("change", function(e) {
   e.preventDefault();
   depositAddition();
   internalProfitUpdate();
});

/* Once the internal price for a bottle gets changed manually, we have to recalculate the internal profit of the
* bottle. */
document.getElementById("newInternalPrice").addEventListener("input", function(e) {
    e.preventDefault();
    internalProfitUpdate();
});

/**
 * Calculate the price for one portion of the drink.
 * Applied formula: price = ((bottleCost + external addition * bottleSize) * 1.19 * 1.1)/(bottleSize * portionSize)
 */
function calulatePortionPrice ( ) {

    let bottleCost = parseFloat(document.querySelector('#costBottle').value);
    let bottleSize = parseFloat(document.querySelector('#bottleSize').value);
    let portionSize = parseFloat(document.querySelector('#portionSize').value);
    let externalAddition = parseFloat(document.querySelector("#externalAddition").value);

    /* If either of the values above is NaN: Return from the function */
    if ( isNaN(bottleCost) || isNaN(bottleSize) || isNaN((portionSize) || isNaN(externalAddition))) {
        return;
    }
    /* Apply the correct formula to calculate the price for one portion of the drink. */
    let portionPrice = (( bottleCost + externalAddition * bottleSize ) * 1.19 * 1.1)/(bottleSize / portionSize);
    portionPrice = Math.ceil ( 10 * portionPrice ) / 10;

    if( isNaN(portionPrice)) {
        return;
    }

    document.getElementById("calcPricePortion").textContent = portionPrice.toString();
    document.getElementById("calcPricePortionEuro").style.visibility = "visible";
}

document.getElementById("externalAddition").addEventListener("change", function(e) {
    e.preventDefault();
    calulatePortionPrice();
    bottlePriceUpdate();
});

document.getElementById("portionSize").addEventListener("change", function(e) {
    e.preventDefault();
    calulatePortionPrice();
    bottlePriceUpdate();
});

/**
 * Tests wheter or not the specified argument n is a float
 * @param n
 * @returns {boolean}
 */
function isFloat ( n ) {
    return Number(n) === n && n % 1 !== 0;
}

/**
 * This Array stores the column names of the drink table
 * @type {string[]}
 */
let drinkFilterNames = [ "drink_id", "drink_name", "drink_type", "bottle_size", "bottle_cost", "trader", "internal_price", "portion_size",
"external_addition", "portion_price", "external_price_bottle", "weight_bottle", "deposit_bottle"];

/**
 * This Array stores the default texts in the header of the drinkTable
 * @type {string[]}
 */
let drinkHeaderTexts = ["ID", "Getränk", "Typ", "Größe", "Netto Einkauf Flasche", "Händler", "Flasche Intern", "Portion",
    "Aufschlag Liter", "Portion Extern", "Flasche Extern", "Gewicht Flasche", "Pfand Flasche"];

let drinkFilterFields = document.getElementsByClassName("drinkFilterFields");
    for ( let i = 0; i < drinkFilterFields.length; ++i ) {

        drinkFilterFields.item(i).textContent = drinkHeaderTexts[i];

        drinkFilterFields.item(i).addEventListener("click", function(e) {
            if ( !drinkOrder.has(drinkFilterNames[i])) {
                drinkOrder.clear();
                drinkOrder.set(drinkFilterNames[i], "asc");

                console.log(snackOrder);

                ipcRenderer.send("drinks:update", jsonMapModule.strMapToJson(drinkFilter),
                    jsonMapModule.strMapToJson(snackOrder));
            }
            else if ( drinkOrder.get(drinkFilterNames[i]).localeCompare("asc") === 0 ) {
                drinkOrder.set(drinkFilterNames[i], "desc");
                ipcRenderer.send("drinks:update", jsonMapModule.strMapToJson(drinkFilter),
                    jsonMapModule.strMapToJson(snackOrder));
            }
            else {
                drinkOrder.clear();
                ipcRenderer.send("drinks:update", jsonMapModule.strMapToJson(drinkFilter),
                    jsonMapModule.strMapToJson(snackOrder));
            }

        });

        drinkFilterFields.item(i).addEventListener("focusin", function(e) {
            /* If the filterField still has its default value: Set it to be empty, so that it can be edited. */
            if ( drinkFilterFields.item(i).textContent.localeCompare(drinkHeaderTexts[i]) === 0 ) {
                /* Get access to the default header texts of the drinkTable */
                drinkFilterFields.item(i).textContent = "";
            }
        });

        drinkFilterFields.item(i).addEventListener("focusout", function(e) {
           if ( drinkFilterFields.item(i).textContent.length !== 0 && drinkFilterFields.item(i).textContent.localeCompare(drinkHeaderTexts[i] !== 0 )) {
               if ( isFloat(drinkFilterFields.item(i).textContent)){
                    drinkFilter.set(drinkFilterNames[i], parseFloat(drinkFilterFields.item(i).textContent));
               }
               else {
                   drinkFilter.set(drinkFilterNames[i], "%" + drinkFilterFields.item(i).textContent + "%");

               }
               ipcRenderer.send("drinks:update", jsonMapModule.strMapToJson(drinkFilter),
                   jsonMapModule.strMapToJson(snackOrder));
               console.log(drinkFilter);
           }
           else if ( drinkFilterFields.item(i).textContent.length === 0 ) {
               drinkFilterFields.item(i).textContent = drinkHeaderTexts[i];
               if ( drinkFilter.has(drinkFilterNames[i])) {
                   drinkFilter.delete(drinkFilterNames[i]);
                   ipcRenderer.send("drinks:update", jsonMapModule.strMapToJson(drinkFilter),
                       jsonMapModule.strMapToJson(snackOrder));

               }
               console.log("Filter reset");
           }
           else if ( drinkFilterFields.item(i).textContent.localeCompare(drinkHeaderTexts[i]) === 0) {
               if ( drinkFilter.has(drinkFilterNames[i])) {
                   drinkFilter.delete(drinkFilterNames[i]);
                   ipcRenderer.send("drinks:update", jsonMapModule.strMapToJson(drinkFilter),
                       jsonMapModule.strMapToJson(snackOrder));

               }
               console.log("Filter reset");
           }


        });
    }

/**
 * This Array stores the names of the columns of the snackTable
 * @type {string[]}
 */
let snackFilterNames = ["snack_id", "snack_name", "snack_cost", "snack_price"];

/**
 * This Array stores the default texts in the header of the snackTable
 * @type {string[]}
 */
let snackHeaderTexts = ["ID", "Snack", "Einkaufspreis", "Verkaufspreis"];

let snackFilterFields = document.getElementsByClassName("snackFilterFields");
for ( let i = 0; i < snackFilterFields.length; ++i ) {

    snackFilterFields.item(i).textContent = snackHeaderTexts[i];

    snackFilterFields.item(i).addEventListener("click", function(e) {
        if ( !snackOrder.has(snackFilterNames[i])) {
            snackOrder.clear();
            snackOrder.set(snackFilterNames[i], "asc");
            ipcRenderer.send("snacks:update", jsonMapModule.strMapToJson(snackFilter), jsonMapModule.strMapToJson(snackOrder));
        }
        else if ( snackOrder.get(snackFilterNames[i]).localeCompare("asc") === 0 ) {
            snackOrder.set(snackFilterNames[i], "desc");
            ipcRenderer.send("snacks:update", jsonMapModule.strMapToJson(snackFilter), jsonMapModule.strMapToJson(snackOrder));
        }
        else {
            snackOrder.clear();
            ipcRenderer.send("snacks:update", jsonMapModule.strMapToJson(snackFilter), jsonMapModule.strMapToJson(snackOrder));
        }
    });

    snackFilterFields.item(i).addEventListener("focusin", function (e) {
        if ( snackFilterFields.item(i).textContent.localeCompare(snackHeaderTexts[i]) === 0) {
            snackFilterFields.item(i).textContent = "";
        }
    });

    snackFilterFields.item(i).addEventListener("focusout", function(e) {
        if ( snackFilterFields.item(i).textContent.length !== 0 && snackFilterFields.item(i).textContent.localeCompare(snackHeaderTexts[i]) !== 0 ){
            if ( isFloat(snackFilterFields.item(i).textContent)) {
                snackFilter.set(snackFilterNames[i],parseFloat(snackFilterFields.item(i).textContent));
            }
            else {
                snackFilter.set(snackFilterNames[i], "%" + snackFilterFields.item(i).textContent + "%");
            }
            ipcRenderer.send("snacks:update", jsonMapModule.strMapToJson(snackFilter), jsonMapModule.strMapToJson(snackOrder));
            console.log(snackFilter);
        }
        else if ( snackFilterFields.item(i).textContent.length === 0 ) {
            snackFilterFields.item(i).textContent = snackHeaderTexts[i];
            if ( snackFilter.has(snackFilterNames[i])) {
                snackFilter.delete(snackFilterNames[i]);
                ipcRenderer.send("snacks:update", jsonMapModule.strMapToJson(snackFilter), jsonMapModule.strMapToJson(snackOrder));
            }

            console.log("Filter reset");
        }
        else if (snackFilterFields.item(i).textContent.localeCompare(snackHeaderTexts[i]) === 0){
            if ( snackFilter.has(snackFilterNames[i])) {
                snackFilter.delete(snackFilterNames[i]);
                ipcRenderer.send("snacks:update", jsonMapModule.strMapToJson(snackFilter), jsonMapModule.strMapToJson(snackOrder));
            }
            console.log("Filter reset");
        }
    });
}

let sortButtons = document.getElementsByClassName("sortFields");
let buttonStates = new Array(sortButtons.length);

for ( let i = 0; i < sortButtons.length; ++i ) {
    buttonStates[i] = 0;

    sortButtons.item(i).addEventListener("click", function(e) {
        console.log(sortButtons.item(i).src);
        if ( buttonStates[i] === 0) {
            buttonStates[i] = 1;
            sortButtons.item(i).src ="../pics/sort_up.svg";
            resetSortButtons(i);

            drinkOrder.clear();
            drinkOrder.set(drinkFilterNames[i], "asc");

            console.log(drinkOrder);
            ipcRenderer.send("drinks:update",
                jsonMapModule.strMapToJson(drinkFilter), jsonMapModule.strMapToJson(drinkOrder));

        }
        else if ( buttonStates[i] === 1) {
            buttonStates[i] = 2;
            sortButtons.item(i).src = "../pics/sort_down.svg";
            resetSortButtons(i);

            drinkOrder.clear();
            drinkOrder.set(drinkFilterNames[i], "desc");
            ipcRenderer.send("drinks:update",
                jsonMapModule.strMapToJson(drinkFilter), jsonMapModule.strMapToJson(drinkOrder));
        }
        else if ( buttonStates[i] === 2) {
            buttonStates[i] = 0;
            sortButtons.item(i).src = "../pics/no_sort.svg";
            resetSortButtons(i);

            drinkOrder.clear();
            ipcRenderer.send("drinks:update",
                jsonMapModule.strMapToJson(drinkFilter), jsonMapModule.strMapToJson(drinkOrder));
        }
    });
}

/**
 * Reset the state of all the existing sortButtons, except for the passed index
 * @param exceptFor The index that does not need to be reset
 */
function resetSortButtons(exceptFor) {
    for ( let j = 0; j < sortButtons.length; ++j ) {
        if ( j !== exceptFor ) {
            buttonStates[j] = 0;
            sortButtons.item(j).src = "../pics/no_sort.svg";
        }
    }
}

let snackSortButtons = document.getElementsByClassName("snackSortFields");
let snackButtonStates = new Array(snackSortButtons.length);

for ( let i = 0; i < snackSortButtons.length; ++i ) {
    snackButtonStates[i] = 0;

    snackSortButtons.item(i).addEventListener("click", function(e) {
        console.log(snackSortButtons.item(i).src);
        if ( snackButtonStates[i] === 0) {
            snackButtonStates[i] = 1;
            snackSortButtons.item(i).src ="../pics/sort_up.svg";
            resetSnackSortButtons(i);

            snackOrder.clear();
            snackOrder.set(snackFilterNames[i], "asc");
            ipcRenderer.send("snacks:update", jsonMapModule.strMapToJson(snackFilter), jsonMapModule.strMapToJson(snackOrder));
        }
        else if ( snackButtonStates[i] === 1) {
            snackButtonStates[i] = 2;
            snackSortButtons.item(i).src = "../pics/sort_down.svg";
            resetSnackSortButtons(i);

            snackOrder.clear();
            snackOrder.set(snackFilterNames[i], "desc");
            ipcRenderer.send("snacks:update", jsonMapModule.strMapToJson(snackFilter), jsonMapModule.strMapToJson(snackOrder));
        }
        else if ( snackButtonStates[i] === 2) {
            snackButtonStates[i] = 0;
            snackSortButtons.item(i).src = "../pics/no_sort.svg";
            resetSnackSortButtons(i);

            snackOrder.clear();
            ipcRenderer.send("snacks:update", jsonMapModule.strMapToJson(snackFilter), jsonMapModule.strMapToJson(snackOrder));
        }
    });
}

/**
 * Reset the state of all the existing sortButtons, except for the passed index
 * @param exceptFor The index that does not need to be reset
 */
function resetSnackSortButtons(exceptFor) {
    for ( let j = 0; j < snackSortButtons.length; ++j ) {
        if ( j !== exceptFor ) {
            snackButtonStates[j] = 0;
            snackSortButtons.item(j).src = "../pics/no_sort.svg";
        }
    }
}
