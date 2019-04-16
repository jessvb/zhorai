/*jshint esversion: 6 */

// See https://github.com/gabrielpoca/browser-pcm-stream/blob/master/app.js
// from https://subvisual.co/blog/posts/39-tutorial-html-audio-capture-streaming-to-node-js-no-browser-extensions/

// Import libraries for streaming
let binaryServer = require('binaryjs').BinaryServer;
let wav = require('wav');

// Import libraries for speech-to-text
const speechToText = require('@google-cloud/speech');
const fs = require('fs');

let dataDir = 'data/';
let wavFilename = dataDir + 'speech.wav';
let txtFilename = dataDir + 'speech.txt';

let server = binaryServer({
    port: 9001
});

/* ------------------------------------------------------------------- */
/* --------- Start capturing stream and generating wave file --------- */
/* ------------------------------------------------------------------- */
server.on('connection', function (client) {
    // todo:
    console.log("Connected!");

    let fileWriter = new wav.FileWriter(wavFilename, {
        channels: 1,
        sampleRate: 48000,
        bitDepth: 16
    });

    client.on('stream', function (stream, meta) {
        // todo:
        console.log("Creating wave file from stream...");
        // console.log(stream._socket._receiver.fragmentedBufferPool._buffer);

        // todo --> do we need to write to a wave file? otherwise, we can pipe the bytes 
        // directly to the model
        stream.pipe(fileWriter);

        stream.on('end', function () {
            // TODO: this is never called... (never stops streaming?)
            fileWriter.end();
            console.log('Wrote wave file: ' + wavFilename);

            // Convert .wav to text:
            buildTextFile().catch(console.error);
        });
    });
});

/* ------------------------------------------------------------------ */
/* --------- Create a text file from the captured wave file --------- */
/* ------------------------------------------------------------------ */
async function buildTextFile() {
    // Creates a client
    const client = new speechToText.SpeechClient();

    // Reads a local audio file and converts it to base64
    const file = fs.readFileSync(wavFilename);
    const audioBytes = file.toString('base64');

    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    const audio = {
        content: audioBytes,
    };
    const config = {
        encoding: 'LINEAR16',
        sampleRateHertz: 48000,
        languageCode: 'en-US',
        enableAutomaticPunctuation: true,
    };
    const request = {
        audio: audio,
        config: config,
    };

    // Detects speech in the audio file
    const [response] = await client.recognize(request);
    const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
    console.log(`Transcription: ${transcription}`);
    fs.appendFile(txtFilename, transcription + "\n", function (err) {
        if (err) {
            console.log("Error writing speech-to-text file: " + err);
        } else {
            console.log("Successfully appended transcription to .txt file: " + txtFilename);
        }
    });
}


