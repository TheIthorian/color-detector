import { rgbToHex } from './colors.js';

export class App {
    logger;
    appContainerElement;
    canvasElement;
    outputElement;

    get targetColor() {
        return this.outputElement.style.backgroundColor;
    }

    constructor(logger) {
        this.logger = logger;

        const deviceAvailable =
            'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;

        if (!deviceAvailable) {
            throw Error('Browser does not support media devices');
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
        canvas.setAttribute('height', 11);
        canvas.setAttribute('width', 11);
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
        let videoStream;
        try {
            videoStream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: { facingMode: 'environment' },
            });

            this.video.srcObject = videoStream;

            await this.getColorCode(videoStream);
        } catch (error) {
            videoStream?.getTracks().forEach(track => track.stop());
            // throw new Error('Unable to access camera');
            throw error;
        }
    }

    async getColorCode(videoStream) {
        const ctx = this.canvasElement.getContext('2d');

        const loop = () => {
            ctx.drawImage(this.video, 0, 0, 11, 11);

            const [x, y, width, height] = [5, 5, 11, 11];
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

        setInterval(loop, 40);
    }
}
