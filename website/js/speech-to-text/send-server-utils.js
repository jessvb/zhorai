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

function makeTextFile(filename) {
    var socket = new WebSocket(url);
    socket.onopen = function (event) {
        socket.send(JSON.stringify({
            'command': 'makeTextFile',
            'textFilename': filename
        }));
        socket.close();
    };
}

function clearMemory(filename) {
    var json = {
        'command': 'clearMem'
    };

    if (filename) {
        json['textFilename'] = filename;
    }

    sendJson(json);
}