import sys
import xml.etree.ElementTree as ET
import json
import utils

tree = ET.parse(sys.argv[1] + '/sentences.xml')
root = tree.getroot()

# only one doc
for doc in root:
    # only one set of sentences per doc
    for sentences in doc:
        s = utils.getStructure(sentences)

#output dictionary
file = open(sys.argv[1] + "/dictionary.txt","w")
res = utils.buildDict(s)
if res:
    file.write(json.dumps(res))
file.close()

#output ecosystem/animal
file = open(sys.argv[1] + "/topic.txt","w")
if res:
    file.write(next(iter(res)))
else:
    with open(sys.argv[1] + 'sentences.tok','r') as f:
        for line in f:
            for word in line.split():
                if utils.isTopic(word):
                    file.write(word)
file.close()

#output name
file = open(sys.argv[1] + "/name.txt","w")
file.write(utils.getName(s))
file.close()

#output mindmap
file = open(sys.argv[1] + "/mindmap.txt","w")
map = utils.getMindMap(res)
if map:
    file.write(json.dumps(map))
file.close()
