/* -------------- Initialize variables -------------- */
var zhoraiTextColour = "#5d3e9f";
var infoLabel;
var recordButton;
var zhoraiSpeechBox;
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

function mod2ReceiveData(filedata) {
    // We're done getting the embedding data!
    // Currently, it's like this though:
    // "ocean,-0.49885207414627075,1.453416109085083,ocean\n
    // camels,1.315521478652954,0.0048450627364218235,desert\n"

    // Instead, format it so that it's an array of arrays of strings/floats:
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
    record_button.addEventListener("click", recordButtonClick);
    textFileBtn.addEventListener('click', function () {
        switchButtonTo('loading');
        // say something about how we're going to display Zhorai's thoughts after parsing
        var phrases = ['Thanks for teaching me about Earth! Let me think about all these new things and show you my thoughts.',
            "Wow, Earth sounds really interesting! Let me think for a bit and then I'll show you my thoughts.",
            "Interesting! Now I want to visit earth and see everything! I'll show you what I understand about Earth after I think for a little while."
        ];
        var toSpeak = chooseRandomPhrase(phrases);
        showPurpleText(toSpeak);
        speakText(toSpeak);

        // send a command to the server to parse what's in the memory,
        parseMem('mindmap', 'parsing' + '_mod1');
        // when done parsing, create the mind map (in mod2ReceiveData)
    });
});