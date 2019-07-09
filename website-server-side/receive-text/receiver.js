/* to connect to website via websocket: */
var WebSocket = require('ws');
var https = require('https');
var fs = require('fs');

const port = 8080;
const server = https.createServer({
    cert: fs.readFileSync('/etc/letsencrypt/live/zhorai.csail.mit.edu/cert.pem'),
    key: fs.readFileSync('/etc/letsencrypt/live/zhorai.csail.mit.edu/privkey.pem')
});

/* to write to txt file: */
var fs = require('fs');
var semParserPath = '../../semantic-parser/';
var embedPath = '../../word-embeddings/';

/* to execute bash scripts */
var exec = require('child_process').exec;

// Create secure websocket server
const wss = new WebSocket.Server({
    server
});

// Define websocket handlers
wss.on('connection', function (connection) {
    connection.on('message', function incoming(message) {
        // process WebSocket message
        console.log('received message: ' + message);
        var sendEnd = false;
        var jsonMsg = JSON.parse(message);
        if (jsonMsg.command == 'parse') {
            // if there's text, then parse it according to jsonMsg.typeOutput
            if (jsonMsg.text) {
                // Parse text for name/dictionary/etc.
                console.log("parsing '" + jsonMsg.text + "' and outputting '" + jsonMsg.typeOutput + "'");
                parseAndReturnToClient(jsonMsg, connection);
            } else {
                console.log("Error: No text to give to the parser. jsonMsg: " + jsonMsg);
                returnTextToClient('ERR_NO_TEXT', jsonMsg.stage, connection);
            }
            sendEnd = false;
        } else if (jsonMsg.command == 'getEmbeddingCoord') {
            // TODO: don't write to a file here!
            // // if there's text, then write that text to a file and send it to the embedder
            if (jsonMsg.text) {
                console.log("getting coords for '" + jsonMsg.text + "'");
                // TODO: don't create file!
                // Create file for parser to parse:
                // writeToFile(dataDir + embedInputFilename, jsonMsg.text, function () {
                //     getCoordsAndReturnToClient(jsonMsg, null, connection);
                // });
                // } else {
                // // there's no text, so let's parse the given filepath
                // if (jsonMsg.filePath) {
                //     getCoordsAndReturnToClient(jsonMsg, jsonMsg.filePath, connection);
                getCoordsAndReturnToClient(jsonMsg, connection);
            } else {
                // there's no text provided... error!
                console.log("Error: No text to give to the embedder. jsonMsg: " +
                    jsonMsg);
                returnTextToClient('ERR_NO_TEXT', jsonMsg.stage, connection);
            }
            sendEnd = false;
        }
        if (sendEnd) {
            sendDone(connection);
        }
    });

    connection.on('close', function (connection) {
        // client closed connection
        console.log("Closed connection.\n");
    });

});

function returnTextToClient(text, stage, connection) {
    console.log("Returning text to client: " + JSON.stringify({
        'filedata': text,
        'stage': stage
    }));
    connection.send(
        JSON.stringify({
            'filedata': text,
            'stage': stage
        }));
    sendDone(connection);
}

function parseAndReturnToClient(jsonMsg, connection) {
    // Execute parsing bash script and return output (stdout) to client
    var parseCmd = 'cd ' + semParserPath +
        ' && sh parse.sh "' + jsonMsg.typeOutput + '" "' + jsonMsg.text + '"';

    console.log(parseCmd);
    exec(parseCmd, function (error, stdout, stderr) {
        var justOutput = "";
        if (stdout) {
            console.log('Parser command output:\n' + stdout);
            // Grab the output without "STARTName" and "ENDName" etc.:
            var startIndex = stdout.lastIndexOf("START" + jsonMsg.typeOutput) + ("START" + jsonMsg.typeOutput + "\n").length;
            var endIndex = stdout.lastIndexOf("END" + jsonMsg.typeOutput) - ("\nOK\n").length;

            justOutput = stdout.substring(startIndex, endIndex);
        }
        if (error) {
            console.log('Function error:\n' + error);
        }
        console.log('Finished parsing.');

        // Check if a sentence caused the parser to hang (this only happens in the mindmap case):
        if (jsonMsg.typeOutput.toLowerCase().includes('mindmap') && stdout.includes("BAD ENGLISH")) {
            // return the error to the client
            returnTextToClient(stdout, jsonMsg.stage, connection);
        } else {
            // TODO: return parsed info without reading from a file...
            // // return the parsed information to client:
            // readFileReturnToClient(tododelme2 + jsonMsg.typeOutput + '.txt', jsonMsg.stage, connection);
            returnTextToClient(justOutput, jsonMsg.stage, connection);
        }
    });
}

function getCoordsAndReturnToClient(jsonMsg, connection) {
    // Execute embedder bash script and return coords with readFileReturnToClient
    console.log('Getting coords and return to client...');

    // TODO: get rid of text file
    // var embedCmd = 'cd ' + embedPath +
    //     ' && python3 visualize_embedding_results.py --corpus-file corpus_files/embedding_corpus.txt --eval-file ' +
    //     filePath + ' --eval-words-file corpus_files/animal-list.txt --ignore-plot --embedding-type linear ' +
    //     '--model-checkpoint results/model_initial-0050.tar';
    var embedCmd = 'cd ' + embedPath; // TODO
    console.log(embedCmd);

    exec(embedCmd, function (error, stdout, stderr) {
        var textToSend = "";
        if (stdout) {
            console.log('Parser command output:\n' + stdout);
            textToSend = stdout;
        }
        if (error) {
            console.log('Function error:\n' + error);
            textToSend = error;
        }

        // Send text back to client:
        // returnTextToClient(textToSend, jsonMsg.stage, connection);
        returnTextToClient('TODO get coords without making file (getCoordsAndReturnToClient)', jsonMsg.stage, connection);
    });

}

function sendDone(connection) {
    // tell the client to close the connection
    connection.send(JSON.stringify({
        'done': true
    }));
}

server.listen(port);

console.log("Zhorai's brain is ready for info!");