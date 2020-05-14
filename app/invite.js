const crypto = require('crypto');

function newInvite () {
    return crypto.randomBytes(4).toString("base64").replace(/\/|\+/g, "_").replace("==", "")
}
module.exports = newInvite;