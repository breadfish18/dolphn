const express = require("express");
const auth = require("../app/auth.js");
const validate = require("../app/validation.js");

async function post (req, res) {
    await resolveInvite(req, res);
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function resolveInvite (req, res) {
    const token = req.headers["authorization"]
    const invite = req.path.split("/").pop()

    if (!validate.token(token)) return;

    const tokenData = auth.destructToken(token);
    const user = await req.app.database.getUser(tokenData.id);
    if (!user) return;
    if (user.token !== token) return;

    const server = await req.app.database.resolveInvite(invite)
    if (!server) return;
    res.send({ server });
}

module.exports = post;