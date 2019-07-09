ecosystems=$1
animal=$2

echo &(python animalEco.py $ecosystems "$animal" 2>&1)
