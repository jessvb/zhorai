// Imports required libraries
const speechToText = require('@google-cloud/speech');
const fs = require('fs');

async function buildTextFile() {
    // Creates a client
    const client = new speechToText.SpeechClient();

    // The name of the audio file to transcribe
    // const fileName = './resources/audio.raw';
    const fileName = './example_speech_2.wav';

    // Reads a local audio file and converts it to base64
    const file = fs.readFileSync(fileName);
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
    fs.appendFile('speech_text.txt', transcription + "\n", function (err) {
        if (err) {
            console.log("Error writing speech-to-text file: " + err);
        } else {
            console.log("Successfully appended transcription.");
        }
    });
}

buildTextFile().catch(console.error);