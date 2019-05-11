#!/bin/bash

python -u train_k_fold_validation.py --results-dir results_k_fold_conv --checkpoint-prefix model_conv --save-frequency 5 --display-frequency 5 --load-embedding-dict-from-file --embedding-type conv | tee results_k_fold_conv/conv-k-fold-validation.txt
python -u train_k_fold_validation.py --results-dir results_k_fold_linear --checkpoint-prefix model_linear --save-frequency 5 --display-frequency 5 --load-embedding-dict-from-file --embedding-type linear | tee results_k_fold_linear/linear-k-fold-validation.txt
