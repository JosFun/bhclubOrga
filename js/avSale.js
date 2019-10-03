const electron = require('electron');
const {ipcRenderer} = electron;
const List = require("collections/list");
const jsonMapModule = require("../js/jsonMap");
const avDb = require("../js/avSaleVariables");

    avDb.drinkOrder.set(avDb.drinkOrderColumn, "asc");
    avDb.snackOrder.set(avDb.snackOrderColumn, "asc");

    avDb.drinkFilter.set(avDb.avColumnName, 1);
    avDb.snackFilter.set(avDb.avColumnName, 1);

    /* Iterate through all the drinkCategories that are supposed to be printed out on the outer side of the TED and send
    corresponding update requests to the sql database in the backend.
     */
    for (let i = 0; i < avDb.drinkOuterCategories.length; ++i) {
        avDb.drinkFilter.set(avDb.typeColumnName, avDb.drinkOuterCategories[i]);

        ipcRenderer.send("drinks:update", jsonMapModule.strMapToJson(avDb.drinkFilter), jsonMapModule.strMapToJson(avDb.drinkOrder));

        avDb.drinkFilter.delete(avDb.typeColumnName);
    }

    ipcRenderer.send("snacks:update", jsonMapModule.strMapToJson(avDb.snackFilter), jsonMapModule.strMapToJson(avDb.snackOrder));

    /* Iterate through all the drinkCategories that are supposed to be printed out on the inner side of the TED and send
    * update requests to the sql database in the backend.
    *  */
    for (let i = 0; i < avDb.drinkInnerCategories.length; ++i) {
        avDb.drinkFilter.set(avDb.typeColumnName, avDb.drinkInnerCategories[i]);

        ipcRenderer.send("drinks:update", jsonMapModule.strMapToJson(avDb.drinkFilter), jsonMapModule.strMapToJson(avDb.drinkOrder));

        avDb.drinkFilter.delete(avDb.typeColumnName);
    }


    ipcRenderer.on("drinks:data", function (e, data) {
        if (avDb.categoryIndex <= 4) {
            avDb.addItems(avDb.MODE.DRINKS_OUTER, "avAußen", "avInnen", data);
        } else {
            avDb.addItems(avDb.MODE.DRINKS_INNER, "avAußen", "avInnen", data);
        }
    });

    ipcRenderer.on("snacks:data", function (e, data) {
        avDb.addItems(avDb.MODE.SNACKS_OUTER, "avAußen", "avInnen", data);
    });






