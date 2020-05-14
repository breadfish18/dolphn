const express = require("express");
const auth = require("../app/auth.js");
const validate = require("../app/validation.js");

async function post (req, res) {
    await createChannel(req, res);
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function createChannel (req, res) {
    const token = req.headers["authorization"]
    const server = req.path.split("/")[req.path.split("/").length - 2]
    let { name } = req.body;

    if (!name) return
    if (!validate.channel(name)) return;

    if (!validate.token(token)) return;

    const tokenData = auth.destructToken(token);
    const user = await req.app.database.getUser(tokenData.id);
    if (!user) return;
    if (user.token !== token) return;

    const id = req.app.snowflake.nextId();
    const timestamp = Date.now();
    const author = user.id;

    if (await req.app.database.hasChannel(name, server)) return
    await req.app.database.newChannel({ id, author, name, desc: false, server, timestamp });

    const users = req.app.sockets
    for (const usr of users.values()) {
        for (const socket of usr.sockets) {
            if (Object.values(socket.rooms).includes(server))
                await socket.join(id)
        }
    }

    req.app.io.of("/chat").to(server).emit('channel_create', {
        id,
        author,
        name,
        server,
        timestamp
    });
    res.send({
        id,
        author,
        name,
        server,
        timestamp
    })
}

module.exports = post;