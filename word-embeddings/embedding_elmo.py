import tensorflow_hub as hub
import tensorflow as tf
import plotly.plotly as py
import plotly.graph_objs as go
import numpy as np
import operator
from sklearn.decomposition import PCA
pca = PCA(n_components = 2)

with open('stop-word-list.txt') as f:
	ignore = f.read().splitlines()

words = {}
# Read in corpus
with open("embedding_corpus.txt", 'r') as f:
	for x in f:
		for w in x.split():
			if True or w not in ignore:
				if w in words:
					words[w] = words[w] + 1
				else:
					words[w] = 1
words = sorted(words.items(), key=operator.itemgetter(0), reverse=True)
words = [x for x, y in words][0:50]
prefixes = ["forest", "desert", "rainforest", "grassland", "tundra", "plain"]
for p in prefixes:
	words.append(p)

elmo = hub.Module("https://tfhub.dev/google/elmo/2")
sess = tf.Session()
with sess.as_default():
	sess.run(tf.global_variables_initializer())
	embedding = elmo(words).eval()
	principalComponents = pca.fit_transform(embedding)

trace1 = go.Scatter(
	x=principalComponents[:, 0],
	y=principalComponents[:, 1],
	mode='markers+text',
	text=words,
	marker=dict(
		size=12,
		color=principalComponents[:, 1],
		colorscale='Viridis',
		opacity=0.8
	),
	textposition='bottom center'
)


data = [trace1]
layout = go.Layout(
	margin=dict(l=0, r=0, b=0, t=0)
)
fig = go.Figure(data=data, layout=layout)
py.plot(fig, filename='embedding-elmo')
