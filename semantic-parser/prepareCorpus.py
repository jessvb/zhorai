import sys
import nltk.data

input = sys.argv[1]

tokenizer = nltk.data.load('tokenizers/punkt/english.pickle')
fp = open(input)
data = fp.read()
print('\n'.join(tokenizer.tokenize(data)))
