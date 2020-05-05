#!/bin/bash

# we want everything to run in python3, so let's make python==python3
rm -f /usr/bin/python
ln -s /usr/bin/python3 /usr/bin/python

# reinstall required libraries etc. 
# (NOTE: not sure why they're not persisting from the Dockerfile...)
pip3 install lxml simplejson pyyaml -I nltk==3.0.5
python3 -c "import nltk; nltk.download('wordnet')"
pip3 install -U nltk[corenlp]

# get stanford-corenlp, if not already there:
cd /usr/src/semantic-parser/
if [ ! -d stanford-corenlp-full-2018-10-05 ]; then
    echo "Please wait until the stanford-corenlp libraries have been downloaded..."
    curl -O https://nlp.stanford.edu/software/stanford-corenlp-full-2018-10-05.zip
    unzip stanford-corenlp-full-2018-10-05.zip
    rm stanford-corenlp-full-2018-10-05.zip
fi
cd stanford-corenlp-full-2018-10-05
ls && pwd && echo "Starting the StanfordCoreNLPServer..."
java -mx6g -cp "*" edu.stanford.nlp.pipeline.StanfordCoreNLPServer -timeout 5000 &

## uncomment to test:
# # sleep for a few seconds (until hopefully the nlp server is up), then test the server:
# sleep 10 # 10sec
# echo 'curling...'
# curl --data 'The quick brown fox jumped over the lazy dog.' 'http://localhost:9000/?properties={%22annotators%22%3A%22tokenize%2Cssplit%2Cpos%22%2C%22outputFormat%22%3A%22json%22}' -o -
# echo 'parsing for name...'
# cd /usr/src/semantic-parser/
# sh parse.sh "Name" "I'm Jess"
# echo 'parsing for deserts...'
# sh parse.sh "Mindmap" "The desert has lots of sand. The desert is very dry. Deserts have cactus. The desert is very hot and sunny. Deserts don't have much water. Deserts have few people. Deserts have flash floods. Deserts have sand dunes. Deserts are sandy. Deserts don't have many plants. Deserts don't have much vegetation. Deserts are hot. Deserts don't have much precipitation. Deserts are also called drylands. Deserts are harsh environments. It's hard for animals to survive in the desert. Animals are rare in the desert. Animals that live in the desert have ways to keep cool and use less water. Many animals in the desert are nocturnal. Animals often come out at night in the desert. Plants in the desert store water. There are lots of cacti in the desert. There are shrubs in the desert. The sun is hot in the desert. Deserts get very cold at night. It is hard to find water in the desert. There are lots of deserts in africa"

cd /usr/src/website-backend/receive-text
npm install
echo $NODE_ENV
if [[ "$NODE_ENV" == "development" ]]; then
    echo "Starting development receive-text server..."
    npm run devstart
elif [[ "$NODE_ENV" == "production" ]]; then
    echo "Starting production receive-text server..."
    npm start
fi
