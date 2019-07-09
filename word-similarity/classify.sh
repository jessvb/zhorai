animal=$1

echo &(python animalEco.py "$animal" 2>&1)
