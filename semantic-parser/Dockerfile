FROM python:3.7-slim-buster

WORKDIR /usr/src/app

# COPY requirements.txt ./
RUN mkdir ./ccg2lambda
COPY ccg2lambda ./ccg2lambda

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
RUN cat ccg2lambda/en/candc_location.txt
# todo del^

COPY . .

EXPOSE 5000
