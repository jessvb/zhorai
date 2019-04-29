import sys
import xml.etree.ElementTree as ET

ecosystems = ["forest", "desert", "rainforest", "grassland", "tundra", "plain"]
animals = ["alligator","ant","antelope","baboon","bat","bear","beaver","bee","bird","butterfly","camel","cat","coyote","cheetah","chicken","chimpanzee","cow","crocodile","deer","dog","dolphin","donkey","duck","eagle","elephant","fish","firefly","flamingo","fly","fox","frog","gerbil","giraffe","goat","goldfish","gorilla","hamster","hippopotamus","horse","jellyfish","kangaroo","kitten","koala","ladybug","leopard","lion","llama","lobster","monkey","moose","octopus","ostrich","otter","owl","panda","panther","peacock","penguin","pig","puma","puppy","rabbit","rat","rhinoceros","scorpion","seal","seahorse","shark","sheep","sloth","snail","snake","starfish","spider","squirrel","swordfish","tiger","walrus","weasel","whale","turtle","wildcat","whale","wolf","zebra"]
negatives = ["n't","not","no","little","small","few"]

def isTopic(word):
    if word in ecosystems or word in animals:
        return True
    return False

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
        if pos == 'NN' or pos == 'JJ' or pos == 'RB' or pos == 'NNS':
            if (word in ecosystems) or (word in animals):
                return ('subject', word, pos)
            else:
                if word in negatives:
                    return ('neg', word, pos)
                return ('pos', word, pos)
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
        if words:
            subjects = [subject[1] for subject in words if subject[0] == 'subject']
            isNeg = False
            for corr, w, pos in words:
                if corr == 'subject':
                    continue
                if corr == 'neg':
                    isNeg = True
                    continue
                if isNeg == True:
                    for i in subjects:
                        if pos == 'NN' or pos == 'NNS':
                            if i in res.keys():
                                res[i].append(["neg",w])
                            else:
                                res[i] = [["neg",w]]
                            isNeg = False
                else:
                    for i in subjects:
                        if i in res.keys():
                            res[i].append(["pos",w])
                        else:
                            res[i] = [["pos",w]]
    return res

def getName(s):
    sentence = s[-1]
    name = extractName(sentence)
    if name:
        res = name[-1]
    else:
        res = " "
    return res

def inMindMap(corr,word,nodes,type,key):
    if type =="nodes":
        for dict in nodes:
            if dict["id"] == word:
                return True
        return False
    else:
        for dict in nodes:
            if dict["source"] == word and dict["target"] == key:
                return True
        return False

def getIndexVal(word,key,links):
    for i in range(len(links)):
        if links[i]["source"] == word and links[i]["target"] == key:
            return i, links[i]["value"]
    return False, False

def getMindMap(topics):
    mindMap = {"nodes": [], "links": []}
    pos = 1
    neg = 2
    colorsIndex = 3
    for key, val in topics.items():
        mindMap["nodes"].append({"id": key, "group": colorsIndex})
        for (corr,word) in val:
            if inMindMap(corr,word,mindMap["nodes"],"nodes",key):
                if inMindMap(corr,word,mindMap["links"],"links",key):
                    ind, value = getIndexVal(word,key,mindMap["links"])
                    if value:
                        mindMap["links"][ind] = {"source": word, "target": key, "value": value + 1}
                else:
                    mindMap["links"].append({"source": word, "target": key, "value": 1})
            else:
                if corr == "pos":
                    mindMap["nodes"].append({"id": word, "group": pos})
                    mindMap["links"].append({"source": word, "target": key, "value": 1})
                elif corr == "neg":
                    mindMap["nodes"].append({"id": word, "group": neg})
                    mindMap["links"].append({"source": word, "target": key, "value": 1})
        colorsIndex = colorsIndex + 1
    return mindMap
