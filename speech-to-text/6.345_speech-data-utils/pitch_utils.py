import parselmouth
from IPython.display import Audio
from parselmouth.praat import call
import numpy as np
import random

def increase_pitch(factor, infile, outfile):
    sound = parselmouth.Sound(infile)
    Audio(data=sound.values, rate=sound.sampling_frequency)
    manipulation = call(sound, "To Manipulation", 0.001, 75, 600)
    pitch_tier = call(manipulation, "Extract pitch tier")
    call(pitch_tier, "Multiply frequencies", sound.xmin, sound.xmax, factor)
    call([pitch_tier, manipulation], "Replace pitch tier")
    sound_octave_up = call(manipulation, "Get resynthesis (overlap-add)")
    sound_octave_up.save(outfile, "WAV")

def get_avg_pitch(infile):
    sound = parselmouth.Sound(infile)
    Audio(data=sound.values, rate=sound.sampling_frequency)
    manipulation = call(sound, "To Manipulation", 0.001, 75, 600)
    pitch_tier = call(manipulation, "Extract pitch tier")
    pitch = sound.to_pitch()
    pitch_values = pitch.selected_array['frequency']
    # remove values lower than 65Hz (that's about the lowest freq for male voice)
    pitch_values = list(filter(lambda bigval: bigval >= 65, pitch_values))
    return np.mean(pitch_values)

def increase_pitch_to_range(minval,maxval,infile,outfile):
    des_pitch = random.random()*(maxval-minval)+minval
    #print("desired: "+str(des_pitch))
    orig_pitch = get_avg_pitch(infile)
    #print("orig: "+str(orig_pitch))
    factor = des_pitch/orig_pitch
    #print("factor"+str(factor))

    # test whether the factor was calculated or not, and then increase the pitch
    try:
        factor
        if (factor > 0):
            increase_pitch(factor, infile, outfile)
        else:
            print("ERROR: The file, " + str(infile) + ", produced an undefined factor. " + \
                    "This may be due to a pitch value of zero, and therefore a divide by zero error." + \
                    " The increased pitch file was not created.")
    except NameError:
        print("ERROR: The file, " + str(infile) + ", produced an undefined factor. " + \
                "This may be due to a pitch value of zero, and therefore a divide by zero error." + \
                " The increased pitch file was not created.")
    #print("new pitch: "+str(get_avg_pitch(outfile)))

def increase_pitch_to_distr(mean,variance,infile,outfile):
    des_pitch = np.random.normal(mean, np.sqrt(variance))
    #print("desired: "+str(des_pitch))
    orig_pitch = get_avg_pitch(infile)
    #print("orig: "+str(orig_pitch))
    factor = des_pitch/orig_pitch
    #print("factor"+str(factor))

    # test whether the factor was calculated or not, and then increase the pitch
    try:
        factor
        if (factor > 0):
            increase_pitch(factor, infile, outfile)
        else:
            print("ERROR: The file, " + str(infile) + ", produced an undefined factor. " + \
                    "This may be due to a pitch value of zero, and therefore a divide by zero error." + \
                    " The increased pitch file was not created.")
    except NameError:
        print("ERROR: The file, " + str(infile) + ", produced an undefined factor. " + \
                "This may be due to a pitch value of zero, and therefore a divide by zero error." + \
                " The increased pitch file was not created.")
    #print("new pitch: "+str(get_avg_pitch(outfile)))

