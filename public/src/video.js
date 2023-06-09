export class VideoAdapter {
    name = 'VideoAdapter';
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

    set xResolution(val) {
        this.canvasElement.setAttribute('width', val);
        this._videoElement.setAttribute('width', val);
        this.options.xResolution = val;
    }

    set yResolution(val) {
        this.canvasElement.setAttribute('height', val);
        this._videoElement.setAttribute('height', val);
        this.options.yResolution = val;
    }

    createCanvasElement() {
        const canvas = document.createElement('canvas');
        canvas.setAttribute('height', this.options.xResolution);
        canvas.setAttribute('width', this.options.yResolution);
        canvas.style.display = 'none';
        document.body.appendChild(canvas);
        this.captureCanvas = canvas;
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
        return videoOutput;
    }

    disconnectOutput() {
        this.output?.disconnectInput();
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

    getVideoGraph() {
        const graph = [];
        let curr = this;
        while (curr) {
            graph.push(curr);
            curr = curr.output;
        }
        return graph;
    }
}

class VideoNode {
    name = 'VideoNode';
    input;
    output;

    constructor() {}

    connectInput(input) {
        console.log(`${this.name} connected to ${input.name}`);
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
        return videoOutput;
    }

    disconnectOutput() {
        this.output?.disconnectInput();
        this.output = undefined;
        return this;
    }

    read() {
        return this.input.read(); // By default, read the previous node
    }

    getVideoGraph() {
        const graph = [];
        let curr = this;
        while (curr) {
            graph.push(curr);
            curr = curr.output;
        }
        return graph;
    }
}

export class CanvasVideoOutput extends VideoNode {
    name = 'CanvasVideoOutput';
    disabled = false;
    canvasElement;
    options;

    constructor(element, options = {}) {
        super();
        this.canvasElement = element;
        this.options = {
            frameRate: options.frameRate ?? 24,
        };
    }

    display() {
        const ctx = this.canvasElement.getContext('2d');

        if (!this.input) return;

        const loop = () => {
            const imageData = this.input.read();
            ctx.putImageData(imageData, 0, 0);
        };

        setInterval(loop, 1000 / this.options.frameRate);
    }
}

export class VideoFilter extends VideoNode {
    name = 'VideoFilter';
    options;

    _filterFunction;

    constructor(options = {}) {
        super();
        this._filterFunction = options.filterFunction;
        this.options = {};
    }

    read() {
        const imageData = this.input.read();

        if (this._filterFunction && !this.disabled) {
            this._filterFunction(imageData);
            return imageData;
        }

        return imageData;
    }

    setFilterFunction(fn) {
        this._filterFunction = fn;
    }
}
