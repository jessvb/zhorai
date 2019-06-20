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
// TODO: del paths for txt files:
// var desertInputPath = dataDirRelPath + 'prior_knowledge/desertInfo.txt'; // relative to semparserfilepath
// var rainforestInputPath = dataDirRelPath + 'prior_knowledge/rainforestInfo.txt'; // relative to semparserfilepath
// var grasslandInputPath = dataDirRelPath + 'prior_knowledge/grasslandInfo.txt'; // relative to semparserfilepath
// var tundraInputPath = dataDirRelPath + 'prior_knowledge/tundraInfo.txt'; // relative to semparserfilepath
// var oceanInputPath = dataDirRelPath + 'prior_knowledge/oceanInfo.txt'; // relative to semparserfilepath
var desertSentences = 'The desert has lots of sand\n' +
    'The desert is very dry\n' +
    'Deserts have cactus\n' +
    'The desert is very hot and sunny\n' +
    'Deserts don\'t have much water\n' +
    'Deserts have few people\n' +
    'Deserts have flash floods\n' +
    'Deserts have sand dunes\n' +
    'Deserts are sandy\n' +
    'Deserts don\'t have many plants\n' +
    'Deserts don\'t have much vegetation\n' +
    'Deserts are hot\n' +
    'Deserts don\'t have much precipitation\n' +
    'Deserts are also called drylands\n' +
    'Deserts are harsh environments\n' +
    'It\'s hard for animals to survive in the desert\n' +
    'Animals are rare in the desert\n' +
    'Animals that live in the desert have ways to keep cool and use less water\n' +
    'Many animals in the desert are nocturnal\n' +
    'Animals often come out at night in the desert\n' +
    'Plants in the desert store water\n' +
    'There are lots of cacti in the desert\n' +
    'There are shrubs in the desert\n' +
    'The sun is hot in the desert\n' +
    'Deserts get very cold at night\n' +
    'It is hard to find water in the desert\n' +
    'There are lots of deserts in africa';
var rainforestSentences = 'The rainforest is very wet\n' +
    'The rainforest has a lot of trees\n' +
    'The rainforest has lots of wood.\n' +
    'There is a lot of rain in the rainforest\n' +
    'There are a lot of different plants in the rainforest\n' +
    'There are a lot of different animals in the rainforest\n' +
    'Rainforests are damp\n' +
    'Rainforests have trees\n' +
    'Rainforests are muddy\n' +
    'There are rivers in the rainforests\n' +
    'People go for hikes in the rainforest\n' +
    'The rainforest is humid\n' +
    'The rainforest has lots of plants';
var grasslandSentences = 'The grassland has a lot of grass\n' +
    'Grasslands can have shrubs\n' +
    'The grassland is can be cool or warm\n' +
    'Grasslands are pretty dry\n' +
    'There are savannas in the grassland\n' +
    'Grasslands are a large open areas of country covered with grass\n' +
    'Grasslands have some rain\n' +
    'Grasslands are open and flat\n' +
    'The most important plants of grasslands are grasses\n' +
    'Temperatures in grasslands vary greatly between summer and winter.\n' +
    'Grasslands don\'t have trees';
var tundraSentences = 'The tundra is very cold\n' +
    'The tundra is very dry\n' +
    'There are not very many trees or bushes in the tundra\n' +
    'Not many things live in the tundra\n' +
    'The tundra is very far north\n' +
    'The tundra is in Canada\n' +
    'The tundra is very far south\n' +
    'The tundra is in Antarctica\n' +
    'The tundra is very windy\n' +
    'There is a lot of snow in the tundra\n' +
    'There are not many animals in the tundra\n' +
    'There is a permafrost in the tundra\n' +
    'Snow doesn\'t melt very often in the tundra\n' +
    'The tundra is in Russia\n' +
    'The tundra stays cold all year\n' +
    'The tundra is dark in the winter\n' +
    'It\'s extremely cold in the tundra during winter\n' +
    'The tundra is bright in the summer\n' +
    'The tundra is really windy\n' +
    'There are marshes and lakes in the tundra during the summer\n' +
    'In the winter, everything in the tundra freezes\n' +
    'The biodiversity is low in the tundra\n' +
    'When the tundra permafrost melts, it\'s bad for global warming\n' +
    'The main plants in the tundra is lichen and mosses';
var oceanSentences = 'The ocean is filled with water\n' +
    'All animals in the ocean need water to survive\n' +
    'The ocean is very wet\n' +
    'The ocean is salty\n' +
    'The ocean has coral reefs\n' +
    'The ocean is very deep\n' +
    'The ocean is huge\n' +
    'The ocean covers most of the earth\n' +
    'The ocean has lots of animals\n' +
    'The ocean is blue\n' +
    'The ocean has currents\n' +
    'The ocean has seaweed and kelp\n' +
    'The ocean has the most animals out of all the biomes\n' +
    'The ocean is like a big sea';

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
    // var ecoFilepath = ''; todo del
    var ecoSentences = '';
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
            // ecoFilepath = oceanInputPath; todo
            ecoSentences = oceanSentences;
        } else if (recordedText.toLowerCase().includes('desert')) {
            eco = 'desert';
            // ecoFilepath = desertInputPath; todo
            ecoSentences = desertSentences;
        } else if (recordedText.toLowerCase().includes('rainforest')) {
            eco = 'rainforest';
            // ecoFilepath = rainforestInputPath; todo
            ecoSentences = rainforestSentences;
        } else if (recordedText.toLowerCase().includes('grassland')) {
            eco = 'grassland';
            // ecoFilepath = grasslandInputPath; todo 
            ecoSentences = grasslandSentences;
        } else if (recordedText.toLowerCase().includes('tundra')) {
            eco = 'tundra';
            // ecoFilepath = tundraInputPath; todo
            ecoSentences = tundraSentences;
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
        var unknownEcosystems = ['forest', 'taiga', 'wetland', 'freshwater', 'coral reef', 'savanna', 'mountain', 'plain'];
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

        // hide the sentences about particular ecosystems to prep for the next
        hideAllSentences();

        // TODO: remove this with file and instead just send the text
        // send the particular ecosystem filepath to the server to parse,
        // parseFile('mindmap', ecoFilepath, 'parsing' + '_mod1');
        parseText(ecoSentences, 'mindmap', 'parsing' + '_mod1');
        // when done parsing, the mind map will be created in mod1ReceiveData

    } else {
        speakText(zhoraiSpeech, null,
            function () {
                switchButtonTo('micBtn');
            });
    }
}

function hideAllSentences() {
    document.getElementById("desertSentences").hidden = true;
    document.getElementById("rainforestSentences").hidden = true;
    document.getElementById("tundraSentences").hidden = true;
    document.getElementById("oceanSentences").hidden = true;
    document.getElementById("grasslandSentences").hidden = true;
}

function mod1ReceiveData(filedata) {
    // We're done parsing and reading the mindmap text file!
    // create the mindmap!
    console.log('Creating mindmap! filedata:');
    filedata = filedata.replace(/'/g, '"');
    filedata = JSON.parse(filedata);
    console.log(filedata);
    clearMemory();
    switchButtonTo('micBtn');
    createMindmap(filedata);

    // show the sentences about that particular ecosystem 
    // (NOTE THAT THESE SENTENCES ARE HARDCODED INTO THE HTML! (eventually: read from file))
    if (filedata.nodes[0].id.toLowerCase() == "desert") {
        document.getElementById("desertSentences").hidden = false;
    } else if (filedata.nodes[0].id.toLowerCase() == "rainforest") {
        document.getElementById("rainforestSentences").hidden = false;
    } else if (filedata.nodes[0].id.toLowerCase() == "tundra") {
        document.getElementById("tundraSentences").hidden = false;
    } else if (filedata.nodes[0].id.toLowerCase() == "ocean") {
        document.getElementById("oceanSentences").hidden = false;
    } else if (filedata.nodes[0].id.toLowerCase() == "grassland") {
        document.getElementById("grasslandSentences").hidden = false;
    } else {
        console.error("Unknown ecosystem for showing sentences.");
    }

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

    // Add click handlers
    recordButton.addEventListener("click", function () {
        recordButtonClick({
            callback: afterRecording,
            onClickStop: switchButtonTo,
            onClickStopParam: 'loading'
        });
    });
});