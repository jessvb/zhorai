import sys
import xml.etree.ElementTree as ET
import utils

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

tree = ET.parse(sys.argv[1] + '/sentences.xml')
root = tree.getroot()

# only one doc
for doc in root:
    # only one set of sentences per doc
    for sentences in doc:
        s = utils.getStructure(sentences)

res = {}
sentence = s[-1]
name = extractName(sentence)
if name:
    print(name[-1])
