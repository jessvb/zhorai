#!/bin/bash
python train.py --corpus-file embedding_corpus.txt --checkpoint-prefix model_initial --save-frequency 100 --display-frequency 25 --epochs 100 --load-embedding-from-file

python train.py --corpus-file ecosystem-sentences.txt --checkpoint-prefix model_eco --save-frequency 5 --display-frequency 25 --epochs 110 --model-checkpoint results/model_initial-0100.tar --results-dir results_eco

python visualize_embedding_results.py
