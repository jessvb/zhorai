import torch
from torch import nn
from torch.nn import functional as F
from torch.autograd import Variable

class SimpleLSTM(nn.Module):
	def __init__(self, input_dims, cell_size, return_single_output):
		super(SimpleLSTM, self).__init__()
		self.return_single_output = return_single_output
		self.cell_size = cell_size
		self.lstm = nn.LSTMCell(input_dims, cell_size)

	def forward(self, x):
		h_t, c_t = self.init_hidden(x.size(0))
		outputs = []
		for x_t in torch.chunk(x, x.size(1), dim=1):
			h_t, c_t = self.lstm(x_t.squeeze(1), (h_t, c_t))
			outputs.append(h_t)
		return outputs[-1] if self.return_single_output else torch.cat(outputs, dim=0).unsqueeze(0)

	def init_hidden(self, batch_size):
		hidden = Variable(next(self.parameters()).data.new(batch_size, self.cell_size), requires_grad=False)
		cell = Variable(next(self.parameters()).data.new(batch_size, self.cell_size), requires_grad=False)
		return hidden.zero_(), cell.zero_()

class EmbeddingModel(nn.Module):
	def __init__(self, num_classes, model_type):
		super(EmbeddingModel, self).__init__()
		#self.lstm1 = nn.LSTM(768, 128, 2, batch_first=True, bidirectional=True)
		self.lstm1 = SimpleLSTM(768, 512, False)
		self.lstm2 = SimpleLSTM(512, 256, True)
		self.l1 = nn.Linear(256, 128)
		self.l2 = nn.Linear(128, num_classes)
		self.model_type = model_type

	def forward(self, x):
		x = self.embedding(x)
		x = self.l1(x)
		x = self.l2(x)
		return x
	
	def embedding(self, x):
		x = self.lstm1(x)
		x = self.lstm2(x)
		#x = x.squeeze()[-1].unsqueeze(0)
		if self.model_type == "attention":
			x = x + x * x
		return x


