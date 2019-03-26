import re

def filterfun(val):
	return val is not '' and val is not ' '

with open('embedding_corpus_raw.csv', 'r') as in_file, open ('embedding_corpus.csv', 'w') as out_file:
	seen = set()
	for line in in_file:
		if line in seen: continue
		seen.add(line)
		line = re.sub(' +', ' ', line)
		line = re.sub(',+', '', line)
		line = re.sub('\n', '', line)
		lines = [re.sub('"', '', item) for item in list(filter(filterfun, line.split(".")))]
		for sentence in lines: 
			if sentence is not ' ' and sentence is not '\n' and len(sentence) > 1: out_file.write(sentence.strip()+"\n")
