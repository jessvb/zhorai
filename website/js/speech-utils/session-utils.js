/* --- utils for saving session information --- */
function saveSessionData(key, value) {
    console.log('saving data (' + key + '): ' + value);
    sessionStorage.setItem(key, value);
}

function getSessionData(key) {
    var value = sessionStorage.getItem(key);
    console.log('getting data (' + key + '): ' + value);
    if (!value) {
        console.log('There was no data previously stored. Returning null.');
        value = null;
    }
    return value;
}

function clearSessionData() {
    sessionStorage.clear();
}