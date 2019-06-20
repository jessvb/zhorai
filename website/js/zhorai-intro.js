/* -------------- Initialize variables -------------- */
var nextPagePath = 'module-1.html';
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
var mod1Btn;
var loadingGif;
var currBtnIsMic = true;
var dataFilename = "../../website-server-side/receive-text/data/name.txt";


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
        mod1Btn.hidden = true;
        loadingGif.hidden = true;
        currBtnIsMic = true;
    } else if (toButton == 'speakBtn') {
        recordButton.hidden = true;
        zhoraiSpeakBtn.hidden = false;
        mod1Btn.hidden = true;
        loadingGif.hidden = true;
        currBtnIsMic = false;
    } else if (toButton == 'mod1Btn') {
        mod1Btn.hidden = false;
        recordButton.hidden = true;
        zhoraiSpeakBtn.hidden = true;
        loadingGif.hidden = true;
        currBtnIsMic = false;
    } else if (toButton == 'loading') {
        loadingGif.hidden = false;
        recordButton.hidden = true;
        zhoraiSpeakBtn.hidden = true;
        mod1Btn.hidden = true;
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
    switch (stages[currStage]) {
        case 'sayHi':
            // have student say, "Hi Zhorai"
            // 1. write, "Say hi" in textbox
            infoLabel.innerHTML = 'Say "hi"!';
            break;
        case 'zAskName':
            // have zhorai say, "Hi there! What’s your name?"
            var phrases = ["Hello there! I don't think we've met. What's your name?",
                "Hello! I don't remember meeting you before. What's your name?",
                "Hi there! What’s your name?"
            ];
            zhoraiSpeech = chooseRandomPhrase(phrases);
            goToNext = true;
            break;
        case 'respondWithName':
            // 1. write "what's your name?"
            infoLabel.innerHTML = 'Zhorai says, "What\'s your name?"';
            // 2. have student say, "I’m <name>" or "<name>" etc.
            // 3. this will take us to the "afterRecording" and then "introReceiveData()" 
            // method
            // 4. zhorai will respond, asking where they're from
            break;
        case 'respondWithPlace':
            // 1. have student say, "I’m from <place>" or "<place>" etc.
            infoLabel.innerHTML = 'Zhorai says, "Where are you from?"';
            // 2. this will take us to the "afterRecording" and then "introReceiveData()" 
            // method 
            // 3. zhorai will respond with "Interesting! I've never heard of <place>, before. 
            // I'd love to learn more."
            break;
        case 'zFinish':
            infoLabel.innerHTML = 'Find out what Zhorai knows about your planet!';
            // change button to module 1 button: Ask Zhorai about ecosystems
            break;
        default:
            console.error("Unknown stage for conversation with Zhorai: " + stages[currStage]);
    }
    finishStage(goToNext, zhoraiSpeech);
}

function afterRecording(recordedText) {
    var recordingIsGood = false;
    var zhoraiSpeech = '';
    switch (stages[currStage]) {
        case 'sayHi':
            // test to see if what they said was correct... e.g., "I didn't quite catch that"
            var greetings = ['hi', 'hello', 'hey', 'yo', 'howdy', 'sup', 'hiya',
                'g\'day', 'what\'s up', 'good morning', 'good afternoon', 'meet'
            ];
            var regex = new RegExp(greetings.join("|"), "i");
            var saidHi = regex.test(recordedText);
            if (saidHi) {
                recordingIsGood = true;
            } else {
                var phrases = ["Sorry, what was that?", "Oh, pardon?"];
                zhoraiSpeech = chooseRandomPhrase(phrases);
            }
            // TODO: clearing mem shouldn't be nec any more, right??:
            // // clear memory so that we don't have two name sentences:
            // clearMemory();
            break;
        case 'respondWithName':
        case 'respondWithPlace':
            // get name/place from server:
            parseText(recordedText, 'name', stages[currStage] + "_intro");
            // this will call the introReceiveData() method, in which zhorai responds
            break;
        default:
            console.error("Unknown stage for ending a recording: " + stages[currStage]);
    }

    finishStage(recordingIsGood, zhoraiSpeech);
}

function introReceiveData(filedata) {
    var phrases = [];
    var zhoraiSpeech = '';
    var recordingIsGood = false;
    var currName = getSessionData('name');
    var currPlace = getSessionData('place');
    switch (stages[currStage]) {
        case 'respondWithName':
            // test to see if what they said was correct... e.g., "I didn't quite catch that"
            if (filedata.trim() && !filedata.includes('ERR_NO_TEXT')) {
                // got a name! Capitalize and store it:
                currName = filedata.charAt(0).toUpperCase() + filedata.slice(1);
                saveSessionData('name', currName);
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
            if (filedata.trim() && !filedata.includes('ERR_NO_TEXT')) {
                // got a name (place)! Capitalize it:
                currPlace = filedata.charAt(0).toUpperCase() + filedata.slice(1);
                saveSessionData('place', currPlace);
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
    finishStage(recordingIsGood, zhoraiSpeech);
}

/**
 * 
 * @param {*} goToNext boolean: if true, the currStage will be incremented and 
 * the gui prepared for next stage (button changed)
 * @param {*} zhoraiSpeech string: if specified, zhorai will speak, and then the button will 
 * automatically change depending on the current/next stage.
 */
function finishStage(goToNext, zhoraiSpeech) {
    showPurpleText(zhoraiSpeech);

    if (goToNext && zhoraiSpeech) {
        // switch button to speak button, speak and then increment stage & switch to mic:
        speakText(zhoraiSpeech, function () {
            switchButtonTo('speakBtn');
        }, function () {
            // prepare for next stage (but don't go to next if it's the last stage)
            if (currStage < stages.length - 1) {
                currStage += 1;
            }
            // switch to mic button
            switchButtonTo('micBtn');
            // start the next stage
            startStage();
        });
    } else if (goToNext && !zhoraiSpeech) {
        // immediately increment, don't switch buttons
        if (currStage < stages.length - 1) {
            currStage += 1;
        }
        startStage();
    } else if (!goToNext && zhoraiSpeech) {
        // speak text & switch buttons, don't go to next stage
        speakText(zhoraiSpeech, function () {
            switchButtonTo('speakBtn');
        }, function () {
            switchButtonTo('micBtn');
        });
    } else if (!goToNext && !zhoraiSpeech) {
        // no more stages and no more speech means we're at the very start or very end:
        // if at beginning, switch to mic btn
        if (currStage == 0) {
            switchButtonTo('micBtn');
        } else if (currStage == stages.length - 1) {
            switchButtonTo('mod1Btn');
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
    mod1Btn = document.getElementById('mod1Btn');
    loadingGif = document.getElementById('loadingGif');

    // TODO del:
    // remove any memory from previous activites:
    // clearMemory('input.txt');
    // clearAnimalFiles();

    startStage();

    // Add click handlers
    // TODO: remove the zhoraiSpeakBtn
    // zhoraiSpeakBtn.addEventListener("click", startStage);
    recordButton.addEventListener("click", function () {
        recordButtonClick({
            callback: afterRecording,
            onClickStop: switchButtonTo,
            onClickStopParam: 'loading'
        });
    });
    mod1Btn.addEventListener("click", function () {
        window.location.href = nextPagePath;
    });
});