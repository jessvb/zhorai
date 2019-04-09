from bert_embedding import BertEmbedding

bert = BertEmbedding()

words = "forests are more wet than deserts, which are dry."

embedding = bert(words)
print(embedding[0])
