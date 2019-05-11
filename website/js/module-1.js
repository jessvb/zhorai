/* -------------- Initialize variables -------------- */
var zhoraiTextColour = "#5d3e9f";
var infoLabel;
var recordButton;
var zhoraiSpeechBox;
var loadingGif;
var currBtnIsMic = true;
var mindmapPath = "../../website-server-side/receive-text/data/mindmap.txt";

// File paths for mindmap creation
var dataDir = 'data/';
var dataDirRelPath = '../website-server-side/receive-text/' + dataDir;
var desertInputPath = dataDirRelPath + 'prior_knowledge/desertInfo.txt'; // relative to semparserfilepath
var rainforestInputPath = dataDirRelPath + 'prior_knowledge/rainforestInfo.txt'; // relative to semparserfilepath
var grasslandInputPath = dataDirRelPath + 'prior_knowledge/grasslandInfo.txt'; // relative to semparserfilepath
var tundraInputPath = dataDirRelPath + 'prior_knowledge/tundraInfo.txt'; // relative to semparserfilepath
var oceanInputPath = dataDirRelPath + 'prior_knowledge/oceanInfo.txt'; // relative to semparserfilepath

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

function afterRecording(recordedText) {
    var saidKnownEco = false;
    var ecoFilepath = '';
    var zhoraiSpeech = '';
    var phrases = [];

    // test to see if what they said has an ecosystem in it... e.g., "I didn't quite catch that"
    var knownEcosystems = ['ocean', 'desert', 'rainforest', 'grassland', 'tundra'];
    var knownRegex = new RegExp(knownEcosystems.join("|"), "i");
    saidKnownEco = knownRegex.test(recordedText);

    // check if there was a known ecosystem stated
    if (saidKnownEco) {
        // get the particular ecosystem stated:
        var eco = '';
        if (recordedText.toLowerCase().includes('ocean')) {
            eco = 'ocean';
            ecoFilepath = oceanInputPath;
        } else if (recordedText.toLowerCase().includes('desert')) {
            eco = 'desert';
            ecoFilepath = desertInputPath;
        } else if (recordedText.toLowerCase().includes('rainforest')) {
            eco = 'rainforest';
            ecoFilepath = rainforestInputPath;
        } else if (recordedText.toLowerCase().includes('grassland')) {
            eco = 'grassland';
            ecoFilepath = grasslandInputPath;
        } else if (recordedText.toLowerCase().includes('tundra')) {
            eco = 'tundra';
            ecoFilepath = tundraInputPath;
        } else {
            console.error("A known ecosystem was stated, but was not found in the " +
                "text... I'm very confused.");
        }

        // say, "I've heard about that ecosystem! Here's what I know about it:"
        phrases = ["I've heard about " + eco + "s before! Here's what I know about them.",
            "Oh yes, " + eco + "s are very interesting. Here's what I know.",
            "Here's what I know about " + eco + "s. They're fascinating!"
        ];
    } else {
        // check if there was an *unknown* ecosystem stated... e.g., "I don't know about that ecosystem yet"
        var saidUnknownEco = false;
        var unknownEcosystems = ['forest', 'taiga', 'wetland', 'freshwater', 'coral reef', 'savanna', 'mountain'];
        var unknownRegex = new RegExp(unknownEcosystems.join("|"), "i");
        saidUnknownEco = unknownRegex.test(recordedText);

        if (saidUnknownEco) {
            phrases = ["Hmmm, I haven't heard about that ecosystem before, but I know about " + chooseRandomPhrase(knownEcosystems) + "s.",
                "I don't know about that ecosystem yet, but I've heard about " + chooseRandomPhrase(knownEcosystems) + "s."
            ];
        } else {
            phrases = ["Sorry, what was that?", "Oh, pardon?", "I didn't quite understand that. Pardon?"];
        }
    }

    zhoraiSpeech = chooseRandomPhrase(phrases);
    showPurpleText(zhoraiSpeech);

    if (saidKnownEco) {
        speakText(zhoraiSpeech, null, null);

        // delete the current mindmap to prepare for the next
        deleteMindmap();

        // send the particular ecosystem filepath to the server to parse,
        parseMem('mindmap', ecoFilepath, 'parsing' + '_mod1');
        // when done parsing, create the mind map (in mod1ReceiveData)

    } else {
        speakText(zhoraiSpeech, null,
            function () {
                switchButtonTo('micBtn');
            });
    }
}

function mod1ReceiveData(filedata) {
    // We're done parsing and reading the mindmap text file!
    // create the mindmap!
    console.log('Creating mindmap! filedata:');
    filedata = filedata.replace(/'/g, '"');
    console.log(filedata);
    console.log(JSON.parse(filedata));
    clearMemory();
    switchButtonTo('micBtn');
    createMindmap(JSON.parse(filedata));
}

/* -------------- Once the page has loaded -------------- */
document.addEventListener('DOMContentLoaded', function () {
    // Initialize variables:
    currStage = 0;
    infoLabel = document.getElementById('z_info_label');
    recordButton = document.getElementById('record_button');
    zhoraiSpeechBox = document.getElementById('final_span');
    loadingGif = document.getElementById('loadingGif');
    textFileBtn = document.getElementById('textFileBtn');

    // remove any memory from previous activites:
    clearMemory("input.txt");

    // insert prompt
    // infoLabel.innerHTML = 'Teach Zhorai about the earth by saying things like, "Deserts are hot and dry."';

    // Add click handlers
    recordButton.addEventListener("click", function () {
        recordButtonClick({
            callback: afterRecording,
            onClickStop: switchButtonTo,
            onClickStopParam: 'loading'
        });
    });
});