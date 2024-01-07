const fileHelper = require('../utils/fileHelper');
const {settingPath} = require('../pathes');
const fs = require("fs");

const getIsLaunched = () => {
    return read().IsLaunched;
}

const setIsLaunched = (value) => {
    write("IsLaunched", value);
}

const getLog = () => {
    return read().Log;
}

const setLog = (value) => {
    write("Log", value);
}

const getMethod = () => {
    return read().Method;
}

const setMethod = (value) => {
    if (fs.existsSync(`./guns/${value}.js`)) {
        write("Method", value);

        return true;
    }

    return false;
}

//

function read()
{
    return fileHelper.readSync(settingPath);
}

function write(param, value)
{
    let json = fileHelper.readSync(settingPath);
    json[param] = value;

    fileHelper.write(settingPath, json);

    return true;
}

module.exports = {getIsLaunched, setIsLaunched, getLog, getMethod, setMethod};