#!/bin/bash
python train.py --corpus-file embedding_corpus.txt --checkpoint-prefix model_initial --save-frequency 100 --display-frequency 25 --epochs 100 --save-embedding-dict

python train.py --corpus-file ecosystem-sentences.txt --checkpoint-prefix model_eco --save-frequency 100 --display-frequency 25 --epochs 100 --model-checkpoint model_initial-0100.tar

python visualize_embedding_results.py
