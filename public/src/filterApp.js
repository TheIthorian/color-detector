import { FilterBuilder } from './filterBuilder.js';
import { Logger } from './log.js';
import { CanvasVideoOutput, VideoAdapter } from './video.js';

window.addEventListener('load', run);

async function run() {
    const outputCanvasElement = document.querySelector('#output');
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    outputCanvasElement.setAttribute('width', windowWidth + 'px');
    outputCanvasElement.setAttribute('height', windowHeight + 'px');

    const videoStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: 'environment' },
    });

    const videoAdapter = new VideoAdapter({
        xResolution: windowWidth,
        yResolution: windowHeight,
    });

    window.addEventListener('resize', () => {
        outputCanvasElement.setAttribute('width', window.innerWidth + 'px');
        outputCanvasElement.setAttribute('height', window.innerHeight + 'px');
        videoAdapter.xResolution = window.innerWidth;
        videoAdapter.yResolution = window.innerHeight;
    });

    const videoOutput = new CanvasVideoOutput(outputCanvasElement, { frameRate: 24 });

    const logger = new Logger(document.getElementById('log-output'));
    videoAdapter.connectInput(videoStream);

    const optionsContainer = document.querySelector('#options');

    for (const element of optionsContainer.childNodes) {
        if (element.type !== 'checkbox') continue;

        element.addEventListener('change', e => {
            // Find all enabled filters
            const filters = [];
            for (const checkbox of optionsContainer.childNodes) {
                if (checkbox.checked) filters.push(checkbox.value);
            }
            console.log('newFilters:', filters);

            // Just connect output
            if (!filters.length) {
                videoAdapter.connectOutput(videoOutput);
                return;
            }

            // Disconnect existing filters
            videoAdapter.getVideoGraph().forEach(node => node.disconnectOutput());

            const head = FilterBuilder.fromArray(filters);
            const graph = head.getVideoGraph();
            const tail = graph[graph.length - 1];
            videoAdapter.connectOutput(head);
            tail.connectOutput(videoOutput);
        });
    }

    videoAdapter.connectOutput(videoOutput);
    videoOutput.display();

    console.log(videoAdapter.getVideoGraph());
}
