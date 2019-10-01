/**
 * Tests whether or not the specified argument n is a float
 * @param n
 * @returns {boolean}
 */
 exports.isFloat = function( n ) {
    return Number(n) === n && n % 1 !== 0;
}

/**
 * Tests whether or not the specified argument n is an int
 * @param n
 * @returns {boolean}
 */
exports.isInt = function( n ) {
     return Number(n) === n && n % 1 === 0;
}