const express = require("express");
const auth = require("../app/auth.js");
const validate = require("../app/validation.js");

async function post (req, res) {
    await postFriendship(req, res);
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function postFriendship (req, res) {
    const token = req.headers["authorization"]
    if (!token) return res.sendStatus(403);
    const { name, type } = req.body

    if (!validate.username(name)) return res.sendStatus(400)
    if (!validate.token(token)) return res.sendStatus(403);
    const tokenData = auth.destructToken(token);
    const user = await req.app.database.getUser(tokenData.id);
    if (!user) return res.sendStatus(403);
    if (user.token !== token) return res.sendStatus(403);

    const id = req.app.snowflake.nextId();

    const friend = await req.app.database.getUserByName(name);
    if (!friend) return res.sendStatus(400)
    const channel = req.app.snowflake.nextId();

    // 1: request
    // 2: friend
    let relationships = await req.app.database.createRelationship({ id, channel, type, user: user.id, recipient: friend.id });

    res.send({ relationships });
}

module.exports = post;