/* --- utils for sending text to the server --- */
var url = 'ws://localhost:8080';

function sendText(text) {
    sendJson({
        'text': text
    });
}

function sendJson(json) {
    var socket = new WebSocket(url);
    socket.onopen = function (event) {
        socket.send(JSON.stringify(json));
        socket.close();
    };
}

function makeTextFile() {
    var socket = new WebSocket(url);
    socket.onopen = function (event) {
        socket.send(JSON.stringify({
            'command': 'makeTextFile'
        }));
        socket.close();
    };
}

/* -------------- Once the page has loaded -------------- */
document.addEventListener('DOMContentLoaded', function () {
    textFileBtn = document.getElementById('textFileBtn');
    textFileBtn.addEventListener('click', makeTextFile);
});