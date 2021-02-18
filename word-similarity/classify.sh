topicKey=$1
subjectDict=$2

echo &(python3.6 subjectCategory.py "$topicKey" "$subjectDict" 2>&1)
