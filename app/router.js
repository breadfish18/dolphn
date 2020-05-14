const express = require('express')
const router = express.Router()

const apiAuth = require("../api/auth.js");
const apiNewUser = require("../api/new_user.js");
const apiUser = require("../api/user.js");
const apiUsers = require("../api/users.js");
const apiStatuses = require("../api/get_status.js");
const apiGetServers = require("../api/get_servers.js");
const apiGetMessages = require("../api/get_messages.js");
const apiGetRelationships = require("../api/relationships.js");
const apiSendMessage = require("../api/post_message.js");
const apiNewServer = require("../api/new_server.js");
const apiNewChannel = require("../api/new_channel.js");
const apiResolveInvite = require("../api/resolve_invite.js");
const apiJoinServer = require("../api/join_server.js");
const apiLogin = require("../api/login.js");

router.use(function timeLog (req, res, next) {
    console.log('Time: ', Date.now())
    next()
})
router.post('/user', apiAuth)
router.post("/auth", apiAuth);
router.get("/status", apiStatuses);
router.get("/users", apiUsers);
router.get("/users/*", apiUser);
router.get("/messages/*", apiGetMessages);
router.get("/invites/*", apiResolveInvite);
router.post("/invites/*", apiJoinServer);
router.post("/messages/*", apiSendMessage);
router.get("/servers", apiGetServers);
router.get("/relationships", apiGetRelationships);
router.post("/servers", apiNewServer);
router.post("/servers/*/channels", apiNewChannel);
router.get("/login", apiLogin);

module.exports = router