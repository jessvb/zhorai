from pitch_utils import increase_pitch_to_distr
import os
import os.path
from pathlib import Path

infiledir = "data_wav/train/man"
newdir = "higher_pitched_distr"
for dirpath, dirnames, filenames in os.walk(infiledir):
    for filename in [f for f in filenames if f.endswith(".wav")]:
        origfilepath = os.path.join(dirpath, filename)
        newpath = os.path.join(newdir, dirpath)
        newfilepath = os.path.join(newpath, filename)

        # make the file path before saving the file
        try:
            os.makedirs(newpath)
        except FileExistsError:
            pass

        # increase the pitch of the current file to child pitch: 200-350Hz
        if (not Path(newfilepath).is_file()):
            increase_pitch_to_distr(247.6684620003424,1189.3323789471688,origfilepath,newfilepath)
            print("Saved higher pitch file to " + str(newfilepath))
        else:
            print(str(newfilepath) + " is already a file. Skipping.")
