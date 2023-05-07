import { CanvasVideoOutput, VideoAdapter, VideoFilter } from './video.js';

window.addEventListener('load', test);

async function test() {
    const outputCanvasElement = document.querySelector('#output');
    outputCanvasElement.setAttribute('width', 500);
    outputCanvasElement.setAttribute('height', 500);

    const videoStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: 'environment' },
    });

    const videoAdapter = new VideoAdapter({
        xResolution: 500,
        yResolution: 500,
    });
    const videoOutput = new CanvasVideoOutput(outputCanvasElement, { frameRate: 100 });
    const videoFilter = new VideoFilter();
    videoFilter.setFilterFunction(imageData => {
        const pixels = imageData.data;
        for (let i = 0; i < pixels.length; i++) {
            const pixelVal = pixels[i];
            pixels[i] = (i + 1) % 4 === 0 ? pixelVal : 255 - pixelVal;
        }
    });

    videoAdapter.connectInput(videoStream);
    videoAdapter.connectOutput(videoFilter).connectOutput(videoOutput);

    console.log(videoAdapter.getVideoGraph());

    videoOutput.display();
}
