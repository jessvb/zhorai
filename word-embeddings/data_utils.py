from bert_embedding import BertEmbedding
import numpy as np
import tensorflow as tf

def generateData(corpus_file, classes):
	sentences = []
	# Read in corpus
	print("Loading corpus...")
	with open(corpus_file, 'r') as f:
		for line in f:
			if any(w in line for w in classes):
				sentences.append(line.strip().replace('-', ' '))
	print("Computing Bert Embeddings...")
	# split into train and test sets
	# Currently we only use 25 train and 5 test to test model
	train_set = sentences[0:1]
	test_set = sentences[1:2]
	# Create dictionary of training/test sets
	words = [w.lower() for line in train_set + test_set for w in line.split()]
	words = list(set(words))
	bert = BertEmbedding()
	embedding_dict = dict([(x[0], y[0]) for x, y in bert(words)])
	print(embedding_dict['forest'].shape)
	print("Preparing dataset...")
	def create_dataset(dataset):
		data = []
		labels = []
		for sentence in dataset:
			for i in range(len(classes)):
				word = classes[i]
				s = sentence.lower().split()
				x = [np.array(embedding_dict[w]) for w in s]
				x = np.array(x)
				x = tf.convert_to_tensor(x, dtype=tf.float32)
				x = tf.expand_dims(x, 0)
				data.append(x)
				curr_label = np.zeros(len(classes))
				curr_label[i] = 1
				curr_label = tf.convert_to_tensor(curr_label, dtype=tf.int16)
				curr_label = tf.expand_dims(curr_label, 0)
				labels.append(curr_label)
		return data, labels		
	train_set, train_labels = create_dataset(train_set)
	test_set, test_labels = create_dataset(test_set)
	return train_set, train_labels, test_set, test_labels 




