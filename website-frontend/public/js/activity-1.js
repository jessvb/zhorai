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
        "Foxes like to eat rabbits",
        // "Foxes like to eat birds and other small game",
        "Foxes have a flexible diet",
        "Foxes will eat fruits and vegetables",
        // "Foxes will eat fish and frogs",
        "Foxes will eat fish and even worms",//, fish, frogs, and worms",
        "If living among humans, foxes will opportunistically dine on garbage and pet food",
        "Like a cat's, the fox's thick tail aids its balance, but it has other uses as well",
        "A fox uses its tail as a warm cover in cold weather",
        "Foxes use their tails as a signal flag to communicate with other foxes",
        "Foxes also signal each other by making scent posts and urinating on trees or rocks to announce their presence",
        "Foxes are omnivorous mammals that are light on their feet",
        //"Foxes are often mistaken for other members of the Canidae family, which include jackals, wolves and dogs",
        "Foxes stand out from their relatives because of their long, thin legs, lithe frame, pointed nose and bushy tail",
        "These animals are very social and live flexible lives",
        "Foxes are found all over the world, including North America and Africa",//, Europe, Asia
        "Foxes call a wide range of terrains their home",
        "Foxes also eat a greatly varied diet",
        //"Foxes are usually monogamous",
        //"This means that foxes have only one mate for life",
        //"Foxes also take on nannies to help with their pups",
        //"The nannies are female foxes that are not breeders",
        //"Sometimes, one male fox will have several female mates",
        //"Females that have the same male mate are known to live in the same den together",
        "Foxes can identify each other's voices, just like humans",
        "The red fox has different sounds foxes use to communicate",
        "These vocalizations include yips, growls and howls",
        //"The small, slender body of a red fox allows it to run quickly",
        "Fox hunting was a popular recreation sport in England",
        // "Hunting foxes without the aid of dogs is still practiced in the United Kingdom and other places",
        "In folklore, foxes are typically characterized as cunning creatures sometimes having magical powers",
        //"In the wild, fox cubs can fall prey to eagles",
        // "Coyotes, gray wolves, bears and mountain lions are all predators for adult foxes",
        // "Foxes have predators, like wolves and mountain lions",
        "Foxes have excellent hearing",
        "Foxes can hear low-frequency sounds and rodents digging underground",
    ],
    butterfly: [
        "Butterflies are insects",
        "Butterflies go through metamorphosis, which happens in four stages", //"from egg, to caterpillar, to chrysalis to a butterfly",
        "Butterflies are insects, but large scaly wings set butterflies apart",
        "These wings allow butterflies to fly but only when their temperature is above 86 degrees",
        "The fastest butterflies can fly up to 30 miles per hour",
        "Scientists estimate that there are 28,000 species of butterflies throughout the world",
        "Most butterflies are found in tropical rainforests, but butterflies can live in all climates and altitudes of the world",
        "The butterfly does migrate to avoid cold weather",
        "Many believe butterflies got their name because butterflies would fly around the buckets of milk on farms",
        //"While the milk was being churned into butter, many noticed these flying insects would appear and soon butterflies were being called butterflies",
        "Butterflies have three body parts, like all other insects: the head, the thorax (chest), and the abdomen (bottom)",
        "Butterflies have four wings and six legs",// are attached to the thorax",
        "Butterflies are colorful for many reasons",
        //"The colors help butterflies attract a mate and absorb heat and the color also helps butterflies blend in among the flowers when butterflies are feeding",
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
        "Butterflies have a long, tube-like tongue that goes down into the nectar of the flower",
        "Butterflies suck the nectar up through this tongue",
        "Female butterflies are usually larger than males",
        "Butterflies can live anywhere from 2 days to 11 months",
    ],
    bear: [
        "The brown bear often lives in the mountains",
        "Bears are impressive mammals",
        "Bears live in many places, including North America and Asia",
        "The brown bear is the most widely distributed bear in the world",
        "The largest brown bears are in British Columbia and Alaska",//, and Kodiak Island",
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
        "American Black Bears mainly feed on vegetation including herbs and seeds", // , grasses, roots, buds, shoots, honey, nuts, fruit, berries
        "Bears will also eat fish, dead animals, insects and garbage", // , small mammals, insects,
        "In northern regions, black bears eat salmon that bears catch in a stream",
        "Behavior: Most bears become active a half-hour before sunrise, take a nap or two during the day, and bed down for the night an hour or two after sunset",
        "Some bears are active mainly at night to avoid people or other bears",
    ],
    frog: [
        "Frogs are small animals",
        "Frogs can jump very well",
        "Frogs are similar to toads",
        "Frogs have smooth skin and long legs",
        // "A toad has rough skin and shorter legs",
        "Frogs are found throughout the world except in very cold places",
        "Frogs are most common in rain forests",
        "Frogs are amphibians, meaning that frogs can live in water or on land",
        "Most frogs spend most of their lives in water",
        "Some live in underground holes or in trees",
        "A frog has smooth, moist skin and big, bulging eyes",
        "Frogs' hind legs are more than twice as long as its front ones",
        "Most frogs have webbed back feet to help frogs leap and swim",
        "Tree frogs have sticky disks on the tips of their fingers and toes",
        "These disks help frogs climb slippery surfaces",
        //"Many frogs are tiny",
        //"Frogs can be less than an inch (5 centimeters) long",
        "The largest frogs are about a foot (30 centimeters) long",
        "Many frogs are green, brown or yellow", //, gray 
        "Some frogs are brightly colored",
        "A frog catches prey by flicking out its long, sticky tongue",
        "Most frogs eat insects and worms",
        "Some frogs also eat rodents and reptiles", //other frogs,
        "Frogs have glands in their skin that make poison",
        "Frogs' poison does not protect them from snakes and birds", //, and other enemies
        "Frogs most often protect themselves by blending in with their surroundings",
        //"Frogs usually lay their eggs in water",
        //"Frogs can lay hundreds or thousands of eggs",
        "Within a few weeks, frog eggs hatch into tadpoles",
        "Tadpoles are young frog, fishlike creatures that breathe through gills instead of lungs",
        "To become an adult frog, a tadpole loses its tail and develops lungs and limbs",
    ],
    horse: [
        "Horses and humans have an ancient relationship",
        //"Asian nomads probably domesticated the first horses some 4,000 years ago, and the animals remained essential to many human societies until the advent of the engine",
        "Horses still hold a place of honor in many cultures, often linked to heroic exploits in war",
        "There are wild and domesticated horses",
        "There is only one species of domestic horse, but around 400 different breeds that specialize in everything from pulling wagons to racing",
        "All horses are grazers",
        "While most horses are domestic, others remain wild",
        "Feral horses are the descendents of previously tame animals that have run free for generations",
        "Groups of feral horses can be found in many places around the world",
        "Free-roaming North American mustangs, for example, are the descendents of horses brought by Europeans more than 400 years ago",
        "Wild horses generally gather in groups of 3 to 20 animals",
        //"A stallion (mature male) leads the group, which consists of mares (females) and young foals",
        //"When young male horses become colts, at around two years of age, the stallion drives them away",
        //"The colts then roam with other young male horses until they can gather their own band of females",
        // "The Przewalski's horse is the only truly wild horse whose ancestors were never domesticated",
        // "Ironically, this stocky, sturdy animal exists today only in captivity",
        // "The last wild Przewalski's horse was seen in Mongolia in 1968",
        "Horses are social mammals",
        "In wild or feral populations, horses form herds with a social hierarchy",
        //"Horse herds, can have up to 26 mares, 5 stallions, and various ages of young",
        "Horse herds have a social hierarchy, with alpha males being dominant and spending the majority of their time defending the herd from predators or competing males",
        "Horses are active at different times of the day, depending on the season",
        "In hot weather, horses graze in morning or evenings to avoid midday high temperatures",
        "Horses sleep in segments throughout the day, which are usually not more than two hours long",
        "Horses also avoid laying down for more than an hour at a time if possible, and can be seen sleeping while standing up",
        "Horses' nostrils, muzzle and cheeks have whiskers",
        "Horses' whiskers are used to perceive the environment through touch", //whiskers, 
        "Vision is the primary means of perceiving the environment in horses",
        "Horses' ears are long and slender, which aids in auditory perception", //and upright,
        "Although horses' sense of smell is important, it is not the chief means of perception",
        // "and provides a smaller role than vision or the sensitive receptors on the nostrils, muzzle, whiskers, or cheeks",
        "Horses communicate with each other mainly through facial gestures and vocalizations",
        //"Grunting, biting and kicking may occur among horses to express dominance", //, shoving, establish or reinforce the hierarchy structure and
        "Horses have an array of facial gestures",
        "Positive horse reactions include raising of the lips to expose upper teeth, similar to a smile, and head bobbing or pointing the ears forward and erect",
        "Aggressive horse facial gestures include the ears being laid back and the nostrils closed while exposing the same teeth",
    ],
    beaver: [
        "Beavers can be found at all levels of the working world, though they perform best in unsupervised positions that require serious responsibility",
        "While other animals are playing or relaxing, beavers are hard at work",
        "Their conscientious attitudes make them dependable as friends and a commitment from a beaver is like money in the bank",
        "Famous for their engineering talents, beavers are able to create advanced damming systems and intricate lodges",
        "Beavers spend most of their time eating and building",
        "Beavers are famously busy, and they turn their talents to reengineering the landscape as few other animals can",
        "Beavers don’t mind the cold, they can be seen active throughout winter and maintain use of their ponds even when they are covered with a layer of ice",
        "Beavers are good house guests. Their lodges typically contain two dens, one for drying off after entering the lodge under water, and a second, dryer den where the family will live and socialize",
        "Beavers have an excellent sense of smell",
        "Beavers are herbivores, so they eat plants",
        "One important communication signal among beavers is a tail slap on the surface of the water, indicating danger",
        "The large front teeth of the beaver never stop growing. The beavers constant gnawing on wood helps to keep their teeth from growing too long",
    ],
    vanilla: [
        "Vanilla ice cream is a simple treasure",
        "Nothing but vanilla bean mixed with cane sugar and cream fresh from the dairy farm",
        "Vanilla evokes purity and simplicity",
        "Vanilla is like an old friend",
        // "Fresh milk and cream and the highest quality make vanilla the benchmark of the Hudsonville lineup",
        "With butter this is the creamiest, dreamiest vanilla ever",
        "Our Original Vanilla Ice Cream",
        "The way vanilla should taste",
        "Our Natural Vanilla is made with fresh cream, sugar and vanilla beans",
        "Our vanilla is made with non-GMO sourced ingredients",
        "Vanilla's distinctive taste brings out the natural goodness of your favorite fresh fruit desserts, like classic Apple Pie a la Mode or Peach Cobbler",
        "Vanilla is frequently used to flavor ice cream, especially in North America, Asia, and Europe",
        "Vanilla ice cream was originally created by cooling a mixture above a container of ice and salt", //made of cream, sugar, and vanilla 
        "The type of vanilla used to flavor ice cream varies by location",
        "In North America and Europe consumers are interested in a more prominent, smoky flavor for vanilla, while in Ireland they want a more anise-like flavor",
        "To create the smooth consistency of vanilla ice cream, the mixture has to be stirred occasionally and then returned to the container of ice and salt to continue the solidification process",
        "According to Iced: Very Cool Concoctions, many people often consider vanilla to be the default or plain flavor of ice cream (see Plain vanilla)",
        "Vanilla is the essence of elegance and sophistication",
        //"This marriage of pure, sweet cream and Madagascar vanilla creates the sweet scent of exotic spice and a distinctive taste that lingers on your tongue",
        "In my humble opinion, vanilla is a highly underappreciated ice cream flavor",
        "Yes, vanilla has had its time in the spotlight",
        // "The debate over the superior flavor (vanilla or chocolate) almost always draws heated opinions and reveals fierce loyalties",
        // "I have never once seen someone hesitate when asked if they prefer vanilla or chocolate",//– it's almost as if this preference is somehow wired into our DNA",
        // "But lately, I've noticed more people proclaiming their love for chocolate, and vanilla has become synonymous with boring",
        "Some people think vanilla is boring",
        "Vanilla fans say that vanilla is anything but basic",//long-time 
    ],
    chocolate: [
        //"The earliest frozen chocolate recipes were published in Naples, Italy in Antonio Latini's The Modern Steward",
        "Chocolate was one of the first ice cream flavors",// (created before vanilla)",
        "Common drinks such as hot chocolate, coffee and tea were the first food items to be turned into frozen desserts",
        "Hot chocolate had become a popular drink, alongside coffee and tea, and all three beverages were used to make frozen and unfrozen desserts",
        "Latini produced two recipes for ices based on the drink, both of which contained only chocolate and sugar",
        //"In Italian doctor Filippo Baldini wrote a treatise entitled De sorbetti, in which he recommended chocolate ice cream as a remedy for various medical conditions, including gout and scurvy",
        "Chocolate ice cream became popular in the United States",
        //"The first advertisement of chocolate ice cream in America started in New York when Philip Lenzi announced that ice cream was officially available almost every day",
        "Chocolate ice cream (and ice cream in general) was once a rare and exotic dessert enjoyed mostly by the elite",
        "Around insulated ice houses were invented and manufacturing ice cream, including chocolate ice cream, soon became an industry in America",
        "Chocolate ice cream is generally made by blending cocoa powder with cream, eggs and sugar",// along with the eggs, cream, and sugar used to make vanilla ice cream
        //"Sometimes chocolate liquor is used in addition to cocoa powder, or it is used exclusively, to create the chocolate flavor",
        "Cocoa powder gives chocolate ice cream its brown color, and it is uncommon to add other colorings",
        // "The Codex Alimentarius, which provides an international set of standards for food, states that the flavor in chocolate ice cream must come from nonfat cocoa solids that must comprise at least of the mix weight",
        //"The US Code of Federal Regulations permits reductions in the content of milk fat and total milk solids of chocolate ice cream by a factor of times the weight of the cocoa solids, in order to take into account the use of additional sweeteners",

        //"The minimum fat content of chocolate ice cream in both Canada and the United States is irrespective of the amount of chocolate sweetener in the recipe",
        "Death by Chocolate Ice Cream features an ultra rich, thick and creamy double chocolate ice cream with chocolate fudge swirled throughout",
        // "Every bite of our chocolate ice cream is a chocoholic's dream",
        "Our thick, rich and creamy chocolate ice cream is anything but ordinary",
        "Made with real cocoa and fresh cream right from neighboring farms the only thing better than our velvety chocolate ice cream is more",
        "Dig into a delicious scoop of our Chocolate ice cream to find out why it's America's favorite",
        "Rich, creamy chocolate ice cream with just the right amount of sweetness and real cocoa",
        "Who can resist our Chocolate ice cream",
        "That fresh cream taste in our Chocolate ice cream is thanks in part to our partnerships with American farmers, who ensure the highest quality of dairy for our desserts",
    ],
    strawberry: [
        "Strawberry ice cream is a flavor of ice cream made with strawberry or strawberry flavoring",
        "It is made by blending in fresh strawberries or strawberry flavoring with the eggs, cream and sugar used to make ice cream",
        "Most strawberry ice cream is colored pink or light red",
        "Strawberry ice cream dates back at least to, when it was served at the second inauguration of James Madison",
        "Strawberry is one of the three flavors in Neapolitan ice cream",
        "Variations of strawberry ice cream include strawberry cheesecake ice cream and strawberry ripple ice cream, which has a ribbon of strawberry jam or syrup",
        "Some ice cream sandwiches are prepared neapolitan-style, and include strawberry ice cream",
        "We introduce sweet summer strawberries to pure cream and other natural ingredients",
        "Because it's brimming with real fruit, the true flavor of our strawberries comes shining through",
        "This strawberry ice cream is the freshest of fresh",
        "Its so creamy and has the perfect fresh strawberry flavor",
        "You will use cups of diced strawberries, pureed up in a blender to make the ice cream totally smooth",
        "But if you want it a little chunkier, with pieces of strawberries throughout then you can just mash the strawberries with a potato masher, or forks instead",
        "Our strawberry ice cream is loaded with chunks of real strawberries",
        "Rich, smooth and creamy, we use a simple recipe for strawberry ice cream that combines real cream and premium ingredients with no artificial flavors or colors",
        "California strawberries are amazing in strawberry ice cream",
        "Strawberries were swirled around in this delicious ice cream",
        "What could be better than strawberry ice cream",
        "Our Natural Strawberry ice cream is packed with strawberries picked at the peak of happiness",
    ],
    cookies: [
        "Cookies and cream is a variety of ice cream based on flavoring from sandwich or crumbled cookies",// and milkshake , with the most popular version containing from brandname cookies
        "Cookies and cream ice cream generally mixes in crumbled sandwich cookies into plain ice cream",//, though variations exist which might instead use chocolate, coffee or mint ice cream",
        "Pieces of rich cookies are dunked in delicious, creamy ice cream to satisfy the kid in all of us",
        "This is not your average Cookies and Cream Ice Cream, this is creamy, homemade ice cream loaded with chunks of delicious cookies",
        "This is nearly an entire package of sandwich cookies stuffed into a batch of ice cream and not just a few crumbles of cookies ",
        "If you love cookies filled with cream, you are certain to LOVE this Cookies and Cream Ice Cream",
        "Why dunk your cookies in milk when you can dunk them in ice cream",
        "We blend cookies filled with cream into the velvety smooth sweetness of our creamy ice cream for a rich and crunchy treat",
        "Take a milk and cookie break with cookies and cream ice cream",
        "Dive into rich and creamy ice cream packed with scrumptious pieces of cookies filled with cream in our Cookies & Cream",
        "That delicious ice cream taste mixed with cookies is an amazing combination",
    ],
    mint: [
        "Mint chocolate chip is an ice cream flavor composed of mint ice cream with small chocolate chips",
        "In most cases peppermint or spearmint flavoring is used to make mint chocolate chip ice cream", //In some cases the liqueur creme de menthe is used to provide the mint flavor, but i
        "Food coloring is usually added to make mint chocolate chip ice cream green, but it may be beige or white in natural or organic varieties",
        "According to the International Dairy Foods Association mint chocolate chip was the most popular flavor of ice cream", //(IDFA)
        "In a July survey by IDFA, mint chocolate chip was ranked as America's most popular ice cream flavor",
        "The popularity of the mint chocolate chip has led to its use in other foods as well a number of products such as cosmetics and air fresheners", //(such as cookies and meringues) 
        "There is a hard candy named mint chocolate chip that tastes similar to the ice cream of the same name", //Ice cream manufacturer Baskin-Robbins has created a (which is one of their permanent flavors)",
        "Some brands name it chocolate (or choco) chip mint, mint 'n chip, or just mint chip",
        //"It is also known as peppermint bon bon, mostly in Minnesota, North Dakota and Wisconsin",
        "This creamy and delicious homemade mint chocolate chip ice cream is made with just a handful of ingredients and is better than anything you could buy at the store",
        "Made with a custard base and flavored with mint extract and dark chocolate, it’s wonderfully refreshing and tastes like an Andes mint",
        // "You may not think of mint ice cream as the kind of thing that tears people apart, but l'll tell you from experience: Precious few discussions of the flavor stay civil for long",
        "When it comes to mint chocolate chip ice cream, there are fresh mint leaf people and mint extract people",
        "Some people insist that great mint ice cream can only be made with real mint leaves steeped in milk and cream",
        "Others demand that the only acceptable mint chip is loaded with peppermint extract and hued a nuclear green",
        // "Try to please them both and you wind up with a Treaty of Versailles situation: Everyone's unhappy and looking into building some tanks",
        //"More than most foods, our expectations for mint chocolate chip ice cream are fixed early and rarely change",
        // "So I'm about to dive deep into the makings of the perfect mint chip ice cream, but I need to get this out of the way",
        // "Which side you fall on likely comes down to what version of mint chip you grew up with",
        "For some people, mint chocolate chip made with mint extract tastes like toothpaste",
        "If you refuse to take your mint any other way, here's some peppermint extract and green food coloring as parting gifts",
        //"But if your crystalline vision of the perfect ice cream is a pale green scoop speckled with dark chocolate, redolent of the crisp and subtly grassy aroma and taste of genuine spearmint leaf, step a little closer",
        "Mint chocolate chip ice cream makes the kitchen smell awesome",
        "Cool mint ice cream dotted with rich chocolate chips make a perfect pairing in this refreshing favorite",
        "Cool, white mint ice cream with the real taste of mint and rich chocolatey chips is what our Mint Chocolate Chip ice cream is all about",
        "A classic dessert, and the perfect combination of mint flavor and rich chocolatey chips for your taste buds to enjoy",
    ],
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

    // get the particular category stated, if there was one:
    var category = '';
    var verb = 'are';
    if (recordedText.toLowerCase().includes('fox')) {
        category = 'foxes';
        categorySentences = sentences.fox;
        saidKnownCategory = true;
    } else if (recordedText.toLowerCase().includes('butterfl')) {
        category = 'butterflies';
        categorySentences = sentences.butterfly;
        saidKnownCategory = true;
    } else if (recordedText.toLowerCase().includes('bear')) {
        category = 'bears';
        categorySentences = sentences.bear;
        saidKnownCategory = true;
    } else if (recordedText.toLowerCase().includes('frog')) {
        category = 'frogs';
        categorySentences = sentences.frog;
        saidKnownCategory = true;
    } else if (recordedText.toLowerCase().includes('horse')) {
        category = 'horses';
        categorySentences = sentences.horse;
        saidKnownCategory = true;
    } else if (recordedText.toLowerCase().includes('beaver')) {
        category = 'beavers';
        categorySentences = sentences.beaver;
        saidKnownCategory = true;
    } else if (recordedText.toLowerCase().includes('vanilla')) {
        category = 'vanilla ice cream';
        verb = 'is';
        categorySentences = sentences.vanilla;
        saidKnownCategory = true;
    } else if (!recordedText.toLowerCase().includes('mint') && recordedText.toLowerCase().includes('chocolate')) {
        category = 'chocolate ice cream';
        verb = 'is';
        categorySentences = sentences.chocolate;
        saidKnownCategory = true;
    } else if (recordedText.toLowerCase().includes('strawberry')) {
        category = 'strawberry ice cream';
        verb = 'is';
        categorySentences = sentences.strawberry;
        saidKnownCategory = true;
    } else if (recordedText.toLowerCase().includes('cookies')) {
        category = 'cookies & cream ice cream';
        verb = 'is';
        categorySentences = sentences.cookies;
        saidKnownCategory = true;
    } else if (recordedText.toLowerCase().includes('mint')) {
        category = 'mint chocolate chip ice cream';
        verb = 'is';
        categorySentences = sentences.mint;
        saidKnownCategory = true;
    }

    if (saidKnownCategory) {
        // say, "I've heard about that category! Here's what I know about it:"
        phrases = ["I've heard about " + category + " before! Here's what I know.",
            "Oh yes, " + category + " " + verb + " very interesting. Here's what I know.",
            "Here's what I know about " + category + ". So fascinating!"
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

        var knownCategories = ['foxes', 'beavers', 'butterflies', 'bears', 'horses', 'frogs', 'vanilla ice cream', 'chocolate ice cream', 'strawberry ice cream', 'cookies & cream ice cream', 'mint chocolate chip ice cream'];
        if (saidUnknownCategory) {
            phrases = ["Hmmm, I haven't heard about that before, but I know about " + chooseRandomPhrase(knownCategories) + ".",
                "I don't know about that yet, but I've heard about " + chooseRandomPhrase(knownCategories) + "."
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
    } else if (filedata.nodes[0].id.toLowerCase() == "vanilla") {
        sentenceTopic.innerHTML = "vanilla ice cream";
        trainingSentencesDiv.innerHTML = createHTMLSentences(sentences.vanilla);
        sentenceContainer.hidden = false;
    } else if (filedata.nodes[0].id.toLowerCase() == "chocolate") {
        sentenceTopic.innerHTML = "chocolate ice cream";
        trainingSentencesDiv.innerHTML = createHTMLSentences(sentences.chocolate);
        sentenceContainer.hidden = false;
    } else if (filedata.nodes[0].id.toLowerCase() == "strawberry") {
        sentenceTopic.innerHTML = "strawberry ice cream";
        trainingSentencesDiv.innerHTML = createHTMLSentences(sentences.strawberry);
        sentenceContainer.hidden = false;
    } else if (filedata.nodes[0].id.toLowerCase() == "cookies" || filedata.nodes[0].id.toLowerCase() == "cooky") {
        sentenceTopic.innerHTML = "cookies & cream ice cream";
        trainingSentencesDiv.innerHTML = createHTMLSentences(sentences.cookies);
        sentenceContainer.hidden = false;
    } else if (filedata.nodes[0].id.toLowerCase() == "mint") {
        sentenceTopic.innerHTML = "mint chocolate chip ice cream";
        trainingSentencesDiv.innerHTML = createHTMLSentences(sentences.mint);
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