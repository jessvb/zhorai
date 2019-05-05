# see https://stackoverflow.com/questions/6712437/find-duplicate-lines-in-a-file-and-count-how-many-time-each-line-was-duplicated
# make a list of all the filepaths in the subdirs
find . -type f | grep -v "DS_Store" > allFilePaths.txt
# make another list of just the file names in the subdirs
echo '' > allFileNames.txt
while read -r line; do
    basename "$line" >> allFileNames.txt
done < allFilePaths.txt

sort allFileNames.txt | uniq -c | grep -v '^ *1 '
