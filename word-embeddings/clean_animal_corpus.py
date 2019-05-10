import re
import argparse


with open('embedding_animal_corpus.txt', 'r') as in_file, open ('embedding_animal_corpus_clean.txt', 'w') as out_file:
	for line in in_file:
		line = line.lower()
		line = re.sub('polar bear', 'polarbear', line)
		line = re.sub('arctic fox', 'arcticfox', line)
		out_file.write(line)
