/* -------------- Initialize variables -------------- */
var nextPagePath = 'index.html';
var zhoraiTextColour = "#5d3e9f";
var stages = ['sayHi',
    'zAskName',
    'respondWithName',
    'respondWithPlace',
    'zFinish'
];
var currStage = 0;
var infoLabel;
var recordButton;
var zhoraiSpeakBtn;
var zhoraiSpeechBox;
var zhoraiVoice;
var currBtnIsMic = true;
var dataFilename = "../../website-server-side/receive-text/data/name.txt";
var currName = '';
var currPlace = '';


/* -------------- Initialize functions -------------- */
/**
 * Speaks with the voice set by zhoraiVoice
 * @param {*} text 
 * @param {*} callback 
 */
function speakText(text, callback) {
    // FROM https://developers.google.com/web/updates/2014/01/Web-apps-that-talk-Introduction-to-the-Speech-Synthesis-API
    var msg = new SpeechSynthesisUtterance(makePhonetic(text));

    msg.voice = zhoraiVoice; // Note: some voices don't support altering params
    //msg.voiceURI = 'native';
    msg.volume = 1; // 0 to 1
    msg.rate = 1.1; // 0.1 to 10
    msg.pitch = 1.5; // 0 to 2
    msg.lang = 'en-US';

    if (callback) {
        console.log('callback!! ' + callback);
        msg.onend = callback;
    }

    // set the button to the "hear again" button
    msg.onstart = function () {
        switchButtonTo('speakBtn');
    };

    window.speechSynthesis.speak(msg);
}

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
            // console.log(voice.name, voice.default ? voice.default : '');
            englishVoices.push(voice);
        }
    });
    return englishVoices;
}

/**
 * Swaps the visible button from a mic to a zhorai-talk button (or vice versa)
 * @param {*} toButton If toButton is not specified, it flips the current button, 
 * otherwise, toButton can be specified as 'micBtn' or 'speakBtn'
 */
function buttonSwap(toButton) {
    if (!toButton) {
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
    } else {
        switchButtonTo(toButton);
    }
}

/**
 * Switches the button to the specified button (either 'micBtn' or 'speakBtn')
 * @param {*} toButton 
 */
function switchButtonTo(toButton) {
    if (toButton == 'micBtn') {
        recordButton.hidden = false;
        zhoraiSpeakBtn.hidden = true;
        currBtnIsMic = true;
    } else if (toButton == 'speakBtn') {
        recordButton.hidden = true;
        zhoraiSpeakBtn.hidden = false;
        currBtnIsMic = false;
    } else if (toButton == 'mod1Btn') {
        document.getElementById('mod1Btn').hidden = false;
        recordButton.hidden = true;
        zhoraiSpeakBtn.hidden = true;
        currBtnIsMic = false;
    } else if (!toButton) {
        console.log('No button specified. Not switching button.');
    } else {
        console.error('Unknown button: ' + toButton + '. Did not switch button.');
    }
}

function startStage() {
    var zhoraiSpeech = '';
    var goToNext = false;
    var toButton = null;
    switch (stages[currStage]) {
        case 'sayHi':
            // have student say, "Hi Zhorai"
            // 1. write, "Say hi" in textbox
            infoLabel.innerHTML = 'Say "hi"!';
            // 2. prep mic button:
            toButton = 'micBtn';
            break;
        case 'zAskName':
            // have zhorai say, "Hi there! What’s your name?"
            var phrases = ["Hello there! I don't think we've met. What's your name?",
                "Hello! I don't remember meeting you before. What's your name?",
                "Hi there! What’s your name?"
            ];
            zhoraiSpeech = chooseRandomPhrase(phrases);
            goToNext = true;
            toButton = 'micBtn';
            break;
        case 'respondWithName':
            // 1. write "what's your name?"
            infoLabel.innerHTML = 'Zhorai says, "What\'s your name?"';
            // 2. have student say, "I’m <name>" or "<name>" etc.
            // 3. this will take us to the "afterRecording" and then "introReceiveData()" 
            // method
            // 4. zhorai will respond, asking where they're from
            toButton = 'micBtn';
            break;
        case 'respondWithPlace':
            // 1. have student say, "I’m from <place>" or "<place>" etc.
            infoLabel.innerHTML = 'Zhorai says, "Where are you from?"';
            // 2. this will take us to the "afterRecording" and then "introReceiveData()" 
            // method 
            // 3. zhorai will respond with "Interesting! I've never heard of <place>, before. 
            // I'd love to learn more."
            toButton = 'micBtn';
            break;
        case 'zFinish':
            // change button to module 1 button: Teach Zhorai about earth
            toButton = 'mod1Btn';
            break;
        default:
            console.error("Unknown stage for conversation with Zhorai: " + stages[currStage]);
    }
    finishStage(goToNext, zhoraiSpeech, toButton);
}

/**
 * when the record button is clicked, start recording and prep for the next stage
 */
function onRecord() {
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
            // clear memory so that we don't have two name sentences:
            clearMemory();
            break;
        case 'respondWithName':
        case 'respondWithPlace':
            // get name/place from server:
            // TODO: del readfile and instead: parseSpeech(recordedSpeech, stages[currStage])
            readFile(dataFilename, stages[currStage] + "_intro");
            // this will call the introReceiveData() method, in which zhorai responds
            break;
        default:
            console.error("Unknown stage for ending a recording: " + stages[currStage]);
    }

    finishStage(recordingIsGood, zhoraiSpeech, 'micBtn');
}

function introReceiveData(filedata) {
    var phrases = [];
    var zhoraiSpeech = '';
    var recordingIsGood = false;
    var toButton = 'micBtn';
    switch (stages[currStage]) {
        case 'respondWithName':
            // test to see if what they said was correct... e.g., "I didn't quite catch that"
            if (filedata) {
                // got a name! Capitalize and store it:
                currName = filedata.charAt(0).toUpperCase() + filedata.slice(1);
                recordingIsGood = true;
                phrases = ["Hello, " + currName + "! Nice to meet you! Where are you from?",
                    "Nice to meet you, " + currName + "! Where are you from?",
                    currName + ". What a nice name! Where are you from?"
                ];
            } else {
                phrases = ["I didn't quite catch that.", "Sorry, I missed that.", "Pardon?",
                    "Sorry, could you repeat that?"
                ];
            }
            break;
        case 'respondWithPlace':
            // test to see if what they said was correct... e.g., "I didn't quite catch that"
            if (filedata) {
                // got a name! Capitalize it:
                currPlace = filedata.charAt(0).toUpperCase() + filedata.slice(1);
                recordingIsGood = true;
                phrases = ["Ooo, " + currPlace + " sounds interesting! I'm from planet Igbruhmmelkin, so I've never heard of " + currPlace + " before! Tell me more!",
                    currPlace + " sounds cool! I have no idea where that is, since I'm from another planet! I'd love to hear more!",
                    "Interesting! I'm from planet Igbruhmmelkin. I've never heard of " + currPlace + " before. Can you tell me more?"
                ];
            } else {
                phrases = ["I didn't quite catch that.", "Sorry, I missed that.", "Pardon?",
                    "Sorry, could you repeat that, " + currName + "?"
                ];
            }
            break;
        default:
            console.error("Unknown stage for receiving data: " + stages[currStage]);
    }

    zhoraiSpeech = chooseRandomPhrase(phrases);
    finishStage(recordingIsGood, zhoraiSpeech, toButton);
}

/**
 * 
 * @param {*} goToNext boolean: if true, the currStage will be incremented and 
 * the gui prepared for next stage
 * @param {*} zhoraiSpeech string: if specified, zhorai will speak
 * @param {*} toButton string: if specified, the button will be set to 'micBtn' or 'speakBtn'
 * before starting the next stage (or right away, if not starting the next stage)
 */
function finishStage(goToNext, zhoraiSpeech, toButton) {
    showPurpleText(zhoraiSpeech);

    if (goToNext) {
        var nextStage = function () {
            // prepare for next stage (but don't go to next if it's the last stage)
            if (currStage < stages.length - 1) {
                currStage += 1;
            }
            // swap the mic button / zhorai talk button
            switchButtonTo(toButton);
            // start the next stage
            startStage();
        };

        if (zhoraiSpeech) {
            speakText(zhoraiSpeech, nextStage);
        } else {
            nextStage();
        }
    } else {
        if (zhoraiSpeech) {
            speakText(zhoraiSpeech, function () {
                switchButtonTo(toButton);
            });
        } else {
            switchButtonTo(toButton);
        }
    }
}

/* -------------- Once the page has loaded -------------- */
document.addEventListener('DOMContentLoaded', function () {
    // Initialize variables:
    currStage = 0;
    infoLabel = document.getElementById('z_info_label');
    recordButton = document.getElementById('record_button');
    zhoraiSpeakBtn = document.getElementById('zhoraiSpeakBtn');
    zhoraiSpeechBox = document.getElementById('final_span');

    // remove any memory from previous activites:
    clearMemory("sentences.txt");

    // Prepare Zhorai's voice:
    window.speechSynthesis.onvoiceschanged = function () {
        // good voices: Alex pitch 2, Google US English 1.5, Google UK English Female 1.5, Google UK English Male 2
        zhoraiVoice = window.speechSynthesis.getVoices().filter(function (voice) {
            return voice.name == 'Google US English';
            // return voice.name == 'Google UK English Female';
            // return voice.name == 'Google UK English Male';
            // return voice.name == 'Alex';
        })[0];
    };

    startStage();

    // Add click handlers
    zhoraiSpeakBtn.addEventListener("click", startStage);
    recordButton.addEventListener("click", onRecord);
    document.getElementById('mod1Btn').addEventListener("click", function () {
        window.location.href = nextPagePath;
    });
});