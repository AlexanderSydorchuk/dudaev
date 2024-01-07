const {join} = require("path");

const targetsPath = join(__dirname, "data/targets.json");
const settingPath = join(__dirname, "data/settings.json");

module.exports = {targetsPath, settingPath};