/*jshint esversion: 6 */

// Stream to server:
// https://subvisual.co/blog/posts/39-tutorial-html-audio-capture-streaming-to-node-js-no-browser-extensions/
// from google (newer): https://developers.google.com/web/fundamentals/media/recording-audio/


let currentStream = null;
let bufferSize = 2048;
let serverUrl = 'ws://localhost:9001';

/* -------------- Helper Functions -------------- */
function convertFloat32ToInt16(buffer) {
    l = buffer.length;
    buf = new Int16Array(l);
    while (l--) {
        buf[l] = Math.min(1, buffer[l]) * 0x7FFF;
    }
    return buf.buffer;
}

function setupStream() {
    // Stream to server requirements:
    let client = new BinaryClient(serverUrl);
    client.on('open', function () {
        // for the sake of this example let's put the stream in the window
        window.Stream = client.createStream();
    });
}

function streamOrStopAudio() {
    if (!currentStream) {
        // start streaming
        // todo: change button to say "stop recording"

        // Handle recording success:
        let handleRecordSuccess = function (stream) {
            setupStream();
            // Recording requirements:
            let context = new AudioContext();
            let source = context.createMediaStreamSource(stream);
            let processor = context.createScriptProcessor(bufferSize, 1, 1);

            source.connect(processor);
            processor.connect(context.destination);

            processor.onaudioprocess = function (e) {
                // Send the data to a server
                let left = e.inputBuffer.getChannelData(0);
                // Start streaming to server!
                window.Stream.write(convertFloat32ToInt16(left));
                console.log("int 16: " + convertFloat32ToInt16(left)); // todo del
            };

            console.log(source);
            currentStream = source.mediaStream;
        };

        navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false
            })
            .then(handleRecordSuccess);
    } else {
        // todo: change button to say "record"
        // TODO: stop recording (below doesn't work :( )) 
        // --> causes jittery streaming after clicking record more than once because it's trying 
        // to send a bunch of streams at once :/
        console.log("Stopping stream.");
        currentStream.getTracks().forEach(function (track) {
            console.log("stopping track: " + track);
            track.stop();
        });
        currentStream = null;

        // Close the websocket:
        window.Stream.end();
    }
}



/* -------------- Once the page has loaded -------------- */
document.addEventListener('DOMContentLoaded', function () {
    let recordBtn = document.getElementById('recordBtn');

    recordBtn.addEventListener('click', streamOrStopAudio);
}, false);
