const express = require("express");
const auth = require("../app/auth.js");
const validate = require("../app/validation.js");

async function post (req, res) {
    await getRelations(req, res);
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function getRelations (req, res) {
    const token = req.headers["authorization"]
    if (!token) return res.sendStatus(403);

    if (!validate.token(token)) return res.sendStatus(403);
    const tokenData = auth.destructToken(token);
    const user = await req.app.database.getUser(tokenData.id);
    if (!user) return res.sendStatus(403);
    if (user.token !== token) return res.sendStatus(403);
    let relationships = await req.app.database.getRelationships(user.id);
    if (!relationships) return res.sendStatus(500)
    console.log(relationships)
    for (let i = 0; i < relationships.length; i++) {
        const relationship = relationships[i];
        console.log(relationship)
        const author = await req.app.database.getUser(relationship.recipent)
        if (author) relationship.username = author.username
    }

    res.send({ relationships });
}

module.exports = post;