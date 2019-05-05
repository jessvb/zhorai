from pitch_utils import get_avg_pitch
import os
from scipy import stats
import numpy as np

infiledir = "data_highpitched_distr/train/woman"
newdir = "higher_pitched"
pitches = []
for dirpath, dirnames, filenames in os.walk(infiledir):
    for filename in [f for f in filenames if f.endswith(".wav")]:
        filepath = os.path.join(dirpath, filename)
        pitches.append(get_avg_pitch(filepath))

# remove values lower than 65Hz (that's about the lowest freq for male voice)
pitches = list(filter(lambda bigval: bigval >= 65, pitches))

tot_avg_pitch = np.mean(pitches)

print("Average pitch for directory, " + infiledir + ", is " + str(tot_avg_pitch))
print(stats.describe(pitches))
