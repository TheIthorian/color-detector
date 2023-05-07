import { VideoFilter } from '../src/video.js';
import { FrameRateCounter, PixelIterator } from '../src/filters.js';

// FR: 30-35
export function invertFilterWithIterator(logger) {
    const videoFilter = new VideoFilter();
    const iterator = new PixelIterator();

    const frameCounter = new FrameRateCounter(logger);

    videoFilter.setFilterFunction(imageData => {
        iterator.setPixelArray(imageData.data);
        while (iterator.hasNext()) {
            iterator.r = 255 - iterator.r;
            iterator.g = 255 - iterator.g;
            iterator.b = 255 - iterator.b;
            iterator.next();
        }
        frameCounter.log();
    });

    return videoFilter;
}

// FR: 20-25
export function invertFilter(logger) {
    const videoFilter = new VideoFilter();
    const frameCounter = new FrameRateCounter(logger);
    videoFilter.setFilterFunction(imageData => {
        const pixels = imageData.data;
        for (let i = 0; i < pixels.length; i++) {
            const pixelVal = pixels[i];
            pixels[i] = (i + 1) % 4 === 0 ? pixelVal : 255 - pixelVal;
        }
        frameCounter.log();
    });

    return videoFilter;
}

// FR: 9
export function invertFilterWithForEach(logger) {
    const videoFilter = new VideoFilter();
    const frameCounter = new FrameRateCounter(logger);

    videoFilter.setFilterFunction(imageData => {
        imageData.data.forEach(pixel => {
            if (pixel % 4 === 0) {
                pixel = 255 - pixel;
            }
        });
        frameCounter.log();
    });

    return videoFilter;
}

// FR: 6
export function invertFilterWithForEachAndGC(logger) {
    const videoFilter = new VideoFilter();
    const frameCounter = new FrameRateCounter(logger);

    videoFilter.setFilterFunction(imageData => {
        const newData = new Uint8Array(
            imageData.data.map(pixel => (pixel % 4 === 0 ? pixel : 255 - pixel))
        );
        frameCounter.log();

        return newData;
    });

    return videoFilter;
}
