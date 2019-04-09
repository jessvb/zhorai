// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');

// Import other required libraries
const fs = require('fs');
const util = require('util');
async function buildAudioFile() {
    // Creates a client
    var client;
    try {
        //const client = new textToSpeech.TextToSpeechClient();
        client = new textToSpeech.TextToSpeechClient();
        // The text to synthesize
        var text = fs.readFileSync("./input.txt").toString('utf-8');
        // const text = 'Hello, my name is Zhorai!';

        // Construct the request
        const request = {
            input: {text: text},
            // Select the language and SSML Voice Gender (optional)
            voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
            // Select the type of audio encoding
            audioConfig: {audioEncoding: 'MP3',
                // Change the pitch to be less male (and more gender neutral):
                pitch: 3
            }
        };

        // Performs the Text-to-Speech request
        const [response] = await client.synthesizeSpeech(request);
        // Write the binary audio content to a local file
        const writeFile = util.promisify(fs.writeFile);
        await writeFile('output.mp3', response.audioContent, 'binary');
        console.log('Audio content written to file: output.mp3');
    } catch (err) { console.log("An error occurred while synthesizing text: "
        + err); }
}

buildAudioFile();
