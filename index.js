import { App } from './src/app.js';
import { Logger } from './src/log.js';

window.addEventListener('load', main);

async function main() {
    const logOutputElement = document.querySelector('#log-output');
    const appMountElement = document.querySelector('#app');
    const logger = new Logger(logOutputElement);

    logger.log({ hello: 'world' });

    new App()
        .mount(appMountElement)
        .run()
        .catch(err => console.error(err));
}
