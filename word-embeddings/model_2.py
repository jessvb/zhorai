import torch
from torch import nn
from torch.nn import functional as F

class EmbeddingModel(nn.Module):
	def __init__(self, num_classes, model_type):
		super(EmbeddingModel, self).__init__()
		self.lstm1 = nn.LSTM(768, 525, 2, batch_first=True, bidirectional=True)
		self.c1 = nn.Conv1d(1, 12, 6)
		self.m1 = nn.MaxPool1d(4)
		self.c2 = nn.Conv1d(12, 1, 6)
		self.l1 = nn.Linear(256, num_classes)
		self.model_type = model_type

	def forward(self, x):
		x = self.embedding(x)
		x = self.l1(x)
		return x
	
	def embedding(self, x):
		x, hidden = self.lstm1(x)
		x = x.squeeze()[-1].unsqueeze(0).unsqueeze(0)
		x = self.c1(x)
		x = self.m1(x)
		x = self.c2(x)
		x = x.squeeze().unsqueeze(0)
		if self.model_type == "attention":
			x = x + x * x
		return x
