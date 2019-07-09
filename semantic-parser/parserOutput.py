import sys
import string
import re
import json

import xml.etree.ElementTree as ET
import nltk.data
from nltk.stem import WordNetLemmatizer

import utils

content, full_word_dict = utils.stem(utils.split(sys.argv[2]))
content = content[1:-1].split(', ')
s = utils.getStructure(content)
# dictionary
res = utils.buildDict(s, full_word_dict)
if res:
    dictionary = json.dumps(res)
    #output dictionary
    if sys.argv[1] == "Dictionary":
        print(dictionary) if dictionary else print("")

#output ecosystem/animal
if sys.argv[1] == "Topic":
    if res:
        print(next(iter(res)).title()) if next(iter(res)) else print("")
    else:
        for s in content:
            words = s.split(' ')
            for word in words:
                word = word.translate(str.maketrans('','',string.punctuation))
                if utils.isTopic(word):
                    print(word.title()) if word else print("")
                    break

#output name
if sys.argv[1] == "Name":
    name = utils.getName(s)
    if name.strip():
        print(name.title())

#output mindmap
if sys.argv[1] == "Mindmap":
    map = utils.getMindMap(res)
    emptyMap = {"nodes": [], "links": []}
    if map != {"nodes": [], "links": []}:
        minmdap = json.dumps(map)
        print(minmdap) if minmdap else print("")
