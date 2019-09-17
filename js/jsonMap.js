/**
 * Convert a map of strings into the corresponding Javascript object
 * @param strMap
 * @returns {any}
 */
function strMapToObj(strMap) {
    let obj = Object.create( null );
    for ( let [k,v] of strMap ) {
        obj[k] = v;
    }

    return obj;
}

/**
 * Convert an Javascript object into the corresponding Javascript Map
 * @param obj
 * @returns {Map<String, String>}
 */
function objToStrMap(obj) {
    let strMap = new Map();
    for ( let k of Object.keys(obj)) {
        strMap.set(k, obj[k]);
    }

    return strMap;
}

/**
 * Convert a map of strings into the corresponding JSON-representation
 * @param strMap
 * @returns {string}
 */
function strMapToJson(strMap) {
    return JSON.stringify(strMapToObj(strMap));
}

/**
 * Recover the Javascript Map from the specified JSON-string
 * @param jsonStr
 * @returns {Map<String, String>}
 */
function jsonToStrMap(jsonStr) {
    return objToStrMap(JSON.parse(jsonStr));
}