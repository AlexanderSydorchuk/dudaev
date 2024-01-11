/**
 * Tells whether gun is still firing
 */
var IsLaunched = false;

const GetIsLaunched = () => IsLaunched;

const Launch = () => {
    IsLaunched = true;
}
const Stop = () => {
    IsLaunched = false;
}

module.exports = {GetIsLaunched, Launch, Stop};