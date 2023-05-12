import { Complex } from '../complex';
import { FFT, inverseFFT, normalise } from '../fft';

describe('fast fourier transform functions', () => {
    describe('FFT', () => {
        it('transforms an array', () => {
            expect(normalise(FFT([1, 1, 1, 1, 0, 0, 0, 0]))).toStrictEqual([
                4, 2.613125929752753, 0, 1.0823922002923938, 0, 1.0823922002923938, 0,
                2.6131259297527527,
            ]);
        });

        it('normalises array', () => {
            expect(
                FFT([1, 1, 1, 1, 0, 0, 0, 0]).map(c => {
                    const r = [c.real, c.imaginary];
                    console.log(r);
                    return r;
                })
            ).toStrictEqual([
                [4, 0],
                [1, -2.414213562373095],
                [0, 0],
                [1, -0.4142135623730949],
                [0, 0],
                [0.9999999999999999, 0.4142135623730949],
                [0, 0],
                [0.9999999999999997, 2.414213562373095],
            ]);
        });
    });

    describe('inverseFFT', () => {
        it('transforms an array', () => {
            const input = [
                [4, 0],
                [1, -2.41421],
                [0, 0],
                [1, -0.414214],
                [0, 0],
                [1, 0.414214],
                [0, 0],
                [1, 2.41421],
            ].map(c => new Complex(c[0], c[1]));

            const output = normalise(inverseFFT(input));
            expect(output).toStrictEqual([
                1, 0.9999994476176949, 0.9999990000000001, 0.9999994476176949, 0,
                5.523823051190035e-7, 9.999999999732445e-7, 5.523823051190035e-7,
            ]);
        });
    });
});
