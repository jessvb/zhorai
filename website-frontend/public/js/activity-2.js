/* -------------- Initialize variables -------------- */
var recordButton;
var recordBtnCurrHandler; // Reference so we can remove/replace handler depending on curranimal
var zhoraiTextColour = "#5d3e9f";
var promptLabel;
var zhoraiSpeechBox;
var loadingGif;
var currBtnIsMic = true;
var mindmapPath = "../../website-backend/receive-text/data/mindmap.txt";
var currentSubject = "";
var sm;
// Note: in this case, currentSubject will always be set to "yourself" 
// (we're only teaching zhorai about ourselves, not animals etc.)

/* -------------- Initialize functions -------------- */
function showPurpleText(text) {
    zhoraiSpeechBox.innerHTML = '<p style="color:' + zhoraiTextColour + '">' + text + '</p>';
}

/**
 * Replaces "Zhorai" with "Zor-eye":
 * @param {*} text
 */
function makePhonetic(text) {
    text = text.replace(/Zhorai/gi, 'Zor-eye');
    text = text.replace(/Zorai/gi, 'Zor-eye');
    text = text.replace(/Zohrai/gi, 'Zor-eye');
    text = text.replace(/Zoreye/gi, 'Zor-eye');
    return text;
}

/**
 * Returns list of english voices:
 */
function getEnglishVoices() {
    englishVoices = [];
    speechSynthesis.getVoices().forEach(function (voice) {
        if (voice.lang.includes("en")) {
            englishVoices.push(voice);
        }
    });
    return englishVoices;
}

/**
 * Switches the button to the specified button (either 'micBtn' or 'speakBtn')
 * @param {*} toButton
 */
function switchButtonTo(toButton) {
    if (toButton == 'micBtn') {
        recordButton.hidden = false;
        loadingGif.hidden = true;
        textFileBtn.hidden = true;
        currBtnIsMic = true;
    } else if (toButton == 'speakBtn') {
        recordButton.hidden = true;
        loadingGif.hidden = true;
        textFileBtn.hidden = true;
        currBtnIsMic = false;
    } else if (toButton == 'loading') {
        loadingGif.hidden = false;
        recordButton.hidden = true;
        textFileBtn.hidden = true;
        currBtnIsMic = false;
    } else if (toButton == 'textFileBtn') {
        textFileBtn.hidden = false;
        loadingGif.hidden = true;
        recordButton.hidden = true;
        currBtnIsMic = false;
    } else if (toButton == 'micAndTextFileBtn') {
        textFileBtn.hidden = false;
        recordButton.hidden = false;
        loadingGif.hidden = true;
        currBtnIsMic = true;
    } else if (!toButton) {
        console.log('No button specified. Not switching button.');
    } else {
        console.error('Unknown button: ' + toButton + '. Did not switch button.');
    }
}

function mod2ReceiveData(filedata) {
    // Check to see if there was a hangup because of a bad sentence
    if (filedata.includes("BAD ENGLISH")) {
        // one of the sentences entered was confusing english... have to redo :(
        var phrases = ['One of those sentences confused me and I forgot the rest of what you said! Could you please re-teach me about ' + currentSubject + '?',
            'I\'m sorry, I got confused in the middle of what you were saying. Could you please teach me again about ' + currentSubject + '?',
            'Oops, I got confused by something you said and forgot everything you taught me about ' + currentSubject + '! Could you please teach me again?'
        ];
        var toSpeak = chooseRandomPhrase(phrases);
        showPurpleText(toSpeak);
        speakText(toSpeak);

        switchButtonTo('micAndTextFileBtn');
    } else if (filedata.includes("ERR_NO_TEXT")) {
        // There were no sentences saved for this animal... Let the user know:
        var phrases = ['Hmm, I actually don\'t know much of anything about you yet. Could you please teach me?',
            'I haven\'t learned about you yet, actually! Could you tell me about ' + currentSubject + '?',
            'Oops! I don\'t know anything about you yet. Could you teach me some things?'
        ];
        var toSpeak = chooseRandomPhrase(phrases);
        showPurpleText(toSpeak);
        speakText(toSpeak);

        switchButtonTo('micAndTextFileBtn');
    } else {
        // We're done parsing and reading the mindmap text file!
        // create the mindmap!
        console.log('Creating mindmap! filedata:');
        filedata = filedata.replace(/'/g, '"');
        console.log(filedata);
        console.log(JSON.parse(filedata));

        switchButtonTo('micAndTextFileBtn');
        createMindmap(JSON.parse(filedata));

        sm.setDivToSessionSentences(currentSubject);
    }
}

function setPrompt() {
    promptLabel.innerHTML = "Zhorai would like to know more about you! Could you teach it about " + currentSubject + "?";
    textFileLabel.innerHTML = "Once you're done teaching Zhorai about " +
        currentSubject + ", click the button below.";
}

/* -------------- Once the page has loaded -------------- */
document.addEventListener('DOMContentLoaded', function () {
    // Initialize variables:
    currStage = 0;
    promptLabel = document.getElementById('promptLabel');
    recordButton = document.getElementById('record_button');
    zhoraiSpeechBox = document.getElementById('final_span');
    loadingGif = document.getElementById('loadingGif');
    textFileLabel = document.getElementById('textFileLabel');
    textFileBtn = document.getElementById('textFileBtn');
    currentSubject = 'yourself';

    // Restart speech synthesizer:
    // (see https://stackoverflow.com/a/58775876/8162699)
    window.speechSynthesis.cancel();

    setPrompt();

    // Create sentence manager and put all known sentences about the current animal on the page
    sm = new SentenceManager(document.getElementById("sentencesDiv"), "./img/x_del.svg");
    // Add all sentences in memory to page:
    sm.setDivToSessionSentences(currentSubject);

    // Add click handlers
    setUpRecordingHandlers(record_button, function () {
        recordButtonClick({
            key: currentSubject,
            sentenceManager: sm
        });
    });
    textFileBtn.addEventListener('click', function () {
        switchButtonTo('loading');
        // say something about how we're going to display Zhorai's thoughts after parsing
        var phrases = ['Thanks for teaching me about ' + currentSubject + '! Let me think about all these new things and show you my thoughts.',
            "Wow, you sound really interesting! Let me think for a bit and then I'll show you my thoughts.",
            "I really enjoyed hearing more about you! I'll show you what I understand after I think for a little while."
        ];
        var toSpeak = chooseRandomPhrase(phrases);
        showPurpleText(toSpeak);
        speakText(toSpeak);

        // delete the current mindmap to prepare for the next
        deleteMindmap();

        // send a command to the server to parse what's in the session memory,
        parseSession('Mindmap', currentSubject, 'parsing' + '_mod2');
        // when done parsing, create the mind map (in mod2ReceiveData)
    });
});