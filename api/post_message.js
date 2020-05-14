const express = require("express");
const auth = require("../app/auth.js");
const validate = require("../app/validation.js");

async function post (req, res) {
    await postMessage(req, res);
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function postMessage (req, res) {
    const token = req.headers["authorization"]
    const channel = req.path.split("/").pop()

    let { content, image } = req.body;
    image = image ? image : false
    if (!token) return;
    if (!content && !image) return
    if (content) {
        content = validate.cleanContent(content);
        if (!validate.content(content)) return;
    }
    if (!validate.token(token)) return;

    const tokenData = auth.destructToken(token);
    const user = await req.app.database.getUser(tokenData.id);
    if (!user) return;
    if (user.token !== token) return;

    const id = req.app.snowflake.nextId();
    const timestamp = Date.now();
    const author = await req.app.database.getUser(user.id)

    req.app.database.newMessage({ id, content, author: author.id, channel, timestamp, image });
    req.app.io.of("/chat").to(channel).emit('message_create', {
        id,
        content,
        author: author.id,
        channel,
        timestamp,
        username: author.username,
        image
    });
    res.send({
        id,
        content,
        author: author.id,
        channel,
        timestamp,
        username: author.username,
        image
    })
}

module.exports = post;