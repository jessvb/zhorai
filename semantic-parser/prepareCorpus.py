import sys
import re
import nltk.data
from nltk.stem import WordNetLemmatizer

def stem(a):
    lemmatizer = WordNetLemmatizer()
    b = []
    for line in a:
        split_line = line.split() #break it up so we can get access to the word
        new_line = ' '.join(lemmatizer.lemmatize(word) for word in split_line)
        b.append(new_line) #add it to the new list of lines
    return b

def split(sentences):
    aSplit = re.split('(?<=[.!?]) +',sentences)
    b = [x.lower() for x in aSplit]
    return b

print(stem(split(sys.argv[1])))
