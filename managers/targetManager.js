const fileHelper = require('../utils/fileHelper');
const {targetsPath} = require('../pathes');

/**
 * Get list of targets inside arr.
 * @returns {Buffer}
 */
const get = () => {
    return fileHelper.readSync(targetsPath); //works

    /*let data = [];
    fileHelper.getAll(targetsPath, targets => {
        data = [...targets];
    });

    return data;
     */
}

/**
 * Adds target to targets file.
 * @param targetUrl
 * @returns {*}
 */
const add = (targetUrl) => {
    let targets = fileHelper.readSync(targetsPath);
    targets.push(targetUrl);
    fileHelper.write(targetsPath, targets);

    return targets;
}

/**
 * Removes target from targets file.
 * @param targetUrl
 * @returns {boolean}
 */
const remove = (targetUrl) => {
    let targets = fileHelper.readSync(targetsPath);
    const index = targets.indexOf(targetUrl);

    if (index > -1) {
        targets.splice(index, 1);
    }
    else {
        return false;
    }

    fileHelper.write(targetsPath, targets);

    return true;
}

/**
 * Clears all targets in file.
 */
const clear = () => {
    fileHelper.write(targetsPath, []);
}

module.exports = {get, add, remove, clear};