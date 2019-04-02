/*jshint esversion: 6 */

// Stream to server:
// https://subvisual.co/blog/posts/39-tutorial-html-audio-capture-streaming-to-node-js-no-browser-extensions/


let currentStream = null;

function streamOrStopAudio() {
    if (!currentStream) {
        // start streaming
        let handleSuccess = function (stream) {
            let context = new AudioContext();
            let source = context.createMediaStreamSource(stream);
            let processor = context.createScriptProcessor(1024, 1, 1);

            source.connect(processor);
            processor.connect(context.destination);

            processor.onaudioprocess = function (e) {
                // Do something with the data, i.e Convert this to WAV
                // console.log(e.inputBuffer);
                console.log("still running");
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