export class App {
    logger;
    appContainerElement;
    canvasElement;
    targetColor;

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
        return this;
    }

    createCanvasElement() {
        const canvas = document.createElement('canvas');
        canvas.setAttribute('height', 11);
        canvas.setAttribute('width', 11);
        this.appContainerElement.appendChild(canvas);

        this.canvasElement = canvas;
    }

    createVideoElement() {
        const video = document.createElement('video');
        video.setAttribute('playsinline', '');
        video.setAttribute('autoplay', '');
        video.setAttribute('muted', '');
        video.style.width = '200px';
        video.style.height = '200px';
        this.appContainerElement.appendChild(video);

        this.video = video;
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
            console.error(error);
            // throw new Error('Unable to access camera');
            throw error;
        }
    }

    async getColorCode(videoStream) {
        const videoTracks = videoStream.getVideoTracks();
        console.log(videoTracks);

        // const canvas = document.querySelector('canvas');
        // const ctx = canvas.getContext('2d');

        const ctx = this.canvasElement.getContext('2d');

        const loop = () => {
            ctx.drawImage(this.video, 0, 0, 11, 11);

            const [x, y, width, height] = [5, 5, 11, 11];
            const imageData = ctx.getImageData(x, y, width, height);

            console.log(imageData);

            const pixels = imageData.data;
            const centerPixel = pixels[Math.floor(pixels.length / 2)];
            this.logger.log({ centerPixelValue: centerPixel });
            this.targetColor = '#FFFFFF';

            // requestAnimationFrame(loop);
        };

        // requestAnimationFrame(loop);

        setInterval(loop, 100);
    }
}
