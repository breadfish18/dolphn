const express = require("express");
const validate = require("../app/validation.js");
const auth = require("../app/auth.js");
const app = require("../app/app.js");

async function post (req, res) {
    await getMessages(req, res);
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function getMessages (req, res) {
    const token = req.headers["authorization"]
    const channel = req.path.split("/").pop()

    if (!token) return res.sendStatus(403)
    if (!channel) return res.sendStatus(400);

    if (!validate.token(token)) return res.sendStatus(403);
    const tokenData = auth.destructToken(token);
    const user = await app.database.getUser(tokenData.id);
    if (!user) return res.sendStatus(403);
    if (user.token !== token) return res.sendStatus(403);
    const messages = await req.app.database.getMessages(channel);
    for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        const author = await req.app.database.getUser(message.author)
        if (author) message.username = author.username
    }
    if (!messages) return res.sendStatus(500)
    res.send({ messages });
}

module.exports = post;