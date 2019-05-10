data_to_move="data/train/woman"
new_dir="data/train/fiftypercentwoman"

# create list of a percentage of the files in the data_to_move dir:
find $data_to_move -type f | shuf -n $(echo $(( $(find $data_to_move -type f | wc -l ) * 50 / 100))) > files_to_move.txt

# loop through files and move them :)
while read pathname; do
    # NOTE: this assumes the fourth directory name in the data_to_move directory is a folder like 'ae' or
    # 'gz' etc. and copies that part of the directory structure into the new directory structure so that
    # files don't get overwritten (because files are often named the exact same, but in different 'ae' /
    # 'gz' / etc. folders in tidigits)
    echo "moving $pathname to $new_dir/$(echo $pathname | awk -F/ '{print $4}')/$(basename $pathname)"
    mkdir -p "$new_dir/$(echo $pathname | awk -F/ '{print $4}')"
    mv "$pathname" "$new_dir/$(echo $pathname | awk -F/ '{print $4}')/$(basename $pathname)"
done < files_to_move.txt

# To test correctness, use the following command:
echo "Subsetted percentage:"
echo "$(find $new_dir -type f | wc -l) / ($(find $data_to_move -type f | wc -l)+$(find $new_dir -type f | wc -l)) * 100" | bc -l
echo "Done."
