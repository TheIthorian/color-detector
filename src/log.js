export class Logger {
    displayElement;

    constructor(displayElement) {
        this.displayElement = displayElement;
    }

    log(message) {
        if (!this.displayElement) return;

        console.log(message);

        if (typeof message === 'string') {
            this.displayElement.textContent = message;
            return;
        }

        this.displayElement.textContent = JSON.stringify(message);
    }
}
