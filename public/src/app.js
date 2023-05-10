import { rgbToHex } from './colors.js';
import { AppError } from './error.js';
import { PixelIterator } from './filters.js';

export class App {
    logger;
    appContainerElement;
    canvasElement;
    outputElement;

    videoStream;
    video;

    get targetColor() {
        return this.outputElement.style.backgroundColor;
    }

    constructor(logger) {
        this.logger = logger;

        const isDeviceAvailable =
            'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;

        if (!isDeviceAvailable) {
            throw new AppError(
                'MEDIA_NOT_SUPPORTED',
                'Unable to load camera because your browser does not support media devices.'
            );
        }
    }

    mount(appContainerElement) {
        this.appContainerElement = appContainerElement;
        this.createCanvasElement();
        this.createVideoElement();
        this.createOutputElement();
        return this;
    }

    createCanvasElement() {
        const canvas = document.createElement('canvas');
        canvas.setAttribute('height', 110);
        canvas.setAttribute('width', 110);
        canvas.style.display = 'none';
        this.appContainerElement.appendChild(canvas);

        this.canvasElement = canvas;
    }

    createVideoElement() {
        const video = document.createElement('video');
        video.setAttribute('playsinline', '');
        video.setAttribute('autoplay', '');
        video.setAttribute('muted', '');
        video.style.width = '100%';
        video.style.height = '300px';
        this.appContainerElement.appendChild(video);

        this.video = video;
    }

    createOutputElement() {
        const outputElement = document.createElement('div');
        outputElement.style.width = '100%';
        outputElement.style.height = '200px';
        outputElement.style.backgroundColor = '#FFFFFF';
        this.appContainerElement.appendChild(outputElement);

        this.outputElement = outputElement;
    }

    async run() {
        try {
            const videoStream = await this.getVideoStream();
            this.connectVideoToStream(videoStream);
            await this.printColorCode();
        } catch (error) {
            await this.disconnectVideoStream();
            throw AppError.unknown(error);
        }
    }

    async getVideoStream() {
        return navigator.mediaDevices.getUserMedia({
            audio: false,
            video: { facingMode: 'environment' },
        });
    }

    async disconnectVideoStream() {
        this.videoStream?.getTracks().forEach(track => track.stop());
    }

    connectVideoToStream(videoStream) {
        this.videoStream = videoStream;
        this.video.srcObject = videoStream;
    }

    async printColorCode() {
        const ctx = this.canvasElement.getContext('2d');
        const loop = () => {
            ctx.drawImage(this.video, 0, 0, 110, 110);

            const [x, y, width, height] = [0, 0, 110, 110];
            const pixels = ctx.getImageData(x, y, width, height).data;
            console.log(pixels);
            const iterator = new PixelIterator(pixels);
            console.log(pixels.length);
            iterator.pixelIndex = pixels.length / 8 + width / 2;

            const r = iterator.r;
            const g = iterator.g;
            const b = iterator.b;

            console.log({ r, g, b });

            const hexColorString = rgbToHex(r, g, b);
            const logMessage = `rgb(${[r, g, b].join(', ')})\n hex: ${hexColorString}`;
            this.logger.log(logMessage, true);

            this.outputElement.style.backgroundColor = rgbToHex(r, g, b);
        };

        setInterval(loop, 400);
    }
}
