/**
 * The enum for the MODE
 * @type {{DRINKS_OUTER: string, SNACKS_OUTER: string, DRINKS_INNER: string, ABRECHNUNG_DRINKS_OUTER: string, ABRECHNUNG_SNACKS_OUTER: string, ABRECHNUNG_DRINKS_INNER: string}}
 */
const MODE = {
    DRINKS_OUTER: "drinksOuter",
    SNACKS_OUTER: "snacks",
    DRINKS_INNER: "drinksInner",
    ABRECHNUNG_DRINKS_OUTER: "abrechnungDrinksOuter",
    ABRECHNUNG_SNACKS_OUTER: "abrechnungSnacksOuter",
    ABRECHNUNG_DRINKS_INNER: "abrechnungDrinksInner"
};


/**
 * The number of columns in the list for AV-Außen
 * @type {number}
 */
const COL_AUSSEN_COUNT = 13;

/**
 * The number of columns in the list for AV-Innen
 * @type {number}
 */
const COL_INNEN_COUNT = 10;

/**
 * The number of columns in the list for AV-Abrechnungen
 * @type {number}
 */
const COL_ABRECHNUNG_COUNT = 5;

/**
 * The categories of drinks that are to be printed out on the outer side of the TED
 * @type {string[]}
 */
const drinkOuterCategories = [ "Bier", "AFG", "Saft", "Wein/Sekt" ];

/**
 * The categories of drinks that are to be printed out on the inner side of the TED
 * @type {string[]}
 */
const drinkInnerCategories = [ "Barschnaps", "Schnaps-eiskalt", "Likör-gekühlt"];

/**
 * The index that refers to the current category of drinks that is to be received next.
 * @type {number}
 */
let categoryIndex = 0;
/**
 * The filter map, that is about to be passed on to the main process of the app
 * @type {Map<string, string>}
 */
const drinkFilter = new Map ();

/**
 * The filter map, that is about to be passed on to the main process of the app
 * @type {Map<string, string>}
 */
const snackFilter = new Map();

/**
 * The name of the type column of the rohgetraenke-table
 * @type {string}
 */
const typeColumnName = "drink_type";

/**
 * The name of the column indicating whether or not a specific drink is to be sold in the AV-Verkauf
 * @type {string}
 */
const avColumnName = "avVerkauf";

/**
 * The order map, that is about to be passed on to the main process of the app, so that the items are being put out
 * in the correct order.
 * @type {Map<string, string>}
 */
const drinkOrder = new Map ();
/**
 * The name of the drink database column, by which the output is about to be ordered.
 * */
const drinkOrderColumn = "drink_name";

/**
 * The order map, that is about to be passed on to the main process of the app, so that the items are being put out in
 * the correct order
 * @type {Map<string, string>}
 */
const snackOrder = new Map ();
/**
 The name of the snack database column, by which the output is about to be ordered.
 */
const snackOrderColumn = "snack_name";

module.exports = {MODE, COL_AUSSEN_COUNT, COL_INNEN_COUNT, COL_ABRECHNUNG_COUNT, drinkOuterCategories, drinkInnerCategories, categoryIndex,
    drinkFilter, snackFilter, drinkOrder, snackOrder, typeColumnName, avColumnName, drinkOrderColumn, snackOrderColumn};

/**
 * Add the passed items to the corresponding tables for the inner and outer list of the TEDDI
 * @param mode Whether the passed items are snacks or drinks
 * @param items The items that are about to be made visible on the app
 */
module.exports.addItems = function (mode, tableAussen, tableInnen, ...data) {
    console.log("hellole");
    let table;
    /* The start row of the table */
    const startRow = document.createElement("tr");

    if (mode === avDb.MODE.DRINKS_OUTER || mode === avDb.MODE.SNACKS_OUTER) {
        table = document.getElementById(tableAussen);

        for (let i = 0; i < avDb.COL_AUSSEN_COUNT; ++i) {
            const td = document.createElement("td");
            if (i === 0) {
                if (mode === avDb.MODE.DRINKS_OUTER) {
                    td.textContent = avDb.drinkOuterCategories[avDb.categoryIndex++];
                } else if (mode === avDb.MODE.SNACKS_OUTER) {
                    td.textContent = "Snacks";
                    avDb.categoryIndex++;
                }
            }
            td.className = "avAußenListeCategory";

            startRow.className = "avAußenListeCategory";
            startRow.appendChild(td);
        }
        table.appendChild(startRow);
    } else if (mode === avDb.MODE.DRINKS_INNER) {
        table = document.getElementById(tableInnen);

        for (let i = 0; i < avDb.COL_INNEN_COUNT; ++i) {
            const td = document.createElement("td");
            if (i === 0) {
                td.textContent = avDb.drinkInnerCategories[avDb.categoryIndex++ - avDb.drinkOuterCategories.length - 1];
            }
            td.className = "avInnenListeCategory";

            startRow.className = "avInnenListeCategory";
            startRow.appendChild(td);
        }
        table.appendChild(startRow);
    } else if (mode === avDb.MODE.ABRECHNUNG_DRINKS_OUTER || mode === avDb.MODE.ABRECHNUNG_SNACKS_OUTER) {
        table = document.getElementById(tableAussen);

        for (let i = 0; i < avDb.COL_ABRECHNUNG_COUNT; ++i) {
            const td = document.createElement("td");
            if (i === 0 && mode === MODE.ABRECHNUNG_DRINKS_OUTER) {
                td.textContent = avDb.drinkOuterCategories[avDb.categoryIndex++];
            } else if (i === 0 && mode === MODE.ABRECHNUNG_SNACKS_OUTER) {
                td.textContent = "Snacks";
                avDb.categoryIndex++;
            }

            td.className = "avAbrechnungAussenCategory";

            startRow.className = "avAbrechnungAussenCategory";
            startRow.appendChild(td);
        }
        table.appendChild(startRow);
    } else if (mode === avDb.MODE.ABRECHNUNG_DRINKS_INNER) {
        table = document.getElementById(tableInnen);

        for (let i = 0; i < avDb.COL_ABRECHNUNG_COUNT; ++i) {
            const td = document.createElement("td");
            if (i === 0) {
                td.textContent = avDb.drinkInnerCategories[avDb.categoryIndex++ - avDb.drinkOuterCategories.length - 1];
            }
            td.className = "avAbrechnungInnenCategory";

            startRow.className = "avAbrechnungInnenCategory";
            startRow.appendChild(td);
        }
        table.appendChild(startRow);
    }

    for (let i = 0; i < data[0].length; ++i) {
        const tr = document.createElement("tr");
        let tds;

        if (mode === avDb.MODE.DRINKS_OUTER || mode === avDb.MODE.SNACKS_OUTER) {
            tds = new Array(avDb.COL_AUSSEN_COUNT);
        } else if (mode === avDb.MODE.DRINKS_INNER) {
            tds = new Array(avDb.COL_INNEN_COUNT);
        } else if (mode === avDb.MODE.ABRECHNUNG_DRINKS_OUTER || mode === avDb.MODE.ABRECHNUNG_SNACKS_OUTER || mode === avDb.MODE.ABRECHNUNG_DRINKS_INNER) {
            tds = new Array(avDb.COL_ABRECHNUNG_COUNT);
        }

        for (let k = 0; k < tds.length; ++k) {
            tds[k] = document.createElement('td');
        }

        if (mode === avDb.MODE.DRINKS_OUTER) {
            tds[0].textContent = data[0][i]["drink_name"];
            tds[1].textContent = data[0][i]["bottle_size"].toFixed(2) + "l";
            tds[2].textContent = data[0][i]["internal_price"].toFixed(2) + "€";
        } else if (mode === avDb.MODE.SNACKS_OUTER) {
            tds[0].textContent = data[0][i]["snack_name"];
            tds[1].textContent = "1 Packung";
            tds[2].textContent = data[0][i]["snack_price"].toFixed(2) + "€";
        } else if (mode === avDb.MODE.DRINKS_INNER) {
            tds[0].textContent = data[0][i]["drink_name"];
            tds[1].textContent = data[0][i]["bottle_size"].toFixed(2) + "l";
            tds[2].textContent = data[0][i]["internal_price"].toFixed(2) + "€";
        } else if (mode === avDb.MODE.ABRECHNUNG_DRINKS_OUTER || mode === avDb.MODE.ABRECHNUNG_DRINKS_INNER) {
            tds[0].textContent = data[0][i]["drink_name"];
            tds[1].textContent = data[0][i]["bottle_size"].toFixed(2) + "l";
            tds[2].textContent = data[0][i]["internal_price"].toFixed(2) + "€";
            let span = document.createElement("span");
            span.contentEditable = true;
            span.addEventListener("focusin", function (e) {
                if (span.textContent === "ANZAHL") {
                    span.textContent = "";
                }
            });
            span.addEventListener("focusout", function (e) {
                let numString = span.textContent;
                if (!isNaN(parseInt(numString))) {
                    let gesamtPrice = parseFloat(tds[4].textContent);
                    let price = parseFloat(tds[2].textContent);
                    let count = parseInt(numString);

                    gesamtPrice += count * price;

                    tds[4].textContent = gesamtPrice.toFixed(2) + "€";
                }
                else {
                    tds[4].textContent = "0.00€";
                }
            });
            tds[3].appendChild(span);

            tds[4].textContent = "0.00€";
        }
        else if (mode === avDb.MODE.ABRECHNUNG_SNACKS_OUTER) {
            tds[0].textContent = data[0][i]["snack_name"];
            tds[1].textContent = "1 Packung";
            tds[2].textContent = data[0][i]["snack_price"].toFixed(2) + "€";

            let span = document.createElement("span");
            span.contentEditable = true;
            span.addEventListener("focusin", function (e) {
                if (span.textContent === "ANZAHL") {
                    span.textContent = "";
                }
            });
            span.addEventListener("focusout", function (e) {
                let numString = span.textContent;
                if (!isNaN(parseInt(numString))) {
                    let gesamtPrice = parseFloat(tds[4].textContent);
                    let price = parseFloat(tds[2].textContent);
                    let count = parseInt(numString);

                    gesamtPrice += count * price;

                    tds[4].textContent = gesamtPrice.toFixed(2) + "€";
                }
                else  {
                    tds[4].textContent = "0.00€";
                }
            });
            tds[3].appendChild(span);

            tds[4].textContent = "0.00€";

        }

        for (let k = 0; k < tds.length; ++k) {
            tr.appendChild(tds[k]);
        }
        table.appendChild(tr);
    }
};
