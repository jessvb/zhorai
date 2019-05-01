import torch
from data_utils import generateData, getBertEmbedding
import argparse
from model import EmbeddingModel
import os
from sklearn.decomposition import PCA
import plotly.plotly as py
import plotly.graph_objs as go

parser = argparse.ArgumentParser(description='Zhorai Word Embedding')
parser.add_argument('--corpus-file', type=str, default='ecosystem-sentences.txt', metavar='FILE', help='Name of corpus file')
parser.add_argument('--eval-file', type=str, default='animal-sentences.txt', metavar='FILE', help='Name of evaluation file')
parser.add_argument('--eval-words-file', type=str, default='animal-list.txt')
parser.add_argument('--model-checkpoint', type=str, default='results/model_eco-0100.tar', metavar='CHECKPOINT', help='Name of model checkpoint file')

args = parser.parse_args()

args.classes = ["desert", "rainforest", "grassland", "tundra"]
eval_list = []
with open(args.eval_words_file, 'r') as f:
	for line in f:
		eval_list.append(line.strip().lower())

dataset, labels, _, __, ___ = generateData(args.corpus_file, args.classes, 1.0)
eval_dataset, eval_labels, _, __, ___ = generateData(args.eval_file, eval_list, 1.0)
embedding_dict = {}
model = EmbeddingModel(len(args.classes))
if len(args.model_checkpoint) > 0:
	checkpoint = torch.load(args.model_checkpoint)
	model.load_state_dict(checkpoint['model_state_dict'])
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
		output = model(inputs)
		print(output.data)
		_, predicted = torch.max(output.data, 1)
		print(label.detach().squeeze().numpy(), predicted)
		if classes[label] in embedding_dict:
			embedding = embedding + embedding_dict[classes[label]][0]
			count = embedding_dict[classes[label]][1] + 1.0
			predictions = embedding_dict[args.classes[label]][2]
			predictions.append(predicted)
			embedding_dict[classes[label]] = (embedding, count, predictions)
		else:
			embedding_dict[classes[label]] = (embedding, 1.0, [predicted])

data = []
words = []
eco_predictions = []
for x in embedding_dict:
	print(x, embedding_dict[x][2])
	embedding = embedding_dict[x][0].detach().squeeze().numpy()
	embedding = embedding/embedding_dict[x][1]
	predictions = embedding_dict[x][2]
	prediction = max(set(predictions), key=predictions.count)
	data.append(embedding)
	words.append(x)
	eco_predictions.append(args.classes[prediction])

pca = PCA(n_components = 2)
pc = pca.fit_transform(data)
for i in range(len(data)):
	print(words[i], pc[i, 0], pc[i, 1], eco_predictions[i])
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
