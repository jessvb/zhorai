/*jshint esversion: 6 */

// See https://github.com/gabrielpoca/browser-pcm-stream/blob/master/app.js
// from https://subvisual.co/blog/posts/39-tutorial-html-audio-capture-streaming-to-node-js-no-browser-extensions/

let binaryServer = require('binaryjs').BinaryServer;
let wav = require('wav');

let outFile = 'demo.wav';

let server = binaryServer({
    port: 9001
});

server.on('connection', function (client) {
    // todo:
    console.log("Connected!");

    let fileWriter = new wav.FileWriter(outFile, {
        channels: 1,
        sampleRate: 48000,
        bitDepth: 16
    });

    client.on('stream', function (stream, meta) {
        // todo:
        console.log("streaming... ");
        // console.log(stream._socket._receiver.fragmentedBufferPool._buffer);

        // todo --> do we need to write to a wave file? otherwise, we can pipe the bytes 
        // directly to the model
        stream.pipe(fileWriter);

        stream.on('end', function () {
            fileWriter.end();
            console.log('wrote to file ' + outFile);
        });
    });
});
