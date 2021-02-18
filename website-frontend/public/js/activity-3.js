/* -------------- Initialize variables -------------- */
var zhoraiTextColour = "#5d3e9f";
var infoLabel;
var recordButton;
var zhoraiSpeechBox;
var loadingGif;
var currBtnIsMic = true;
var mindmapPath = "../../website-backend/receive-text/data/mindmap.txt";
var knownTopics = [
    'icecream',
    'ice cream',
    'flavour',
    'flavor',
    'ice cream flavour',
    'spirit animal',
    'animal'
];
var subject = '';

// File paths for mindmap creation
var dataDir = 'data/';
var dataDirRelPath = '../website-backend/receive-text/' + dataDir;
var animalsDir = 'animals/';
var animalsRelPath = dataDirRelPath + animalsDir;

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

/**
 * Returns the topic in a standardized format (e.g., ice cream vs. icecream) 
 * that the user wants to ask Zhorai about, given the text the user said.
 * 
 * If there is no topic from the list of topics, this returns null.
 */
function getTopic(text) {
    // return the topic standardized, singular & lowercase
    text = text.toLowerCase();
    topic = getAnySubstring(text, knownTopics)
    if (topic) {
        topic = standardizeTopic(topic);
    }
    return topic;
}

function getAnySubstring(str, substrings) {
    var foundSubstr = null;
    for (var i = 0; i != substrings.length; i++) {
        var substring = substrings[i];
        if (str.indexOf(substring) != -1) {
            foundSubstr = substring;
        }
    }
    return foundSubstr;
}

/**
 * Converts non-standard topics to standard ones, including:
 * - ice cream flavour
 * - spirit animal
 * @param {*} topic 
 */
function standardizeTopic(topic) {
    topic = topic.toLowerCase();
    if (topic == 'flavor' || topic == 'flavour' || topic.includes('ice')) {
        topic = 'ice cream flavour';
    } else if (topic == 'spiritanimal' || topic == 'animal') {
        topic = 'spirit animal';
    }
    return topic;
}

function afterRecording(recordedText) {
    var topic = '';
    var zhoraiSpeech = '';
    var phrases = [];

    // test to see if what they said has a specific topic in it... e.g., "I didn't quite catch that"
    topic = getTopic(recordedText);

    // if there was a known topic stated...
    if (topic) {
        phrases = ["Oh yes! Let me think about you and " + topic + "s for a second.",
            "I'll think about you and " + topic + "s for a bit and let you know!",
            "Oh yeah, you seem really interesting! Let me think about " + topic + "s and who you are."
        ];
    } else {
        phrases = ["Sorry, what was that?", "Oh, pardon?", "I didn't quite understand that. Pardon?"];
    }

    zhoraiSpeech = chooseRandomPhrase(phrases);
    showPurpleText(zhoraiSpeech);

    if (topic) {
        speakText(zhoraiSpeech, null, null); // don't switch to mic yet -- do that in mod3receivedata

        // delete the current mindmap to prepare for the next
        deleteMindmap();

        // send the person's info/sentences to the server to parse by getting the info
        // from the session:
        parseSession('Mindmap', subject, 'mindmapping' + '_mod3');
        // when done parsing, create the mind map (in mod3ReceiveData)

        // send the server the person's info/senetnces info (and get the histogram info in mod3ReceiveData)
        getHistogramValuesFromSession(subject, topic, 'histogram' + '_mod3');
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
            // {categoryData: {"desert": 1.0, "rainforest": 0.8170465764721643, "tundra": 
            //    0.33213671992101007, "grassland": 0.8271058674638075, "ocean": 0.0},
            //  animal: "camel"}

            // get topic and category word similarity from returned info:
            var topic = JSON.parse(filedata).topic;
            var categoryData = JSON.parse(filedata).categoryData;

            // find the category with the largest word similarity value:
            var maxVal = 0;
            var category = '';
            Object.keys(categoryData).forEach(function (key) {
                var currVal = parseInt(categoryData[key]);
                if (currVal > maxVal) {
                    maxVal = currVal;
                    category = key;
                }
            });

            // say something about the guess, depending on the topic:
            if (topic == 'ice cream flavour') {
                phrases = ["Based on what I know about you, I would guess your favourite " + topic +
                    " is " + category + ".",
                    "I would guess you like " + category + " ice cream, from what I know.",
                    "From what I know, you seem like a " + category + "-type person to me!"
                ];
            } else if (topic == 'spirit animal') {
                phrases = ["Based on what I know about you, I would guess your " + topic +
                    " is a " + category + ".",
                    "I would guess your " + topic + " is " + category + " from what I know.",
                    "Your " + topic + " seems like a " + category + " from what I know!"
                ];
            } else {
                // This shouldn't happen
                console.error("Error: topic was not in known topics.");
                phrases = ["I got confused about the topic we were talking about... Can you ask me again?"];
            }

            createHistogram(categoryData);
        } else {
            // error checking:
            phrases = ["I don't think I know enough about you to guess.",
                "I feel like I haven't heard enough about you yet to guess.",
                "Hmm, I'm not sure! I don't feel like I know enough about you yet."
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
    subject = 'yourself'; // in this case, we're always considering the data about the person

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