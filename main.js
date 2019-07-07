const { app, BrowserWindow, Menu } = require('electron');
const url = require('url');
const path = require('path');

let sql = require('mysql');

/**
 * The main window of the application
 * */
let win;

var connection = sql.createConnection({
    host    : 'localhost',
    user    : 'bhdbuser',
    password: "bhc",
    }
);

/* Appliance of error callback mechanism*/
connection.connect(function(err){
    if ( !err ) {
        console.log("Connection with the database has suceeded!");
    }
    else {
        console.log("Connection could not have been established!");
    }
});

function createWindow () {
    // Erstelle das Browser-Fenster.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        },
        resizable:true,
    })

    // and load the index.html of the app.
    win.loadFile('index.html')

    // Quit app once the main window is closed
    win.on('closed',function(){
        app.quit();
    });

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    Menu.setApplicationMenu(mainMenu);
}

// Handle createAddWindow
function createAddDrinkWindow ( ) {
    windowShrink();

    addWin = new BrowserWindow( {
        width: 800,
        height: 600,
        title:"Add a new Database Entry"
    });

    addWin.loadURL(url.format({
        pathname: path.join(__dirname, 'html/addDrinkWindow.html'),
        protocol:'file',
        slashes: true
    }));
}

function insertTest(){

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

app.on('ready', createWindow)