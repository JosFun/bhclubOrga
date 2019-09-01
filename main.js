const { app, BrowserWindow, Menu, ipcMain, webContents } = require('electron');
const url = require('url');
const path = require('path');

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

// Handle createAddWindow
function createAddDrinkWindow ( ) {
    windowShrink();

    addWin = new BrowserWindow( {
        title:"Add a new Database Entry",
        webPreferences: {
            nodeIntegration: true
        }

    });

    addWin.maximize();

    addWin.loadURL(url.format({
        pathname: path.join(__dirname, 'html/addDrinkWindow.html'),
        protocol:'file',
        slashes: true
    }));

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
        label: 'File',
        click(){
            createAddDrinkWindow();
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
 * Perform a sql select on the table "rohgetraenke" and send the data to the addDrinkWindow, where they are displayed.
 */
function selectDrinks ( ) {
    let sqlSelect = "SELECT * FROM rohgetraenke;"
    dbConnection.query(sqlSelect, function( err, result, fields ) {
        if ( err ) throw err;
        /* Send the data of all drinks to all the renderer processes. */
        win.webContents.send("drinks:data", result);
    });
}

/**
 * Perform a sql select on the table "snacks" and send the data to the addDrinkWindow, where they are displayed.
 */
function selectSnacks() {
    /* Get all the data of all the snacks inside the snack database */
    let sqlSelect = "SELECT * FROM snacks;"
    dbConnection.query(sqlSelect, function ( err, result, fields ) {
        if ( err ) throw err;
        /* Send the data of all the snacks to all the renderer processes. */
        win.webContents.send("snacks:data", result);
    });
}

// Catch newly added drinks
ipcMain.on('drink:add', function(e,drinkInfo){
    /*TODO: Perform the sql insertion*/
    let sqlInsert = "INSERT INTO rohgetraenke (drink_name, bottle_size, bottle_cost, trader, " +
        "internal_price, portion_size, external_addition, portion_price, external_price_bottle, " +
        "weight_bottle, deposit_bottle, skListe, avVerkauf, bierKarte, barKarte, abrechnung) VALUES (?)";
    dbConnection.query(sqlInsert, [drinkInfo], function ( err, result ) {
        if ( err ) throw err;
        console.log("New drink inserted!");
    } )
    selectDrinks();
});

// Catch newly added snacks
ipcMain.on('snack:add', function(e,snackInfo){
    e.preventDefault();
   /* Perform the sql insertion of the data belonging to the newly added snack */
   let sqlInsert = "INSERT INTO snacks (snack_name, snack_cost, snack_price, skListe, " +
       "avVerkauf, bierKarte, barKarte, abrechnung) VALUES (?)";
   dbConnection.query(sqlInsert, [snackInfo], function( err, result ){
       if ( err ) throw err;
       console.log("New snack inserted!");
   })

    /* Get all the data of all the snacks inside the snack database */
    selectSnacks();
});

// Catch update requests regarding the visualization of the snack database
ipcMain.on('snacks:update', function(e){
    e.preventDefault();
    selectSnacks();
})

// Catch update requests regarding the visualization of the drink database
ipcMain.on('drinks:update', function(e){
    e.preventDefault();
    selectDrinks();
})

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