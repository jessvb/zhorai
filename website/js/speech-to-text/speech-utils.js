// From https://developers.google.com/web/updates/2013/01/Voice-Driven-Web-Apps-Introduction-to-the-Web-Speech-API
// NOTE: Pages hosted on HTTPS do not need to ask repeatedly for permission, whereas HTTP hosted pages do.
const imgDir = 'img/';
/* -------------- Once the page has loaded -------------- */
document.addEventListener('DOMContentLoaded', function () {
    var start_button = document.getElementById('start_button');
    var start_img = document.getElementById('start_img');

    // var create_email = false;
    var final_transcript = '';
    var recognizing = false;
    var ignore_onend;
    var start_timestamp;
    if (!('webkitSpeechRecognition' in window)) {
        upgrade();
    } else {
        start_button.style.display = 'inline-block';
        var recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.onstart = function () {
            recognizing = true;
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
            // if (create_email) {
            //     create_email = false;
            //     createEmail();
            // }
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
        start_button.style.visibility = 'hidden';
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

    start_button.addEventListener("click", startButtonClick);

    function startButtonClick(event) {
        if (recognizing) {
            recognition.stop();
            console.log("stopped recognition. outputting to txt file:");
            // TODO: appendToFile(final_transcript);
        } else {
            final_transcript = '';
            // recognition.lang = select_dialect.value;
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
    var current_style;

    function showButtons(style) {
        if (style == current_style) {
            return;
        }
        current_style = style;
        // copy_button.style.display = style;
        // email_button.style.display = style;
        // copy_info.style.display = 'none';
        // email_info.style.display = 'none';
    }
}, false);