# Context Aware Word Embeddings

## Facilities Presented in this Folder
### Baseline Embedding Computation
`embedding_{bert|elmo|word2vec}.py`: These compute and plot word embeddings for the three methods. The Word2Vec implementation trains a skipgram model before computing the embeddings.

### Embedding Classification Model Training
`train.py`: This loads data and trains an embedding model on the ecosystem corpus, using pre-trained BERT embeddings.

execute `python train.py --help` to see command line options. Typical execution can be done with `python train.py`.

### Embedding Classification Model Evaluation
`visualize_embedding_results`: This loads an existing model (trained using train.py) and outputs a CSV file containing word,x,y,prediction tuples. prediction is not output if `--igonre-plot` is set. word is the relevant word, x and y are the PCA reduced coordinates for the embedding, and prediction is the predicted ecosystem for the word based on the input sentence. 

execute `python visualize_embedding_results.py --corpus-file embedding_corpus.txt --eval-file test-sentence.txt --eval-words-file animal-list.txt  ---ignore-plot --model-checkpoint results/model_initial-0050.tar`

execute `python visualize_embedding_results.py --help` to see details about commmand line options.


