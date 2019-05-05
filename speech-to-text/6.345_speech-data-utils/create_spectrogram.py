import parselmouth

import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

boyfile = "data_highpitched/train/boy/am/8z1a.wav"
girlfile = "data_highpitched/train/girl/is/8z1a.wav"
manfile = "data_wav/train/man/ff/8z1a.wav"
womanfile = "data_wav/train/woman/cg/8z1a.wav"
highmanfile = "data_highpitched/train/man/ff/8z1a.wav"
highwomanfile = "data_highpitched/train/woman/cg/8z1a.wav"

sns.set() # Use seaborn's default style to make attractive graphs

# Plot nice figures using Python's "standard" matplotlib library
sndboy = parselmouth.Sound(boyfile)
sndgirl = parselmouth.Sound(girlfile)
sndman = parselmouth.Sound(manfile)
sndwoman = parselmouth.Sound(womanfile)
sndhighman = parselmouth.Sound(highmanfile)
sndhighwoman = parselmouth.Sound(highwomanfile)


#plt.figure()
#plt.plot(snd.xs(), snd.values.T)
#plt.xlim([snd.xmin, snd.xmax])
#plt.xlabel("time [s]")
#plt.ylabel("amplitude")
#plt.show() # or plt.savefig("sound.png"), or plt.savefig("sound.pdf")

def draw_spectrogram(spectrogram, dynamic_range=70):
    X, Y = spectrogram.x_grid(), spectrogram.y_grid()
    sg_db = 10 * np.log10(spectrogram.values)
    plt.pcolormesh(X, Y, sg_db, vmin=sg_db.max() - dynamic_range, cmap='afmhot')
    plt.ylim([spectrogram.ymin, spectrogram.ymax])
    plt.xlabel("time [s]")
    plt.ylabel("frequency [Hz]")

def draw_intensity(intensity):
    plt.plot(intensity.xs(), intensity.values.T, linewidth=3, color='w')
    plt.plot(intensity.xs(), intensity.values.T, linewidth=1)
    plt.grid(False)
    plt.ylim(0)
    plt.ylabel("intensity [dB]")

#intensity = snd.to_intensity()
#spectrogram = snd.to_spectrogram()
#plt.figure()
#draw_spectrogram(spectrogram)
#plt.twinx()
#draw_intensity(intensity)
#plt.xlim([snd.xmin, snd.xmax])
#plt.show() # or plt.savefig("spectrogram.pdf")

def draw_pitch(pitch):
    # Extract selected pitch contour, and
    # replace unvoiced samples by NaN to not plot
    pitch_values = pitch.selected_array['frequency']
    pitch_values[pitch_values==0] = np.nan
    plt.plot(pitch.xs(), pitch_values, 'o', markersize=5, color='w')
    plt.plot(pitch.xs(), pitch_values, 'o', markersize=2)
    plt.grid(False)
    plt.ylim(0, pitch.ceiling)
    plt.ylabel("fundamental frequency [Hz]")

def create_spec_with_pitch(infile):
    snd = parselmouth.Sound(infile)
    pitch = snd.to_pitch()
    # If desired, pre-emphasize the sound fragment before calculating the spectrogram
    pre_emphasized_snd = snd.copy()
    pre_emphasized_snd.pre_emphasize()
    spectrogram = pre_emphasized_snd.to_spectrogram(window_length=0.03, maximum_frequency=8000)
    plt.figure()
    draw_spectrogram(spectrogram)
    plt.twinx()
    draw_pitch(pitch)
    plt.xlim([snd.xmin, snd.xmax])
    plt.show() # or plt.savefig("spectrogram_0.03.pdf")

create_spec_with_pitch(boyfile)
create_spec_with_pitch(girlfile)
create_spec_with_pitch(manfile)
create_spec_with_pitch(womanfile)
create_spec_with_pitch(highmanfile)
create_spec_with_pitch(highwomanfile)
