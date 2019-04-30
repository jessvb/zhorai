import torch
from data_utils import generateData, getBertEmbedding
import argparse
from model import EmbeddingModel
import os
from sklearn.decomposition import PCA
import plotly.plotly as py
import plotly.graph_objs as go

parser = argparse.ArgumentParser(description='Zhorai Word Embedding')
parser.add_argument('--corpus-file', type=str, default='ecosystem-eval-sentences.txt', metavar='FILE', help='Name of corpus file')
parser.add_argument('--eval-file', type=str, default='animal-eval-sentences.txt', metavar='FILE', help='Name of evaluation file')
parser.add_argument('--eval-words-file', type=str, default='animal-list.txt')
parser.add_argument('--model-checkpoint', type=str, default='results/initial_model/model-1000.tar', metavar='CHECKPOINT', help='Name of model checkpoint file')

args = parser.parse_args()

args.classes = ["forest", "desert", "rainforest", "grassland", "tundra"]
eval_list = []
with open(args.eval_words_file, 'r') as f:
	for line in f:
		eval_list.append(line.strip().lower())

dataset, labels, _, __, ___ = generateData(args.corpus_file, args.classes, 1.0)
eval_dataset, eval_labels, _, __, ___ = generateData(args.eval_file, eval_list, 1.0)
embedding_dict = {}
model = EmbeddingModel(len(args.classes))
datasets = [dataset, eval_dataset]
label_sets = [labels, eval_labels]
class_sets = [args.classes, eval_list]
for x, y, classes in zip(datasets, label_sets, class_sets):
	for i in range(len(x)):
		inputs = x[i]
		label = y[i]
		if inputs.shape[1] < 2:
			continue
		embedding = model.embedding(inputs)
		if classes[label] in embedding_dict:
			embedding = embedding + embedding_dict[classes[label]][0]
			count = embedding_dict[classes[label]][1] + 1.0
			embedding_dict[classes[label]] = (embedding, count)
		else:
			embedding_dict[classes[label]] = (embedding, 1.0)

data = []
words = []
for x in embedding_dict:
	print(x, len(embedding_dict[x]))
	embedding = embedding_dict[x][0].detach().squeeze().numpy()
	embedding = embedding/embedding_dict[x][1]
	data.append(embedding)
	words.append(x)

pca = PCA(n_components = 2)
pc = pca.fit_transform(data)
trace1 = go.Scatter(
	x = pc[:, 0],
	y = pc[:, 1],
	mode='markers+text',
	text=words,
	marker=dict(
		size=12,
		color=pc[:, 1],
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
py.plot(fig, filename='embedding-context-dependent')
