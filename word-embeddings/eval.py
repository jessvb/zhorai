import torch
import torch.optim as optim
import numpy as np
from data_utils import getBertEmbedding
import argparse
from model import EmbeddingModel
import os
from sklearn.decomposition import PCA

parser = argparse.ArgumentParser(description='Zhorai Word Embedding Evaluation')
parser.add_argument('--model-checkpoint', type=str, help='Model checkpoint to use for evaluation')
parser.add_argument('--eval-sentence', type=str, help='Sentence to return embedding')

args = parser.parse_args()

if torch.cuda.is_available():
	args.device = torch.device('cuda')
	torch.cuda.manual_seed(np.random.randint(1, 10000))
	#torch.backends.cudnn.enabled = True 
args.classes = ["desert", "rainforest", "grassland", "tundra"]
model = EmbeddingModel(len(args.classes))
checkpoint = torch.load(args.model_checkpoint)
model.load_state_dict(checkpoint['model_state_dict'])
inputs = getBertEmbedding(args.eval_sentence)
pca = PCA(n_components = 2)
print("word,x,y,prediction")
data = []
predictions = []
for x, w in inputs:
	output = model(x)
	embedding = model.embedding(x) 
	_, predicted = torch.max(output.data, 1)
	predictions.append(predicted)
	print(embedding.shape)
	# TODO: Currently does PCA on a single embedding. Should instead do PCA on each embedding including the training set.
	data.append(embedding.detach().squeeze().numpy())
data = np.array(data)
print(data.shape)
pc = pca.fit_transform(data)
for i in range(data.shape[0]):
	w = inputs[i][1]
	predicted = predictions[i]
	print("{0},{1},{2},{3}".format(w, pc[i,0],pc[i,1],args.classes[predicted]))
