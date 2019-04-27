# Context Aware Word Embeddings

## Facilities Presented in this Folder
embedding_{bert|elmo|word2vec}.py: These compute and plot word embeddings for the three methods. The Word2Vec implementation trains a skipgram model before computing the embeddings.

train.py: This loads data and trains an embedding model on the ecosystem corpus, using pre-trained BERT embeddings.
execute `python train.py --help` to see command line options. Typical execution can be done with `python train.py`.

eval.py: This loads an existing model (trained using train.py) and outputs a CSV file containing word,x,y,prediction tuples. word is the relevant word, x and y are the PCA reduced coordinates for the embedding, and prediction is the predicted ecosystem for the word based on the input sentence. 
example execution: `python eval.py --model-checkpoint model-0005.tar --eval-sentence "camels do not need water"`
execute `python eval.py --help` to see details about commmand line options.
