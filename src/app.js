import { rgbToHex } from './colors.js';
import { AppError } from './error.js';

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
        outputElement.style.height = '300px';
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

            const [x, y, width, height] = [5, 5, 11, 11]; // TODO: should be 0, 0, 11, 11
            const imageData = ctx.getImageData(x, y, width, height);

            const pixels = imageData.data;
            // const centerPixelPosition = 11 * 4 * 6;
            const firstPixelPosition = 0;
            const [r, g, b, a] = pixels.slice(firstPixelPosition, firstPixelPosition + 5);

            const hexColorString = rgbToHex(r, g, b);
            const logMessage = `rgb(${[r, g, b].join(', ')}), hex: ${hexColorString}`;
            this.logger.log(logMessage, true);

            this.outputElement.style.backgroundColor = rgbToHex(r, g, b);
        };

        setInterval(loop, 400);
    }
}
