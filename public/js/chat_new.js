const token = localStorage.getItem("token");
if (!token) window.location.replace("/login");
const id = atob(token).split(".")[0];

let socket = io.connect(window.location.href, {
    transportOptions: {
        polling: {
            extraHeaders: {
                authentication: token
            }
        }
    }
});

const me = new Peer(id, { host: window.location.host, port: 9000, path: "/peer" });

navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

var stream;

Vue.component('Modal', {
    template: '#modal-template',
    props: ['show'],
    methods: {
        close: function () {
            this.$emit('close');
        }
    },
    mounted: function () {
        document.addEventListener("keydown", (e) => {
            if (this.show && e.keyCode == 27) {
                this.close();
            }
        });
    }
});

Vue.component('NewServerModal', {
    template: '#new-server-modal-template',
    props: ['show'],
    data: function () {
        return {
            title: '',
        };
    },
    // watch: {
    //     show: {
    //         handler (val) {
    //             if (val) {

    //             }
    //         }
    //     }
    // },
    methods: {
        close: function () {
            this.$emit('close');
            this.title = '';
        },
        createServer: async function () {
            await app.createServer(this.title)
            this.close();
        }
    }
});

Vue.component('NewChannelModal', {
    template: '#new-channel-modal-template',
    props: ['show'],
    data: function () {
        return {
            title: '',
        };
    },
    // watch: {
    //     show: {
    //         handler (val) {
    //             if (val) {

    //             }
    //         }
    //     }
    // },
    methods: {
        close: function () {
            this.$emit('close');
            this.title = '';
        },
        createChannel: async function () {
            await app.createChannel(this.title, app.selectedServerId)
            this.close();
        }
    }
});

var app = new Vue({
    el: '#app',
    data: {
        username: null,
        servers: null,
        users: null,
        selectedServerId: localStorage.getItem("selectedServerId"),
        selectedChannelId: localStorage.getItem("selectedChannelId"),
        selectedServer: null,
        selectedChannel: null,
        messages: null,
        showNewServerModal: false,
        showNewChannelModal: false
    },
    methods: {
        login: async function () {
            return new Promise(async (resolve, reject) => {
                const body = await fetch("/api/login", {
                    method: "GET",
                    headers: new Headers({
                        "Content-Type": "application/json",
                        "Authorization": token
                    }),
                }).then(res => res.json()).catch(e => reject(e))
                if (body && body.ok) {
                    return resolve(body.username);
                } else {
                    return reject("Error");
                }
            })
        },
        getUsername: async function (id) {
            return new Promise(async (resolve, reject) => {
                const body = await fetch(`/api/users/${id}`, {
                    method: "GET",
                    headers: new Headers({
                        "Content-Type": "application/json",
                        "Authorization": token
                    })
                }).then(res => res.json()).catch(e => reject(e))
                if (body && body.username) {
                    return resolve(body.username);
                } else {
                    return reject("Error");
                }
            })
        },
        getUsers: async function () {
            return new Promise(async (resolve, reject) => {
                const body = await fetch("/api/users", {
                    method: "GET",
                    headers: new Headers({
                        "Content-Type": "application/json",
                        "Authorization": token
                    })
                }).then(res => res.json()).catch(e => reject(e))
                if (body && body.users) {
                    return resolve(body.users);
                } else {
                    return reject("Error");
                }
            })
        },
        getServers: async function () {
            return new Promise(async (resolve, reject) => {
                const body = await fetch("/api/servers", {
                    method: "GET",
                    headers: new Headers({
                        "Content-Type": "application/json",
                        "Authorization": token
                    })
                }).then(res => res.json()).catch(e => reject(e))
                if (body && body.servers) {
                    return resolve(body.servers);
                } else {
                    return reject("Error");
                }
            })
        },
        getMessages: async function (channel) {
            return new Promise(async (resolve, reject) => {
                const body = await fetch(`/api/messages/${channel}`, {
                    method: "GET",
                    headers: new Headers({
                        "Content-Type": "application/json",
                        "Authorization": token
                    })
                }).then(res => res.json()).catch(e => reject(e))
                if (body && body.messages) {
                    return resolve(body.messages);
                } else {
                    return reject("Error");
                }
            })
        },
        getStatus: async function () {
            return new Promise(async (resolve, reject) => {
                const body = await fetch("/api/status", {
                    method: "GET",
                    headers: new Headers({
                        "Content-Type": "application/json",
                        "Authorization": token
                    })
                }).then(res => res.json()).catch(e => reject(e))
                if (body) {
                    return resolve({ online: body.online, offline: body.offline });
                } else {
                    return reject("Error");
                }
            })
        },
        getRelationships: async function () {
            return new Promise(async (resolve, reject) => {
                const body = await fetch("/api/relationships", {
                    method: "GET",
                    headers: new Headers({
                        "Content-Type": "application/json",
                        "Authorization": token
                    })
                }).then(res => res.json()).catch(e => reject(e))
                if (body && body.relationships) {
                    return resolve(body.relationships);
                } else {
                    return reject("Error");
                }
            })
        },
        sendMessage: async function (message) {
            return new Promise(async (resolve, reject) => {
                const body = await fetch(`/api/messages/${message.channel}`, {
                    method: "POST",
                    headers: new Headers({
                        "Content-Type": "application/json",
                        "Authorization": token
                    }),
                    body: JSON.stringify({ content: message.content })
                }).then(res => res.json()).catch(e => reject(e))
                if (body && body.id) {
                    return resolve(body);
                } else {
                    return reject("Error");
                }
            })
        },
        createServer: async function (name) {
            return new Promise(async (resolve, reject) => {
                const body = await fetch(`/api/servers`, {
                    method: "POST",
                    headers: new Headers({
                        "Content-Type": "application/json",
                        "Authorization": token
                    }),
                    body: JSON.stringify({ name })
                }).then(res => res.json()).catch(e => reject(e))
                if (body && body.id) {
                    return resolve(body);
                } else {
                    return reject("Error");
                }
            })
        },
        createChannel: async function (name, server) {
            return new Promise(async (resolve, reject) => {
                const body = await fetch(`/api/servers/${server}/channels`, {
                    method: "POST",
                    headers: new Headers({
                        "Content-Type": "application/json",
                        "Authorization": token
                    }),
                    body: JSON.stringify({ name })
                }).then(res => res.json()).catch(e => reject(e))
                if (body && body.id) {
                    return resolve(body);
                } else {
                    return reject("Error");
                }
            })
        },
        setChannel: async function (channel) {
            localStorage.setItem("selectedChannelId", channel);

            this.selectedChannelId = channel;
            this.selectedChannel = this.servers.find(server => server.id === this.selectedServerId).channels.find(channel => channel.id === this.selectedChannelId)

            this.messages = await this.getMessages(this.selectedChannelId);
        },
        setServer: async function (server) {
            localStorage.setItem("selectedServerId", server);

            this.selectedServerId = server;
            this.selectedServer = this.servers.find(server => server.id === this.selectedServerId)

            this.setChannel(this.selectedServer.channels[0].id)
        },
        playStream: function (stream) {
            let audio = document.createElement("audio");
            audio.autoplay = true;
            document.body.append(audio)
            audio.srcObject = stream;
            // audio.src = (URL || webkitURL || mozURL).createObjectURL(stream);
        },
        getUserMedia: async function () {
            return new Promise(async (resolve, reject) => {
                navigator.getUserMedia({ video: false, audio: true },
                    function success (localAudioStream) {
                        return resolve(localAudioStream)
                    },
                    function error (err) {
                        return reject(err)
                    }
                )
            })
        },
        callPeer: async function (peer) {
            return new Promise(async (resolve, reject) => {
                var outgoing = me.call(peer, stream);
                outgoing.on('stream', function (remoteStream) {
                    return resolve(remoteStream)
                });
            })
        },
        joinVoice: async function () {
            stream = await this.getUserMedia()
            socket.emit("voice_join", {
                token
            });
            socket.on("call_peers", async data => {
                for (let i = 0; i < data.peers.length; i++) {
                    console.log('okay')
                    const peer = data.peers[i];
                    this.playStream(await this.callPeer(peer))
                }
            })
        },
        formatDate: function (date) {
            return moment(date).calendar();
        },
        compiledMarkdown: function (text) {
            return marked(text, { sanitize: true });
        },
        showExtras: function (message) {
            const lastMessage = this.messages[this.messages.indexOf(message) - 1]
            if (!lastMessage) return true
            if ((message.author === lastMessage.author) === false) return true
            if ((message.channel === lastMessage.channel) === false) return true
            return (message.timestamp - lastMessage.timestamp > 60000)
        },
        scroll: function () {
            document.querySelector(".messages").scrollTop = document.querySelector(".messages").scrollHeight
        },
        keypress: function (event) {
            if (event.keyCode == 13 && !event.shiftKey) {
                event.preventDefault()
                const input_message = event.target
                if (input_message.value.trim().length > 0) {
                    this.sendMessage({
                        content: input_message.value,
                        channel: this.selectedChannelId
                    }).then(result => console.log(result));
                    input_message.value = "";
                    input_message.blur();
                } else {
                    input_message.blur();
                }
            }
        }
    },
    updated: function () {
        this.scroll()
    },
    mounted: async function () {
        await this.login().catch(() => {
            localStorage.removeItem("token")
            location.replace("/login")
        })
        this.username = await this.getUsername(id);
        this.servers = await this.getServers();
        console.log(this.servers)
        this.users = await this.getUsers();

        if (!this.selectedServerId) {
            localStorage.setItem("selectedServerId", this.servers[0].id);
            this.selectedServerId = this.servers[0].id;
        }
        if (!this.selectedChannelId) {
            let id = this.servers.find(server => server.id === this.selectedServerId).channels[0].id
            localStorage.setItem("selectedChannelId", id);
            this.selectedChannelId = id;
        }

        this.selectedServer = this.servers.find(server => server.id === this.selectedServerId);
        this.selectedChannel = this.servers.find(server => server.id === this.selectedServerId).channels.find(channel => channel.id === this.selectedChannelId)

        this.messages = await this.getMessages(this.selectedChannelId);
    }
})

socket.on("message_create", async data => {
    console.log("message event")
    if (data.channel === app.selectedChannelId)
        app.messages.push({
            id: data.id,
            timestamp: data.timestamp,
            username: data.username,
            author: data.author,
            content: data.content,
            image: data.image
        });
});
socket.on("channel_create", async data => {
    app.servers.find(s => s.id === data.server).channels.push({
        id: data.id,
        author: data.author,
        name: data.name,
        timestamp: data.timestamp
    })
});
socket.on("server_create", async data => {
    app.servers.push(data)
});
me.on('call', function (incoming) {
    incoming.answer(stream)
    incoming.on('stream', function (remoteStream) {
        app.playStream(remoteStream)
    });
});

document.body.addEventListener("keypress", event => {
    const input_message = document.querySelector(`.type-area`)
    if (event.target !== document.body) return
    if (!document.activeElement === input_message && navigator.userAgent.search("Firefox") !== -1 && event.key.length === 1)
        input_message.value += event.key;
    input_message.focus();
});