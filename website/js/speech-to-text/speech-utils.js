// From https://developers.google.com/web/updates/2013/01/Voice-Driven-Web-Apps-Introduction-to-the-Web-Speech-API
// NOTE: Pages hosted on HTTPS do not need to ask repeatedly for permission, whereas HTTP hosted pages do.
var imgDir = 'img/';
var start_img;
var final_transcript;
var recognizing;
var recognition;
var current_style;
var afterRecordingCallback;

// These functions are called outside this js file (thus we leave them outside
// the DOMContentLoaded event):
function recordButtonClick(event) {
    if (recognizing) {
        recognition.stop();
    } else {
        final_transcript = '';
        recognition.start();
        console.log("started recognition...");
        ignore_onend = false;
        final_span.innerHTML = '';
        interim_span.innerHTML = '';
        start_img.src = imgDir + 'mic-slash.gif';
        showInfo('info_allow');
        showButtons('none');
        start_timestamp = event.timeStamp;
    }

    if (event.callback) {
        afterRecordingCallback = event.callback;
    }
}

function showInfo(s) {
    if (s) {
        for (var child = info.firstChild; child; child = child.nextSibling) {
            if (child.style) {
                child.style.display = child.id == s ? 'inline' : 'none';
            }
        }
        info.style.visibility = 'visible';
    } else {
        info.style.visibility = 'hidden';
    }
}

function showButtons(style) {
    if (style == current_style) {
        return;
    }
    current_style = style;
}

function chooseRandomPhrase(phrases) {
    return phrases[Math.floor(Math.random() * phrases.length)];
}


/* -------------- Once the page has loaded -------------- */
document.addEventListener('DOMContentLoaded', function () {
    var record_button = document.getElementById('record_button');
    start_img = document.getElementById('start_img');
    var textFileBtn = document.getElementById('textFileBtn');

    final_transcript = '';
    recognizing = false;
    if (textFileBtn) {
        textFileBtn.disabled = false;
    }
    var ignore_onend;
    var start_timestamp;
    if (!('webkitSpeechRecognition' in window)) {
        upgrade();
    } else {
        record_button.style.display = 'inline-block';
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.onstart = function () {
            recognizing = true;
            if (textFileBtn) {
                textFileBtn.disabled = true;
            }
            showInfo('info_speak_now');
            start_img.src = imgDir + 'mic-animate.gif';
        };
        recognition.onerror = function (event) {
            if (event.error == 'no-speech') {
                start_img.src = imgDir + 'mic.gif';
                showInfo('info_no_speech');
                ignore_onend = true;
            }
            if (event.error == 'audio-capture') {
                start_img.src = imgDir + 'mic.gif';
                showInfo('info_no_microphone');
                ignore_onend = true;
            }
            if (event.error == 'not-allowed') {
                if (event.timeStamp - start_timestamp < 100) {
                    showInfo('info_blocked');
                } else {
                    showInfo('info_denied');
                }
                ignore_onend = true;
            }
        };
        recognition.onend = function () {
            recognizing = false;
            if (textFileBtn) {
                textFileBtn.disabled = false;
            }
            if (ignore_onend) {
                return;
            }
            start_img.src = imgDir + 'mic.gif';
            if (!final_transcript) {
                showInfo('info_start');
                return;
            }
            showInfo('');
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
                var range = document.createRange();
                range.selectNode(document.getElementById('final_span'));
                window.getSelection().addRange(range);
            }
            console.log("stopped recognition. sending to server:" + final_transcript);
            sendText(final_transcript);

            if (afterRecordingCallback) {
                afterRecordingCallback(final_transcript);
                afterRecordingCallback = null;
            }
        };
        recognition.onresult = function (event) {
            var interim_transcript = '';
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final_transcript += event.results[i][0].transcript;
                } else {
                    interim_transcript += event.results[i][0].transcript;
                }
            }
            final_transcript = capitalize(final_transcript);
            final_span.innerHTML = linebreak(final_transcript);
            interim_span.innerHTML = linebreak(interim_transcript);
            if (final_transcript || interim_transcript) {
                showButtons('inline-block');
            }
        };
    }

    function upgrade() {
        record_button.style.visibility = 'hidden';
        showInfo('info_upgrade');
    }
    var two_line = /\n\n/g;
    var one_line = /\n/g;

    function linebreak(s) {
        return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
    }
    var first_char = /\S/;

    function capitalize(s) {
        return s.replace(first_char, function (m) {
            return m.toUpperCase();
        });
    }
}, false);