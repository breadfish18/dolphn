const express = require("express");
const auth = require("../app/auth.js");
const validate = require("../app/validation.js");

async function post (req, res) {
    await users(req, res);
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function users (req, res) {
    const token = req.headers["authorization"]

    if (!token) return res.send({ ok: false });

    if (!validate.token(token)) return res.send({ ok: false });
    const tokenData = auth.destructToken(token);
    const user = await req.app.database.getUser(tokenData.id);
    if (!user) return;
    if (user.token !== token) return;
    const users = (await req.app.database.getUsers()).map(user => {
        return { username: user.username, id: user.id, timestamp: user.timestamp }
    }).filter(usr => usr.id !== user.id)

    if (!users) return res.send({ ok: false });

    res.send({ ok: true, users });
}

module.exports = post;