import sys
import json
from nltk.corpus import wordnet as wn
from itertools import product

class Entity:
    def __init__(self, desc, name):
        self.name = name
        self.pos = self.getDescription(desc,'pos')
        self.neg = self.getDescription(desc,'neg')

    def getDescription(self,desc,corr):
        pre_res, res = [], []
        for wcorr, word in desc:
            if wcorr == corr:
                pre_res.append(word)
        unique_list = list(set(pre_res))
        for word in unique_list:
            res.append((pre_res.count(word),word))
        return res

class AnimalEco:
    def __init__(self, animal):
        self.animal = animal
        self.ecosystems = []
        self.scores = []
        self.match = None

    def addEco(self,ecosystem):
        self.ecosystems.append(ecosystem)

    def compare(self,animal,eco):
        score = 0
        failed, weight = 0, 0
        animal_syns = create_syns(animal.pos)
        eco_syns = create_syns(eco.pos)
        pos_combinations = list(product(animal_syns,eco_syns))
        for (a_c,a_desc), (e_c,e_desc) in pos_combinations:
            s = a_desc.wup_similarity(e_desc)
            if s:
                score += a_c*e_c * a_desc.wup_similarity(e_desc)
                weight += a_c*e_c
            else:
                failed += 1

        animal_syns = create_syns(animal.neg)
        eco_syns = create_syns(eco.neg)
        neg_combinations = list(product(animal_syns,eco_syns))
        for (a_c,a_desc), (e_c,e_desc) in neg_combinations:
            s = a_desc.wup_similarity(e_desc)
            if s:
                score += a_c*e_c * a_desc.wup_similarity(e_desc)
                weight += a_c*e_c
            else:
                failed += 1


        self.scores.append(score/weight)

    def normScores(self):
        mi = min(self.scores)
        ma = max(self.scores)
        r = ma - mi
        self.scores = [float(s - mi)/r for s in self.scores]

    def findMatch(self):
        ind = self.scores.index(max(self.scores))
        self.match = self.ecosystems[ind].name

def create_syns(word_tups):
    res = set()
    for c, word in word_tups:
        syns = wn.synsets(word)
        if len(syns) > 0:
            res.add((c,wn.synsets(word)[0]))
    return res


def main():
    # assumes student told the agent only about one animal.
    # Otherwise, takes the first one
    # animal_dict = eval(open(sys.argv[2], 'r').read())
    animal_dict = json.loads(sys.argv[1])
    animal_name = list(animal_dict.keys())[0]
    animal = Entity(animal_dict[animal_name],animal_name)
    # get and save all ecosystem that agent knows about
    eco_dict = eval(open('eco_dict.txt', 'r').read())
    animal_eco = AnimalEco(animal)
    for e in eco_dict.keys():
        ecosystem = Entity(eco_dict[e],e)
        animal_eco.addEco(ecosystem)
        animal_eco.compare(animal,ecosystem)
    animal_eco.normScores()
    # not returning match for now
    # animal_eco.findMatch()
    ret = {}
    for i in range(len(animal_eco.ecosystems)):
        ret[animal_eco.ecosystems[i].name] = animal_eco.scores[i]
    print(json.dumps(ret))

if __name__ == "__main__":
    main()
