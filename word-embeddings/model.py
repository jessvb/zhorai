import torch
from torch import nn
from torch.nn import functional as F

class EmbeddingModel(nn.Module):
	def __init__(self, num_classes):
		super(EmbeddingModel, self).__init__()
		self.lstm1 = nn.LSTM(768, 128, 2, batch_first=True, bidirectional=True)
		self.l1 = nn.Linear(256, 128)
		self.l2 = nn.Linear(128, num_classes)

	def forward(self, x):
		x, hidden = self.lstm1(x)
		x = x.squeeze()[-1].unsqueeze(0)
		x = self.l1(x)
		x = self.l2(x)
		return x
	
	def embedding(self, x):
		x, hidden = self.lstm1(x)
		x = x.squeeze()[-1].unsqueeze(0)
		x = self.l1(x)
		return x

	def embeddingLSTM(self, x):
		x, hidden = self.lstm1(x)
		x = x.squeeze()[-1].unsqueeze(0)
		return x

class AttentionEmbeddingModel(nn.Module):
	def __init__(self, num_classes):
		super(AttentionEmbeddingModel, self).__init__()
		self.lstm1 = nn.LSTM(768, 128, 2, batch_first=True, bidirectional=True)
		self.l1 = nn.Linear(256, 128)
		self.l2 = nn.Linear(128, num_classes)

	def forward(self, x):
		x, hidden = self.lstm1(x)
		x = x.squeeze()[-1].unsqueeze(0)
		x = self.l1(x)
		# self attention
		x = x + x * x
		x = self.l2(x)
		return x
	
	def embedding(self, x):
		x, hidden = self.lstm1(x)
		x = x.squeeze()[-1].unsqueeze(0)
		x = self.l1(x)
		return x

	def embeddingLSTM(self, x):
		x, hidden = self.lstm1(x)
		x = x.squeeze()[-1].unsqueeze(0)
		return x
