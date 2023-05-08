import { PixelIterator, calculateSobelFactor, sobelFilter } from '../filters.js';

describe('test desc', () => {
    it('works', () => {
        const pixels = [10, 10, 10, 10, 20, 20, 20, 20, 30, 30, 30, 30, 40, 40, 40, 40];
        const pixelIterator = new PixelIterator(pixels);
        const height = 4;
        const width = 4;
        const sobelFactor = calculateSobelFactor(0, height, width, pixelIterator);

        expect(sobelFactor).toBe(
            10 * 1 + 10 * 0 + 20 * -1 + 2 * 10 + 10 * 0 + 20 + -2 + 30 * 1 + 30 * 0 + -1 * 40
        );
    });
});
