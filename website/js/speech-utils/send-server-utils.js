/* --- utils for sending text to the server --- */
var url = 'wss://zhorai.csail.mit.edu:8080';

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

function sendFromSession(key) {
    sendText(SentenceManager.getSessionData(key));
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
            mod2ReceiveData(jsonMsg.filedata, jsonMsg.stage.split('_')[0]); // remove mod2 from stage
        } else if (jsonMsg.stage.toLowerCase().includes('mod3')) {
            mod3ReceiveData(jsonMsg.filedata, jsonMsg.stage.split('_')[0]); // remove mod3 from stage
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
 * @param {*} typeOutput : e.g., 'Mindmap', 'Name', 'Dictionary', etc.
 * @param {*} stage : the current zhorai stage you're in, if applicable.
 * (This informs 'onReceive' what to do)
 */
function parseText(recordedText, typeOutput, stage) {
    // convert the words "polar bear" to "polarbear" before giving to the parser:
    recordedText = recordedText.replace(/polar bear/ig, 'polarbear');
    sendJson({
        'command': 'parse',
        'text': recordedText,
        'typeOutput': typeOutput, // e.g., 'Mindmap', 'Name', 'Dictionary', etc.
        'stage': stage
    });
}

/**
 * Parses given text and returns it with a call to onReceive.
 * e.g., parseSession('mindmap', 'polarbear', 'parsing_mod1')
 * or,   parseSession('mindmap', 'camel', 'parsing' + '_mod3');
 *
 * @param {*} typeOutput : e.g., 'Topic', 'Name', 'Dictionary', etc.
 * @param {*} key : the key used for session storage. This will be used to retrieve
 * the value stored (e.g., the sentences associated with the animal-key).
 * @param {*} stage : the current zhorai stage you're in, if applicable.
 * (This informs 'onReceive' what to do)
 *
 */
function parseSession(typeOutput, key, stage) {
    var value = SentenceManager.getSentencesAsString(key);
    sendJson({
        'command': 'parse',
        'text': value,
        'typeOutput': typeOutput, // e.g., 'Topic', 'Name', 'Mindmap', etc.
        'stage': stage
    });
}

/**
 * Sends sentences, starts the word embedder, and returns an array of an array to onReceive
 * with the coordinates of the ecosystems as well as the animals in the sentences.
 *
 * Example call: getEmbeddingCoord('Camels live in the hot sun.\nCamels spit onto sand.\n',
 * 'embedStage_mod3')
 *
 * @param {*} sentences : text containing sentences about an animal.
 * @param {*} stage : the current zhorai stage you're in, if applicable.
 * (This informs 'onReceive' what to do)
 */
function getEmbeddingCoordFromText(sentences, stage) {
    sendJson({
        'command': 'getEmbeddingCoord',
        'text': sentences,
        'stage': stage
    });
}

/**
 * Retrieves sentences from session, sends the sentences, starts the word embedder, and
 * returns an array of an array to onReceive with the coordinates of the ecosystems as
 * well as the animals in the sentences.
 *
 * Example call: getEmbeddingCoord('camelSentences', 'embedStage_mod3')
 *
 * @param {*} key : key for the session variable containing sentences about an animal.
 * @param {*} stage : the current zhorai stage you're in, if applicable.
 * (This informs 'onReceive' what to do)
 */
function getEmbeddingCoordFromSession(key, stage) {
    // TODO: need to get the correct parsing for the sentences, as in parseSession
    var sentences = SentenceManager.getSessionData(key);
    getEmbeddingCoordFromText(sentences, stage);
}