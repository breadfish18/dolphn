const express = require("express");
const auth = require("../app/auth.js");
const validate = require("../app/validation.js");

async function post (req, res) {
    await editFriendship(req, res);
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function editFriendship (req, res) {
    const token = req.headers["authorization"]
    if (!token) return res.sendStatus(403)
    const id = req.path.split("/").pop()
    const { type } = req.body

    if (!validate.id(id)) return res.sendStatus(403)

    if (!validate.token(token)) return res.sendStatus(403);

    const tokenData = auth.destructToken(token);
    const user = await req.app.database.getUser(tokenData.id);
    if (!user) return res.sendStatus(403);
    if (user.token !== token) return res.sendStatus(403);

    const snowflake = req.app.snowflake.nextId();

    // 1: request
    // 2: friend
    const previous = await req.app.database.getRelationship(id)
    const relationship = await req.app.database.editRelationship({ id, channel: previous.channel, type: 2, user: previous.user, recipient: previous.recipient });
    await req.app.database.createRelationship({ id: snowflake, channel: previous.channel, type: 2, user: previous.recipient, recipient: previous.user })
    res.send({ relationship });
}

module.exports = post;