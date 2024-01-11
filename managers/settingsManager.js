const fileHelper = require('../utils/fileHelper');
const {settingPath} = require('../pathes');
const fs = require("fs");

const getLog = () => {
    return read().Log;
}

const setLog = (value) => {
    writeValue("Log", value);
}

const getMethod = () => {
    return read().Method;
}

const setMethod = (value) => {
    if (fs.existsSync(`./guns/${value}.js`)) {
        writeValue("Method", value);

        return true;
    }

    return false;
}

const getDelay = () => {
    return read().Delay;
}

const setDelay = (value) => {
    writeValue("Delay", value);
}

//

function read() {
    try {
        return fileHelper.readSync(settingPath);
    } catch {
        writeAll(defaultValue);

        return defaultValue;
    }
}

function writeValue(param, value) {
    let json = fileHelper.readSync(settingPath);
    json[param] = value;

    fileHelper.write(settingPath, json);

    return true;
}

function writeAll(json) {
    fileHelper.write(settingPath, json);
}

const defaultValue = {
    "Log": false,
    "Method": "fast",
    "Delay": 10,
}

module.exports = {getLog, getMethod, setMethod, writeAll, getDelay, setDelay};