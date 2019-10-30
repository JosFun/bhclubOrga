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
    /* Day refers to the weekday, while date means the acutal day in the month!*/
    let dd = String(today.getDate() ).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2,"0");
    let yyyy = String(today.getFullYear());

    return dd + "-" + mm + "-" + yyyy;
};

/**
 * Returns the current data's year as a number.
 * @returns {number}
 */
exports.getYear = function ( ) {
    let today = new Date();
    let yyyy = String(today.getFullYear());

    return parseInt ( yyyy );
};

/**
 * Returns the current date's month as a number
 * @returns {number}
 */
exports.getMonth = function( ) {
    let today = new Date();
    let mm = String(today.getMonth() + 1);

    return parseInt ( mm );
}