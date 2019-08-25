const electron = require('electron');
const {ipcRenderer} = electron;

/**
 * The number of columns that have to be specified for each drink
 * */
const DRINK_COLUMNS = 15;
const SNACK_COLUMNS = 8;

const form = document.querySelector('#drinkForm');
form.addEventListener('submit', submitForm);

function submitDrinkForm(e){
    e.preventDefault();
    const columnInfo = new Array ( DRINK_COLUMNS );
    {
        columnInfo[0] = document.querySelector('#drink').value;
        columnInfo[1] = document.querySelector('#bottleSize').value;
        columnInfo[2] = document.querySelector('#costBottle').value;
        columnInfo[3] = document.querySelector('#costLitre').value;
        columnInfo[4] = document.querySelector('#internalPrice').value;
        columnInfo[5] = document.querySelector('#addition').value;
        columnInfo[6] = document.querySelector('#portionSize').value;
        columnInfo[7] = document.querySelector('#calcPricePortion').value;
        columnInfo[8] = document.querySelector('#roundedPricePortion').value;
        columnInfo[9] = document.querySelector('#externalBottle').value;
        columnInfo[10] = document.querySelector( '#abrechnung').value;
        columnInfo[11] = document.querySelector('#skListe').value;
        columnInfo[12] = document.querySelector('#avVerkauf').value;
        columnInfo[13] = document.querySelector('#bierKarte').value;
        columnInfo[14] = document.querySelector('#barKarte').value;
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
        columnInfo[3] = document.querySelector( '#snack_sk').value;
        columnInfo[4] = document.querySelector( '#snack_av').value;
        columnInfo[5] = document.querySelector( '#snack_bier').value;
        columnInfo[6] = document.querySelector( '#snack_bar').value;
        columnInfo[7] = document.querySelector( '#snack_abrechnung').value;
    }

    //send newly added snack to main.js, i.e. the main process of the electron application
    ipcRenderer.send('snack:add', columnInfo);
}

/**
 * Updates the drink Data that is to be displayed within the drink table
 * @param fields - An 2D array that contains all the rows and columns of the drinkTable
 */
function updateData ( ...fields ) {

    const table = document.querySelector('#drinkTable');

    for ( let k = 0; k < fields.length; ++k) {
        /* Create a new row in the table */
        const tr = document.createElement('tr');

        /* Create the columns for every property of each drink */
        const tds = new Array(DRINK_COLUMNS);

        for (let i = 0; i < DRINK_COLUMNS; ++i) {
            tds[i] = document.createElement('td');
            tds[i].contentEditable = 'true';

            /* The text of the property field */
            const propText = document.createTextNode(columnInfo[i]);
            tds[i].appendChild(propText);
            tr.appendChild(tds[i]);
        }
        table.appendChild(tr);
    }
}