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
        console.log("received message in stage, " + jsonMsg.stage + ": " + jsonMsg.filedata);
        if (jsonMsg.stage.toLowerCase().includes('intro')) {
            introReceiveData(jsonMsg.filedata, jsonMsg.stage.split('_')[0]); // remove intro from stage
        } else if (jsonMsg.stage.toLowerCase().includes('mod1')) {
            mod1ReceiveData(jsonMsg.filedata, jsonMsg.stage.split('_')[0]); // remove mod1 from stage
        } else if (jsonMsg.stage.toLowerCase().includes('mod2')) {
            mod2ReceiveData(jsonMsg.filedata, jsonMsg.stage.split('_')[0]); // remove mod1 from stage
        } else {
            console.log('onReceive did not understand the current stage, ' + jsonMsg.stage + '.');
        }
    }

    if (jsonMsg.done == true) {
        socket.close();
    }
}

/**
 * Parses given text and returns it with a call to onReceive.
 * @param {*} recordedText : the text you want parsed
 * @param {*} typeOutput : e.g., 'topic', 'name', 'dictionary', etc.
 * @param {*} stage : the current zhorai stage you're in, if applicable. 
 * (This informs 'onReceive' what to do)
 */
function parseText(recordedText, typeOutput, stage) {
    sendJson({
        'command': 'parse',
        'text': recordedText,
        'typeOutput': typeOutput, // e.g., 'topic', 'name', 'dictionary', etc.
        'stage': stage
    });
}

/**
 * Parses given text and returns it with a call to onReceive.
 * @param {*} recordedText : the text you want parsed
 * @param {*} typeOutput : e.g., 'topic', 'name', 'dictionary', etc.
 * @param {*} stage : the current zhorai stage you're in, if applicable. 
 * (This informs 'onReceive' what to do)
 */
function parseMem(typeOutput, stage) {
    sendJson({
        'command': 'parse',
        'typeOutput': typeOutput, // e.g., 'topic', 'name', 'mindmap', etc.
        'stage': stage
    });
}

/**
 * Sends sentences about animals to the server, starts the word embedder, and 
 * returns an array of an array to onReceive with the coordinates of the ecosystems 
 * as well as the animals in the sentences. 
 * 
 * @param {*} animalSentences : sentences about animals separated by newlines.
 * @param {*} stage : the current zhorai stage you're in, if applicable. 
 * (This informs 'onReceive' what to do)
 */
function getEmbeddingCoord(animalSentences, stage) {
    sendJson({
        'command': 'getEmbeddingCoord',
        'text': animalSentences,
        'stage': stage
    });
}
   