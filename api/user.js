const express = require("express");
const auth = require("../app/auth.js");
const validate = require("../app/validation.js");

async function post (req, res) {
    await user(req, res);
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function user (req, res) {
    const id = req.path.split("/").pop()
    if (!validate.id(id)) return res.send({ ok: false });

    const user = await req.app.database.getUser(id);
    if (!user) return res.send({ ok: false });
    res.send({ ok: true, username: user.username });
}

module.exports = post;