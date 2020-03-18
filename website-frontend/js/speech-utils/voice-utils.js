var zhoraiVoice;
var msg; // this is global because of a strange bug: https://stackoverflow.com/a/35935851

/**
 * Speaks with the voice set by zhoraiVoice
 * @param {*} text: the text zhorai says
 * @param {*} onSpeak: a function that's called when zhorai starts speaking
 * @param {*} callback: a function that's called when zhorai is done speaking
 */
function speakText(text, onSpeak, callback) {
    // FROM https://developers.google.com/web/updates/2014/01/Web-apps-that-talk-Introduction-to-the-Speech-Synthesis-API
    msg = new SpeechSynthesisUtterance(makePhonetic(text));

    msg.voice = zhoraiVoice; // Note: some voices don't support altering params
    msg.volume = 1; // 0 to 1
    msg.rate = 1.2; // 0.1 to 10
    msg.pitch = 2; // 0 to 2
    msg.lang = 'en-US';

    // onSpeak e.g., set the button to the "hear again" button
    if (onSpeak) {
        onSpeak();
    }

    if (callback) {
        // msg.onend = callback;
        msg.onend = function () {
            callback();
        };
    }

    window.speechSynthesis.speak(msg);
}

/* -------------- Once the page has loaded -------------- */
document.addEventListener('DOMContentLoaded', function () {
    // Prepare Zhorai's voice:
    window.speechSynthesis.onvoiceschanged = function () {
        // good voices: Alex pitch 2, Google US English 1.5, Google UK English Female 1.5, Google UK English Male 2 --> speed = 1.1
        // Karen 2, Melina 2, Google US English Female 2 (put speed = 1.2 for Karen/Melina)
        zhoraiVoice = window.speechSynthesis.getVoices().filter(function (voice) {
            return voice.name == 'Melina';
            // return voice.name == 'Google US English Female';
            // return voice.name == 'Google UK English Female';
            // return voice.name == 'Google UK English Male';
            // return voice.name == 'Alex';
        })[0];
    };
});
