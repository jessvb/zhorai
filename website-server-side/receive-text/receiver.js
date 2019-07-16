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
var wordSimPath = '../../word-similarity/';

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
        } else if (jsonMsg.command == 'getHistogramValues') {
            // if there's text, then send it to the word similarity program:
            if (jsonMsg.text) {
                // todo        
                console.log("getting histogram values for '" + jsonMsg.text + "'");
                getWordSimilarityAndReturnToClient(jsonMsg, connection);

            } else {
                // there's no text provided... error!
                console.log("Error: No text to give to the word similarity program. jsonMsg: " +
                    jsonMsg);
                returnTextToClient('ERR_NO_TEXT', jsonMsg.stage, connection);
            }
            sendEnd = false;
        }
        // todo del:
        // else if (jsonMsg.command == 'getEmbeddingCoord') {
        //     // TODO: don't write to a file here!
        //     // // if there's text, then write that text to a file and send it to the embedder
        //     if (jsonMsg.text) {
        //         console.log("getting coords for '" + jsonMsg.text + "'");
        //         // TODO: don't create file!
        //         // Create file for parser to parse:
        //         // writeToFile(dataDir + embedInputFilename, jsonMsg.text, function () {
        //         //     getCoordsAndReturnToClient(jsonMsg, null, connection);
        //         // });
        //         // } else {
        //         // // there's no text, so let's parse the given filepath
        //         // if (jsonMsg.filePath) {
        //         //     getCoordsAndReturnToClient(jsonMsg, jsonMsg.filePath, connection);
        //         getCoordsAndReturnToClient(jsonMsg, connection);
        //     } else {
        //         // there's no text provided... error!
        //         console.log("Error: No text to give to the embedder. jsonMsg: " +
        //             jsonMsg);
        //         returnTextToClient('ERR_NO_TEXT', jsonMsg.stage, connection);
        //     }
        //     sendEnd = false;
        // } 
        else {
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

        // Check if a sentence caused the parser to hang (this only happens in the mindmap case): TODO: should I add "Dictionary" here too??
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
                // TODO: do we need to edit the textToSend, or is it formatted correctly already??
                returnTextToClient(textToSend, jsonMsg.stage, connection);
            });

        }
    });
}

// todo del:
// function getCoordsAndReturnToClient(jsonMsg, connection) {
//     // Execute embedder bash script and return coords with readFileReturnToClient
//     console.log('Getting coords and return to client...');

//     var embedCmd = 'cd ' + wordSimPath; // TODO
//     console.log(embedCmd);

//     exec(embedCmd, function (error, stdout, stderr) {
//         var textToSend = "";
//         if (stdout) {
//             console.log('Parser command output:\n' + stdout);
//             textToSend = stdout;
//         }
//         if (error) {
//             console.log('Function error:\n' + error);
//             textToSend = error;
//         }

//         // Send text back to client:
//         // returnTextToClient(textToSend, jsonMsg.stage, connection);
//         returnTextToClient('TODO get coords without making file (getCoordsAndReturnToClient)', jsonMsg.stage, connection);
//     });

// }

function sendDone(connection) {
    // tell the client to close the connection
    connection.send(JSON.stringify({
        'done': true
    }));
}

server.listen(port);

console.log("Zhorai's brain is ready for info!");