animal=$1

echo &(python3.6 animalEco.py "$animal" 2>&1)
