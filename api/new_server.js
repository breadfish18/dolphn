const express = require("express");
const auth = require("../app/auth.js");
const validate = require("../app/validation.js");
const newInvite = require("../app/invite.js");


async function post (req, res) {
    await createServer(req, res);
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function createServer (req, res) {
    const token = req.headers["authorization"]

    let { name } = req.body;

    if (!name) return

    if (!validate.token(token)) return;

    const tokenData = auth.destructToken(token);
    const user = await req.app.database.getUser(tokenData.id);
    if (!user) return;
    if (user.token !== token) return;

    const id = req.app.snowflake.nextId();
    const timestamp = Date.now();
    const author = user.id;
    const invite = newInvite();

    await req.app.database.newServer({ id, author, name, invite, timestamp });
    const channel_id = req.app.snowflake.nextId();
    await req.app.database.newChannel({ id: channel_id, author, name: "general", desc: false, server: id, timestamp });

    await req.app.database.joinServer(author, id)

    const sockets = req.app.sockets.get(user.id).sockets
    for (socket of sockets) {
        await socket.join(id);
        await socket.join(channel_id);
    }

    req.app.io.of("/chat").to(author).emit('server_create', {
        id,
        author,
        name,
        channels: [{
            id: channel_id,
            author,
            name: "general",
            server: id,
            timestamp
        }],
        invite,
        timestamp
    });
    res.send({
        id,
        author,
        name,
        channels: [{
            id: channel_id,
            author,
            name: "general",
            server: id,
            timestamp
        }],
        invite,
        timestamp
    })
}

module.exports = post;