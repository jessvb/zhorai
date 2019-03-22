infile=$1
outpath=$2

cat $infile | sed -f ccg2lambda/en/tokenizer.sed > $outpath/sentences.tok
ccg2lambda/candc-1.00/bin/candc --models ccg2lambda/candc-1.00/models --candc-printer xml --input $outpath/sentences.tok > $outpath/sentences.candc.xml

echo 0
python ccg2lambda/en/candc2transccg.py $outpath/sentences.candc.xml > $outpath/sentences.xml
echo 1
python ccg2lambda/scripts/semparse.py $outpath/sentences.xml ccg2lambda/en/semantic_templates_en_emnlp2015.yaml $outpath/sentences.sem.xml
echo 2
python ccg2lambda/scripts/prove.py $outpath/sentences.sem.xml --graph_out $outpath/graphdebug.html
echo 3
python ccg2lambda/scripts/visualize.py $outpath/sentences.xml > $outpath/sentences.html
