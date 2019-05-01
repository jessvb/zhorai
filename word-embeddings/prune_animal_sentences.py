animal_list = []
with open('animal-list.txt', 'r') as f:
	for line in f:
		animal_list.append(line.strip().lower())

with open('animal-sentences-full.txt', 'r') as f:
	with open('animal-pruned-sentences.txt', 'w') as f2:
		for line in f:
			if any(w.lower() in line.lower() for w in animal_list):
				f2.write(line.lower())
