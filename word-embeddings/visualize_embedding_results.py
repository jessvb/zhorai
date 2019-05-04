import torch
import numpy as np
from data_utils import generateData, getBertEmbedding
import argparse
from model import EmbeddingModel
import os
from sklearn.decomposition import PCA
import plotly.plotly as py
import plotly.graph_objs as go
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE

parser = argparse.ArgumentParser(description='Zhorai Word Embedding')
parser.add_argument('--corpus-file', type=str, default='ecosystem-sentences.txt', metavar='FILE', help='Name of corpus file')
parser.add_argument('--eval-file', type=str, default='animal-sentences.txt', metavar='FILE', help='Name of evaluation file')
parser.add_argument('--eval-words-file', type=str, default='animal-list.txt')
parser.add_argument('--model-checkpoint', type=str, default='results/model_eco-0100.tar', metavar='CHECKPOINT', help='Name of model checkpoint file')
parser.add_argument('--embedding-type', type=str, default='attention', metavar='TYPE', help='Type of model. accepted values are "attention" and "embedding". Defaults to attention.')
parser.add_argument('--plot-tag', type=str, default='0', metavar='TAG', help='tag of plotly plot')
parser.add_argument('--ignore-plot', action='store_true', help='If set, ignores plotting')
parser.add_argument('--verbose', action='store_true', help='Verbose data generation')
parser.add_argument('--load-embedding-dict-from-file', action='store_true', help='If true, loads embedding dictionaries from file')

args = parser.parse_args()

args.classes = ["desert", "rainforest", "grassland", "tundra", "ocean"]
eval_list = []
with open(args.eval_words_file, 'r') as f:
	for line in f:
		eval_list.append(line.strip().lower())

model = EmbeddingModel(len(args.classes), args.embedding_type)

#dataset, labels, _, __, ___ = generateData(args.corpus_file, args.classes, 1.0, args.load_embedding_dict_from_file, not args.load_embedding_dict_from_file, args.verbose, 'eval_embedding_dict.pckl', True)
eval_dataset, eval_labels, _, __, ___ = generateData(args.eval_file, eval_list, 1.0, args.load_embedding_dict_from_file, not args.load_embedding_dict_from_file, args.verbose, 'animal_embedding_dict.pckl', True, args.classes)
embedding_dict = {}
#datasets = [dataset, eval_dataset]
#label_sets = [labels, eval_labels]
#class_sets = [args.classes, eval_list]
if len(args.model_checkpoint) > 0:
	checkpoint = torch.load(args.model_checkpoint, map_location='cpu')
	model.load_state_dict(checkpoint['model_state_dict'])
	embedding = checkpoint['model_state_dict']['l2.weight']
	for i in range(len(args.classes)):
		embedding_dict[args.classes[i]] = ([embedding[i, :]], [i])
x = eval_dataset
y = eval_labels
classes = eval_list
for i in range(len(x)):
	inputs = x[i]
	label = y[i]
	if inputs.shape[1] < 2:
		continue
	embedding = model.embedding(inputs)
	output = model(inputs)
	_, predicted = torch.max(output.data, 1)
	if classes[label] in embedding_dict:
		embedding = embedding_dict[classes[label]][0] + [embedding]
		predictions = embedding_dict[classes[label]][1] + [predicted]
		embedding_dict[classes[label]] = (embedding, predictions)
	else:
		embedding_dict[classes[label]] = ([embedding], [predicted])
data = []
words = []
eco_predictions = []
for x in embedding_dict:
	predictions = embedding_dict[x][1]
	prediction = max(set(predictions), key=predictions.count)
	embedding = torch.zeros(embedding_dict[x][0][0].shape)
	count = 0
	for i in range(len(predictions)):
		if predictions[i] == prediction:
			embedding = embedding + embedding_dict[x][0][i]
			count += 1.0
	embedding = embedding.detach().squeeze().numpy()
	embedding /= count
	embedding /= np.linalg.norm(embedding)
	data.append(embedding)
	words.append(x)
	eco_predictions.append(args.classes[prediction])
data = np.array(data)

pca = PCA(n_components=2, whiten=True).fit_transform(data)
#tsne = TSNE(n_components=2).fit_transform(data)
decomp = pca
for i in range(len(data)):
	print('{0},{1},{2},{3}'.format(words[i], decomp[i, 0], decomp[i, 1], eco_predictions[i]))
	if words[i] in args.classes:
		words[i] = "<b>{0}<b>".format(words[i])

if args.ignore_plot:
	exit(0)
trace1 = go.Scatter(
		x = decomp[:, 0],
		y = decomp[:, 1],
	mode='markers+text',
	text=words,
	marker=dict(
		size=12,
		color=decomp[:, 1],
		colorscale='Viridis',
		opacity=0.8
	),
	textposition='bottom center'
)
dataTrace = [trace1]
layout = go.Layout(
	margin=dict(l=0, r=0, b=0, t=0)
)
fig = go.Figure(data=dataTrace, layout=layout)
py.plot(fig, filename='{0}-context-dependent-{1}'.format(args.embedding_type, args.plot_tag))
