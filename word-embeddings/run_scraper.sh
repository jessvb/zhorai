#!/bin/bash

scrapy runspider scraper.py -o embedding_corpus_raw.csv
python clean_corpus.py
rm embedding_corpus_raw.csv
