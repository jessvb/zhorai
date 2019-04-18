import sys
import xml.etree.ElementTree as ET

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
