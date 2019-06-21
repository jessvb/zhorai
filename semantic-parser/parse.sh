# script receives two arguments
# 1. the input file (inculuding its relative path)
# 2. the output relative path
infile=$1
outpath=$2

#splitting sentences so that each sentence appears in new line
python prepareCorpus.py $infile > $outpath/splitSentences.txt
#show the sentences being parsed
echo 'Parsing The following Sentences:'
cat $outpath/splitSentences.txt
# #splitting words up into tokens
# cat $outpath/splitSentences.txt | sed -f ccg2lambda/en/tokenizer.sed > $outpath/sentences.tok
# #label tokens
# ccg2lambda/candc-1.00/bin/candc --models ccg2lambda/candc-1.00/models --candc-printer xml --input $outpath/sentences.tok > $outpath/sentences.candc.xml
# #parse sentence besed on labels
# python ccg2lambda/en/candc2transccg.py $outpath/sentences.candc.xml > $outpath/sentences.xml
#build dictionary output for word embedder
if python parserOutput.py $outpath 2>&1 >/dev/null;
then
  if [ -s $outpath/dictionary.txt ]
  then
       echo 'OK'
  else
       echo 'ERROR: BAD ENGLISH'
  fi
else
    echo 'ERROR: BAD ENGLISH'
fi
