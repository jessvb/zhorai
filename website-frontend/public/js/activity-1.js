/* -------------- Initialize variables -------------- */
var zhoraiTextColour = "#5d3e9f";
var infoLabel;
var recordButton;
var zhoraiSpeechBox;
var loadingGif;
var currBtnIsMic = true;

// Sentences for mindmap creation
var sentences = {
    fox: [
        "Red foxes are solitary hunters",
        "Foxes feed on rodents, rabbits, birds, and other small game",
        "Foxes have a flexible diet",
        "Foxes will eat fruit and vegetables, fish, frogs, and even worms",
        "If living among humans, foxes will opportunistically dine on garbage and pet food",
        "Like a cat's, the fox's thick tail aids its balance, but it has other uses as well",
        "A fox uses its tail (or “brush”) as a warm cover in cold weather and as a signal flag to communicate with other foxes",
        "Foxes also signal each other by making scent posts—urinating on trees or rocks to announce their presence",
        "Foxes are omnivorous mammals that are light on their feet",
        "Foxes are often mistaken for other members of the Canidae family, which include jackals, wolves and dogs",
        "Foxes stand out from their relatives because of their long, thin legs, lithe frame, pointed nose and bushy tail",
        "These animals are very social and live flexible lives",
        "Foxes are found all over the world — in North America, Europe, Asia and North Africa — and call a wide range of terrains their home",
        "Foxes also eat a greatly varied diet",
        "Foxes are usually monogamous",
        "This means that foxes have only one mate for life",
        "Foxes also take on nannies to help with their pups",
        "The nannies are female foxes that are not breeders",
        "Sometimes, one male fox will have several female mates",
        "Females that have the same male mate are known to live in the same den together",
        "Foxes can identify each other's voices, just like humans",
        "The red fox has different sounds foxes use to communicate",
        "These vocalizations include yips, growls and howls",
        "The small, slender body of a red fox allows it to run nearly",
        "Fox hunting was a popular recreation sport in England since",
        "Hunting foxes without the aid of dogs is still practiced in the United Kingdom and several other countries including the United States",
        "In folklore, foxes are typically characterized as cunning creatures sometimes having magical powers",
        "In the wild, fox cubs can fall prey to eagles",
        "Coyotes, gray wolves, bears and mountain lions are all predators for adult foxes",
        "Foxes have excellent hearing",
        "Foxes can hear low-frequency sounds and rodents digging underground",
    ],
    butterfly: [
        "Butterflies are insects",
        "Butterflies go through a four-step process called metamorphosis – from egg, to caterpillar, to chrysalis to a butterfly",
        "Butterflies are insects, but large scaly wings set butterflies apart",
        "These wings allow butterflies to fly but only when their body temperature is above 86 degrees",
        "The fastest butterflies can fly up to 30 miles per hour",
        "Scientists estimate that there are 28,000 species of butterflies throughout the world",
        "Most butterflies are found in tropical rainforests, but butterflies can live in all climates and altitudes of the world",
        "The butterfly does migrate to avoid cold weather",
        "Many believe butterflies got their name because butterflies would fly around the buckets of milk on farms",
        "While the milk was being churned into butter, many noticed these flying insects would appear and soon butterflies were being called butterflies",
        "Butterflies have three body parts, like all other insects: the head, the thorax (chest), and the abdomen (bottom)",
        "The butterfly’s four wings and six legs are attached to the thorax",
        "Butterflies are colorful for many reasons",
        "The colors help butterflies attract a mate and absorb heat and the color also helps butterflies blend in among the flowers when butterflies are feeding",
        "Butterflies change four times during their lives in a process which is called metamorphosis",
        "Butterflies are born as an egg (stage 1)",
        "Next butterflies turn into a caterpillar, or larvae (stage 2)",
        "This caterpillar will eat constantly – it loves leaves and flowers – and will grow and grow through this stage of its life",
        "As the caterpillar grows, it skin will spilt and molt or shed its skin",
        "When the caterpillar has grown several thousand times its original size, it goes into a resting stage",
        "This is when the caterpillar becomes a pupa, or chrysalis (stage 3)",
        "Finally, the chrysalis breaks open and a butterfly comes out (stage 4)",
        "Now the adult butterfly will begin the process all over again by laying eggs of its own",
        "Most butterflies live on the nectar and pollen from flowers",
        "Butterflies have a long, flexible, tube-like tongue that goes down into the nectar of the flower",
        "Butterflies suck the nectar up through this tongue",
        "Female butterflies are usually larger than males and butterflies live longer",
        "Butterflies can live anywhere from 2 days to 11 months",
    ],
    bear: [
        "The awe-inspiring brown bear lives in the forests and mountains of northern North America, Europe, and Asia",
        "The brown bear is the most widely distributed bear in the world",
        "The world's largest brown bears are found in coastal British Columbia and Alaska, and on islands such as Kodiak",
        "Bears hibernate, which means they sleep for long periods of time during the winter",
        "What bears look like: The American Black Bear is the most common bear native to North America",
        "The coat of a Black Bear is shaggy and usually black but it can also be dark brown, cinnamon, or yellow-brown",
        "Black bears' eyes are brown (blue at birth)",
        "Black bears' skin is light gray",
        "The black bear is about 4 to 7 feet long from nose to tail, and two to three feet high at the shoulders",
        "The black bear has small eyes, rounded ears, a long brown snout, a large body, and a short tail",
        "Male black bears weigh an average of 150-300 lbs",
        "Where bears live: American Black Bears are found in the forested areas of Canada, USA and Mexico",
        "Bears once occupied nearly all of the forested regions of North America",
        "Black bears live in a variety of habitat types",
        "Bears are mainly found in forested areas with thick ground cover and an abundance of fruits, nuts and vegetation",
        "During the winter bears hibernate in dens",
        "What bears eat: American Black Bears are omnivores",
        "Most bears' diet is plant based",
        "American Black Bears mainly feed on vegetation including herbs, grasses, roots, buds, shoots, honey, nuts, fruit, berries and seeds",
        "Bears will also eat fish, small mammals, insects, dead animals and garbage",
        "In northern regions, black bears eat salmon that bears catch in a stream",
        "Behavior: Most bears become active a half-hour before sunrise, take a nap or two during the day, and bed down for the night an hour or two after sunset",
        "Some bears are active mainly at night to avoid people or other bears",
    ],
    frog: [
        "Frogs are small animals that can jump very well",
        "Frogs are similar to toads",
        "However, a frog has smooth skin and long legs",
        "A toad has rough skin and shorter legs",
        "Frogs are found throughout the world except in very cold places",
        "Frogs are most common in rain forests",
        "Frogs are amphibians, meaning that frogs can live in water or on land",
        "Most frogs spend most of their lives in water",
        "Some live in underground holes or in trees",
        "A frog has smooth, moist skin and big, bulging eyes",
        "Its hind legs are more than twice as long as its front ones",
        "Most frogs have webbed back feet to help frogs leap and swim",
        "Tree frogs have sticky disks on the tips of their fingers and toes",
        "These disks help frogs climb slippery surfaces",
        "Many frogs are tiny",
        "Frogs can be less than an inch (5 centimeters) long",
        "The largest frogs are about a foot (30 centimeters) long",
        "Most frogs are green, brown, gray, or yellow",
        "Some are brightly colored",
        "A frog catches prey by flicking out its long, sticky tongue",
        "Most frogs eat insects and worms",
        "Some also eat other frogs, rodents, and reptiles",
        "Frogs have glands in their skin that make poison",
        "But this poison does not protect frogs from snakes, birds, and other enemies",
        "Instead, frogs most often protect themselves by blending in with their surroundings",
        "Frogs usually lay their eggs in water",
        "Frogs can lay hundreds or thousands of eggs",
        "Within a few weeks, frog eggs hatch into tadpoles",
        "Tadpoles are young frog, fishlike creatures that breathe through gills instead of lungs",
        "To become an adult frog, a tadpole loses its tail and develops lungs and limbs",
    ],
    horse: [
        "Horses and humans have an ancient relationship",
        "Asian nomads probably domesticated the first horses some 4,000 years ago, and the animals remained essential to many human societies until the advent of the engine",
        "Horses still hold a place of honor in many cultures, often linked to heroic exploits in war",
        "There are wild and domesticated horses",
        "There is only one species of domestic horse, but around 400 different breeds that specialize in everything from pulling wagons to racing",
        "All horses are grazers",
        "While most horses are domestic, others remain wild",
        "Feral horses are the descendents of once-tame animals that have run free for generations",
        "Groups of such horses can be found in many places around the world",
        "Free-roaming North American mustangs, for example, are the descendents of horses brought by Europeans more than 400 years ago",
        "Wild horses generally gather in groups of 3 to 20 animals",
        "A stallion (mature male) leads the group, which consists of mares (females) and young foals",
        "When young male horses become colts, at around two years of age, the stallion drives them away",
        "The colts then roam with other young male horses until they can gather their own band of females",
        "The Przewalski's horse is the only truly wild horse whose ancestors were never domesticated",
        "Ironically, this stocky, sturdy animal exists today only in captivity",
        "The last wild Przewalski's horse was seen in Mongolia in 1968",
        "Horses are social mammals",
        "In wild or feral populations, horses form herds with a social hierarchy",
        "These herds, can have up to 26 mares, 5 stallions, and various ages of young",
        "Horse herds have a well-established social hierarchy, with alpha males being dominant and spending the majority of their time defending the herd from predators or competing males",
        "Horses are active at different times of the day, depending on the season",
        "In hot weather, horses graze in morning or evenings to avoid mid-day high temperatures",
        "Horses sleep in segments throughout the day, which are usually not more than two hours long",
        "Horses also avoid laying down for more than an hour at a time if possible, and can be seen sleeping while standing up",
        "In horses, the nostrils, muzzle, whiskers, and cheeks all have whiskers that are used to perceive the environment through touch",
        "Vision is the primary means of perceiving the environment in horses",
        "Ears are long, slender, and upright, which aid in auditory perception",
        "Although horses' sense of smell is important, it is not the chief means of perception and provides a smaller role than vision or the sensitive receptors on the nostrils, muzzle, whiskers, or cheeks",
        "Horses communicate with each other mainly through facial gestures and vocalizations",
        "Grunting, biting, shoving, and kicking may occur among horses to establish or reinforce the hierarchy structure and express dominance",
        "Horses have an array of facial gestures",
        "Positive horse reactions include raising of the lips to expose upper teeth, similar to a smile, and head bobbing or pointing the ears forward and erect",
        "Aggressive horse facial gestures include the ears being laid back and the nostrils closed while exposing the same teeth",
    ],
    beaver: ['TODO'],
};

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
 * Converts a list of sentences to HTML divs of sentences
 */
function createHTMLSentences(sentencesList) {
    html = sentencesList.join(".<br>");
    html += ".";
    return html;
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
    var saidKnownCategory = false;
    var categorySentences = '';
    var zhoraiSpeech = '';
    var phrases = [];

    // test to see if what they said has a category in it... e.g., "I didn't quite catch that"
    var knownCategories = ['foxes', 'beavers', 'butterflies', 'bears', 'horses', 'frogs'];

    // get the particular category stated, if there was one:
    var category = '';
    if (recordedText.toLowerCase().includes('fox')) {
        category = 'foxes';
        categorySentences = sentences.fox;
        saidKnownCategory = true;
    } else if (recordedText.toLowerCase().includes('butterfl')) {
        category = 'butterflies';
        categorySentences = sentences.butterfly;
        saidKnownCategory = true;
    } else if (recordedText.toLowerCase().includes('bear')) {
        category = 'bear';
        categorySentences = sentences.bear;
        saidKnownCategory = true;
    } else if (recordedText.toLowerCase().includes('frog')) {
        category = 'frog';
        categorySentences = sentences.frog;
        saidKnownCategory = true;
    } else if (recordedText.toLowerCase().includes('horse')) {
        category = 'horse';
        categorySentences = sentences.horse;
        saidKnownCategory = true;
    } else if (recordedText.toLowerCase().includes('beaver')) {
        category = 'beaver';
        categorySentences = sentences.beaver;
        saidKnownCategory = true;
    }

    if (saidKnownCategory) {
        // say, "I've heard about that category! Here's what I know about it:"
        phrases = ["I've heard about " + category + " before! Here's what I know about them.",
            "Oh yes, " + category + " are very interesting. Here's what I know.",
            "Here's what I know about " + category + ". They're fascinating!"
        ];
    } else {
        // check if there was an *unknown* category stated... e.g., "I don't know about that category yet"
        var saidUnknownCategory = false;
        var unknownCategories = [
            // animals
            'camel', 'cat', 'dog', 'bird', 'chicken', 'cow', 
            'crab', 'crocodile', 'deer', 'dolphin', 'donkey', 'duck', 'elephant',
            'fish', 'giraffe', 'goat', 'hamster', 'hedgehog', 'jellyfish', 'sheep',
            'lion', 'mole', 'monkey', 'mouse', 'octopus', 'owl', 'panda', 'penguin',
            'pig', 'pony', 'rabbit', 'seahorse', 'snake', 'starfish', 'stingray',
            'tiger', 'turkey', 'turtle', 'unicorn', 'whale', 'worm', 'zebra',
            'pigeon', 'dinosaur', 'dragon', 'kangaroo', 'rhino', 'toad', 'puppy',
            'kitty', 'hippo', 'rat', 'mouse', 'ostrich', 'peacock',
            // ice cream
            'pecan', 'neapolitan', 'fudge', 'praline', 'pistachio', 'cherry',
            'almond', 'coffee', 'rocky', 'road', 'marshmallow', 'dough', 
            'birthday', 'moose', 'birthday'
        ];
        var unknownRegex = new RegExp(unknownCategories.join("|"), "i");
        saidUnknownCategory = unknownRegex.test(recordedText);

        if (saidUnknownCategory) {
            phrases = ["Hmmm, I haven't heard about that before, but I know about " + chooseRandomPhrase(knownCategories) + "s.",
                "I don't know about that yet, but I've heard about " + chooseRandomPhrase(knownCategories) + "s."
            ];
        } else {
            phrases = ["Sorry, what was that?", "Oh, pardon?", "I didn't quite understand that. Pardon?"];
        }
    }

    zhoraiSpeech = chooseRandomPhrase(phrases);
    showPurpleText(zhoraiSpeech);

    if (saidKnownCategory) {
        speakText(zhoraiSpeech, null, null);

        // delete the current mindmap to prepare for the next
        deleteMindmap();

        // hide the sentences about particular category to prep for the next
        hideAllSentences();

        // send the sentences for the particular category for the server to parse:
        parseText(categorySentences.join('. ') + '.', 'Mindmap', 'parsing' + '_mod1');
        // when done parsing, the mind map will be created in mod1ReceiveData

    } else {
        speakText(zhoraiSpeech, null,
            function () {
                switchButtonTo('micBtn');
            });
    }
}

function hideAllSentences() {
    document.getElementById("sentenceContainer").hidden = true;
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

    // show the sentences about that particular category 
    sentenceContainer = document.getElementById("sentenceContainer");
    sentenceTopic = document.getElementById("sentenceTopic");
    trainingSentencesDiv = document.getElementById("trainingSentences");
    if (filedata.nodes[0].id.toLowerCase() == "fox") {
        sentenceTopic.innerHTML = "foxes";
        trainingSentencesDiv.innerHTML = createHTMLSentences(sentences.fox);
        sentenceContainer.hidden = false;
    } else if (filedata.nodes[0].id.toLowerCase() == "butterfly") {
        sentenceTopic.innerHTML = "butterflies";
        trainingSentencesDiv.innerHTML = createHTMLSentences(sentences.butterfly);
        sentenceContainer.hidden = false;
    } else if (filedata.nodes[0].id.toLowerCase() == "bear") {
        sentenceTopic.innerHTML = "bears";
        trainingSentencesDiv.innerHTML = createHTMLSentences(sentences.bear);
        sentenceContainer.hidden = false;
    } else if (filedata.nodes[0].id.toLowerCase() == "frog") {
        sentenceTopic.innerHTML = "frogs";
        trainingSentencesDiv.innerHTML = createHTMLSentences(sentences.frog);
        sentenceContainer.hidden = false;
    } else if (filedata.nodes[0].id.toLowerCase() == "horse") {
        sentenceTopic.innerHTML = "horses";
        trainingSentencesDiv.innerHTML = createHTMLSentences(sentences.horse);
        sentenceContainer.hidden = false;
    } else if (filedata.nodes[0].id.toLowerCase() == "beaver") {
        sentenceTopic.innerHTML = "beavers";
        trainingSentencesDiv.innerHTML = createHTMLSentences(sentences.beaver);
        sentenceContainer.hidden = false;
    } else {
        console.error("Unknown category for showing sentences.");
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