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
    };

    socket.onmessage = function (event) {
        onReceive(event, socket);
    };
}

function makeTextFile(filename) {
    sendJson({
        'command': 'makeTextFile',
        'textFilename': filename
    });
}

function clearMemory(filename) {
    var json = {
        'command': 'clearMem'
    };

    if (filename) {
        json.textFilename = filename;
    }

    sendJson(json);
}

function readFile(filename, stage) {
    var json = {
        'command': 'readFile',
        'filename': filename,
        'stage': stage
    };
    sendJson(json);
}

function onReceive(event, socket) {
    var jsonMsg = JSON.parse(event.data);
    if (jsonMsg.filedata) {
        console.log(jsonMsg.stage);
        console.log(jsonMsg.filedata);
        if (jsonMsg.stage.toLowerCase().includes('intro')) {
            introReceiveData(jsonMsg.filedata, jsonMsg.stage.split('_')[0]);
        }
    }

    if (jsonMsg.done == true) {
        socket.close();
    }
}