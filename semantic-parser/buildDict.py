import sys
import xml.etree.ElementTree as ET
import utils

ecosystems = ["forest", "desert", "rainforest", "grassland", "tundra", "plain"]
animals = ["alligator","ant","antelope","baboon","bat","bear","beaver","bee","bird","butterfly","camel","cat","coyote","cheetah","chicken","chimpanzee","cow","crocodile","deer","dog","dolphin","donkey","duck","eagle","elephant","fish","firefly","flamingo","fly","fox","frog","gerbil","giraffe","goat","goldfish","gorilla","hamster","hippopotamus","horse","jellyfish","kangaroo","kitten","koala","ladybug","leopard","lion","llama","lobster","monkey","moose","octopus","ostrich","otter","owl","panda","panther","peacock","penguin","pig","puma","puppy","rabbit","rat","rhinoceros","scorpion","seal","seahorse","shark","sheep","sloth","snail","snake","starfish","spider","squirrel","swordfish","tiger","walrus","weasel","whale","turtle","wildcat","whale","wolf","zebra"]
negatives = ["n't","not","no","little","small","few"]

def extractWords(part):
    if type(part) is tuple:
        word = part[0]
        pos = part[1]
        if pos == 'NN' or pos == 'JJ' or pos == 'RB'or pos == 'NNS':
            if (word in ecosystems) or (word in animals):
                return ('subject',word)
            else:
                if word in negatives:
                    return ('neg',word)
                else:
                    return ('pos',word)
        return
    else:
        words = []
        for p in part:
            res = extractWords(p)
            if type(res) is tuple:
                words = words + [res]
            elif res:
                words = words + res
    return words

tree = ET.parse(sys.argv[1] + '/sentences.xml')
root = tree.getroot()

# only one doc
for doc in root:
    # only one set of sentences per doc
    for sentences in doc:
        s = utils.getStructure(sentences)

res = {}
for sentence in s:
    words = extractWords(sentence)
    subjects = [subject[1] for subject in words if subject[0] == 'subject']
    isNeg = False
    for corr, w in words:
        if corr == 'subject':
            continue
        if corr == 'neg':
            isNeg = True
            continue
        if isNeg == True:
            for i in subjects:
                if i in res.keys():
                    res[i].append(['neg',w])
                else:
                    res[i] = [['neg',w]]
            isNeg = False
        else:
            for i in subjects:
                if i in res.keys():
                    res[i].append(['pos',w])
                else:
                    res[i] = [['pos',w]]

print(res)

file = open("../website-server-side/receive-text/data/topic.txt","w")
file.write(next(iter(res)))
file.close()
