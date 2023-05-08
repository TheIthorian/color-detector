import { PixelIterator, calculateSobelFactor, sobelFilter } from '../filters.js';

describe('sobelFilter', () => {
    describe('pixel iterations', () => {
        /**
         * [10 20]
         * [30 40]
         */
        const pixels = [10, 10, 10, 10, 20, 20, 20, 20, 30, 30, 30, 30, 40, 40, 40, 40];
        const height = 2;
        const width = 2;
        const VERTICAL_SOBEL_MATRIX = [1, 0, -1, 2, 0, -2, 1, 0, -1];

        it('correctly iterates over the adjacent elements for the first element', () => {
            const pixelIterator = new PixelIterator(pixels);
            const sobelFactor = calculateSobelFactor(
                0,
                height,
                width,
                pixelIterator,
                VERTICAL_SOBEL_MATRIX
            );

            const expectedSum = [
                [10 * 1 + 10 * 0 + 20 * -1],
                [10 * 2 + 10 * 0 + 20 * -2],
                [30 * 1 + 30 * 0 + 40 * -1],
            ]
                .map(arr => arr[0])
                .reduce((prev, curr) => prev + curr, 0);

            expect(sobelFactor).toBe(expectedSum);
        });

        it('correctly iterates over the adjacent elements for the last element', () => {
            const pixelIterator = new PixelIterator(pixels);
            const sobelFactor = calculateSobelFactor(
                3,
                height,
                width,
                pixelIterator,
                VERTICAL_SOBEL_MATRIX
            );

            const expectedSum = [
                [10 * 1 + 20 * 0 + 20 * -1],
                [30 * 2 + 40 * 0 + 40 * -2],
                [30 * 1 + 40 * 0 + 40 * -1],
            ]
                .map(arr => arr[0])
                .reduce((prev, curr) => prev + curr, 0);

            expect(sobelFactor).toBe(expectedSum);
        });
    });
});
