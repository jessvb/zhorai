###############################
### PYTHON: SEMANTIC-PARSER ###
###############################
FROM python:3.7-slim-buster

# Create directory in container:
WORKDIR /usr/src/semantic-parser

# COPY requirements.txt ./
RUN mkdir ./ccg2lambda
COPY ./semantic-parser/ccg2lambda /usr/src/semantic-parser/ccg2lambda

RUN apt-get update

RUN apt-get -y install python3-dev

RUN apt-get -y install libxml2-dev libxslt-dev python-dev

RUN pip install lxml simplejson pyyaml -I nltk==3.0.5

RUN python -c "import nltk; nltk.download('wordnet'); nltk.download('punkt')"

RUN python ccg2lambda/scripts/run_tests.py; exit 0

RUN apt-get -y install coq

RUN apt-get -y install curl

RUN cd ccg2lambda && coqc coqlib.v && cd ..

RUN ccg2lambda/en/install_candc.sh

RUN echo "/path/to/candc-1.00/" > ccg2lambda/en/candc_location.txt

COPY . .


#########################
### NODE.JS: RECEIVER ###
#########################
FROM node:10-buster-slim

# Create directory in container:
WORKDIR /usr/src/website-backend/receive-text

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# (Copy from comp to container)
COPY ./website-backend/receive-text/package*.json /usr/src/website-backend/receive-text/

RUN cd /usr/src/website-backend/receive-text && npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY ./website-backend/receive-text /usr/src/website-backend/receive-text

EXPOSE 5000
