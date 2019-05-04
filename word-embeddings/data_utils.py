from bert_embedding import BertEmbedding
import torch
import numpy as np
import random
import pickle

def getBertEmbedding(sentences):
	data = []
	if isinstance(sentences, str):
		sentences = [sentences]
	for sentence in sentences:
		bert = BertEmbedding()
		words = sentence.split()
		embedding_dict = dict([(x[0], y[0]) for x, y in bert(words)])
		for word in words:
			s = [w for w in words if w is not word] 
			x = [np.array(embedding_dict[w]) for w in s if w in embedding_dict]
			x = np.array(x)
			x = torch.tensor(x, dtype=torch.float)
			x = x.unsqueeze(0)
			data.append((x, word))
	return data

def generateData(corpus_file, classes, split_percentage, load_embedding_from_file=False, save_embedding_dict=False, verbose=True, embedding_dict_filename="embedding_dict.pkl", shuffle=True, ignore_words=None):
	if ignore_words is None:
		ignore_words = []
	sentences = []
	# Read in corpus
	if verbose: print("Loading corpus...")
	with open(corpus_file, 'r') as f:
		for line in f:
			if any(w.lower() in line.lower() for w in classes):
				sentences.append(line.strip().replace('-', ' '))
	if shuffle: random.shuffle(sentences)
	#sentences = sentences[0:50]
	if verbose: print("Computing Bert Embeddings...")
	# split into train and test sets
	num_train = int(len(sentences)*split_percentage)
	train_set = sentences[0:num_train] 
	test_set = sentences[num_train:]
	# Create dictionary of training/test sets
	if verbose: print(len(train_set), len(test_set))
	words = [w.lower() for line in train_set + test_set for w in line.split()]
	words = list(set(words))
	if load_embedding_from_file:
		with open(embedding_dict_filename, 'rb') as f:
			embedding_dict = pickle.load(f)
	else:
		bert = BertEmbedding()
		embedding_dict = dict([(x[0], y[0]) for x, y in bert(words)])
		if save_embedding_dict:
			with open(embedding_dict_filename, 'wb') as f:
				pickle.dump(embedding_dict, f, pickle.HIGHEST_PROTOCOL)

	if verbose: print("Preparing dataset...")
	def create_dataset(dataset, max_len):
		data = []
		labels = []
		for sentence in dataset:
			for i in range(len(classes)):
				word = classes[i]
				if word.lower() in sentence.lower():
					s = sentence.lower().split()
					x = [np.array(embedding_dict[w]) for w in s if w not in word.lower() and w not in ignore_words and w in embedding_dict]
					x = np.array(x)
					max_len = max_len if x.shape[0] < max_len else x.shape[0]
					x = torch.tensor(x, dtype=torch.float)
					x = x.unsqueeze(0)
					data.append(x)
					y = [i]
					y = torch.tensor(y, dtype=torch.long)
					labels.append(y)
		return data, labels, max_len		
	train_set, train_labels, max_len = create_dataset(train_set, 0)
	test_set, test_labels, max_len = create_dataset(test_set, max_len)
	return train_set, train_labels, test_set, test_labels, classes 




