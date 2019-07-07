const { app, BrowserWindow, Menu } = require('electron')

let sql = require('mysql');
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
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        },
        resizable:true,
    })

    // and load the index.html of the app.
    win.loadFile('index.html')

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    Menu.setApplicationMenu(mainMenu);
}

function insertTest(){

}

// Create a new main menu template
const mainMenuTemplate = [
    {
        label: 'File'
    }
];

app.on('ready', createWindow)