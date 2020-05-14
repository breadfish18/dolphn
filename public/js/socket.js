async function messageCreate (app, data) {
    if (!cache[data.author]) {
        let name = await getUsername(data.author);
        cache[data.author] = { id: data.author, username: name };
    }
    console.log(app.servers)

    app.servers.find(s => s.id === data.server).channels.find(c => c.id === data.channel).messages.push({
        id: data.id,
        timestamp: data.timestamp,
        ausername: cache[data.author].username,
        author: data.author,
        content: data.content,
        image: data.image
    });
    setTimeout(() => {
        app.scroll()
    }, 25);
    let name = document.querySelector(`.servers-div.is-active .left-panel .channels .channel[channel='${data.channel}'] h3`)
    if (!document.querySelector(`.channel[channel='${data.channel}']`).classList.contains("selected")) name.getAttribute('unread') ? name.setAttribute('unread', (~~name.getAttribute('unread') + 1).toString()) : name.setAttribute('unread', "1")

    if (data.author !== id && document.hidden) {
        drop.play();
    }
}

function messageDelete (app, data) {
    app.messages.splice(
        app.messages.indexOf(app.messages.find(message => message.id === data.id)),
        1
    );
}

async function channelCreate (app, data) {
    console.log(data)
    app.servers.find(s => s.id === data.server).channels.push({
        id: data.id,
        name: data.name
    });
}
async function serverCreate (app, data) {
    app.servers.push({
        id: data.id,
        name: data.name
    });
}
async function offlineEvent (app, data) {
    if (!cache[data.id]) {
        let name = await getUsername(data.id);
        cache[data.id] = { id: data.id, username: name };
    }
    if (data.id !== id && !app.offline.find(user => user.id === data.id)) {
        const index = app.online.indexOf(app.online.find(user => user.id === data.id))
        if (index !== -1) app.online.splice(index, 1);
        app.offline.push({ id: data.id, name: cache[data.id].username });
    }
}
async function onlineEvent (app, data) {
    if (!cache[data.id]) {
        let name = await getUsername(data.id);
        cache[data.id] = { id: data.id, username: name };
    }
    if (data.id !== id && !app.online.find(user => user.id === data.id)) {
        const index = app.offline.indexOf(app.offline.find(user => user.id === data.id))
        if (index !== -1) app.offline.splice(index, 1);
        app.online.push({ id: data.id, name: cache[data.id].username });
    }
}