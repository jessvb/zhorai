// From https://developers.google.com/web/updates/2013/01/Voice-Driven-Web-Apps-Introduction-to-the-Web-Speech-API
// NOTE: Pages hosted on HTTPS do not need to ask repeatedly for permission, whereas HTTP hosted pages do.
var imgDir = 'img/';
var start_img;
var final_transcript;
var recognizing;
var recognition;
var current_style;
var afterRecordingCallback;
var onClickStop;
var onClickStopParam;
var doneProcessing = false;
var doneRecording = false;

// These functions are called outside this js file (thus we leave them outside
// the DOMContentLoaded event):
function recordButtonClick(event) {
    // save callbacks for after recording/processing
    if (event.callback) {
        afterRecordingCallback = event.callback;
    }
    if (event.onClickStop) {
        onClickStop = event.onClickStop;
        if (event.onClickStopParam) {
            onClickStopParam = event.onClickStopParam;
        }
    }

    // start or stop recording
    if (recognizing) {
        // clicked to stop recording 
        recognition.stop();
        doneRecording = true;
        // stopped recording callback
        if (onClickStop) {
            // e.g., change to loading icon
            onClickStop(onClickStopParam);
        }
        // if we're done processing and recording, then:
        if (doneProcessing && doneRecording) {
            whenDoneRecAndProcessing();
        }
    } else {
        // clicked to start recording
        doneProcessing = false;
        doneRecording = false;

        final_transcript = '';
        recognition.start();
        ignore_onend = false;
        final_span.innerHTML = '';
        interim_span.innerHTML = '';
        start_img.src = imgDir + 'mic-slash.gif';
        showInfo('info_allow');
        showButtons('none');
        start_timestamp = event.timeStamp;
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

function whenDoneRecAndProcessing() {
    if (afterRecordingCallback) {
        afterRecordingCallback(final_transcript);
    }
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
            doneProcessing = true;
            // if we're done processing and recording, then:
            if (doneProcessing && doneRecording) {
                whenDoneRecAndProcessing();
            }
            // send the transcript to the server
            sendText(final_transcript);

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