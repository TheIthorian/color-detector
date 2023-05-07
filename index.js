import { App } from './src/app.js';
import { AppError } from './src/error.js';
import { Logger } from './src/log.js';

window.addEventListener('load', main);

async function main() {
    const logOutputElement = document.querySelector('#log-output');
    const appMountElement = document.querySelector('#app');

    const logger = new Logger(logOutputElement);

    new App(logger)
        .mount(appMountElement)
        .run()
        .catch(err => handleError(err));
}

function handleError(error) {
    console.error(error);
    const errorContainerElement = document.querySelector('#errors');
    errorContainerElement.innerHTML = '';

    Error({
        parentNode: errorContainerElement,
        title: 'Error: ' + error.code,
        message: error.message,
    });
}

function Error({ parentNode, title, message }) {
    const errorElement = document.createElement('div');

    const errorTitleElement = document.createElement('h2');
    errorTitleElement.innerText = title;
    errorElement.appendChild(errorTitleElement);

    const errorSubTitleElement = document.createElement('span');
    errorSubTitleElement.innerText = message;
    errorElement.appendChild(errorSubTitleElement);

    parentNode.appendChild(errorElement);
}
