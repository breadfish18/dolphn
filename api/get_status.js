const express = require("express");
const auth = require("../app/auth.js");
const validate = require("../app/validation.js");

async function post (req, res) {
    await getStatuses(req, res);
}
/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function getStatuses (req, res) {
    const token = req.headers["authorization"]
    if (!token) return res.sendStatus(403);

    if (!validate.token(token)) return res.sendStatus(403);
    const tokenData = auth.destructToken(token);
    const user = await req.app.database.getUser(tokenData.id);
    if (!user) return res.sendStatus(403);
    if (user.token !== token) return res.sendStatus(403);

    const users = (await req.app.database.getUsers()).map(user => user.id)

    const online = [...req.app.sockets.keys()];
    const offline = users.filter((user) => !online.includes(user))

    res.send({ online, offline });
}

module.exports = post;