#!/bin/bash

python -u train_k_fold_validation.py --checkpoint-prefix model_conv --save-frequency 5 --display-frequency 5 --load-embedding-dict-from-file --embedding-type conv | tee k-fold-validation.txt
python -u train_k_fold_validation.py --checkpoint-prefix model_linear --save-frequency 5 --display-frequency 5 --load-embedding-dict-from-file --embedding-type linear | tee k-fold-validation.txt

#python visualize_embedding_results.py
