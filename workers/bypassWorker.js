const { parentPort } = require("worker_threads");
const gun = require("../guns/bypass");

gun.attack().then(a => {});

parentPort.postMessage(true);
