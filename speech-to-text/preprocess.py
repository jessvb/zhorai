import librosa
import scipy
import numpy as np

def compute_magnitude_spectrum(frame, window='hamming', fft_size=512):
    # first windowing
    window = scipy.signal.get_window(window, len(frame))
    frame = frame * window

    # pad to fft_size
    n_pad = max(0, fft_size - len(frame))
    frame = np.pad(frame, (0, n_pad), mode='constant', constant_values=0)
    frame = frame[:fft_size]

    # compute discrete FFT
    spectrum = librosa.stft(frame,
                            n_fft=fft_size,
                            hop_length=fft_size,
                            win_length=fft_size,
                            window='boxcar',
                            center=False)
    return np.abs(spectrum)[:, 0]

##### filename = where wave is stored,
##### frame_time = length of frame in seconds,
##### shift_time = length of time for one shift to where the next frame starts
def compute_mfcc(filename,frame_time=25/1000,shift_time=10/1000,fft_size=512):
    s_pe, s_of, sr = preprocess_wav(filename)

    frame_len = int(round(frame_time*sr)) # number of samples in a frame
    shift_len = int(round(shift_time*sr)) # number of samples for the shift

    ## t7: mel scale mel-frequency filter banks
    Fs = sr
    mel_path = './mel_filters.mat'
    mel_filters = scipy.io.loadmat(mel_path)['mel_filters']
    freqs = np.linspace(0, Fs / 2, int(fft_size / 2 + 1))

    ## Get mfccs for each frame of the wave (shift frame by shift_len)
    num_samples = len(s_pe)
    frame_start = 0
    done = False
    while not done:
        # check if we will cover every frame by the end of this iter
        if frame_start + frame_len >= num_samples:
            done = True
        # if we're at the end and we need to zero pad, add zeros:
        if (frame_start + shift_len + frame_len > num_samples):
            # add extra zeros
            num_zeros = frame_start + shift_len + frame_len - num_samples
            s_pe = np.concatenate((s_pe, np.zeros(num_zeros)), axis=None)

        # compute the magnitude spectrum for this frame
        frame_range = range(frame_start, frame_start + frame_len)
        mag_spec = compute_magnitude_spectrum(s_pe[frame_range])
        # concat mag_specs column-wise --> each frame corresponds to a col
        try:
            mag_specs = np.concatenate((mag_specs,mag_spec.reshape([mag_spec.shape[0],1])),axis=1)
        except NameError:
            mag_specs = mag_spec.reshape([mag_spec.shape[0],1])

        # compute the energy per band of the mel filters
        energy_per_band = np.zeros(mel_filters.shape[1])
        energy_per_band = mag_spec.dot(mel_filters)
        # concat energies column-wise --> each frame corresponds to a col
        try:
            energies = np.concatenate((energies,energy_per_band.reshape([energy_per_band.shape[0],1])),axis=1)
        except NameError:
            energies = energy_per_band.reshape([energy_per_band.shape[0],1])


        ## t8 MFSCs = log of filter bank energies
        mfscs_single = np.maximum(-50,np.log(energy_per_band))
        # concat mfscs column-wise --> each frame corresponds to a col
        try:
            mfscs = np.concatenate((mfscs,mfscs_single.reshape([mfscs_single.shape[0],1])),axis=1)
        except NameError:
            mfscs = mfscs_single.reshape([mfscs_single.shape[0],1])

        # update starting frame
        frame_start += shift_len

    # zero pad s_of too:
    s_of = np.concatenate((s_of, np.zeros(num_zeros)), axis=None)

    # get the logE energies, which are another feature of the waveform
    logEs = np.zeros(mfscs.shape[1]) # logE for each frame
    frame_start = 0
    #while frame_start + shift_len < len(s_pe):
    for logE_ind in range(0, mfscs.shape[1]):
        summed = 0
        for i in range(frame_start,frame_start+frame_len):
            summed += np.power(s_of[i],2)
        logsum = np.log(summed)
        logE = np.max([-50,logsum])
        logEs[logE_ind] = logE

        frame_start += shift_len

    # from the mfscs, get the mfccs using dct
    mfccs = np.zeros(mfscs.shape)
    for k in range(0,mfscs.shape[1]): # go thru each mfccs by frame
        for i in range(0,mfscs.shape[0]): # go thru each element of mfccs
            for j in range(0,mfscs.shape[0]): # for each mfcc, look at all mfscs
                mfccs[i,k] += mfscs[j,k]*np.cos(np.pi*i/mfscs.shape[0]*(j+0.5))

    # return the log energies and the first thirteen mfccs for all frames
    return np.concatenate((logEs.reshape([1,mfccs.shape[1]]),mfccs[0:13,:]),axis=0).T

def remove_offset(y):
    return y - np.mean(y)

def pre_emph(s_of):
    s_pe = s_of.copy()
    s_pe[0] = s_of[0] - 0.97*0 # s_of[-1] = 0
    for n in range(1, len(s_of)):
        s_pe[n] = s_of[n] - 0.97*s_of[n-1]
    return s_pe

### Takes in a .wav file and returns:
### 1. a preemphasized signal with dc offset removed (s_pe)
### 2. the un-preemphasized signal with dc offset removed (s_of)
### 3. the sampling rate
def preprocess_wav(filepath):
    y, sr = librosa.load(filepath,sr=None)
    s_of = remove_offset(y)
    return pre_emph(s_of), s_of, sr
