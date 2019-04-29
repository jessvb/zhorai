/* to connect to website via websocket: */
var WebSocketServer = require('websocket').server;
var http = require('http');
var port = 8080;

/* to write to txt file: */
var fs = require('fs');
var dataDir = 'data/';
var semParserInputFilename = 'input.txt';
var semParserPath = '../../semantic-parser/';
var dataDirRelPath = '../website-server-side/receive-text/' + dataDir;
var semParserInputPath = dataDirRelPath + semParserInputFilename; // relative to semparserfilepath
var allText = '';

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
            // Add received text to allText:
            if (jsonMsg.command == 'makeTextFile') {
                // make a text file with allText
                writeToFile(dataDir + jsonMsg.textFilename, allText);
                // reset allText for next text file
                allText = '';
                sendEnd = true;
            } else if (jsonMsg.command == 'clearMem') {
                // remove all remembered data:
                allText = '';
                if (jsonMsg.textFilename) {
                    // write empty file
                    console.log('emptying file: ' + jsonMsg.textFilename);
                    writeToFile(dataDir + jsonMsg.textFilename, allText);
                }
                sendEnd = true;
            } else if (jsonMsg.command == 'readFile') {
                // get file data and return it to the client
                console.log('Reading file: ' + jsonMsg.filename);
                readFileReturnToClient(jsonMsg.filename, jsonMsg.stage, connection);
                sendEnd = false;
            } else if (jsonMsg.command == 'parse') {
                // if there's text, then write that text to a file and parse it
                if (jsonMsg.text) {
                    // Parse text for name/dictionary/etc.
                    console.log("parsing '" + jsonMsg.text + "'");
                    // Create file for parser to parse:
                    writeToFile(dataDir + semParserInputFilename, jsonMsg.text, function () {
                        parseAndReturnToClient(jsonMsg, connection);
                    });
                } else {
                    // there's no text, so let's parse the memory
                    console.log("parsing '" + dataDir + semParserInputFilename + "'");
                    // first, write the memory to the data file, and then parse it
                    writeToFile(dataDir + semParserInputFilename, allText, function () {
                        parseAndReturnToClient(jsonMsg, connection);
                    });
                }

                sendEnd = false;
            } else if (jsonMsg.text) {
                allText += jsonMsg.text + '.\n';
                sendEnd = true;
            }
            console.log('text in current memory:');
            console.log(allText);
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

function writeToFile(filename, text, callback) {
    fs.writeFile(filename, text, function (err) {
        if (err) {
            console.error("Error writing to file: " + err);
        } else {
            console.log('File successfully written!');
            if (callback) {
                callback();
            }
        }
    });
}

function readFileReturnToClient(filename, stage, connection) {
    console.log('Reading file: ' + filename);
    fs.readFile(filename, function (err, data) {
        if (err) {
            console.error("Error reading file, " + filename + ": " + err);
        } else {
            console.log("read from file: " + data);
            connection.sendUTF(JSON.stringify({
                'filedata': new TextDecoder().decode(data),
                'stage': stage
            }));
            sendDone(connection);
        }
    });
}

function parseAndReturnToClient(jsonMsg, connection) {
    // Execute parsing bash script and return name with readFileReturnToClient
    var parseCmd = 'cd ' + semParserPath +
        ' && sh parse.sh ' + semParserInputPath + ' ' + dataDirRelPath;

    console.log(parseCmd);
    exec(parseCmd, function (error, stdout, stderr) {
        if (stdout) {
            console.log('Parser command output:\n' + stdout);
        }
        if (error) {
            console.log('Function error:\n' + error);
        }
        console.log('Finished parsing and wrote to file: ' + dataDir);

        // return the parsed information to client:
        readFileReturnToClient(dataDir + jsonMsg.typeOutput + '.txt', jsonMsg.stage, connection);
    });
}

function sendDone(connection) {
    // tell the client to close the connection
    connection.sendUTF(JSON.stringify({
        'done': true
    }));
}

console.log("Zhorai's brain is ready for info!");