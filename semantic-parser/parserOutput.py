import sys
import xml.etree.ElementTree as ET
import json
import utils

file = open(sys.argv[1] + "splitSentences.txt",'r')
content = file.readlines()
content = [x.strip() for x in content]
s = utils.getStructure(content)
file.close()

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
    with open(sys.argv[1] + '/splitSentences.txt','r') as f:
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
emptyMap = {"nodes": [], "links": []}
if map != {"nodes": [], "links": []}:
    file.write(json.dumps(map))
file.close()
