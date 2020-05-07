/* to connect to website via websocket: */
var WebSocket = require('ws');
var https;
var http;
var fs = require('fs'); // also for writing to txt file

const port = 5000;
var server;
http = require('http');
server = http.createServer(function (request, response) {
    // empty for http
});

/* to write to txt file: */
var semParserPath = '../../semantic-parser/';
var wordSimPath = '../../word-similarity/';

/* to execute bash scripts */
var exec = require('child_process').exec;

// Create websocket server (note: not necessarily secure)
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
        } else if (jsonMsg.command == 'getHistogramValues') {
            // if there's text, then send it to the word similarity program:
            if (jsonMsg.text) {
                getWordSimilarityAndReturnToClient(jsonMsg, connection);

            } else {
                // there's no text provided... error!
                console.log("Error: No text to give to the word similarity program. jsonMsg: " +
                    jsonMsg);
                returnTextToClient('ERR_NO_TEXT', jsonMsg.stage, connection);
            }
            sendEnd = false;
        } else {
            console.log("Error: Command, '" + jsonMsg.command + "', not recognized. Closing connection.");
            sendEnd = true;
        }

        // End the ws connection if sendEnd==true
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
            // return parsed info
            returnTextToClient(justOutput, jsonMsg.stage, connection);
        }
    });
}

function getWordSimilarityAndReturnToClient(jsonMsg, connection) {
    // First, parse the sentences, then execute word similarity bash script and return values to client
    console.log('Getting word similarity and returning to client... (But first, we parse!)');

    // Let's make sure the parseAndReturnToClient knows we're parsing for a dictionary:
    jsonMsg.typeOutput = "Dictionary";
    // Execute parsing bash script and return output (stdout) to word similarity command:
    var parseCmd = 'cd ' + semParserPath +
        ' && sh parse.sh "' + jsonMsg.typeOutput + '" "' + jsonMsg.text + '"';

    console.log(parseCmd);
    exec(parseCmd, function (error, stdout, stderr) {
        var parserOutput = "";
        if (stdout) {
            console.log('Parser command output:\n' + stdout);
            // Grab the output without "STARTName" and "ENDName" etc.:
            var startIndex = stdout.lastIndexOf("START" + jsonMsg.typeOutput) + ("START" + jsonMsg.typeOutput + "\n").length;
            var endIndex = stdout.lastIndexOf("END" + jsonMsg.typeOutput) - ("\nOK\n").length;

            parserOutput = stdout.substring(startIndex, endIndex);
        }
        if (error) {
            console.log('Function error:\n' + error);
        }

        // Check if a sentence caused the parser to hang:
        if (jsonMsg.typeOutput.toLowerCase().includes('mindmap') && stdout.includes("BAD ENGLISH")) {
            console.log('Parser error... Returning to client.');
            // return the error to the client
            returnTextToClient(stdout, jsonMsg.stage, connection);
        } else {
            console.log('Finished parsing. Now to get the word similarity...');

            var wordSimCmd = 'cd ' + wordSimPath +
                ' && sh classify.sh \'' + parserOutput + '\'';
            console.log(wordSimCmd);

            exec(wordSimCmd, function (error, stdout, stderr) {
                var jsonToSend = {};
                if (stdout) {
                    console.log('Parser command output:\n' + stdout);
                    jsonToSend.ecoData = JSON.parse(stdout);
                    jsonToSend.animal = jsonMsg.key;
                }
                if (error) {
                    console.log('Function error:\n' + error);
                    jsonToSend = error;
                }

                // Send text back to client:
                returnTextToClient(JSON.stringify(jsonToSend), jsonMsg.stage, connection);
            });

        }
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
