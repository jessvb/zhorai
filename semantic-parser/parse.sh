# script receives two arguments
# 1. the input file (inculuding its relative path)
# 2. the output relative path
type=$1
sentences=$2

#splitting sentences so that each sentence appears in new line
# splitSentences=$(python prepareCorpus.py "$sentences");
# echo "$splitSentences"
# #splitting words up into tokens
# cat $outpath/splitSentences.txt | sed -f ccg2lambda/en/tokenizer.sed > $outpath/sentences.tok
# #label tokens
# ccg2lambda/candc-1.00/bin/candc --models ccg2lambda/candc-1.00/models --candc-printer xml --input $outpath/sentences.tok > $outpath/sentences.candc.xml
# #parse sentence besed on labels
# python ccg2lambda/en/candc2transccg.py $outpath/sentences.candc.xml > $outpath/sentences.xml

#build dictionary output for word embedder
retVal=$(python parserOutput.py "$type" "$sentences");
if [ -z "$retVal" ]
then
    echo "START$type"
    echo 'ERROR: BAD ENGLISH'
    echo "END$type"
else
    echo "START$type"
    echo "$retVal"
    echo 'OK'
    echo "END$type"
fi
