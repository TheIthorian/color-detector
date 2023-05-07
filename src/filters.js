import { VideoFilter } from './video.js';

export function invertFilter(logger) {
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

    next() {
        this.pos += 4;
    }

    hasNext() {
        return this.pixelArray.length > this.pos + 4;
    }

    log() {
        console.log({ pos: iterator.pos, rgb: [iterator.r, iterator.g, iterator.b] });
    }
}
