alert("Halo");
console.log("hrey");
const electron = require('electron');
const {ipcRenderer} = electron;
const ul = document.querySelector('ul');

ipcRenderer.on('drink:add', function(e,drink){
    /* Create a list item */
    const li = document.createElement('li');
    const drinkText = document.createTextNode(drink);
    li.appendChild(drinkText);
    ul.appendChild(li);
});