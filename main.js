const { app, BrowserWindow, Menu, ipcMain, webContents } = require('electron');
const url = require('url');
const path = require('path');
const List = require("collections/list");
const jsonMapModule = require("./js/jsonMap");
const fs = require("fs");


process.env.NODE_ENV = 'development';
let sql = require('mysql');

/**
 * The main window of the application
 * */
let win;

/**
 * Create a connection to the mysql database the software is using
 * @type {Connection} The connection to the mysql database
 */
var dbConnection = sql.createConnection({
    host    : 'localhost',
    port    : '3306',
    user    : 'bhdbuser',
    password: "bhc",
    database: 'bhclub',
    }
);

function dataBaseConnect ( ) {
    /* Appliance of error callback mechanism*/
    dbConnection.connect(function (err) {
        if (!err) {
            console.log("Connection with the database has suceeded!");
        } else {
            console.log("Connection could not have been established!");
        }
    });
}

function dataBaseDisconnect ( ) {
    dbConnection.end();
}

function createWindow () {
    // Erstelle das Browser-Fenster.
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
        }
    );

    win.maximize();

   win.loadURL(url.format({
       pathname: path.join(__dirname,'index.html'),
       protocol: 'file',
       slashes: true
   }));

    // Quit app once the main window is closed
    win.on('closed',function(){
        app.quit();
    });

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    Menu.setApplicationMenu(mainMenu);

    /* Build up the connection to the underlying database. */
    dataBaseConnect();

}

/**
 * Minimize the main window
 */
function windowShrink (){
    win.minimize();
}

/**
 * Maximize the main window
 */
function windowExtend (){
    win.maximize();
}

// Create a new main menu template
const mainMenuTemplate = [
    {
        label: 'Print',
        accelerator: process.platform == 'darwin' ? 'Command + P':'Ctrl + P',
        click() {
            win.webContents.printToPDF(
                {
                    marginsType: 0,
                    pageSize: "A4",
                    printBackground: true,
                    printSelectionOnly: true,
                    landscape: false
                },
                function (error, data) {
               if ( error ) throw error;
               fs.writeFile(path.join(__dirname, 'print.pdf'), data, function(e) {
                   if ( e ) throw e;
                   console.log("Written to PDF successfully");
               })
            });
        }
    },
    {
        label: 'Quit',
        click(){
            app.quit();
        }
    }
];


/**
 * Perform a filtered sql select on the table "rohgetraenke" and send the data to the addDrinkWindow
 * @param filter
 */
function selectDrinks ( drinkFilter, drinkOrder ) {
    let sqlSelect = "SELECT * FROM rohgetraenke";
    let valueArray = new Array();

    console.log( drinkOrder );
    console.log(drinkFilter);

    /* Get access to all the values in the map by putting the values of the iterator into a corresponding array. */
    let iterator = drinkFilter.keys();
    let key, i = 0;
    console.log("what up");
    while ( (key = iterator.next().value) !== undefined) {
        console.log(key);
        valueArray[i++] = drinkFilter.get(key);
        console.log(valueArray[i - 1]);
    }

    iterator = drinkFilter.keys();
    if ( drinkFilter != null && drinkFilter.size >= 1 ) {
        let key = iterator.next().value;
        sqlSelect += " where " + key + " like ?";
    }
    console.log(sqlSelect);

    for ( let i = 1; drinkFilter != null && i < drinkFilter.size; ++i ) {
        let key = iterator.next().value;
        sqlSelect += " and " + key + " like ?";
    }

    if ( drinkOrder.size === 1 ) {
        let column = drinkOrder.keys().next().value;
        sqlSelect += " order by " + column + " " + drinkOrder.get(column);
    }

    sqlSelect += ";";

    console.log ( valueArray );

    console.log(sqlSelect);
    dbConnection.query(sqlSelect, valueArray,function( err, result, fields ) {
        if ( err ) throw err;
        /* Send the data of all drinks to all the renderer processes. */
        win.webContents.send("drinks:data", result);
    });
}


/**
 * Perform a sql select on the table "snacks" and send the data to the addDrinkWindow, where they are displayed.
 */
function selectSnacks( snackFilter, snackOrder ) {
    /* Get all the data of all the snacks inside the snack database */
    let sqlSelect = "SELECT * FROM snacks";
    let valueArray = new Array();

    /* Get access to all the values in the map by putting the values of the iterator into a corresponding array. */
    let iterator = snackFilter.keys();
    let key, i = 0;
    while ( (key = iterator.next().value) !== undefined) {
        valueArray[i++] = snackFilter.get(key);
    }

    iterator = snackFilter.keys();

    if ( snackFilter != null && snackFilter.size >= 1 ) {
        let key = iterator.next().value;
        sqlSelect += " where " + key + " like ?";
    }

    for ( let i = 1; snackFilter != null && i < snackFilter.size; ++i ) {
        let key = iterator.next().value;
        sqlSelect += " and " + key + " like ?";
    }

    /* If the user has specified an order for the elements in the snackDataBase */
    if ( snackOrder.size === 1 ) {
        let column = snackOrder.keys().next().value;

        sqlSelect += " order by " + column + " " + snackOrder.get(column);
    }
    sqlSelect +=";";

    dbConnection.query(sqlSelect, valueArray,function ( err, result, fields ) {
        if ( err ) throw err;
        /* Send the data of all the snacks to all the renderer processes. */
        win.webContents.send("snacks:data", result);
    });
}

/**
 * Update a drink in the database by performing a sql update request
 * @param id The id of the drink that is to be updated
 * @param column The property of the drink that is to be updated
 * @param value The new value for the property
 */
function updateDrinks ( id, column, value ) {
    let sqlUpdate = "UPDATE rohgetraenke SET " + column + " = ? where drink_id = ?";
    dbConnection.query(sqlUpdate, [value, id], function( err, results, fields) {
       if ( err ) throw ( err );
       console.log("Drink with id " + id + " has been updated!");
    });
}

/**
 * Update a snack in the database by performing a sql update request
 * @param id The id of the snack that is to be updated
 * @param column The property of the snack that is to be updated
 * @param value The new value for the property
 */
function updateSnacks ( id, column, value ) {
    let sqlUpdate = "UPDATE snacks set " + column + " = ? where snack_id = ?";
    dbConnection.query(sqlUpdate,  [value, id], function( err, results, fields) {
        if ( err ) throw err;
        console.log("Snack with id " + id + " has been updated!");
    });
}

/**
 * Update a drink in the databse by performing a sql delete request
 * @param id The id of the drink that is to be deleted
 */
function deleteDrink ( id ) {
    let sqlDelete = "DELETE FROM rohgetraenke where drink_id = ?";
    dbConnection.query(sqlDelete, [id], function( err, results, fields) {
       if ( err ) throw err;
       console.log("Drink with id " + id + " has been deleted!");
    });
}

/**
 * Update a snack in the database by performing a sql delete request
 * @param id The id of the snack that is to be deleted
 */
function deleteSnack ( id ) {
    let sqlDelete = "DELETE FROM snacks where snack_id = ?";
    dbConnection.query(sqlDelete, [id], function(err, results, fields) {
        if ( err ) throw err;
        console.log("Snack with id  " + id + " has been deleted!");

    })
}

/**
 * Get all the avVerkaufAbrechnungen from the sql database
 */
function getAVVerkaufAbrechnungen ( ) {
    let sqlSelect = "SELECT * FROM av_verkauf;"
    dbConnection.query(sqlSelect, function( err, results, fields) {
        if ( err ) throw err;
        console.log("AV-Abrechnungen have been fetched from the system!");
        win.webContents.send("av_verkauf_abrechnungen:deliver", results);
    })
}

/**
 * Create a new AVVerkaufAbrechnung by inserting a new set of data into the database.
 * Send the id of the new Abrechnung to the renderer process afterwards.
 * @param data
 */
function createNewAVVerkaufAbrechnung ( data ) {
    let sqlInsert = "INSERT INTO av_verkauf (av_abrechnung_datum, money_count_100, money_count_50, money_count_20, " +
        "money_count_10, money_count_5, money_count_2, money_count_1, money_count_05, money_count_02, money_count_01, " +
        "money_count_005, money_count_002, money_count_001) VALUES (?)";
    dbConnection.query(sqlInsert, [data], function( err, result) {
       if ( err ) throw err;
       console.log("New Abrechnung created!");
       /* Get access to the id of the abrechnung that has just been created.*/
       dbConnection.query("SELECT MAX(av_abrechnung_id) from av_verkauf", function(err, id) {
            if ( err ) throw err;
            win.webContents.send("av_verkauf_abrechnungen:confirm_abrechnung_creation", id);

       });
    });
}

/**
 * Delete all the entries in the table av_drinks with the specified id
 * @param abrechnungID The specified id of the av_drinks-entries that are to be deleted.
 */
function deleteAVDrinks ( abrechnungID ) {
    let sqlDelete = "DELETE FROM av_drinks WHERE av_abrechnung_id = ?";
    dbConnection.query(sqlDelete, abrechnungID, function (err, results ) {
        if ( err ) throw err;
        console.log("av_drinks-entries with av_abrechnung_id = " + abrechnungID + " have been deleted from the system.");
        win.webContents.send("av_drinks_abrechnungen:deletion_complete");
    } );
}

function storeAVDrinks ( abrechnungID, drinkID, amount ) {
    let valueArray = [ abrechnungID, drinkID, amount];
    let sqlInsert = "INSERT INTO av_drinks VALUES (?)";
    dbConnection.query(sqlInsert, [valueArray], function(err, results) {
        if ( err ) throw err;
        console.log("av_drink_entry has successfully been inserted into the system!");
    })
}

// Catch newly added drinks
ipcMain.on('drink:add', function(e,drinkInfo, drinkFilter, drinkOrder){
    /*TODO: Perform the sql insertion*/
    let sqlInsert = "INSERT INTO rohgetraenke (drink_name, drink_type, bottle_size, bottle_cost, trader, " +
        "internal_price, portion_size, external_addition, portion_price, external_price_bottle, " +
        "weight_bottle, deposit_bottle, skListe, avVerkauf, bierKarte, barKarte, abrechnung) VALUES (?)";
    dbConnection.query(sqlInsert, [drinkInfo], function ( err, result ) {
        if ( err ) throw err;
        console.log("New drink inserted!");
    } );
    selectDrinks(jsonMapModule.jsonToStrMap(drinkFilter), jsonMapModule.jsonToStrMap(drinkOrder));
});

// Catch newly added snacks
ipcMain.on('snack:add', function(e,snackInfo, snackFilter, snackOrder){
    e.preventDefault();
   /* Perform the sql insertion of the data belonging to the newly added snack */
   let sqlInsert = "INSERT INTO snacks (snack_name, snack_cost, snack_price, skListe, " +
       "avVerkauf, bierKarte, barKarte, abrechnung) VALUES (?)";
   dbConnection.query(sqlInsert, [snackInfo], function( err, result ){
       if ( err ) throw err;
       console.log("New snack inserted!");
   });

    /* Get all the data of all the snacks inside the snack database */
    selectSnacks(jsonMapModule.jsonToStrMap(snackFilter), jsonMapModule.jsonToStrMap(snackOrder));
});

// Catch update requests regarding the visualization of the snack database
ipcMain.on('snacks:update', function(e, snackFilter, snackOrder){
    e.preventDefault();
    selectSnacks(jsonMapModule.jsonToStrMap(snackFilter), jsonMapModule.jsonToStrMap(snackOrder));
});

// Catch update requests regarding the visualization of the drink database
ipcMain.on('drinks:update', function(e, drinkFilter, drinkOrder){
    e.preventDefault();
    selectDrinks(jsonMapModule.jsonToStrMap(drinkFilter), jsonMapModule.jsonToStrMap(drinkOrder));
});

// Catch requests regarding the next id within the snack database
ipcMain.on('snacks:nextID', function(e){
    e.preventDefault();
    let sqlSelect = "SELECT max(snack_id) from snacks";
    dbConnection.query(sqlSelect,function(err, result, fields) {
        if ( err ) throw err;
        win.webContents.send("snacks:nextID", result);
    });
});

// Catch requests regarding the next id within the drink database
ipcMain.on('drinks:nextID', function(e) {
    e.preventDefault();
    let sqlSelect = "SELECT max(drink_id) from rohgetraenke";
    dbConnection.query(sqlSelect, function(err, result, fields) {
        if ( err ) throw ( err );
        win.webContents.send("drinks:nextID", result);
    })
});

// Catch requests regarding the update of a snack with a certain id in the database
ipcMain.on('snacks:alter', function(e, id, column, value) {
    e.preventDefault();
    updateSnacks(id, column, value);
});

// Catch requests regarding the update of a drink with a certain id in the database
ipcMain.on('drinks:alter', function(e, id, column, value) {
   e.preventDefault();
   console.log(id);
   console.log(column);
   console.log(value);
   updateDrinks(id, column, value);
});

// Catch requests regarding the deletion of a snack with a certain id in the database
ipcMain.on('snack:delete', function(e,id,snackFilter) {
    e.preventDefault();
    deleteSnack(id);
    selectSnacks(jsonMapModule.jsonToStrMap(snackFilter));
});

// Catch requests regarding the deletion of a drink with a certain id in the database
ipcMain.on('drink:delete', function(e,id,drinkFilter) {
    e.preventDefault();
    deleteDrink(id);
    selectDrinks(jsonMapModule.jsonToStrMap(drinkFilter));
});

// Catch requests regarding the fetch request of all the av-Verkauf-abrechnungen that exist in the database
ipcMain.on('av_verkauf_abrechnungen:get', function(e) {
    getAVVerkaufAbrechnungen();
    e.preventDefault();
});

ipcMain.on("av_verkauf_abrechnungen:create_abrechnung", function(e, abrechnungData) {
    createNewAVVerkaufAbrechnung(abrechnungData);
});

ipcMain.on("av_drinks_abrechnungen:delete", function (e, abrechnungID){
    deleteAVDrinks(abrechnungID);
});

ipcMain.on("av_drinks_abrechnungen:store", function(e, abrechnungID, drinkID, amount) {
    storeAVDrinks(abrechnungID, drinkID, amount);
});

if (process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'DeveloperTools',
        submenu: [
        {
            label: 'Toggle DevTools',
            accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
            click(item, focusedWindow){
                focusedWindow.toggleDevTools();
            }
         },
        {
            role: 'reload'
        }]
    });
}

app.on('ready', createWindow)