import torch
import torch.optim as optim
import numpy as np
from data_utils import generateData
import argparse
from model import EmbeddingModel
from progressbar import progressbar
import os

parser = argparse.ArgumentParser(description='Zhorai Word Embedding k-fold cross validation')
parser.add_argument('--epochs', type=int, default=10, metavar='EPOCHS', help='Epochs to train each embedding model')
parser.add_argument('--corpus-file', type=str, default='embedding_corpus.txt', metavar='FILE', help='Name of corpus file') 
parser.add_argument('--verbose', action='store_true', help='display tensorflow error messages')
parser.add_argument('--results-dir', type=str, default='results_k_fold', metavar='DIR', help='Directory to store results')
parser.add_argument('--checkpoint-prefix', type=str, default='model', metavar='PREFIX', help='Prefix of filename to save checkpoint')
parser.add_argument('--save-frequency', type=int, default=5, metavar='N', help='Save model every N epochs')
parser.add_argument('--display-frequency', type=int, default=50, metavar='N', help='Display model every N epochs')
parser.add_argument('--learning-rate', type=float, default=0.001, metavar='lr', help='Learning rate for training')
parser.add_argument('--train-split-percentage', type=float, default=0.8, metavar='x', help='Percentage of data for training')
parser.add_argument('--save-embedding-dict', action='store_true', help='Save computed embeddings to file')
parser.add_argument('--load-embedding-from-file', action='store_true', help='Load precomputed embeddings from file')
parser.add_argument('--model-checkpoint', type=str, default='', help='Model checkpoint to resume training')
parser.add_argument('--embedding-type', type=str, default='attention', metavar='TYPE', help='Type of model. accepted values are "attention" and "embedding". Defaults to attention.')
parser.add_argument('--k', type=int, default=10, metavar='NUM_FOLDS', help='Num folds for k-fold cross validation')

args = parser.parse_args()

if torch.cuda.is_available():
	args.device = torch.device('cuda')
	torch.cuda.manual_seed(np.random.randint(1, 10000))
	torch.backends.cudnn.enabled = True 
args.classes = ["desert", "rainforest", "grassland", "tundra", "ocean"]
model = EmbeddingModel(len(args.classes), args.embedding_type)
if torch.cuda.is_available():
	model = model.cuda()
criterion = torch.nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=args.learning_rate)
model = model.train()
starting_epoch = 0
running_loss = 0.0
if len(args.model_checkpoint) > 0:
	checkpoint = torch.load(args.model_checkpoint)
	model.load_state_dict(checkpoint['model_state_dict'])
	optimizer.load_state_dict(checkpoint['optimizer_state_dict'])
	starting_epoch = checkpoint['epoch']
	running_loss = checkpoint['running_loss']
train_set, train_labels, _, __, ___ = generateData(args.corpus_file, args.classes, 1.0, args.load_embedding_from_file, args.save_embedding_dict)
num_examples = len(train_set) / args.k
folds = [(train_set[i:i+num_examples], train_labels[i:i+num_examples]) for i in range(0, len(train_set), num_examples)]
print('Performing K-Fold Cross Validation...')
print('Starting from epoch %d' % (starting_epoch + 1))
for i in len(folds):
	curr_results_dir = os.path.join(args.results_dir,"results_fold_{0}".format(i))
	os.mkdir(curr_results_dir)
	print("Leaving out fold #{0}".format(i+1)
	curr_test_set, curr_test_labels = folds[i]
	curr_train_set = []
	curr_train_labels = []
	for j in len(folds):
		if i != j:
			curr_train_set = curr_train_set + folds[j]
			curr_train_labels = curr_train_labels + folds[j]
	for epoch in progressbar(range(starting_epoch, args.epochs)):
		for i in range(len(curr_train_set)):
			inputs = curr_set[i]
			labels = curr_train_labels[i]
			if torch.cuda.is_available():
				inputs = inputs.cuda()
				labels = labels.cuda()
			optimizer.zero_grad()
			outputs = model(inputs)
			loss = criterion(outputs, labels)
			loss.backward()
			optimizer.step()
			running_loss += loss.item()
		if (epoch + 1) % args.save_frequency == 0:
			path = os.path.join(curr_results_dir, "{0}-{1:04d}.tar".format(args.checkpoint_prefix, epoch + 1))
			torch.save({
									'epoch': epoch,
									'model_state_dict': model.state_dict(),
									'optimizer_state_dict': optimizer.state_dict(),
									'running_loss': running_loss
								 }, path)
			print('\nModel saved to %s' % path)
		if (epoch + 1) % args.display_frequency == 0:
			print('\nEpoch %d:\n\tLoss = %.3f' % (epoch + 1, running_loss / args.display_frequency))
			running_loss = 0.0
			model = model.eval()
			correct = 0.0
			total = 0.0
			for k in range(len(curr_train_set)):
				inputs = curr_train_set[k]
				labels = curr_train_labels[k]
				if torch.cuda.is_available():
					inputs = inputs.cuda()
					labels = labels.cuda()
				outputs = model(inputs)
				_, predicted = torch.max(outputs.data, 1)
				total += labels.size(0)
				correct += (predicted == labels).sum().item()
			print('\tTrain accuracy = %.3f%% ' % (100.0 * correct/total))
			correct = 0.0
			total = 0.0
			for k in range(len(curr_test_set)):
				inputs = curr_test_set[k]
				labels = curr_test_labels[k]
				if torch.cuda.is_available():
					inputs = inputs.cuda()
					labels = labels.cuda()
				outputs = model(inputs)
				_, predicted = torch.max(outputs.data, 1)
				total += labels.size(0)
				correct += (predicted == labels).sum().item()
			print('\tTest accuracy = %.3f%% ' % (100.0 * correct/total))
			model = model.train()
print('Training Complete.')
