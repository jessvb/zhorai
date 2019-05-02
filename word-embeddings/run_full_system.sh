#!/bin/bash
python train.py --corpus-file embedding_corpus.txt --checkpoint-prefix model_initial --save-frequency 5 --display-frequency 5 --epochs 20 --load-embedding-from-file

python train.py --corpus-file ecosystem-sentences.txt --checkpoint-prefix model_eco --save-frequency 5 --display-frequency 5 --epochs 30 --model-checkpoint results/model_initial-0020.tar --results-dir results_eco

#python visualize_embedding_results.py
