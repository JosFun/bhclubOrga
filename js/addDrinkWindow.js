const electron = require('electron');
const {ipcRenderer} = electron;

/**
 * The number of columns that have to be specified for each drink
 * @type {number}
 * */
const DRINK_COLUMNS = 16;
/**
 * The number of columns that have to be specified for each snack
 * @type {number}
 */
const SNACK_COLUMNS = 8;

/* Ask the main process to send the id for the next drink that is to be added to the system. */
ipcRenderer.send('drinks:nextID');
ipcRenderer.send('snacks:nextID');

/* Ask the main process to send the most recent data in the database to this renderer process */
ipcRenderer.send('drinks:update');
ipcRenderer.send('snacks:update');

const drinkForm = document.querySelector('#drinkForm');
drinkForm.addEventListener('submit', submitDrinkForm);

const snackForm = document.querySelector('#snackForm');
snackForm.addEventListener('submit', submitSnackForm);

function submitDrinkForm(e){
    e.preventDefault();
    const columnInfo = new Array ( DRINK_COLUMNS );
    {
        columnInfo[0] = document.querySelector('#drink').value;
        columnInfo[1] = document.querySelector('#bottleSize').value;
        columnInfo[2] = document.querySelector('#costBottle').value;
        columnInfo[3] = document.querySelector('#agentName').value;
        columnInfo[4] = parseFloat(document.getElementById('newInternalPrice').textContent);
        columnInfo[5] = document.querySelector('#portionSize').value;
        columnInfo[6] = document.querySelector('#externalAddition').value;
        columnInfo[7] = parseFloat(document.getElementById('calcPricePortion').textContent);
        columnInfo[8] = parseFloat(document.getElementById('externalBottle').textContent);
        columnInfo[9] = document.querySelector('#bottleWeight').value;
        columnInfo[10] = document.querySelector('#bottleDeposit').value;
        columnInfo[11] = document.getElementById('abrechnung').checked;
        columnInfo[12] = document.getElementById("skListe").checked;
        columnInfo[13] = document.getElementById("avVerkauf").checked;
        columnInfo[14] = document.getElementById("bierKarte").checked;
        columnInfo[15] = document.getElementById("barKarte").checked;
    }

    for ( let i = 0; i < DRINK_COLUMNS; ++i ) {
        if ( columnInfo [ i ] == null ) {
            console.log("You have to specify values for all the necessary fields if you want to input a new drink.");
            return;
        }
    }

     //send newly added drink to main.js
    ipcRenderer.send('drink:add', columnInfo);
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
        if ( columnInfo[i] == null ) {
            console.log("You have to specify values for all the necessary columns if you want to input a new snack.");
            return;
        }
    }

    //send newly added snack to main.js, i.e. the main process of the electron application
    ipcRenderer.send('snack:add', columnInfo);
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

    for ( let k = 0; k < fields.length; ++k) {
        /* Create a new row in the table */
        const tr = document.createElement('tr');

        /* Create the columns for every property of each drink plus its id. */
        const tds = new Array(DRINK_COLUMNS + 1);

        for (let i = 0; i < DRINK_COLUMNS + 1; ++i) {
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

                ipcRenderer.send('drinks:alter',id, "drink_name", newName);
            });
            tr.appendChild(tds[1]);


            tds[2].appendChild(document.createTextNode(fields[0][k]["bottle_size"] + "l"));
            tds[2].addEventListener('focusout', function(e) {
                e.preventDefault();

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                let strVal = tds[2].textContent;
                /* Parsing to float does also work if units are specified within the field */
                let bottleSize = parseFloat(strVal);

                ipcRenderer.send('drinks:alter',id, "bottle_size", bottleSize);

            });
            tr.appendChild(tds[2]);

            tds[3].appendChild(document.createTextNode(fields[0][k]["bottle_cost"] + "€"));
            tds[3].addEventListener('input', function(e) {
                e.preventDefault();

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                let bottleCost = parseFloat(tds[3].textContent);

                /* Now the internal price has to be checked */
                let bottleInternal = parseFloat(tds[5].textContent);
                /* Test whether or not the internal price is high enough to account for the VAT and the loss of deposit*/
                if ( bottleInternal < 1.19 * bottleCost + parseFloat(tds[11].textContent) ) {
                    tds[5].style.color = "red";
                }
                else {
                    tds[5].style.color = "green";
                }

                ipcRenderer.send('drinks:alter', id, "bottle_cost", bottleCost);
            });
            tr.appendChild(tds[3]);

            tds[4].appendChild(document.createTextNode(fields[0][k]["trader"]));
            tds[4].addEventListener('input', function(e) {
                e.preventDefault();

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                let trader = tds[4].textContent;

                ipcRenderer.send('drinks:alter', id, "trader", trader);
            });
            tr.appendChild(tds[4]);

            tds[5].appendChild(document.createTextNode(fields[0][k]["internal_price"] + "€"));
            tds[5].addEventListener('input', function(e) {
                e.preventDefault();

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                let bottleInternal = parseFloat(tds[5].textContent);

                /* Test whether or not the internal price is high enough to account for the VAT and the loss of deposit*/
                if ( bottleInternal < 1.19 * parseFloat(tds[3].textContent) + parseFloat(tds[11].textContent) ) {
                    tds[5].style.color = "red";
                }
                else {
                    tds[5].style.color = "green";
                }

                ipcRenderer.send('drinks:alter', id, "internal_price", bottleInternal);
            });
            tr.appendChild(tds[5]);

            tds[6].appendChild(document.createTextNode(fields[0][k]["portion_size"] + "l"));
            /* Recalculate the price for one portion and one bottle if the external addition gets changed.*/
            tds[6].addEventListener('input', function(e) {
                e.preventDefault();

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                let portion = parseFloat(tds[6].textContent);
                let bottleCost = parseFloat(tds[3].textContent);
                let externalAddition = parseFloat(tds[7].textContent);
                let bottleSize = parseFloat(tds[2].textContent);
                let portionSize = parseFloat(tds[6].textContent);

                /* Apply the correct formula to calculate the price for one portion of the drink. */
                let portionPrice = (( bottleCost + externalAddition * bottleSize ) * 1.19 * 1.1)/(bottleSize / portionSize);
                portionPrice = Math.ceil ( 100 * portionPrice ) / 100;

                let bottlePrice = (Math.ceil(100 * portionPrice * bottleSize / portionSize) / 100);

                if ( !isNaN(externalAddition)){
                    ipcRenderer.send("drinks:alter", id, "external_addition", externalAddition);
                }

                if ( !isNaN(portionPrice)) {
                    tds[8].textContent = portionPrice.toString() + "€";
                    ipcRenderer.send("drinks:alter", id, "portion_price", portionPrice);
                }
                if ( !isNaN(bottlePrice)) {
                    tds[9].textContent = bottlePrice.toString() + "€";
                    ipcRenderer.send("drinks:alter", id, "external_price_bottle", bottlePrice);
                }
            });
            tr.appendChild(tds[6]);

            tds[7].appendChild(document.createTextNode(fields[0][k]["external_addition"] + "€"));
            /* Recalculate the price for one portion and one bottle if the external addition gets changed.*/
            tds[7].addEventListener('input', function(e) {
                e.preventDefault();

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                let portion = parseFloat(tds[6].textContent);
                let bottleCost = parseFloat(tds[3].textContent);
                let externalAddition = parseFloat(tds[7].textContent);
                let bottleSize = parseFloat(tds[2].textContent);
                let portionSize = parseFloat(tds[6].textContent);

                /* Apply the correct formula to calculate the price for one portion of the drink. */
                let portionPrice = (( bottleCost + externalAddition * bottleSize ) * 1.19 * 1.1)/(bottleSize / portionSize);
                portionPrice = Math.ceil ( 100 * portionPrice ) / 100;

                if ( !isNaN(externalAddition)){
                    ipcRenderer.send("drinks:alter", id, "external_addition", externalAddition);
                }

                let bottlePrice = (Math.ceil(100 * portionPrice * bottleSize / portionSize) / 100);
                if ( !isNaN(portionPrice)) {
                    tds[8].textContent = portionPrice.toString() + "€";
                    ipcRenderer.send("drinks:alter", id, "portion_price", portionPrice);
                }
                if ( !isNaN(bottlePrice)) {
                    tds[9].textContent = bottlePrice.toString() + "€";
                    ipcRenderer.send("drinks:alter", id, "external_price_bottle", bottlePrice);
                }
            });
            tr.appendChild(tds[7]);

            tds[8].appendChild(document.createTextNode(fields[0][k]["portion_price"] + "€"));
            tds[8].contentEditable = "false";
            tr.appendChild(tds[8]);

            tds[9].appendChild(document.createTextNode(fields[0][k]["external_price_bottle"] + "€"));
            /* The external price for a bottle is being calculated and therefore not editable at all.*/
            tds[9].contentEditable = "false";
            tr.appendChild(tds[9]);

            tds[10].appendChild(document.createTextNode(fields[0][k]["weight_bottle"] + "g"));
            tds[10].addEventListener('focusout', function(e) {
                e.preventDefault();

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                let weight = parseFloat(tds[10].textContent);

                ipcRenderer.send("drinks:alter", id, "weight_bottle", weight);
            });
            tr.appendChild(tds[10]);

            tds[11].appendChild(document.createTextNode(fields[0][k]["deposit_bottle"] + "€"));
            tds[11].addEventListener('focusout', function(e) {
                e.preventDefault();

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                let deposit = parseFloat(tds[11].textContent);

                ipcRenderer.send("drinks:alter", id, "deposit_bottle", deposit);
            });
            tr.appendChild(tds[11]);

            tds[12].appendChild(createCheckBox(fields[0][k]["skListe"],"drinkSKBox"));
            tds[12].addEventListener('change', function(e) {
                e.preventDefault();

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                /* Get a reference to the checkbox that has just been created. */
                let sk = document.getElementById("drinkSKBox").checked;

                console.log( "SK " + sk);

                ipcRenderer.send("drinks:alter", id, "skListe", sk);
            });
            tr.appendChild(tds[12]);

            tds[13].appendChild(createCheckBox(fields[0][k]["avVerkauf"],"drinkAVBox"));
            tds[13].addEventListener('change', function(e) {
                e.preventDefault();

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                let av = document.getElementById("drinkAVBox").checked;

                ipcRenderer.send("drinks:alter", id, "avVerkauf", av);
            });
            tr.appendChild(tds[13]);

            tds[14].appendChild(createCheckBox(fields[0][k]["bierKarte"],"drinkBierBox"));
            tds[14].addEventListener('change', function(e) {
                e.preventDefault();

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                let bier = document.getElementById("drinkBierBox").checked;

                ipcRenderer.send("drinks:alter", id, "bierKarte", bier);
            });
            tr.appendChild(tds[14]);

            tds[15].appendChild(createCheckBox(fields[0][k]["barKarte"],"drinkBarBox"));
            tds[15].addEventListener('change', function(e) {
                e.preventDefault();

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                let bar = document.getElementById("drinkBarBox").checked;

                ipcRenderer.send("drinks:alter", id, "barKarte", bar);
            });
            tr.appendChild(tds[15]);

            tds[16].appendChild(createCheckBox(fields[0][k]["abrechnung"],"drinkAbrechnungBox"));
            tds[16].addEventListener('change', function(e) {
                e.preventDefault();

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                let abrechnung = document.getElementById("drinkAbrechnungBox").checked;

                ipcRenderer.send("drinks:alter", id, "abrechnung", abrechnung);
            });
            tr.appendChild(tds[16]);
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

    for ( let k = 0; k < fields[0].length; ++k) {
        /* Create a new row in the table */
        const tr = document.createElement('tr');

        /* Create the columns for every property of each drink plus its id. */
        const tds = new Array(SNACK_COLUMNS + 1);

        for ( let i = 0; i < SNACK_COLUMNS + 1; ++i ) {
            tds[i] = document.createElement('td');
            tds[i].contentEditable = 'true';
        }

        {
            tds[0].appendChild(document.createTextNode("#" + fields[0][k]["snack_id"]));
            tr.appendChild(tds[0]);

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

            tds[2].appendChild(document.createTextNode(fields[0][k]["snack_cost"]));
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

            tds[3].appendChild(document.createTextNode(fields[0][k]["snack_price"]));
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
            tds[4].addEventListener('change', function(e) {
               e.preventDefault();

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                let sk = document.getElementById("skListe").checked;

                ipcRenderer.send("snacks:alter", id, "skListe", sk);


            });

            tds[5].appendChild(createCheckBox(fields[0][k]["avVerkauf"] == 1, "avSnackBox"));
            tr.appendChild(tds[5]);
            tds[5].addEventListener('change', function(e) {
                e.preventDefault();

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                let av = document.getElementById("avVerkauf").checked;

                ipcRenderer.send("snacks:alter", id, "avVerkauf", av );
            });

            tds[6].appendChild(createCheckBox(fields[0][k]["bierKarte"] == 1, "bierSnackBox"));
            tr.appendChild(tds[6]);
            tds[6].addEventListener('change', function(e) {
                e.preventDefault();

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                let bier = document.getElementById("bierKarte").checked;

                ipcRenderer.send("snacks:alter", id, "bierKarte", bier);
            });

            tds[7].appendChild(createCheckBox(fields[0][k]["barKarte"] == 1, "barSnackBox"));
            tr.appendChild(tds[7]);
            tds[7].addEventListener('change', function(e) {
                e.preventDefault();

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                let bar = document.getElementById("barKarte").checked;

                ipcRenderer.send( "snacks:alter", id, "barKarte", bar );
            });
            tds[8].appendChild(createCheckBox(fields[0][k]["abrechnung"] == 1, "abrechnungSnackBox"));
            tr.appendChild(tds[8]);
            tds[8].addEventListener('change', function(e) {
                e.preventDefault();

                /* Extract the id of the current element from the table by stripping of the preceding # from the actual id */
                let idString = tds[0].textContent;
                idString = idString.slice(1,idString.length);
                let id = parseInt ( idString );

                let abrechnung = document.getElementById("abrechnungSnackBox").checked;

                ipcRenderer.send("snacks:alter", id, "abrechnung", abrechnung );
            })

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
    document.getElementById("nextSnackID").textContent = "#" + newID.toString();
});

ipcRenderer.on("drinks:nextID", function(e, nextID) {
    let newID = 1;
    if ( nextID [ 0 ] ["max(drink_id)"] != null ) {
        newID = nextID [ 0 ] ["max(drink_id)"] + 1;
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
})

/**
 * Calculate the price for one portion of the drink.
 * Applied formula: price = ((bottleCost + 17€ * bottleSize) * 1.19 * 1.1)/(bottleSize * portionSize)
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
    portionPrice = Math.ceil ( 100 * portionPrice ) / 100;

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