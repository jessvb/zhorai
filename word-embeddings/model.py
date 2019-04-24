import tensorflow as tf
from tensorflow.keras.layers import Bidirectional, Dense, Activation, LSTM

class EmbeddingModel(tf.keras.Model):
	def __init__(self, num_classes):
		super(EmbeddingModel, self).__init__()
		self.b1 = Bidirectional(LSTM(128, return_sequences=True))
		self.b2 = Bidirectional(LSTM(128))
		self.d1 = Dense(256)
		self.d2 = Dense(num_classes)

	def call(self, x):
		x = self.b1(x)
		x = self.b2(x)
		x = self.d1(x)
		x = self.d2(x)
		return x
