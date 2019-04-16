import librosa
import numpy as np
import scipy
import matplotlib.pyplot as plt

from preprocess import compute_magnitude_spectrum
from preprocess import remove_offset
from preprocess import pre_emph


file1 = "home-1.wav"
y1, sr1 = librosa.load(file1,sr=None)

s_of1 = remove_offset(y1)
s_pe1 = pre_emph(s_of1)

hamming_window_len = 256
sample_start = int(round(0.57*sr1)) # samples at .57sec
frame_range = range(sample_start, hamming_window_len + sample_start)

spec_256 = compute_magnitude_spectrum(s_of1[frame_range], window='hamming',fft_size=hamming_window_len)
freq_rang_256 = np.linspace(0,8000,len(spec_256))

fund_freq = 2000/17
fund_period = int(round(1/fund_freq*sr1))

hamming_window_len = fund_period*2
sample_start = int(round(0.57*sr1)) # samples at .57sec
frame_range = range(sample_start, hamming_window_len + sample_start)
spec_fp2 = compute_magnitude_spectrum(s_of1[frame_range], window='hamming',fft_size=hamming_window_len)
freq_rang_fp2 = np.linspace(0,8000, len(spec_fp2))

hamming_window_len = int(round(fund_period*2.5))
sample_start = int(round(0.57*sr1)) # samples at .57sec
frame_range = range(sample_start, hamming_window_len + sample_start)
spec_fp25 = compute_magnitude_spectrum(s_of1[frame_range], window='hamming',fft_size=hamming_window_len)
freq_rang_fp25 = np.linspace(0,8000, num=len(spec_fp25))

hamming_window_len = fund_period*3
sample_start = int(round(0.57*sr1)) # samples at .57sec
frame_range = range(sample_start, hamming_window_len + sample_start)
spec_fp3 = compute_magnitude_spectrum(s_of1[frame_range], window='hamming',fft_size=hamming_window_len)
freq_rang_fp3 = np.linspace(0,8000, num=len(spec_fp3))

plt.subplot(411)
plt.plot(freq_rang_256, 20*np.log(spec_256))
plt.title('256 point Hamming window')
plt.ylabel('Magnitude (dB)')
plt.xlabel('Frequency (Hz)')

plt.subplot(412)
plt.plot(freq_rang_fp2,20*np.log(spec_fp2))
plt.title(str(fund_period*2) + ' point Hamming window (2*F_0-period)')
plt.ylabel('Magnitude (dB)')
plt.xlabel('Frequency (Hz)')

plt.subplot(413)
plt.plot(freq_rang_fp25,20*np.log(spec_fp25))
plt.title(str(int(round(fund_period*2.5))) + ' point Hamming window (2.5*F_0-period)')
plt.ylabel('Magnitude (dB)')
plt.xlabel('Frequency (Hz)')

plt.subplot(414)
plt.plot(freq_rang_fp3,20*np.log(spec_fp3))
plt.title(str(fund_period*3) + ' point Hamming window (3*F_0-period)')
plt.ylabel('Magnitude (dB)')
plt.xlabel('Frequency (Hz)')

plt.savefig("test_spec.png")

