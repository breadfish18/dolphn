const r = require("rethinkdbdash")({ db: "dolphn" });
const auth = require("../app/auth.js");

class Database {
    async newUser ({ id, username, password, timestamp, token }) {
        await r.table("users").insert({ id, username, password, timestamp, token, servers: ["191239534061551600"] });
    }
    async newMessage ({ id, author, content, channel, image, timestamp }) {
        await r.table("messages").insert({ id, author, content, channel, image, timestamp });
    }
    async createRelationship ({ id, channel, type, user, recipient }) {
        return await r.table("relationships").insert({ id, channel, type, user, recipient })
    }
    async newChannel ({ id, author, name, desc, server, timestamp }) {
        await r.table("channels").insert({ id, author, name, desc, server, timestamp });
    }
    async newServer ({ id, author, name, channel, invite, timestamp }) {
        await r.table("servers").insert({ id, author, name, channel, invite, timestamp });
    }

    async updateUser ({ id, username, password, icon, token }) {
        await r.table("users").get(id).update({ username, password, icon, token });
    }
    async editRelationship ({ id, channel, type, user, recipient }) {
        return await r.table("relationships").get(id).update({ channel, type, user, recipient })
    }
    async joinServer (id, server) {
        await r.table("users").get(id).update({
            servers: r.row('servers').append(server)
        })
    }

    async deleteUser (id) {
        await r.table("users").get(id).delete();
        // await r.table("messages").filter({ author: id }).delete()
    }
    async deleteMessage (id) {
        await r.table("messages").get(id).delete();
    }

    async getMessage (id) {
        return await r.table("messages").get(id);
    }
    async hasChannel (name, server) {
        return await r.table("channels").filter({ name, server }).count() > 0;
    }
    async getChannels (server) {
        return await r.table("channels").filter({ server });
    }
    async getServers (user) {
        return await r.table("servers").filter(s => r.table("users").get(user).getField("servers").contains(s.getField("id")))
    }
    async getRelationship (id) {
        return await r.table("relationships").get(id)
    }
    async getRelationships (user) {
        console.log(user)
        return await r.table("relationships").filter(r.row("user").eq(user).and(r.row("type").eq(2)).or(r.row("recipient").eq(user).and(r.row("type").eq(1))))
    }
    async getMessages (channel) {
        return await r.table("messages").filter({ channel }).orderBy("timestamp");
        // .skip(skip).limit(limit)
    }
    async getUsers () {
        return await r.table("users");
    }
    async getUser (id) {
        return await r.table("users").get(id);
    }
    async getServer (id) {
        return await r.table("servers").get(id);
    }
    async resolveInvite (invite) {
        const servers = await r.table("servers").filter({ invite });
        return servers ? servers[0] : null;
    }
    async getUserByName (name) {
        const users = await r.table("users").filter({ username: name });
        return users ? users[0] : null;
    }
    async hasUsername (name) {
        return await r.table("users").filter({ username: name }).count() > 0;
    }
    async authenticateToken (token) {
        const tokenData = auth.destructToken(token);
        if (!tokenData) return false;
        const userData = await this.getUser(tokenData.id);
        return !!userData;
    }
    async inServer (id, server) {
        return await r.table("users").get(id).getField("servers").contains(server)
    }
}

module.exports = Database;