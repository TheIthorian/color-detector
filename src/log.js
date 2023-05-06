export class Logger {
    displayElement;

    constructor(displayElement) {
        this.displayElement = displayElement;
    }

    log(message, skipConsole = false) {
        if (!this.displayElement) return;

        if (!skipConsole) console.log(message);

        if (typeof message === 'string') {
            this.displayElement.textContent = message;
            return;
        }

        this.displayElement.textContent = JSON.stringify(message);
    }
}
