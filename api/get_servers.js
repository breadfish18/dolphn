const express = require("express");
const auth = require("../app/auth.js");
const validate = require("../app/validation.js");

async function post (req, res) {
    await getServers(req, res);
}
/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function getServers (req, res) {
    const token = req.headers["authorization"]
    if (!token) return res.sendStatus(403);

    if (!validate.token(token)) return res.sendStatus(403);
    const tokenData = auth.destructToken(token);
    const user = await req.app.database.getUser(tokenData.id);
    if (!user) return res.sendStatus(403);
    if (user.token !== token) return res.sendStatus(403);

    let servers = await req.app.database.getServers(user.id);
    for (let i = 0; i < servers.length; i++) {
        servers[i].channels = await req.app.database.getChannels(servers[i].id)
    }
    if (!servers) return res.sendStatus(500)
    res.send({ servers });
}

module.exports = post;