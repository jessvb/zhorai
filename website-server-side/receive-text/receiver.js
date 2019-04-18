/* to connect to website via websocket: */
var WebSocketServer = require('websocket').server;
var http = require('http');
var port = 8080;

/* to write to txt file: */
var fs = require('fs');
var dataDir = 'data/';
var allText = '';


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
        if (message.type === 'utf8') {
            // process WebSocket message
            console.log(message.utf8Data);

            jsonMsg = JSON.parse(message.utf8Data);
            // Add received text to allText:
            if (jsonMsg.text) {
                allText += jsonMsg.text + '\n';
            }

            // make a text file:
            if (jsonMsg.command == 'makeTextFile') {
                // make a text file with allText
                writeToFile(dataDir + jsonMsg.textFilename, allText);
                // reset allText for next text file
                allText = '';
            }

            console.log('text thus far:');
            console.log(allText);
        }
    });

    connection.on('close', function (connection) {
        // close user connection
        console.log("Closed connection.");
    });
});

function writeToFile(filename, text) {
    fs.writeFile(filename, text, function (err) {
        if (err) {
            console.err("Error writing to file: " + err);
        } else {
            console.log('File successfully written!');
        }
    });
}