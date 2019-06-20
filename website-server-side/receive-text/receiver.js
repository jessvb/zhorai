/* to connect to website via websocket: */
var WebSocketServer = require('websocket').server;
var http = require('http');
var port = 8080;

/* to write to txt file: */
var fs = require('fs');
var tododelme2 = 'data/';
var tododelme3 = '../website-server-side/receive-text/' + tododelme2;

var tododelme = 'input.txt';
var semParserPath = '../../semantic-parser/';
var tododelme4 = tododelme3 + tododelme; // relative to semparserfilepath

var tododel5 = 'embed-sentence.txt';
var embedPath = '../../word-embeddings/';
var embedInputPath = tododelme3 + tododel5; // relative to embedfilepath
// var allText = ''; TODO REMOVE

var animalDir = 'animals/';
var tododelme6 = tododelme3 + animalDir;

/* to execute bash scripts */
var exec = require('child_process').exec;


var server = http.createServer(function (request, response) {
    // process HTTP request. Since we're writing just WebSockets
    // server we don't have to implement anything.
});
server.listen(port, function () {});

// create the server
wsServer = new WebSocketServer({
    httpServer: server
});

// WebSocket server
wsServer.on('request', function (request) {
    var connection = request.accept(null, request.origin);

    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function (message) {
        var sendEnd = false;
        if (message.type === 'utf8') {
            // process WebSocket message
            console.log('\nReceived message:\n' + message.utf8Data);

            var jsonMsg = JSON.parse(message.utf8Data);
            // TODO del:
            // Add received text to allText:
            // if (jsonMsg.command == 'makeTextFile') {
            //     // make a text file with allText
            //     writeToFile(tododelme2 + jsonMsg.textFilename, allText);
            //     // reset allText for next text file
            //     allText = '';
            //     sendEnd = true;
            // } else if (jsonMsg.command == 'clearMem') {
            //     // remove all remembered data:
            //     allText = '';
            //     if (jsonMsg.textFilename) {
            //         // write empty file
            //         console.log('emptying file: ' + jsonMsg.textFilename);
            //         writeToFile(tododelme2 + jsonMsg.textFilename, allText);
            //     }
            //     sendEnd = true;
            // } else if (jsonMsg.command == 'readFile') {
            //     // get file data and return it to the client
            //     console.log('Reading file: ' + jsonMsg.filename);
            //     readFileReturnToClient(jsonMsg.filename, jsonMsg.stage, connection);
            //     sendEnd = false;
            // } else 
            if (jsonMsg.command == 'parse') {
                // if there's text, then write that text to a file and parse it
                if (jsonMsg.text) {
                    // Parse text for name/dictionary/etc.
                    console.log("parsing '" + jsonMsg.text + "'");
                    // TODO: make this NOT FILE specific...
                    // Create file for parser to parse:
                    // writeToFile(tododelme2 + tododelme, jsonMsg.text, function () {
                    //     parseAndReturnToClient(jsonMsg, tododelme4, connection);
                    // });

                    parseAndReturnToClient(jsonMsg, connection);
                } else {
                    console.log("Error: No text to give to the parser. jsonMsg: " + jsonMsg);
                }
                // TODO del:
                // else {
                //     // there's no text, so let's either parse the memory or parse the given filepath
                //     if (jsonMsg.filePath) {
                //         parseAndReturnToClient(jsonMsg, jsonMsg.filePath, connection);
                //     } 
                //     else {
                //         // there's no filepath, so let's parse the memory
                //         console.log("parsing '" + tododelme2 + tododelme + "'");
                //         // first, write the memory to the data file, and then parse it
                //         writeToFile(tododelme2 + tododelme, allText, function () {
                //             parseAndReturnToClient(jsonMsg, tododelme4, connection);
                //         });
                //     }
                // }
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
                }
                // }
                sendEnd = false;
                // TODO del:
                // } else if (jsonMsg.command == 'clearAnimalFiles') {
                //     var cmd = 'rm ' + tododelme2 + animalDir + '*';
                //     exec(cmd);
                //     console.log("Cleared animal memory files.");
                //     sendEnd = true;
                // } else if (jsonMsg.text) {
                //     allText += jsonMsg.text + '.\n';
                //     sendEnd = true;
            }
            // TODO del:
            // console.log('text in current memory:');
            // console.log(allText);
            if (sendEnd) {
                sendDone(connection);
            }
        }
    });

    connection.on('close', function (connection) {
        // client closed connection
        console.log("Closed connection.\n");
    });
});

// todo del:
// function writeToFile(filename, text, callback) {
//     fs.writeFile(filename, text, function (err) {
//         if (err) {
//             console.error("Error writing to file: " + err);
//         } else {
//             console.log('File successfully written!');
//             if (callback) {
//                 callback();
//             }
//         }
//     });
// }

function returnTextToClient(text, stage, connection) {
    console.log("Returning text to client: " + JSON.stringify({
        'filedata': text,
        'stage': stage
    }));
    connection.sendUTF(
        JSON.stringify({
            'filedata': text,
            'stage': stage
        }));
    sendDone(connection);
}

// TODO DEL:
// function readFileReturnToClient(filename, stage, connection) {
//     console.log('Reading file: ' + filename);
//     fs.readFile(filename, function (err, data) {
//         if (err) {
//             console.error("Error reading file, " + filename + ": " + err);
//         } else {
//             console.log("read from file: " + data);
//             connection.sendUTF(JSON.stringify({
//                 'filedata': new TextDecoder().decode(data),
//                 'stage': stage
//             }));
//             sendDone(connection);
//         }
//     });
// }

function parseAndReturnToClient(jsonMsg, connection) {
    // TODO: make this not require an inputPath!
    // // Execute parsing bash script and return name with readFileReturnToClient
    // var parseCmd = 'cd ' + semParserPath +
    //     ' && sh parse.sh ' + inputPath + ' ' + tododelme3;
    var parseCmd = 'cd ' + semParserPath; // TODO

    console.log(parseCmd);
    exec(parseCmd, function (error, stdout, stderr) {
        if (stdout) {
            console.log('Parser command output:\n' + stdout);
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
            returnTextToClient('TODO get parsed text! (parseAndReturnToClient)', jsonMsg.stage, connection);
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
    connection.sendUTF(JSON.stringify({
        'done': true
    }));
}

console.log("Zhorai's brain is ready for info!");