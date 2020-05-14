const auth = require("./auth.js");
const app = require("./app.js");
const validate = require("./validation.js");
const sockets = new Map()
const voiceChat = [];

app.sockets = sockets

async function connection (socket) {
    let token = socket.handshake.headers.authentication
    if (!token) return;

    if (!validate.token(token)) return;

    const tokenData = auth.destructToken(token);
    const user = await app.database.getUser(tokenData.id);
    if (!user) return;
    if (user.token !== token) return;

    console.log("connection")
    sockets.get(user.id) ? sockets.get(user.id).sockets.push(socket) : sockets.set(user.id, { sockets: [socket] })

    console.time()
    const servers = await app.database.getServers(user.id)
    for (server of servers) {
        await socket.join(server.id);
        const channels = await app.database.getChannels(server.id)
        for (channel of channels) {
            await socket.join(channel.id);
        }
    }
    const friends = await app.database.getRelationships(user.id)
    for (const friend of friends) {
        await socket.join(friend.channel);
    }

    console.timeEnd()
    await socket.join(user.id)

    // console.log("Socket now in rooms", socket.rooms);

    socket.broadcast.emit('online', {
        id: user.id
    });
    socket.emit('online', {
        id: user.id
    });
    socket.on('disconnect', async () => {
        let token = socket.handshake.headers.authentication
        if (!token) return;

        if (!validate.token(token)) return;

        const tokenData = auth.destructToken(token);
        const user = await app.database.getUser(tokenData.id);
        if (!user) return;
        if (user.token !== token) return;

        sockets.get(user.id).sockets.length === 1 ? sockets.delete(user.id) : sockets.get(user.id).sockets = sockets.get(user.id).sockets.filter(s => s.id !== socket.id)

        console.log(sockets.get(user.id))
        socket.broadcast.emit('offline', {
            id: user.id
        });
        socket.emit('offline', {
            id: user.id
        });
    });
    socket.on("message_create", async data => {
        // let { content, token, image, channel } = data;
        // image = image ? image : false
        // if (!token) return;
        // if (!content && !image) return
        // if (content) {
        //     content = validate.cleanContent(content);
        //     if (!validate.content(content)) return;
        // }
        // if (!validate.token(token)) return;

        // const tokenData = auth.destructToken(token);
        // const user = await app.database.getUser(tokenData.id);
        // if (!user) return;
        // if (user.token != token) return;

        // const id = app.snowflake.nextId();
        // const timestamp = Date.now();
        // const author = await app.database.getUser(user.id)

        // app.database.newMessage({ id, content, author: author.id, channel, timestamp, image });
        // socket.broadcast.emit('message_create', {
        //     id,
        //     content,
        //     author: author.id,
        //     channel,
        //     timestamp,
        //     username: author.username,
        //     image
        // });
        // socket.emit('message_create', {
        //     id,
        //     content,
        //     author: author.id,
        //     channel,
        //     timestamp,
        //     username: author.username,
        //     image
        // });
    });
    socket.on("message_delete", async data => {
        //     let { id, token } = data;
        //     if (!id || !token) return;

        //     if (!validate.id(id)) return;
        //     if (!validate.token(token)) return;

        //     const tokenData = auth.destructToken(token);
        //     const user = await app.database.getUser(tokenData.id);
        //     if (!user) return;
        //     if (user.token != token) return;
        //     const messageData = await app.database.getMessage(id);
        //     if (messageData.author !== tokenData.id) return;
        //     app.database.deleteMessage(id);
        //     socket.broadcast.emit('message_delete', {
        //         id
        //     });
        //     socket.emit('message_delete', {
        //         id
        //     });
        // });
        // socket.on("channel_create", async data => {
        //     let { name, desc, token, server } = data;
        //     if (!token) return;

        //     if (!name && desc && server) return

        //     if (!validate.token(token)) return;
        //     if (!validate.description(desc)) return;

        //     const tokenData = auth.destructToken(token);
        //     const user = await app.database.getUser(tokenData.id);
        //     if (!user) return;
        //     if (user.token != token) return;

        //     const id = app.snowflake.nextId();
        //     const timestamp = Date.now();
        //     const author = user.id;

        //     app.database.newChannel({ id, author, name, desc, server, timestamp });
        //     socket.broadcast.emit('channel_create', {
        //         id,
        //         author,
        //         name,
        //         desc,
        //         server,
        //         timestamp
        //     });
        //     socket.emit('channel_create', {
        //         id,
        //         author,
        //         name,
        //         desc,
        //         server,
        //         timestamp
        //     });
    });
    socket.on("server_create", async data => {
        // let { name, token } = data;
        // if (!token) return;

        // if (!name) return

        // if (!validate.token(token)) return;

        // const tokenData = auth.destructToken(token);
        // const user = await app.database.getUser(tokenData.id);
        // if (!user) return;
        // if (user.token != token) return;

        // const id = app.snowflake.nextId();
        // const timestamp = Date.now();
        // const author = user.id;

        // app.database.newServer({ id, author, name, timestamp });
        // socket.broadcast.emit('server_create', {
        //     id,
        //     author,
        //     name,
        //     timestamp
        // });
        // socket.emit('server_create', {
        //     id,
        //     author,
        //     name,
        //     timestamp
        // });
    });
    socket.on("voice_join", async data => {
        let { token } = data;
        if (!token) return;

        if (!validate.token(token)) return;

        const tokenData = auth.destructToken(token);
        const user = await app.database.getUser(tokenData.id);
        if (!user) return;
        if (user.token != token) return;

        if (!voiceChat.includes(user.id)) voiceChat.push(user.id)

        if (voiceChat.length > 1) {
            const peers = voiceChat.filter(id => id !== user.id)
            socket.emit('call_peers', {
                peers
            });
        }
        console.log(voiceChat)
    });
    // socket.on("update_status", async data => {
    //     let { status, token } = data;
    //     if (!status || !token) return;

    //     if (!status >= 0 && !status > 3) return;
    //     if (!validate.token(token)) return;

    //     const tokenData = auth.destructToken(token);
    //     const user = await app.database.getUser(tokenData.id);
    //     if (!user) return;
    //     if (user.token != token) return;
    //     socket.broadcast.emit('update_status', {
    //         status,
    //         id: user.id
    //     });
    //     socket.emit('update_status', {
    //         status,
    //         id: user.id
    //     });

    // });
    // socket.on("message_edit", async data => {
    //     let { id, token, content } = data;
    //     if (!id || !token) return;

    //     if (!validate.id(id)) return;
    //     if (!validate.token(token)) return;
    //     const tokenData = auth.destructToken(token);
    //     const user = await app.database.getUser(tokenData.id);
    //     if (!user) return;
    //     if (user.token != token) return;
    //     const messageData = await app.database.getMessage(id);
    //     if (messageData.author !== tokenData.id) return;
    // });
}

module.exports = connection;