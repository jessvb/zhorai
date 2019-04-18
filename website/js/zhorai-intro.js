/* -------------- Initialize variables -------------- */
var zhoraiTextColour = "#5d3e9f";
var stages = ['sayHi', 'zAskName', 'respondWithName', 'zAskPlace', 'respondWithPlace', 'zFinish'];
var currStage = 0;
var recordButton;
var zhoraiSpeakBtn;
var zhoraiSpeechBox;
// good voices: Alex pitch 2, Google US English 1.5, Google UK English Female 1.5, Google UK English Male 2
var zhoraiVoice = window.speechSynthesis.getVoices().filter(function (voice) {
    return voice.name == 'Google US English';
})[0];
var currBtnIsMic = true;


/* -------------- Initialize functions -------------- */
// Speaks with the voice set by zhoraiVoice
function speakText(text, callback) {
    // FROM https://developers.google.com/web/updates/2014/01/Web-apps-that-talk-Introduction-to-the-Speech-Synthesis-API
    var msg = new SpeechSynthesisUtterance(makePhonetic(text));

    msg.voice = zhoraiVoice; // Note: some voices don't support altering params
    //msg.voiceURI = 'native';
    msg.volume = 1; // 0 to 1
    msg.rate = 1; // 0.1 to 10
    msg.pitch = 1.5; // 0 to 2
    // msg.text = 'Sounds like a cool place! I\'ve never heard of Boston before';
    msg.lang = 'en-US';

    if (callback) {
        msg.onend = callback;
    }

    window.speechSynthesis.speak(msg);
}

function showPurpleText(text) {
    zhoraiSpeechBox.innerHTML = '<p style="color:' + zhoraiTextColour + '">' + text + '</p>';
}

// Replaces "Zhorai" with "Zor-eye":
function makePhonetic(text) {
    text = text.replace(/Zhorai/gi, 'Zor-eye');
    text = text.replace(/Zorai/gi, 'Zor-eye');
    text = text.replace(/Zohrai/gi, 'Zor-eye');
    text = text.replace(/Zoreye/gi, 'Zor-eye');
    return text;
}

// Returns english voices:
function getEnglishVoices() {
    englishVoices = [];
    speechSynthesis.getVoices().forEach(function (voice) {
        if (voice.lang.includes("en")) {
            // console.log(voice.name, voice.default ? voice.default : '');
            englishVoices.push(voice);
        }
    });
    return englishVoices;
}

// Swaps the visible button from a mic to a zhorai-talk button (or vice versa)
function buttonSwap() {
    if (currBtnIsMic) {
        // swap to zhorai speak button:
        recordButton.hidden = true;
        zhoraiSpeakBtn.hidden = false;
    } else {
        // swap to mic button:
        recordButton.hidden = false;
        zhoraiSpeakBtn.hidden = true;
    }
    currBtnIsMic = !currBtnIsMic;
}

function startStage() {
    var zhoraiSpeech = '';
    switch (stages[currStage]) {
        case 'sayHi':
            // have student say, "Hi Zhorai"
            // 1. write, "Say hi" in textbox
            // TODO
            // 2. prep mic button:
            recordButton.hidden = false;
            zhoraiSpeakBtn.hidden = true;
            break;
        case 'zAskName':
            // have zhorai say, "Hi there! What’s your name?"
            var phrases = ["Hello! What's your name?", "Hi there! What’s your name?"];
            zhoraiSpeech = chooseRandomPhrase(phrases);
            break;
        case 'respondWithName':
            // todo have student say, "I’m <name>" or "<name>" etc.
            break;
        case 'zAskPlace':
            // todo have zhorai say, "Hello <name>, pleased to meet you. Where are you from?"
            break;
        case 'respondWithPlace':
            // todo have student say, "I’m from <place>" or "<place>" etc.
            break;
        case 'zFinish':
            // todo have zhorai say, "That sounds like an interesting place! 
            // I have never heard of <place> before."
            break;
        default:
            console.err("Unknown stage for conversation with Zhorai: " + stages[currStage]);
    }

    showPurpleText(zhoraiSpeech);
    if (zhoraiSpeech) {
        speakText(zhoraiSpeech, function () {
            // after speaking, change to mic again and increment stage
            if (currStage < stages.length - 1) {
                currStage += 1;
            }
            buttonSwap();
            startStage();
        });
    }
}

// when the record button is clicked, start recording and prep for the next stage
function onRecord() {
    // TODO -- recordButtonClick --> pass in afterRecording??
    recordButtonClick({
        callback: afterRecording
    });

}

function afterRecording(recordedSpeech) {
    var recordingIsGood = false;
    var zhoraiSpeech = '';
    console.log("AFTER RECORDING!");
    switch (stages[currStage]) {
        case 'sayHi':
            // test to see if what they said was correct... e.g., "I didn't quite catch that"
            var greetings = ['hi', 'hello', 'hey', 'yo', 'howdy', 'sup', 'hiya',
                'g\'day', 'what\'s up', 'good morning', 'good afternoon', 'meet'
            ];
            var regex = new RegExp(greetings.join("|"), "i");
            var saidHi = regex.test(recordedSpeech);
            if (saidHi) {
                recordingIsGood = true;
            } else {
                var phrases = ["Sorry, what was that?", "Oh, pardon?"];
                zhoraiSpeech = chooseRandomPhrase(phrases);
            }
            break;
        case 'respondWithName':
            // test to see if what they said was correct... e.g., "I didn't quite catch that"
            break;
        case 'respondWithPlace':
            // test to see if what they said was correct... e.g., "I didn't quite catch that"
            break;
        default:
            console.err("Unknown stage for ending a recording: " + stages[currStage]);
    }

    speakText(zhoraiSpeech);
    showPurpleText(zhoraiSpeech);

    if (recordingIsGood) {
        // prepare for next stage (but don't go to next if it's the last stage)
        if (currStage < stages.length - 1) {
            currStage += 1;
        }
        // swap the mic button / zhorai talk button
        buttonSwap();

        // start the next stage
        startStage();
    }
}

/* -------------- Once the page has loaded -------------- */
document.addEventListener('DOMContentLoaded', function () {
    // Initialize variables:
    currStage = 0;
    recordButton = document.getElementById('record_button');
    zhoraiSpeakBtn = document.getElementById('zhoraiSpeakBtn');
    zhoraiSpeechBox = document.getElementById('final_span');

    // remove any memory from previous activites:
    clearMemory("sentences.txt");

    startStage();

    // Add click handlers
    zhoraiSpeakBtn.addEventListener("click", startStage);
    recordButton.addEventListener("click", onRecord);
});