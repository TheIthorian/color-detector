import { grayScale, greenScreen, invertFilter, mirrorFilter } from './filters.js';
import { Logger } from './log.js';
import { CanvasVideoOutput, VideoAdapter, VideoFilter } from './video.js';

window.addEventListener('load', test);

async function test() {
    const outputCanvasElement = document.querySelector('#output');
    outputCanvasElement.setAttribute('width', 600);
    outputCanvasElement.setAttribute('height', 600);

    const videoStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: 'environment' },
    });

    const videoAdapter = new VideoAdapter({
        xResolution: 600,
        yResolution: 600,
    });
    const videoOutput = new CanvasVideoOutput(outputCanvasElement, { frameRate: 24 });

    const logger = new Logger(document.getElementById('log-output'));
    videoAdapter.connectInput(videoStream);
    videoAdapter.connectOutput(grayScale()).connectOutput(videoOutput);
    // videoAdapter.connectOutput(videoOutput);

    console.log(videoAdapter.getVideoGraph());

    videoOutput.display();
}
