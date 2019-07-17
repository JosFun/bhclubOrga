const { app, BrowserWindow, Menu, ipcMain } = require('electron');
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
        webPreferences: {
            nodeIntegration: true
        }
        }
    )

   win.loadURL(url.format({
       pathname: path.join(__dirname,'index.html'),
       protocol: 'file',
       slashes: true
   }))

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
        title:"Add a new Database Entry",
        webPreferences: {
            nodeIntegrbhcation: true
        }

    });

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

// Catch newly added drinks
ipcMain.on('drink:add', function(e,drinkInfo){
    /*TODO: Perform the sql insertion*/
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