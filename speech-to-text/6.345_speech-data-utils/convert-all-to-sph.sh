DIR="data_highpitched_distr"
mkdir -p "new_sph_files/$DIR"
for f in $(find $DIR -name "*.wav"); do
    echo "Processing $f file..."
    # make sure the directory structure is there for this file
    mkdir -p new_sph_files/${f%/*}
    #./sph2pipe -f sph "$f" "new_sph_files/$f"
    #echo $(basename $f)
    #echo ${f%/*}
    sox -t wav $f -t sph "new_sph_files/$f"
done
