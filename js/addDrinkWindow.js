const electron = require('electron');
const {ipcRenderer} = electron;

const form = document.querySelector('#drinkForm');
form.addEventListener('submit', submitForm);

function submitForm(e){
    e.preventDefault();
    const drink = document.querySelector('#drink').value;
    console.log(drink);
    // send newly added drink to main.js
    ipcRenderer.send('drink:add', drink);
}