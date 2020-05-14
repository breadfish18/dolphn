const express = require("express");
const auth = require("../app/auth.js");
const validate = require("../app/validation.js");

async function post (req, res) {
    await joinServer(req, res);
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function joinServer (req, res) {
    const token = req.headers["authorization"]
    const invite = req.path.split("/").pop()

    if (!validate.token(token)) return res.sendStatus(403);

    const tokenData = auth.destructToken(token);
    const user = await req.app.database.getUser(tokenData.id);
    if (!user) return res.sendStatus(403);
    if (user.token !== token) return res.sendStatus(403);

    const server = await req.app.database.resolveInvite(invite)
    if (!server) return

    // if ((await req.app.database.inServer(user.id, server.id))) return res.sendStatus(400);

    await req.app.database.joinServer(user.id, server.id)

    const sockets = req.app.sockets.get(user.id).sockets

    for (socket of sockets) {
        await socket.join(server.id);
        const channels = await req.app.database.getChannels(server.id)
        for (let x = 0; x < channels.length; x++) {
            const channel = channels[x];
            await socket.join(channel.id);
        }
    }
    res.send({ server });
}

module.exports = post;