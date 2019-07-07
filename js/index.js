
document.forms['userinput'].onsubmit = e => {
    e.preventDefault();
    let inputDrink = document.forms['userinput'].elements['drinkName'].value;
    console.log(inputDrink);
}
