const { parentPort } = require("worker_threads");
const gun = require("../guns/fast");

gun.attack().then(a => {});

parentPort.postMessage(true);
