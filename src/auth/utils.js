const { homedir } = require("os");

function identitiesdir() {
    return `${homedir()}/.mycel/identities`;
}

function getIdentityFilePath(username) {
    return `${identitiesdir()}/${username}.json`;
}

module.exports = {
    identitiesdir,
    getIdentityFilePath
};
