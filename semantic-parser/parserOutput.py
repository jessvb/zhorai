import sys
import xml.etree.ElementTree as ET
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
file.write(str(res))
file.close()

#output ecosystem/animal
file = open(sys.argv[1] + "/topic.txt","w")
file.write(next(iter(res)))
file.close()

#output name
file = open(sys.argv[1] + "/name.txt","w")
file.write(utils.getName(s))
file.close()

#output mindmap
# file = open(sys.argv[1] + "/mindmap.txt","w")
# file.write()
# file.close()
