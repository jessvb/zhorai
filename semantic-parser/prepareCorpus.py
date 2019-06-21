import sys
import nltk.data
from nltk.stem import WordNetLemmatizer

input = sys.argv[1]

def stem(a):
    lemmatizer = WordNetLemmatizer()
    b = []
    for line in a:
        split_line = line.split() #break it up so we can get access to the word
        new_line = ' '.join(lemmatizer.lemmatize(word) for word in split_line)
        b.append(new_line) #add it to the new list of lines
    return b

def addPeriod(s):
    if s[-1] == '.' or s[-1] == '\n':
        return s
    return s + '.'

def openfile(f):
    with open(f,'r') as a:
        a = a.readlines()
        aSplit = []
        for l in range(len(a)):
            aSplit = aSplit + [addPeriod(x) for x in a[l].split('. ')]
        b = [x.lower() for x in aSplit]
        return b

def returnfile(a):
    with open(input,'r') as d:
        for line in a:
            print(line)

returnfile(stem(openfile(input)))
