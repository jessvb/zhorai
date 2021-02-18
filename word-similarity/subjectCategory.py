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

class SubjectCategory:
    def __init__(self, animal):
        self.animal = animal
        self.categories = []
        self.scores = []
        self.match = None

    def addCategory(self,category):
        self.categories.append(category)

    def compare(self,subject,category):
        score = 0
        failed, weight = 0, 0
        subject_syns = create_syns(subject.pos)
        category_syns = create_syns(category.pos)
        pos_combinations = list(product(subject_syns,category_syns))
        for (subject_c,subject_desc), (category_c,category_desc) in pos_combinations:
            similarity = subject_desc.wup_similarity(category_desc)

            # wup_similarity breaks when the two synsets have no common hypernym.
            # check for this failure, and if so, use a very small number for s, 
            # so that we don't run into errors with "s=None" later on
            if (not similarity):
                similarity = 1e-14
                failed += 1
            score += subject_c*category_c * similarity
            weight += subject_c*category_c

        subject_syns = create_syns(subject.neg)
        category_syns = create_syns(category.neg)
        neg_combinations = list(product(subject_syns,category_syns))
        for (subject_c,subject_desc), (category_c,category_desc) in neg_combinations:
            similarity = subject_desc.wup_similarity(category_desc)

            # wup_similarity breaks when the two synsets have no common hypernym.
            # check for this failure, and if so, use a very small number for s, 
            # so that we don't run into errors with "s=None" later on
            if (not similarity):
                similarity = 1e-14
                failed += 1
            score += subject_c*category_c * similarity
            weight += subject_c*category_c

        self.scores.append(score/weight)

    def normScores(self):
        mi = min(self.scores)
        ma = max(self.scores)
        r = ma - mi
        self.scores = [float(s - mi)/r for s in self.scores]

    def findMatch(self):
        ind = self.scores.index(max(self.scores))
        self.match = self.categories[ind].name

def create_syns(word_tups):
    res = set()
    for c, word in word_tups:
        syns = wn.synsets(word)
        if len(syns) > 0:
            res.add((c,wn.synsets(word)[0]))
    return res


def main():
    # assumes student told the agent only about one subject (e.g., themselves, 
    # an animal). Otherwise, takes the first one
    
    # sys.argv[1] = topicKey (e.g., 'spirit animal', 'ice cream flavour')
    # sys.argv[2] = subjectDict (e.g., personal data)
    
    # animal_dict = eval(open(sys.argv[2], 'r').read())
    subject_dict = json.loads(sys.argv[2])
    subject_name = list(subject_dict.keys())[0]
    subject = Entity(subject_dict[subject_name],subject_name)
    topic = sys.argv[1]

    # get and save all relevant category (e.g., ecosystems, ice cream 
    # flavours, spirit animals) info that agent knows about
    topicFilename = ''
    if (topic == 'ecosystems'):
        topicFilename = 'eco_dict.txt'
    elif (topic == 'ice cream flavour'):
        topicFilename = 'ice_cream_dict.txt'
    elif (topic == 'spirit animal'):
        topicFilename = 'spirit_animal_dict.txt'
    
    category_dict = eval(open(topicFilename, 'r').read())
    subject_category = SubjectCategory(subject)
    for e in category_dict.keys():
        category = Entity(category_dict[e],e)
        subject_category.addCategory(category)
        subject_category.compare(subject,category)
    subject_category.normScores()
    # not returning match for now
    # animal_eco.findMatch()
    ret = {}
    for i in range(len(subject_category.categories)):
        ret[subject_category.categories[i].name] = subject_category.scores[i]
    print(json.dumps(ret))

if __name__ == "__main__":
    main()
