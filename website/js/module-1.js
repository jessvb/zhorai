/* -------------- Initialize variables -------------- */
var zhoraiTextColour = "#5d3e9f";
// var stages = ['teachEco', TODO DEL
//     'zThink',
//     'zDisplay'
// ];
var stages = ['parsingSentences', 'readingMindmap'];
var currStage = 0;
var infoLabel;
var recordButton;
// var zhoraiSpeakBtn;
var zhoraiSpeechBox;
// var mod2Btn;
var loadingGif;
var currBtnIsMic = true;
var mindmapPath = "../../website-server-side/receive-text/data/mindmap.txt";

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
        // zhoraiSpeakBtn.hidden = true;
        // mod2Btn.hidden = true;
        loadingGif.hidden = true;
        textFileBtn.hidden = true;
        currBtnIsMic = true;
    } else if (toButton == 'speakBtn') {
        recordButton.hidden = true;
        // zhoraiSpeakBtn.hidden = false;
        // mod2Btn.hidden = true;
        loadingGif.hidden = true;
        textFileBtn.hidden = true;
        currBtnIsMic = false;
        // } else if (toButton == 'mod2Btn') {
        //     mod2Btn.hidden = false;
        //     recordButton.hidden = true;
        //     zhoraiSpeakBtn.hidden = true;
        //     loadingGif.hidden = true;
        //     textFileBtn.hidden = true;
        //     currBtnIsMic = false;
    } else if (toButton == 'loading') {
        loadingGif.hidden = false;
        recordButton.hidden = true;
        // zhoraiSpeakBtn.hidden = true;
        // mod2Btn.hidden = true;
        textFileBtn.hidden = true;
        currBtnIsMic = false;
    } else if (toButton == 'textFileBtn') {
        textFileBtn.hidden = false;
        loadingGif.hidden = true;
        recordButton.hidden = true;
        // zhoraiSpeakBtn.hidden = true;
        // mod2Btn.hidden = true;
        currBtnIsMic = false;
    } else if (toButton == 'micAndTextFileBtn') {
        textFileBtn.hidden = false;
        recordButton.hidden = false;
        loadingGif.hidden = true;
        // zhoraiSpeakBtn.hidden = true;
        // mod2Btn.hidden = true;
        currBtnIsMic = true;
    } else if (!toButton) {
        console.log('No button specified. Not switching button.');
    } else {
        console.error('Unknown button: ' + toButton + '. Did not switch button.');
    }
}

// TODO DEL:
// function startStage() {
//     var zhoraiSpeech = '';
//     var goToNext = false;
//     switch (stages[currStage]) {
//         case 'teachEco':
//             // have student say sentences like, "Deserts are hot"
//             // 1. write this prompt in textbox
//             infoLabel.innerHTML = 'Teach Zhorai about the earth by saying things like, "Deserts are hot and dry."';
//             break;
//         case 'zThink':
//             // have zhorai say, "Hmm let me think about that and then I can show you!"
//             var phrases = ["Hmm let me think about that and then I can show you!",
//                 "Wow that's a lot of interesting information! I'll think about it for a bit and then show you.",
//                 "Thanks for teaching me! I'll think about what you told me and show you my thoughts!"
//             ];
//             zhoraiSpeech = chooseRandomPhrase(phrases);
//             goToNext = true;
//             break;
//         case 'zDisplay':
//             // display the mindmap
//             // TODO
//             goToNext = false;
//         break;
//         default:
//             console.error("Unknown stage for module 1: " + stages[currStage]);
//     }
//     finishStage(goToNext, zhoraiSpeech);
// }

function afterRecording(recordedText) {
    // var recordingIsGood = false;
    // var zhoraiSpeech = '';
    // switch (stages[currStage]) {
    //     case 'sayHi':
    //         // test to see if what they said was correct... e.g., "I didn't quite catch that"
    //         var greetings = ['hi', 'hello', 'hey', 'yo', 'howdy', 'sup', 'hiya',
    //             'g\'day', 'what\'s up', 'good morning', 'good afternoon', 'meet'
    //         ];
    //         var regex = new RegExp(greetings.join("|"), "i");
    //         var saidHi = regex.test(recordedText);
    //         if (saidHi) {
    //             recordingIsGood = true;
    //         } else {
    //             var phrases = ["Sorry, what was that?", "Oh, pardon?"];
    //             zhoraiSpeech = chooseRandomPhrase(phrases);
    //         }
    //         // clear memory so that we don't have two name sentences:
    //         clearMemory();
    //         break;
    //     case 'respondWithName':
    //     case 'respondWithPlace':
    //         // get name/place from server:
    //         parseText(recordedText, 'name', stages[currStage] + "_intro");
    //         // this will call the introReceiveData() method, in which zhorai responds
    //         break;
    //     default:
    //         console.error("Unknown stage for ending a recording: " + stages[currStage]);
    // }

    // finishStage(recordingIsGood, zhoraiSpeech);
}

function mod1ReceiveData(filedata) {
    // // when done parsing, read mindmap text file
    // // and then create the mind map
    // switch (stages[currStage]) {
    //     case 'parsingSentences':
    //         // parsed sentences in the memory :) Now let's start reading the mindmap.txt output
    //         readFile('mindmap.txt', stages[currStage] + '_mod1'); // TODO: does this work??
    //         incrementStage();
    //         break;
    //     case 'readingMindmap':
    //         // finished reading the mindmap :) Now let's create the mindmap!
    //         createMindmap(JSON.parse(filedata)); // TODO: does this work correctly??
    //         // incrementstage takes us back to parsing sentences:
    //         incrementStage();
    //         break;
    //     default:
    //         console.error("Unknown stage for receiving data: " + stages[currStage]);
    // } TODO DEL

    // We're done parsing and reading the mindmap text file!
    // create the mindmap!
    console.log('TODO DEL: creating mindmap! filedata:');
    filedata = filedata.replace(/'/g, '"');
    console.log(filedata);
    console.log(JSON.parse(filedata));
    clearMemory();
    switchButtonTo('micAndTextFileBtn');
    createMindmap(JSON.parse(filedata)); // TODO: does this work correctly??
}

function incrementStage() { // TODO DEL
    if (currStage < stages.length - 1) {
        currStage += 1;
    } else {
        currStage = 0;
    }
}

// /** TODO DEL 
//  * 
//  * @param {*} goToNext boolean: if true, the currStage will be incremented and 
//  * the gui prepared for next stage (button changed)
//  * @param {*} zhoraiSpeech string: if specified, zhorai will speak, and then the button will 
//  * automatically change depending on the current/next stage.
//  */
// function finishStage(goToNext, zhoraiSpeech) {
//     showPurpleText(zhoraiSpeech);
//     // in module 1, either 

//     // if (goToNext && zhoraiSpeech) {
//     //     // NOTE: This doesn't happen in module 1
//     //     // switch button to speak button, speak and then increment stage & switch to mic:
//     //     speakText(zhoraiSpeech, function () {
//     //         switchButtonTo('speakBtn');
//     //     }, function () {
//     //         // prepare for next stage (but don't go to next if it's the last stage)
//     //         if (currStage < stages.length - 1) {
//     //             currStage += 1;
//     //         }
//     //         // switch to mic button
//     //         switchButtonTo('micBtn');
//     //         // start the next stage
//     //         startStage();
//     //     });
//     // } else if (goToNext && !zhoraiSpeech) {
//     //     // immediately increment, don't switch buttons
//     //     if (currStage < stages.length - 1) {
//     //         currStage += 1;
//     //     }
//     //     startStage();
//     // } else if (!goToNext && zhoraiSpeech) {
//     //     // NOTE: This doesn't happen in module 1
//     //     // speak text & switch buttons, don't go to next stage
//     //     speakText(zhoraiSpeech, function () {
//     //         switchButtonTo('speakBtn');
//     //     }, function () {
//     //         switchButtonTo('micBtn');
//     //     });
//     // } else if (!goToNext && !zhoraiSpeech) {
//     //     // no more stages and no more speech means we're at the very start or very end:
//     //     // if at beginning, switch to mic btn
//     //     if (currStage == 0) {
//     //         switchButtonTo('micBtn');
//     //     } else if (currStage == stages.length - 1) {
//     //         switchButtonTo('mod2Btn');
//     //     }
//     // }
// }

/* -------------- Once the page has loaded -------------- */
document.addEventListener('DOMContentLoaded', function () {
    // Initialize variables:
    currStage = 0;
    infoLabel = document.getElementById('z_info_label');
    recordButton = document.getElementById('record_button');
    // zhoraiSpeakBtn = document.getElementById('zhoraiSpeakBtn');
    zhoraiSpeechBox = document.getElementById('final_span');
    loadingGif = document.getElementById('loadingGif');
    textFileBtn = document.getElementById('textFileBtn');

    // remove any memory from previous activites:
    clearMemory("input.txt");

    // insert prompt
    infoLabel.innerHTML = 'Teach Zhorai about the earth by saying things like, "Deserts are hot and dry."';

    // Add click handlers
    // zhoraiSpeakBtn.addEventListener("click", null); // TODO click handler
    record_button.addEventListener("click", recordButtonClick);
    textFileBtn.addEventListener('click', function () {
        switchButtonTo('loading');
        // send a command to the server to parse what's in the memory,
        // TODO 
        parseMem('mindmap', stages[currStage] + '_mod1');

        // when done parsing, read mindmap text file (in mod1ReceiveData) TODO DEL
        // and then create the mind map (in mod1ReceiveData)
    });

    // document.getElementById('mod2Btn').addEventListener("click", function () {
    //     window.location.href = nextPagePath;
    // });
});