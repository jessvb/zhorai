/* -------------- Initialize variables -------------- */
var zhoraiTextColour = "#5d3e9f";
var infoLabel;
var recordButton;
var zhoraiSpeechBox;
var loadingGif;
var currBtnIsMic = true;

// Sentences for mindmap creation
var desertSentences = 'The desert has lots of sand. ' +
    'The desert is very dry. ' +
    'Deserts have cactus. ' +
    'The desert is very hot and sunny. ' +
    'Deserts don\'t have much water. ' +
    'Deserts have few people. ' +
    'Deserts have flash floods. ' +
    'Deserts have sand dunes. ' +
    'Deserts are sandy. ' +
    'Deserts don\'t have many plants. ' +
    'Deserts don\'t have much vegetation. ' +
    'Deserts are hot. ' +
    'Deserts don\'t have much precipitation. ' +
    'Deserts are also called drylands. ' +
    'Deserts are harsh environments. ' +
    'It\'s hard for animals to survive in the desert. ' +
    'Animals are rare in the desert. ' +
    'Animals that live in the desert have ways to keep cool and use less water. ' +
    'Many animals in the desert are nocturnal. ' +
    'Animals often come out at night in the desert. ' +
    'Plants in the desert store water. ' +
    'There are lots of cacti in the desert. ' +
    'There are shrubs in the desert. ' +
    'The sun is hot in the desert. ' +
    'Deserts get very cold at night. ' +
    'It is hard to find water in the desert. ' +
    'There are lots of deserts in africa';
var rainforestSentences = 'The rainforest is very wet. ' +
    'The rainforest has a lot of trees. ' +
    'The rainforest has lots of wood.. ' +
    'There is a lot of rain in the rainforest. ' +
    'There are a lot of different plants in the rainforest. ' +
    'There are a lot of different animals in the rainforest. ' +
    'Rainforests are damp. ' +
    'Rainforests have trees. ' +
    'Rainforests are muddy. ' +
    'There are rivers in the rainforests. ' +
    'People go for hikes in the rainforest. ' +
    'The rainforest is humid. ' +
    'The rainforest has lots of plants';
var grasslandSentences = 'The grassland has a lot of grass. ' +
    'Grasslands can have shrubs. ' +
    'The grassland is can be cool or warm. ' +
    'Grasslands are pretty dry. ' +
    'There are savannas in the grassland. ' +
    'Grasslands are a large open areas of country covered with grass. ' +
    'Grasslands have some rain. ' +
    'Grasslands are open and flat. ' +
    'The most important plants of grasslands are grasses. ' +
    'Temperatures in grasslands vary greatly between summer and winter.. ' +
    'Grasslands don\'t have trees';
var tundraSentences = 'The tundra is very cold. ' +
    'The tundra is very dry. ' +
    'There are not very many trees or bushes in the tundra. ' +
    'Not many things live in the tundra. ' +
    'The tundra is very far north. ' +
    'The tundra is in Canada. ' +
    'The tundra is very far south. ' +
    'The tundra is in Antarctica. ' +
    'The tundra is very windy. ' +
    'There is a lot of snow in the tundra. ' +
    'There are not many animals in the tundra. ' +
    'There is a permafrost in the tundra. ' +
    'Snow doesn\'t melt very often in the tundra. ' +
    'The tundra is in Russia. ' +
    'The tundra stays cold all year. ' +
    'The tundra is dark in the winter. ' +
    'It\'s extremely cold in the tundra during winter. ' +
    'The tundra is bright in the summer. ' +
    'The tundra is really windy. ' +
    'There are marshes and lakes in the tundra during the summer. ' +
    'In the winter, everything in the tundra freezes. ' +
    'The biodiversity is low in the tundra. ' +
    'When the tundra permafrost melts, it\'s bad for global warming. ' +
    'The main plants in the tundra is lichen and mosses';
var oceanSentences = 'The ocean is filled with water. ' +
    'All animals in the ocean need water to survive. ' +
    'The ocean is very wet. ' +
    'The ocean is salty. ' +
    'The ocean has coral reefs. ' +
    'The ocean is very deep. ' +
    'The ocean is huge. ' +
    'The ocean covers most of the earth. ' +
    'The ocean has lots of animals. ' +
    'The ocean is blue. ' +
    'The ocean has currents. ' +
    'The ocean has seaweed and kelp. ' +
    'The ocean has the most animals out of all the biomes. ' +
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
            ecoSentences = oceanSentences;
        } else if (recordedText.toLowerCase().includes('desert')) {
            eco = 'desert';
            ecoSentences = desertSentences;
        } else if (recordedText.toLowerCase().includes('rainforest')) {
            eco = 'rainforest';
            ecoSentences = rainforestSentences;
        } else if (recordedText.toLowerCase().includes('grassland')) {
            eco = 'grassland';
            ecoSentences = grasslandSentences;
        } else if (recordedText.toLowerCase().includes('tundra')) {
            eco = 'tundra';
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

        // send the sentences for the particular ecosystem for the server to parse:
        parseText(ecoSentences, 'Mindmap', 'parsing' + '_mod1');
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
    // We're done parsing the mindmap info!
    // create the mindmap!
    console.log('Creating mindmap! filedata:');
    filedata = filedata.replace(/'/g, '"');
    filedata = JSON.parse(filedata);
    console.log(filedata);
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

    // Restart speech synthesizer:
    // (see https://stackoverflow.com/a/58775876/8162699)
    window.speechSynthesis.cancel();

    // Add click handlers
    setUpRecordingHandlers(recordButton, function () {
        recordButtonClick({
            callback: afterRecording,
            onClickStop: switchButtonTo,
            onClickStopParam: 'loading'
        });
    });
});