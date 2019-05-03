import re
import argparse


parser = argparse.ArgumentParser(description='Zhorai Word Embedding Corpus Cleaner')
parser.add_argument('--raw-corpus', type=str, default='embedding_corpus_raw.csv', metavar='RAW_CORPUS_FILE', help='Name of raw corpus file')
parser.add_argument('--clean-corpus', type=str, default='embedding_corpus.txt', metavar='CLEAN_CORPUS_FILE', help='Name of clean corpus file to create')
args = parser.parse_args()

def filterfun(val):
	return val is not '' and val is not ' '

with open(args.raw_corpus, 'r') as in_file, open (args.clean_corpus, 'w') as out_file:
	seen = set()
	for line in in_file:
		if line in seen: continue
		seen.add(line)
		line = re.sub(' +', ' ', line)
		line = re.sub(',+', '', line)
		line = re.sub('\n', '', line)
		line = re.sub('-', ' ', line)
		lines = [re.sub('"', '', item) for item in list(filter(filterfun, line.split(".")))]
		for sentence in lines: 
			if sentence is not ' ' and sentence is not '\n' and len(sentence.split()) > 3: out_file.write(sentence.strip()+"\n")
