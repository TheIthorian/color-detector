/*
complex fast fourier transform and inverse from
http://rosettacode.org/wiki/Fast_Fourier_transform#C.2B.2B
*/

import { Complex } from './complex.js';

export function inverseFFT(amplitudes) {
    const N = amplitudes.length;
    const inverseN = 1 / N;

    // conjugate if imaginary part is not 0
    for (let i = 0; i < N; ++i)
        if (amplitudes[i] instanceof Complex) amplitudes[i].imaginary = -amplitudes[i].imaginary;

    // apply fourier transform
    amplitudes = FFT(amplitudes);

    for (let i = 0; i < N; ++i) {
        // conjugate again
        amplitudes[i].imaginary = -amplitudes[i].imaginary;
        // scale
        amplitudes[i].real *= inverseN;
        amplitudes[i].imaginary *= inverseN;
    }

    return amplitudes;
}

export function FFT(amplitudes) {
    const N = amplitudes.length;
    if (N <= 1) return amplitudes;

    const halfN = N / 2;
    let even = [];
    let odd = [];

    for (let i = 0; i < halfN; ++i) {
        even[i] = amplitudes[i * 2];
        odd[i] = amplitudes[i * 2 + 1];
    }

    even = FFT(even);
    odd = FFT(odd);

    const a = -2 * Math.PI;
    for (let k = 0; k < halfN; ++k) {
        if (!(even[k] instanceof Complex)) even[k] = new Complex(even[k], 0);
        if (!(odd[k] instanceof Complex)) odd[k] = new Complex(odd[k], 0);

        const p = k / N;
        const t = new Complex(0, a * p);
        t.exp(t).multiply(odd[k], t);

        amplitudes[k] = even[k].add(t, odd[k]);
        amplitudes[k + halfN] = even[k].subtract(t, even[k]);
    }

    return amplitudes;
}

export function normalise(amplitudes) {
    const transformedAmplitudes = [];
    for (let i = 0; i < amplitudes.length; i++) {
        transformedAmplitudes[i] = amplitudes[i].abs();
    }

    return transformedAmplitudes;
}
