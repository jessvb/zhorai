/*jshint esversion: 6 */

// Stream to server:
// https://subvisual.co/blog/posts/39-tutorial-html-audio-capture-streaming-to-node-js-no-browser-extensions/
// from google (newer): https://developers.google.com/web/fundamentals/media/recording-audio/


let currentStream = null;

function streamOrStopAudio() {
    if (!currentStream) {
        // start streaming
        let handleSuccess = function (stream) {
            let bufferSize = 2048;

            let context = new AudioContext();
            let source = context.createMediaStreamSource(stream);
            let processor = context.createScriptProcessor(bufferSize, 1, 1);

            source.connect(processor);
            processor.connect(context.destination);

            // todo del:
            if (window.URL) {
                player.srcObject = stream;
            } else {
                player.src = stream;
            }

            processor.onaudioprocess = function (e) {
                // Do something with the data, i.e Convert this to WAV
                // console.log(e.inputBuffer);
                console.log("still running");
                let left = e.inputBuffer.getChannelData(0);
                console.log(left);
            };

            console.log(source);
            currentStream = source.mediaStream;
        };

        navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false
            })
            .then(handleSuccess);
    } else {
        // stop streaming
        currentStream.getTracks().forEach(function (track) {
            console.log("stopping track: " + track);
            track.stop();
        });
        currentStream = null;
    }
}



/* -------------- Once the page has loaded -------------- */
document.addEventListener('DOMContentLoaded', function () {
    let recordBtn = document.getElementById('recordBtn');
    recordBtn.addEventListener('click', streamOrStopAudio);
}, false);