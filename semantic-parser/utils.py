import sys
import xml.etree.ElementTree as ET

ecosystems = ["forest", "desert", "rainforest", "grassland", "tundra", "plain"]
animals = ["alligator","ant","antelope","baboon","bat","bear","beaver","bee","bird","butterfly","camel","cat","coyote","cheetah","chicken","chimpanzee","cow","crocodile","deer","dog","dolphin","donkey","duck","eagle","elephant","fish","firefly","flamingo","fly","fox","frog","gerbil","giraffe","goat","goldfish","gorilla","hamster","hippopotamus","horse","jellyfish","kangaroo","kitten","koala","ladybug","leopard","lion","llama","lobster","monkey","moose","octopus","ostrich","otter","owl","panda","panther","peacock","penguin","pig","puma","puppy","rabbit","rat","rhinoceros","scorpion","seal","seahorse","shark","sheep","sloth","snail","snake","starfish","spider","squirrel","swordfish","tiger","walrus","weasel","whale","turtle","wildcat","whale","wolf","zebra"]
negatives = ["n't","not","no","little","small","few"]

def combine(id, structureData):
    if len(structureData[id]) == 2:
        return structureData[id]
    else:
        children = structureData[id].split(' ')
        sentenceStruct = []
        for c in children:
            sentenceStruct.append(combine(c, structureData))
    return sentenceStruct

def getStructure(sentences):
    s = []
    for sentence in sentences:
        structureData = {}
        ccg = sentence[1]
        subRoot = ccg.attrib['root']
        for span in ccg:
            if span.attrib['pos'] == "None":
                structureData[span.attrib['id']] = (span.attrib['child'])
            else:
                structureData[span.attrib['id']] = (span.attrib['base'], span.attrib['pos'])
        s.append(combine(subRoot, structureData))
    return s

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

def extractName(part):
    if type(part) is tuple:
        word = part[0]
        pos = part[1]
        if pos == 'NNP':
            return [word]
        return
    else:
        words = []
        for p in part:
            res = extractName(p)
            if type(res) is tuple:
                words = words + [res]
            elif res:
                words = words + res
    return words

def buildDict(s):
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
    return res

def getName(s):
    sentence = s[-1]
    name = extractName(sentence)
    if name:
        res = name[-1]
    else:
        res = " "
    return res
