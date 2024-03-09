// utils.js located in ./

function returnSkillError(errMsg) {
    return {success: false, error: errMsg};
}

function returnSkillSuccess(data) {
    return {success: true, ...data};
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    returnSkillError,
    returnSkillSuccess,
    sleep,
};