#!/bin/bash

scrapy runspider animal_scraper.py -o embedding_animal_corpus_raw.csv
python clean_corpus.py --raw-corpus embedding_animal_corpus_raw.csv --clean-corpus embedding_animal_corpus.txt
rm embedding_animal_corpus_raw.csv
