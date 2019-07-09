import sys
import re
import string
import xml.etree.ElementTree as ET
from nltk.parse.corenlp import CoreNLPParser
from nltk.stem import WordNetLemmatizer


ecosystems = ["forest", "desert", "rainforest", "grassland", "tundra", "plain", "ocean"]
animals = ["alligator","ant","antelope","baboon","bat","bear","beaver","bee","bird","butterfly","camel","cat","coyote","cheetah","chicken","chimpanzee","cow","crocodile","deer","dog","dolphin","donkey","duck","eagle","elephant","fish","firefly","flamingo","fly","fox","frog","gerbil","giraffe","goat","goldfish","gorilla","hamster","hippopotamus","horse","jellyfish","kangaroo","kitten","koala","ladybug","leopard","lion","llama","lobster","monkey","moose","octopus","ostrich","otter","owl","panda","panther","peacock","penguin","pig","polarbear","puma","puppy","rabbit","rat","reindeer","rhinoceros","scorpion","seal","seahorse","shark","sheep","sloth","snail","snake","starfish","spider","squirrel","swordfish","tiger","walrus","weasel","whale","turtle","wildcat","whale","wolf","zebra"]
negatives = ["n’t","n't","not","no","little","small","few","low"]
stopwords = ["i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "ha", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "more", "most", "other", "some", "such", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now", "lot", "many"]

lemmatizer = WordNetLemmatizer()
parser = CoreNLPParser()

def stem(a):
    lemmatizer = WordNetLemmatizer()
    b = []
    full_word_dict = {}
    for line in a:
        split_line = line.split() #break it up so we can get access to the word
        new_line = ' '.join(lemmatizer.lemmatize(word) for word in split_line)
        b.append(new_line) #add it to the new list of lines
        for word in split_line:
            word_stripped = word.translate(str.maketrans('','',string.punctuation))
            lemw = lemmatizer.lemmatize(word_stripped)
            if lemw not in full_word_dict.keys():
                full_word_dict[lemw] = word_stripped
    return str(b), full_word_dict

def split(sentences):
    sentences = sentences.replace("\r",". ")
    sentences = sentences.replace("\n",". ")
    aSplit = re.split('(?<=[.!?]) +',sentences)
    b = [x.lower() for x in aSplit]
    return b

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

def getStructureOld(sentences):
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


def traverse_tree(tree):
    if len(tree.leaves()) == 1:
        word = tree.leaves()[0]
        leaf_index = tree.leaves().index(word)
        tree_location = tree.leaf_treeposition(leaf_index)
        pos = tree[tree_location[:-1]].label()
        return (lemmatizer.lemmatize(word).lower(),pos)
    s = []
    for subtree in tree:
        s.append(traverse_tree(subtree))
    return s

def getStructure(sentences):
    s = []
    for sentence in sentences:
        parsed = next(parser.raw_parse(sentence))
        s.append(traverse_tree(parsed))
    return s


def isNegative(word):
    if word in negatives:
        return True
    for n in negatives:
        if n in word:
            return True
    return False

def extractWords(part):
    if type(part) is tuple:
        word = part[0]
        pos = part[1]
        if pos == 'NN' or pos == 'JJ' or pos == 'RB' or pos == 'NNS' or (pos == 'VBP' and isNegative(word)):
            if (word in ecosystems) or (word in animals):
                return ('subject', word, pos)
            else:
                if isNegative(word):
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
        if pos == 'NNP' or pos == "NN" or pos == "FW":
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

def buildDict(s, full_word_dict):
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
                if w in stopwords:
                    continue
                if isNeg == True:
                    for i in subjects:
                        if pos == 'NN' or pos == 'NNS':
                            if i in res.keys():
                                res[i].append(["neg",full_word_dict[w]])
                            else:
                                res[i] = [["neg",full_word_dict[w]]]
                            isNeg = False
                else:
                    for i in subjects:
                        if i in res.keys():
                            res[i].append(["pos",full_word_dict[w]])
                        else:
                            res[i] = [["pos",full_word_dict[w]]]
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
