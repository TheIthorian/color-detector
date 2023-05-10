import {
    blackAndWhiteFilter,
    grayScale,
    invertFilter,
    mirrorFilter,
    sobelFilter,
} from './filters.js';
import { CanvasVideoOutput, VideoAdapter, VideoFilter } from './video.js';

window.addEventListener('load', test);

async function test() {
    const outputCanvasElement = document.querySelector('#output');
    outputCanvasElement.setAttribute('width', 700);
    outputCanvasElement.setAttribute('height', 700);

    const videoStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: 'environment' },
    });

    const videoAdapter = new VideoAdapter({
        xResolution: 700,
        yResolution: 700,
    });
    const videoOutput = new CanvasVideoOutput(outputCanvasElement, { frameRate: 24 });

    const logger = new Logger(document.getElementById('log-output'));
    videoAdapter.connectInput(videoStream);
    videoAdapter
        // .connectOutput(invertFilter())
        .connectOutput(grayScale())
        // .connectOutput(mirrorFilter())
        .connectOutput(blackAndWhiteFilter())
        // .connectOutput(sobelFilter())
        .connectOutput(videoOutput);

    console.log(videoAdapter.getVideoGraph());

    videoOutput.display();
}
