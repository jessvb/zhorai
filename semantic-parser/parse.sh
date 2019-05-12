# script receives two arguments
# 1. the input file (inculuding its relative path)
# 2. the output relative path
infile=$1
outpath=$2

#splitting sentences so that each sentence appears in new line
python prepareCorpus.py $infile > $outpath/splitSentences.txt
#splitting words up into tokens
cat $outpath/splitSentences.txt | sed -f ccg2lambda/en/tokenizer.sed > $outpath/sentences.tok
#label tokens
ccg2lambda/candc-1.00/bin/candc --models ccg2lambda/candc-1.00/models --candc-printer xml --input $outpath/sentences.tok > $outpath/sentences.candc.xml
#parse sentence besed on labels
python ccg2lambda/en/candc2transccg.py $outpath/sentences.candc.xml > $outpath/sentences.xml
#don't need the lambda expressions for now
#python ccg2lambda/scripts/semparse.py $outpath/sentences.xml ccg2lambda/en/semantic_templates_en_emnlp2015.yaml $outpath/sentences.sem.xml
#python ccg2lambda/scripts/prove.py $outpath/sentences.sem.xml --graph_out $outpath/graphdebug.html
#create visualization that can be shown in website
#python ccg2lambda/scripts/visualize.py $outpath/sentences.xml > $outpath/sentences.html
#build dictionary output for word embedder
if python parserOutput.py $outpath 2>&1 >/dev/null;
then
    echo 'OK'
else
    echo 'ERROR'
fi
