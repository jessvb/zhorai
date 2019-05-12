/* -------------- Initialize variables -------------- */
var zhoraiTextColour = "#5d3e9f";
var infoLabel;
var recordButton;
var zhoraiSpeechBox;
var loadingGif;
var currBtnIsMic = true;
var mindmapPath = "../../website-server-side/receive-text/data/mindmap.txt";
var knownAnimals = ['bees',
    'birds',
    'butterflies',
    'leopards',
    'cows',
    'owls',
    'fireflies',
    'dolphins',
    'fish',
    'lobsters',
    'starfish',
    'swordfish',
    'whales',
    'polarbears',
    'arcticfoxes',
    'yaks',
    'reindeer',
    'camels',
    'scorpions',
    'elephants',
    'giraffes',
    'lions'
];

// File paths for mindmap creation
var dataDir = 'data/';
var dataDirRelPath = '../website-server-side/receive-text/' + dataDir;
var animalsDir = 'animals/';
var animalsMindmapPath = dataDirRelPath + animalsDir;

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
    allAnimals.concat(knownAnimals);

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
    return animal;
}

function isAnimalPlural(animal) {
    return knownAnimals.includes(animal);
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
        // say, "Based on what I know about Earth, here's where I would guess the animal comes from."
        phrases = ["Based on what I know about Earth, here's where I would guess " + animal + " come from...",
            "I would guess " + animal + " live in this ecosystem...",
            "I think " + animal + " are from this ecosystem based on what I've been taught..."
        ];
    } else {
        phrases = ["Sorry, what was that?", "Oh, pardon?", "I didn't quite understand that. Pardon?"];
    }

    zhoraiSpeech = chooseRandomPhrase(phrases);
    showPurpleText(zhoraiSpeech);

    if (saidAnimal) {
        speakText(zhoraiSpeech, null, null);

        // delete the current mindmap to prepare for the next
        deleteMindmap();

        // send the particular animal filepath to the server to parse,
        parseMem('mindmap', animalsMindmapPath + animal + '.txt', 'mindmapping' + '_mod3');
        // when done parsing, create the mind map (in mod3ReceiveData)

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
        console.log('Creating mindmap! filedata:');
        filedata = filedata.replace(/'/g, '"');
        console.log(filedata);
        console.log(JSON.parse(filedata));

        switchButtonTo('micBtn');
        createMindmap(JSON.parse(filedata));
    } else if (stage.includes('embed')) {
        // We're done getting the embedding data!
        // Currently, it's like this though:
        // "ocean,-0.49885207414627075,1.453416109085083,ocean\n
        // camels,1.315521478652954,0.0048450627364218235,desert\n"

        // Instead, we need to format it so that it's an array of arrays of 
        // strings/floats, like this:
        // [["camel", 1.1, 2.7, "desert"], ["tundra", 3.5, 0.2, "tundra"]]

        // get rid of last newline
        if (filedata.charAt(filedata.length - 1) == '\n') {
            filedata = filedata.substring(0, filedata.length - 1);
        }
        // split by newlines
        filedata = filedata.split(/\r?\n/);
        // split by commas, and change the two inner strings to be floats
        for (i = 0; i < filedata.length; i++) {
            filedata[i] = filedata[i].split(',');
            for (j = 0; j < filedata[i].length; j++) {
                if (!isNaN(parseFloat(filedata[i][j]))) {
                    filedata[i][j] = parseFloat(filedata[i][j]);
                }
            }
        }

        console.log('Creating vector graph! filedata:');
        console.log(filedata);

        // Now that filedata is formatted correctly, create the vector graph!
        console.log("TODO MAKE VECTOR GRAPH!");
        createScatterplot(filedata);
        // console.log(JSON.parse(filedata));
        // clearMemory();
        // switchButtonTo('micAndTextFileBtn');
        // createMindmap(JSON.parse(filedata));
    } else {
        console.error("Unknown stage in mod3receivedata: " + stage);
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
    // textFileBtn.addEventListener('click', function () {
    //     switchButtonTo('loading');
    //     // say something about how we're going to display Zhorai's thoughts after parsing
    //     var phrases = ['Thanks for teaching me about Earth! Let me think about all these new things and show you my thoughts.',
    //         "Wow, Earth sounds really interesting! Let me think for a bit and then I'll show you my thoughts.",
    //         "Interesting! Now I want to visit earth and see everything! I'll show you what I understand about Earth after I think for a little while."
    //     ];
    //     var toSpeak = chooseRandomPhrase(phrases);
    //     showPurpleText(toSpeak);
    //     speakText(toSpeak);

    //     // send a command to the server to parse what's in the memory,
    //     parseMem('mindmap', null, 'parsing' + '_mod3');
    //     // when done parsing, create the mind map (in mod3ReceiveData)
    // });
});