export class VideoAdapter {
    output;
    inputStream;
    options;

    canvasElement;
    _videoElement;

    constructor(options = {}) {
        this.options = {
            xResolution: options.xResolution ?? 10,
            yResolution: options.yResolution ?? 10,
            pollRate: options.pollRate ?? 100,
        };

        this.canvasElement = this.createCanvasElement();
        this._videoElement = this.createVideoElement();
    }

    createCanvasElement() {
        const canvas = document.createElement('canvas');
        canvas.setAttribute('height', this.options.xResolution);
        canvas.setAttribute('width', this.options.yResolution);
        canvas.style.display = 'none';
        document.body.appendChild(canvas);
        return canvas;
    }

    createVideoElement() {
        const video = document.createElement('video');
        video.setAttribute('playsinline', '');
        video.setAttribute('autoplay', '');
        video.setAttribute('muted', '');
        video.style.display = 'none';
        document.body.appendChild(video);
        return video;
    }

    connectInput(videoStream) {
        this.inputStream = videoStream;
        this._videoElement.srcObject = videoStream;
        return this;
    }

    disconnectInput() {
        this.inputStream = undefined;
        return this;
    }

    connectOutput(videoOutput) {
        this.output = videoOutput;
        this.output.connectInput(this);
        return this;
    }

    disconnectOutput() {
        this.output.disconnectInput();
        this.output = undefined;
        return this;
    }

    read() {
        const ctx = this.canvasElement.getContext('2d');
        const { xResolution, yResolution } = this.options;

        ctx.drawImage(this._videoElement, 0, 0, xResolution, yResolution);
        const imageData = ctx.getImageData(0, 0, xResolution, yResolution);
        return imageData;
    }
}

export class CanvasVideoOutput {
    canvasElement;
    options;
    imageSource;

    constructor(element, options = {}) {
        this.canvasElement = element;
        this.options = {
            frameRate: options.frameRate ?? 24,
        };
    }

    connectInput(imageSource) {
        this.imageSource = imageSource;
        return this;
    }

    disconnectInput() {
        this.imageSource = undefined;
        return this;
    }

    display() {
        console.log(this.canvasElement);
        const ctx = this.canvasElement.getContext('2d');

        const loop = () => {
            const imageData = this.imageSource.read();
            console.log(imageData);
            ctx.putImageData(imageData, 0, 0);
        };

        setInterval(loop, 1000 / this.options.frameRate);
    }
}

class VideoFilter {
    constructor() {}
}

class VideoNode {
    input;
    output;

    connectInput(input) {
        this.input = input;
        return this;
    }

    disconnectInput() {
        this.input = undefined;
        return this;
    }

    connectOutput(videoOutput) {
        this.output = videoOutput;
        this.output.connectInput(this);
        return this;
    }

    disconnectOutput() {
        this.output.disconnectInput();
        this.output = undefined;
        return this;
    }
}
