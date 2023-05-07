import { VideoFilter } from './video.js';

export function invertFilter() {
    const videoFilter = new VideoFilter();
    videoFilter.setFilterFunction(imageData => {
        const pixels = imageData.data;
        for (let i = 0; i < pixels.length; i++) {
            const pixelVal = pixels[i];
            pixels[i] = (i + 1) % 4 === 0 ? pixelVal : 255 - pixelVal;
        }
    });

    return videoFilter;
}

export function mirrorY() {
    const videoFilter = new VideoFilter();

    videoFilter.setFilterFunction(imageData => {
        const pixels = imageData.data;
        const newPixels = new Uint8Array(pixels.length);

        for (let i = 0; i < pixels.length; i++) {
            newPixels[pixels.length - 1 - i] = pixels[i];
        }

        for (let i = 0; i < pixels.length; i++) {
            pixels[i] = newPixels[i];
        }
    });

    return videoFilter;
}
