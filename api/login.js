const express = require("express");
const auth = require("../app/auth.js");
const validate = require("../app/validation.js");

async function post (req, res) {
    await login(req, res);
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function login (req, res) {
    const token = req.headers["authorization"]

    if (!token) return res.send({ ok: false });
    if (!validate.token(token)) return res.send({ ok: false });

    if (!(await req.app.database.authenticateToken(token))) return res.send({ ok: false });

    res.send({ ok: true })
}

module.exports = post;