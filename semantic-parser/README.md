# Semantic Parser

This parser will use the ccg2lambda library to parse the sentences. Then it will reduce the space to ecosystems and animals.
The input of this section is a corpus of sentences about the ecosystems/animals.
The outputs of this section are:
  1. Dictionary used as the input to the word embedder. The keys are the ecosystems and animals that appeared in the corpus. The values are lists of tuples where each tuple has two values. The first value is 'pos' or 'neg' and the second value is the word. The first value describes the relationship between the word and the key.
  2. Visualizations that can be used to show the students about the parser's output.

### Short explanation on ccg2lambda

This is a tool to derive formal semantic representations of
natural language sentences given CCG derivation trees and semantic templates.
For the full explanation, read the README file under the ccg2lambda directory.

## Installation

In order to run this software, it is necessary to install python3,
nltk 3, lxml, simplejson and yaml python libraries. I recommend installing the packages in the virtual environment of this project with `pip`:

```bash
sudo apt-get install python3-dev
sudo apt-get install libxml2-dev libxslt-dev python-dev
pip install lxml simplejson pyyaml -I nltk==3.0.5
```

You also need to install WordNet and the Punkt Sentence Tokenizer:

```bash
python -c "import nltk; nltk.download('wordnet'); nltk.download('punkt')"
```

To ensure that the ccg2lambda library is working as expected, you can run the tests:

```bash
python ccg2lambda/scripts/run_tests.py
```
(all tests should pass, except a few expected failures).

You also need to install the [Coq Proof Assistant](https://coq.inria.fr/) that is used for automated reasoning. You can install it by:

```bash
sudo apt-get install coq
```

Then, compile the coq library that contains the axioms:

```bash
cd ccg2lambda
coqc coqlib.v
cd ..
```

Next, install the [C&C parser](http://www.cl.cam.ac.uk/~sc609/candc-1.00.html) for the CCG structures.

You can download and install the C&C syntactic parser by running the following script
from the semantic-parser directory:

```bash
# from semantic-parser directory
ccg2lambda/en/install_candc.sh
```

If that fails, you may succeed by following [these alternative instructions](https://github.com/valeriobasile/learningbyreading#installation-of-the-cc-tools-and-boxer), in which case you need to manually create a file `ccg2lambda/en/candc_location.txt` with the path to the C&C parser:

```bash
echo "/path/to/candc-1.00/" > ccg2lambda/en/candc_location.txt
```

## How to Run the Semantic Parser

Simply run the following command
```bash
sh parse.sh arg1 arg2
```
where arg1 is the input file (including its relative path) and arg2 is the the output relative path.

For example, to run the current example, run the command
```bash
sh parse.sh example/input.txt example/
```
where input.txt is the corpus and the rest of the files in example/ are output files of the parser.

## Open Issues
1. What do we want to happen when a student describes an animal using another animal? For example, "tigers are scary cats"?
