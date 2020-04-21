/* -------------- Initialize variables -------------- */
var zhoraiTextColour = "#5d3e9f";
var infoLabel;
var recordButton;
var zhoraiSpeechBox;
var loadingGif;
var currBtnIsMic = true;
var mindmapPath = "../../website-backend/receive-text/data/mindmap.txt";
var knownAnimals = [
    'bees',
    'birds',
    // 'butterflies',
    // 'leopards',
    'cows',
    // 'owls',
    // 'fireflies',
    'dolphins',
    'fish',
    // 'lobsters',
    // 'starfish',
    // 'swordfish',
    'whales',
    'polarbears',
    // 'arcticfoxes',
    // 'yaks',
    'reindeer',
    'camels',
    // 'scorpions',
    // 'elephants',
    // 'giraffes',
    'lions'
];

// File paths for mindmap creation
var dataDir = 'data/';
var dataDirRelPath = '../website-backend/receive-text/' + dataDir;
var animalsDir = 'animals/';
var animalsRelPath = dataDirRelPath + animalsDir;

var justEcosGraph = [
    ["desert", -0.9816911220550537, 0.8623313903808594, "desert"],
    ["rainforest", -0.6243925094604492, -0.26911765336990356, "rainforest"],
    ["grassland", 0.5262490510940552, 1.3611185550689697, "grassland"],
    ["tundra", 1.4992122650146484, 0.5913272500038147, "tundra"],
    ["ocean", 0.5613870620727539, -1.175655722618103, "ocean"],
];

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
        // textFileBtn.hidden = true;
        currBtnIsMic = true;
    } else if (toButton == 'speakBtn') {
        recordButton.hidden = true;
        loadingGif.hidden = true;
        // textFileBtn.hidden = true;
        currBtnIsMic = false;
    } else if (toButton == 'loading') {
        loadingGif.hidden = false;
        recordButton.hidden = true;
        // textFileBtn.hidden = true;
        currBtnIsMic = false;
        // } else if (toButton == 'textFileBtn') {
        //     // textFileBtn.hidden = false;
        //     loadingGif.hidden = true;
        //     recordButton.hidden = true;
        //     currBtnIsMic = false;
    } else if (toButton == 'micAndTextFileBtn') {
        // textFileBtn.hidden = false;
        recordButton.hidden = false;
        loadingGif.hidden = true;
        currBtnIsMic = true;
    } else if (!toButton) {
        console.log('No button specified. Not switching button.');
    } else {
        console.error('Unknown button: ' + toButton + '. Did not switch button.');
    }
}

function getAnimal(text) {
    // create a list of all the animals, plural and singular
    var allAnimals = [];
    for (var i = 0; i < knownAnimals.length; i++) {
        allAnimals.push(convertAnimalToSingular(knownAnimals[i]));
    }
    allAnimals = allAnimals.concat(knownAnimals);

    // return the animal 
    // --> with no whitespace (e.g., polar bear = polarbear)
    // --> lowercase
    text = text.replace(/\s+/g, '');
    text = text.toLowerCase();
    return containsAny(text, allAnimals);
}

function containsAny(str, substrings) {
    var foundSubstr = null;
    for (var i = 0; i != substrings.length; i++) {
        var substring = substrings[i];
        if (str.indexOf(substring) != -1) {
            foundSubstr = substring;
        }
    }
    return foundSubstr;
}

function convertAnimalToSingular(animal) {
    if (animal == 'butterflies') {
        animal = 'butterfly';
    } else if (animal == 'fireflies') {
        animal = 'firefly';
    } else if (animal.includes('fish')) {
        animal = animal; // stays the same ;)
    } else if (animal.includes('foxes')) {
        animal = animal.substring(0, animal.length - 2);
    } else if (animal == 'reindeer') {
        animal = animal; // stays the same :)
    } else {
        // assuming we can just remove the last letter, which should be an 's'
        if (animal.charAt(animal.length - 1) == 's') {
            animal = animal.substring(0, animal.length - 1);
        } else {
            console.error("Couldn't convert, " + animal + " to singular");
        }
    }
    return animal;
}

function convertAnimalToPlural(animal) {
    if (animal) {
        if (animal == 'butterfly') {
            animal = 'butterflies';
        } else if (animal == 'firefly') {
            animal = 'fireflies';
        } else if (animal.includes('fish')) {
            animal = animal; // stays the same ;)
        } else if (animal.includes('fox')) {
            animal = 'arcticfoxes';
        } else if (animal == 'reindeer') {
            animal = animal; // stays the same :)
        } else {
            // assuming we can just add an 's'
            animal = animal + 's';
        }
    } else {
        animal = null;
    }
    return animal;
}

function isAnimalPlural(animal) {
    if (animal) {
        isPlural = knownAnimals.includes(animal);
    } else {
        isPlural = false;
    }

    return isPlural;
}

function afterRecording(recordedText) {
    var saidAnimal = false;
    var animal = '';
    var zhoraiSpeech = '';
    var phrases = [];

    // test to see if what they said has an animal in it... e.g., "I didn't quite catch that"
    animal = getAnimal(recordedText);
    if (!isAnimalPlural(animal)) {
        animal = convertAnimalToPlural(animal);
    }
    saidAnimal = knownAnimals.includes(animal);

    // if there was a known animal stated...
    if (saidAnimal) {
        phrases = ["Oh yes! Let me think about " + animal + " for a second.",
            "I'll think about " + animal + " for a bit and let you know!",
            "Oh yeah, " + animal + " sound interesting. Let me think about where they might be from."
        ];
    } else {
        phrases = ["Sorry, what was that?", "Oh, pardon?", "I didn't quite understand that. Pardon?"];
    }

    zhoraiSpeech = chooseRandomPhrase(phrases);
    showPurpleText(zhoraiSpeech);

    if (saidAnimal) {
        speakText(zhoraiSpeech, null, null); // don't switch to mic yet -- do that in mod3receivedata

        // delete the current mindmap to prepare for the next
        deleteMindmap();

        // send the particular animal info to the server to parse by getting the info
        // from the session:
        parseSession('Mindmap', animal, 'mindmapping' + '_mod3');
        // when done parsing, create the mind map (in mod3ReceiveData)

        // send the server the particular animal info (and get the histogram info in mod3ReceiveData)
        getHistogramValuesFromSession(animal, 'histogram' + '_mod3');
    } else {
        speakText(zhoraiSpeech, null,
            function () {
                switchButtonTo('micBtn');
            });
    }
}

function mod3ReceiveData(filedata, stage) {
    if (stage.includes('mindmap')) {
        // We're done parsing and reading the mindmap text file!
        // create the mindmap!
        console.log('Creating mindmap!');
        filedata = filedata.replace(/'/g, '"');

        if (!filedata.includes('ERR_NO_TEXT')) {
            createMindmap(JSON.parse(filedata));
        } // note: we deal with this error (no text provided) in the histogram code below:

    } else if (stage.includes('histogram')) {
        if (!filedata.includes('ERR_NO_TEXT')) {
            // filedata should look something like this:
            // {ecoData: {"desert": 1.0, "rainforest": 0.8170465764721643, "tundra": 
            //    0.33213671992101007, "grassland": 0.8271058674638075, "ocean": 0.0},
            //  animal: "camel"}

            // get animal and ecosystem word similarity from returned info:
            var animal = JSON.parse(filedata).animal;
            var ecoData = JSON.parse(filedata).ecoData;

            // find the ecosystem with the largest word similarity value:
            var maxVal = 0;
            var eco = '';
            Object.keys(ecoData).forEach(function (key) {
                var currVal = parseInt(ecoData[key]);
                if (currVal > maxVal) {
                    maxVal = currVal;
                    eco = key;
                }
            });

            // say, "Based on what I know about Earth, here's where I would guess the animal 
            // comes from.":
            phrases = ["Based on what I know about Earth, I would guess " + animal +
                " live in " + eco + "s.",
                "I would guess " + animal + " live in " + eco + "s from what I know.",
                "I think " + animal + " are from " + eco + "s based on what you told me."
            ];

            createHistogram(ecoData);
        } else {
            // error checking:
            phrases = ["I don't know enough about that animal to guess where it's from.",
                "I haven't heard enough about that animal to say where it lives.",
                "Hmm, I'm not sure! I haven't heard much about that animal."
            ];
        }

        var zhoraiSpeech = chooseRandomPhrase(phrases);
        showPurpleText(zhoraiSpeech);
        speakText(zhoraiSpeech, null,
            function () {
                switchButtonTo('micBtn');
            });
    } else {
        console.error("Unknown stage in mod3receivedata: " + stage);
        switchButtonTo('micBtn');
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