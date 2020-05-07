###############################
### PYTHON: SEMANTIC-PARSER ###
###############################
FROM ubuntu:16.04

# Create directory in container:
WORKDIR /usr/src/semantic-parser
RUN mkdir ./ccg2lambda
COPY ./semantic-parser/ccg2lambda /usr/src/semantic-parser/ccg2lambda
COPY ./word-similarity /usr/src/word-similarity

# install python3
RUN apt-get update \
  && apt-get install -y python3-pip python3-dev \
  && apt-get install -y libmysqlclient-dev python3-virtualenv \
  # install unzip for stanford nlp
  && apt-get install -y unzip \
  # get apt-utils for the warning on openjdk-8-jdk and others
  && apt-get install -y --no-install-recommends apt-utils \
  && apt-get install dialog apt-utils -y
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections
RUN apt-get install -y -q
# make sure python always refers to python3 (v important for parsing libs)
RUN rm -f /usr/bin/python \
  && ln -s /usr/bin/python3 /usr/bin/python \
  && echo 'testing python version: ' \
  && python -V
# install pip
RUN pip3 install --upgrade pip
# install curl (for ccg2lambda/en/install_candc.sh)
RUN apt-get install -y curl
# install nltk
RUN pip3 install -I nltk==3.0.5
RUN python3 -m nltk.downloader punkt
RUN python3 -m nltk.downloader wordnet
# install other libraries
RUN pip3 install lxml simplejson pyyaml
RUN apt-get install -y libxml2-dev libxslt-dev

# install java
RUN apt-get install -y --no-install-recommends software-properties-common
RUN add-apt-repository -y ppa:openjdk-r/ppa
RUN apt-get update
RUN apt-get install -y openjdk-8-jdk
RUN apt-get install -y openjdk-8-jre
RUN update-alternatives --config java
RUN update-alternatives --config javac

## test ccg2lambda
## NOTE: there should be a few expected failures (e.g., 3), but not many
RUN cd ccg2lambda && python3 scripts/run_tests.py

## install coq proof assistant
RUN apt-get -y install coq

## compile the coq library
RUN cd ccg2lambda && coqc coqlib.v && cd ..

## install c&c parser -- this may fail...
RUN ccg2lambda/en/install_candc.sh
## export candc_location.txt in case it failed
RUN echo "/path/to/candc-1.00/" > ccg2lambda/en/candc_location.txt

########################
### NODE.JS RECIEVER ###
########################
WORKDIR /usr/src/website-backend/receive-text

# install node and npm
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash
RUN apt-get -y install nodejs

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

# Prep bash script for docker-compose command:
COPY receiver_parser_setup.sh /usr/src/receiver_parser_setup.sh
RUN cd /usr/src && chmod +x receiver_parser_setup.sh

COPY . .

EXPOSE 5000
