import tensorflow as tf
import numpy as np
from data_utils import generateData
import argparse
from model import EmbeddingModel
import os
from progressbar import progressbar

parser = argparse.ArgumentParser(description='Zhorai Word Embedding')
parser.add_argument('--epochs', type=int, default=1000, metavar='EPOCHS', help='Epochs to train embedding model')
parser.add_argument('--corpus-file', type=str, default='embedding_corpus.txt', metavar='FILE', help='Name of corpus file') 
parser.add_argument('--batch-size', type=int, default=16, metavar='N', help='Number of examples in batch')
parser.add_argument('--verbose', action='store_true', help='display tensorflow error messages')
parser.add_argument('--results-dir', type=str, default='results', metavar='DIR', help='Directory to store results')
parser.add_argument('--checkpoint-prefix', type=str, default='model', metavar='PATH', help='Prefix of filename to save checkpoint')
parser.add_argument('--save-frequency', type=int, default=250, metavar='N', help='Save model every N epochs')

args = parser.parse_args()

if not args.verbose:
	tf.logging.set_verbosity(tf.logging.ERROR)

args.classes = ["forest", "desert", "rainforest", "grassland", "tundra", "plain"]
train_set, train_labels, test_set, test_labels = generateData(args.corpus_file, args.classes)

model = EmbeddingModel(len(args.classes))
model.compile('adam', tf.losses.softmax_cross_entropy)

saver = tf.train.Saver()

with tf.Session() as sess:
	sess.run(tf.global_variables_initializer())
	print("Training model...")
	for i in progressbar(range(args.epochs*len(train_set))):
			j = i % len(train_set)
			model.train_on_batch(train_set[j], train_labels[j])
			epoch = i / len(train_set)
			if epoch % args.save_frequency == 0:
				saver.save(sess, os.path.join(args.results_dir, "{0}-{1:04d}".format(args.checkpoint_prefix, int(epoch))))
	print("Training complete.")
	
