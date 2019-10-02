/**
 * Tests whether or not the specified argument n is a float
 * @param n
 * @returns {boolean}
 */
 exports.isFloat = function( n ) {
    return Number(n) === n && n % 1 !== 0;
};

/**
 * Tests whether or not the specified argument n is an int
 * @param n
 * @returns {boolean}
 */
exports.isInt = function( n ) {
     return Number(n) === n && n % 1 === 0;
};

/**
   Returns the current date's string representation
 * @returns {string}
 */
exports.getDate = function(  ) {
    let today = new Date();
    let dd = String(today.getDay() - 1).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2,"0");
    let yyyy = String(today.getFullYear());

    return dd + "-" + mm + "-" + yyyy;
};