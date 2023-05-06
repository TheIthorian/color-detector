export class App {
    appContainerElement;

    constructor() {}

    mount(appContainerElement) {
        this.appContainerElement = appContainerElement;
        this.createVideoElement();
        return this;
    }

    createVideoElement() {
        const video = document.createElement('video');
        video.setAttribute('playsinline', '');
        video.setAttribute('autoplay', '');
        video.setAttribute('muted', '');
        video.style.width = '200px';
        video.style.height = '200px';

        this.video = video;
        console.log(video);
        this.appContainerElement.appendChild(this.video);
    }

    async run() {
        let videoStream;
        try {
            const availableDevices = await navigator.mediaDevices.enumerateDevices();
            console.log(availableDevices);

            const videoCamera = availableDevices.find(device => device.kind === 'videoinput');
            if (!videoCamera) {
                throw Error('Could not find camera');
            }

            videoStream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    deviceId: videoCamera.deviceId,
                },
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

    async getColorCode(videoStream) {}
}
