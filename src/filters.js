import { VideoFilter } from './video.js';

export function invertFilter(logger) {
    const videoFilter = new VideoFilter();
    const iterator = new PixelIterator();
    // const frameCounter = new FrameRateCounter(logger);

    videoFilter.setFilterFunction(imageData => {
        iterator.setPixelArray(imageData.data);
        while (iterator.hasNext()) {
            iterator.r = 255 - iterator.r;
            iterator.g = 255 - iterator.g;
            iterator.b = 255 - iterator.b;
            iterator.next();
        }
        // frameCounter.log();
    });

    return videoFilter;
}

export function mirrorFilter() {
    const videoFilter = new VideoFilter();
    const iterator = new PixelIterator();

    let newPixelList;
    const newPixelListIterator = new PixelIterator();

    function transform(index, width) {
        const rowIndex = Math.floor(index / width);
        const colIndex = index % width;
        const transformedIndex = (rowIndex + 1) * width - colIndex - 1;
        return transformedIndex;
    }

    videoFilter.setFilterFunction(imageData => {
        iterator.setPixelArray(imageData.data);

        if (!newPixelList) {
            newPixelList = new Uint8ClampedArray(imageData.data.length);
            newPixelListIterator.setPixelArray(newPixelList);
        }

        // Iterate over the original array and set the new array elements
        while (iterator.hasNext()) {
            newPixelListIterator.pixelIndex = transform(iterator.pixelIndex, imageData.width);
            newPixelListIterator.setRGBA(iterator.r, iterator.g, iterator.b, iterator.a);
            iterator.next();
        }

        iterator.setFromPixelArray(newPixelList);
    });

    return videoFilter;
}

export function greenScreen(
    thresholds = {
        green: 180,
        blue: 200,
        red: 200,
    }
) {
    const videoFilter = new VideoFilter();
    const iterator = new PixelIterator();

    videoFilter.setFilterFunction(imageData => {
        iterator.setPixelArray(imageData.data);

        while (iterator.hasNext()) {
            if (
                iterator.g > thresholds.green &&
                iterator.b < thresholds.blue &&
                iterator.r < thresholds.red
            ) {
                iterator.setRGBA(255, 0, 0, 255);
            }
            iterator.next();
        }
    });

    return videoFilter;
}

export function sobelFilter() {
    const videoFilter = new VideoFilter();
    const iterator = new PixelIterator();
    const sobelIterator = new PixelIterator();

    videoFilter.setFilterFunction(imageData => {
        iterator.setPixelArray(imageData.data);
        sobelIterator.setPixelArray(imageData.data);

        while (iterator.hasNext()) {
            const sobelFactor = calculateSobelFactor(
                iterator.pixelIndex,
                imageData.height,
                imageData.width,
                sobelIterator
            );
            iterator.setRGBA(
                iterator.r * sobelFactor,
                iterator.g * sobelFactor,
                iterator.b * sobelFactor,
                iterator.a
            );
            iterator.next();
        }
    });

    return videoFilter;
}

export function calculateSobelFactor(index, height, width, pixelIterator) {
    const ADJACENT_DIRECTIONS = [
        [-1, 1],
        [0, 1],
        [1, 1],
        [-1, 0],
        [0, 0],
        [1, 0],
        [-1, -1],
        [0, -1],
        [1, -1],
    ];

    const SOBEL_MATRIX = [1, 0, -1, 2, 0, -2, 1, 0, -1];

    function rowColToIndex(row, col, width) {
        return row * width + col;
    }

    const rowIndex = Math.floor(index / width);
    const colIndex = index % width;

    let sobelSum = 0;
    for (let i = 0; i < ADJACENT_DIRECTIONS.length; i++) {
        const direction = ADJACENT_DIRECTIONS[i];
        const sobelFactor = SOBEL_MATRIX[i];
        let newColIndex = colIndex + direction[0];
        let newRowIndex = rowIndex + direction[1];

        newColIndex = newColIndex < 0 ? colIndex : newColIndex > width ? colIndex : newColIndex;
        newRowIndex = newRowIndex < 0 ? rowIndex : newRowIndex > height ? rowIndex : newRowIndex;

        pixelIterator.pixelIndex = rowColToIndex(newRowIndex, newColIndex, width);
        sobelSum = (sobelFactor * (pixelIterator.r + pixelIterator.g + pixelIterator.b)) / 3;
    }

    return sobelSum;
}

export function grayScale() {
    const videoFilter = new VideoFilter();
    const iterator = new PixelIterator();

    videoFilter.setFilterFunction(imageData => {
        iterator.setPixelArray(imageData.data);

        while (iterator.hasNext()) {
            const grayScaleFactor = 0.3 * iterator.r + 0.59 * iterator.g + 0.11 * iterator.b;
            // const gray = 0.2126 * iterator.r + 0.7152 * iterator.g + 0.0722 * iterator.b;
            iterator.setRGBA(grayScaleFactor, grayScaleFactor, grayScaleFactor, iterator.a);
            iterator.next();
        }
    });

    return videoFilter;
}

export class FrameRateCounter {
    last = 0;
    curr = 0;
    poll = 1;
    lastPrintTime = 0;
    logger;

    static TIME_BETWEEN_PRINTS = 1000;

    constructor(logger) {
        this.logger = logger;
    }

    log() {
        this.curr = performance.now();
        const timeSinceLastPrint = this.curr - this.lastPrintTime;
        if (timeSinceLastPrint > FrameRateCounter.TIME_BETWEEN_PRINTS) {
            this.logger.log(
                'Actual framerate: ' + (1000 / (this.curr - this.last)).toFixed(1),
                true
            );
            this.lastPrintTime = this.curr;
        }
        this.last = performance.now();
    }
}

export class PixelIterator {
    pos = 0;
    pixelArray;

    constructor(pixelArray) {
        this.pixelArray = pixelArray;
    }

    setPixelArray(pixelArray) {
        this.pixelArray = pixelArray;
        this.pos = 0;
    }

    get r() {
        return this.pixelArray[this.pos];
    }

    set r(val) {
        this.pixelArray[this.pos] = val;
    }

    get g() {
        return this.pixelArray[this.pos + 1];
    }

    set g(val) {
        this.pixelArray[this.pos + 1] = val;
    }

    get b() {
        return this.pixelArray[this.pos + 2];
    }

    set b(val) {
        this.pixelArray[this.pos + 2] = val;
    }

    get a() {
        return this.pixelArray[this.pos + 3];
    }

    set a(val) {
        this.pixelArray[this.pos + 3] = val;
    }

    get pixelIndex() {
        return this.pos / 4;
    }

    set pixelIndex(val) {
        this.pos = val * 4;
    }

    setRGBA(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    setFromPixelArray(pixelArray) {
        for (let i = 0; i < this.pixelArray.length; i++) {
            this.pixelArray[i] = pixelArray[i];
        }
    }

    next() {
        this.pos += 4;
    }

    hasNext() {
        return this.pixelArray.length > this.pos + 4;
    }

    log() {
        console.log({ pos: this.pos, rgb: [this.r, this.g, this.b, this.a] });
    }
}
