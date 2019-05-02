#!/bin/bash

python -u train_k_fold_validation.py --corpus-file ecosystem-sentences.txt --checkpoint-prefix model_eco --save-frequency 5 --display-frequency 5 --epochs 30 --model-checkpoint plain_embedding_2/results/model_initial-0020.tar --results-dir results_eco | tee k-fold-validation.txt

#python visualize_embedding_results.py
