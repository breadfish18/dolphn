Vue.component('modal', {
    template: '#modal-template'
})
let token = localStorage.getItem("token");
let currentFile;
if (!token) window.location.replace("/login");
let id = atob(token).split(".")[0];
let username;
let cache = {};
let messages;
let drop = new Audio();
drop.src = "/assets/drop.mp3";
axios.defaults.headers.common["Authorization"] = token;
let messagebody = document.querySelector(".messages"); // This is used to control the scroll of the messages.

// let video = document.getElementById("call");

let socket = io.connect(window.location.href, {
    transportOptions: {
        polling: {
            extraHeaders: {
                authentication: token
            }
        }
    }
});

async function getUsername (id) {
    let response = await fetch("/api/getuser", {
        // Load vals
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: id })
    });
    let parsed = await response.json();
    if (parsed.username) {
        return parsed.username;
    } else {
        return;
    }
}
async function getMessages (channel) {
    console.log("getting")
    return new Promise((resolve, reject) => {
        fetch("/api/getmessages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ token, channel })
            })
            .then(function (response) {
                return response.json();
            })
            .then(async parsed => {
                console.log(parsed)
                let messages = parsed.messages;
                if (parsed.messages) {
                    for (let index = 0; index < messages.length; index++) {
                        const message = messages[index];
                        if (!cache[message.author]) {
                            await getUsername(message.author)
                                .then(name => {
                                    cache[message.author] = {
                                        username: name
                                    };
                                    message.ausername = name;
                                })
                                .catch(console.log);
                        } else {
                            message.ausername = cache[message.author].username;
                        }
                    } // Cache usernames & use them
                    resolve(messages);
                } else {
                    reject();
                }
            })
            .catch(console.log);
    });
}
async function getPanel () {
    console.log(token)
    let response = await fetch("/api/getpanel", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ token })
    });

    let parsed = await response.json();
    let online = parsed.online.map(async each => {
        if (!each) return;
        if (!(/^[0-9]{15,25}$/).test(each)) return;
        let name = cache[each] ? cache[each].username : await getUsername(each);
        return { name: name, id: each };
    });
    let offline = parsed.offline.map(async each => {
        if (!each) return;
        if (!(/^[0-9]{15,25}$/).test(each)) return;
        let name = cache[each] ? cache[each].username : await getUsername(each);
        return { name: name, id: each };
    });
    let servers = parsed.servers

    return {
        online: await Promise.all(online),
        offline: await Promise.all(offline),
        servers
    };
}

function init () {
    return new Promise((resolve, reject) => {
        getUsername(id)
            .then(usernameReturned => {
                username = usernameReturned;
                resolve()
            })
            .catch(reject);
    });
}

(async () => {
    await init(); // This initalizes the message history & the logged in user"s info.
    const peer = new Peer(id, { host: window.location.host, port: 9000, path: "/peer" });
    const result = await getPanel();
    const online = Array.from(result.online);
    const offline = Array.from(result.offline);
    const servers = Array.from(result.servers)
    console.log(servers)
    const voicechat = [];
    // CREATE VUE INSTANCE
    const app = new Vue({
        el: "#app",
        data () {
            return {
                messages: [],
                username: username,
                id: id,
                online,
                offline,
                voicechat,
                servers,
                currentServer: servers[0],
                currentChannel: servers[0].channels[0]
            };
        },
        methods: {
            createChannel () {
                const name = document.querySelector(".name-input").value
                const desc = document.querySelector(".desc-input").value
                const server = document.querySelector(".servers-div.is-active").getAttribute("server")

                if (!(name && desc)) return this.closeModal("2")

                socket.emit("channel_create", { name, desc, token, server });
                this.closeModal("2")
            },
            formatDate (date) {
                return moment(date).calendar();
            },
            getDay (date) {
                return moment(date).startOf('day').format("LL")
            },
            imageUrlAlt (event) {
                event.target.src = "/assets/avatar.png";
            },
            getImageUrl: function (avatar_id) {
                return "https://cdn.dolphn.app/avatars/" + avatar_id + ".png" + "?" + new Date().getTime();
            },
            compiledMarkdown: text => {
                return marked(text, { sanitize: true });
            },
            async resolveMessages (server, channel) {
                // if (servers.find(s => s.id === server.id).channels.find(c => c.id === channel.id).messages.length > 0) return
                document.querySelector(".servers-div.is-active div.channel-div.is-active .messages span").classList.add("is-active")
                const messages = await getMessages(channel.id)
                document.querySelector(".servers-div.is-active div.channel-div.is-active .messages span").classList.remove("is-active")
                servers.find(s => s.id === server.id).channels.find(c => c.id === channel.id).messages = messages;
                setTimeout(() => { this.scroll() }, 10)
                console.log("yes am getting")


            },
            setChannel (server, channel) {
                this.currentChannel = server.channels.find(c => c.id === channel)
                // document.querySelector(`.servers-div[server='${server.id}'] div.channel-div.is-active`).classList.remove("is-active")
                // document.querySelector(`.servers-div[server='${server.id}'] div.channels div.selected`).classList.remove("selected")

                // document.querySelector(`.channel[channel='${channel.id}']`).classList.add("selected")
                // document.querySelector(`.channel-div[channel='${channel.id}']`).classList.add("is-active")
                // document.querySelector(`.channel[channel='${channel.id}'] h3`).removeAttribute('unread')
                // this.resolveMessages(server, channel)
                // console.log(document.querySelector(`.channel-name`))
                // document.querySelector(`.channel-name`).innerText = "#" + channel.name
            },
            setServer (server) {
                document.querySelector(".server.selected").classList.remove("selected")
                document.querySelector(".servers-div.is-active").classList.remove("is-active")
                document.querySelector(`.server[server='${server.id}']`).classList.add("selected")
                document.querySelector(`.servers-div[server='${server.id}']`).classList.add("is-active")
                localStorage.setItem("server", server.id);
                // console.log(document.querySelector(`.channel-name`))
                // document.querySelector(`.channel-name`).innerText = "#" + channel.name
            },
            closeModal (i) {
                let modal_darken = document.getElementsByClassName("modal-darken")[0]
                let modal_content = document.getElementById(i)
                modal_darken.classList.replace("fadeIn", "fadeOut")
                modal_content.classList.replace("zoomIn", "zoomOut")

                modal_content.addEventListener(
                    "animationend",
                    () => {
                        modal_content.classList.add("none")
                        modal_content.classList.replace("zoomOut", "zoomIn")
                    }, {
                        once: true
                    }
                );
                modal_darken.addEventListener(
                    "animationend",
                    () => {
                        modal_darken.classList.add("none")
                        modal_darken.classList.replace("fadeOut", "fadeIn")
                    }, {
                        once: true
                    }
                );
            },
            openNew: async function () {
                let modal_darken = document.getElementsByClassName("modal-darken")[0]
                let modal_content = document.getElementById("2")
                modal_content.classList.remove("none")
                modal_darken.classList.remove("none")
            },
            openCall: async function (call, stream) {
                let modal_darken = document.getElementsByClassName("modal-darken")[0]
                let modal_content = document.getElementById("1")
                // let modal = document.getElementsByClassName("modal")[0]
                let answer = document.getElementsByClassName("answer-call")[0]
                let decline = document.getElementsByClassName("decline-call")[0]
                let text = document.querySelector(`.caller > h3:nth-child(2)`)
                let image = document.querySelector(`.is-128x128 > img:nth-child(1)`)
                let id = call.peer;
                let name = cache[id] ? cache[id].username : await getUsername(id);
                text.innerText = name;
                image.src = this.getImageUrl(id)

                // modal.removeAttribute("style")
                // modal.classList.replace("disabled", "enabled")
                modal_content.classList.remove("none")
                modal_darken.classList.remove("none")
                answer.addEventListener(
                    "click",
                    async () => {
                        call.answer(stream);
                        this.closeModal("1")
                    }, {
                        once: true
                    }
                );
                decline.addEventListener(
                    "click",
                    async () => {
                        call.close();
                        this.closeModal("1")
                    }, {
                        once: true
                    }
                );
            },
            upload () {
                let avatar = document.getElementById("avatar-up").files[0];
                let formData = new FormData();
                formData.append("file", avatar);
                axios.post("/api/uploadavatar", formData);
            },
            uploadImg () {
                let img = document.getElementById("image-up").files[0];
                let formData = new FormData();
                formData.append("file", img);
                axios.post("/api/uploadimages", formData).then(r => {
                    socket.emit("message_create", {
                        token: token,
                        content: input_message.value.trim() ? input_message.value : false,
                        image: r.data.imgs,
                        server: document.querySelector(".servers-div.is-active").getAttribute("server"),
                        channel: document.querySelector(".servers-div.is-active div.channel-div.is-active").getAttribute("channel")
                    });
                    input_message.value = "";
                    input_message.blur();
                });
            },
            uploadPrompt () {
                let avatar = document.getElementById("avatar-up");
                avatar.click();
            },
            uploadPromptImg () {
                let img = document.getElementById("image-up");
                img.click();
            },
            scroll () {
                document.querySelector(".servers-div.is-active div.channel-div.is-active .messages").scrollTop = 999999
            },
            showExtras (msg) {
                // const message = messages[messages.indexOf(messages.find(m => m.id === msg))]
                // const lastMessage = messages[messages.indexOf(messages.find(m => m.id === msg)) - 1]
                // if (!lastMessage) return true
                // if ((message.author === lastMessage.author) === false) return true
                // if ((message.channel === lastMessage.channel) === false) return true
                // return (message.timestamp - lastMessage.timestamp > 60000)
                return true
            },
            supporter (id) {
                return id === ""
            },
            developer (id) {
                return id === "113218223129755660"
            },
            keypress (event) {

                if (event.keyCode == 13 && !event.shiftKey) {
                    event.preventDefault()
                    const input_message = event.target
                    if (input_message.value.trim().length > 0) {
                        console.log(document.querySelector(`.servers-div[server='${document.querySelector(".servers-div.is-active").getAttribute("server")}'] div.channel-div.is-active`).getAttribute("channel"))
                        socket.emit("message_create", {
                            token: token,
                            content: input_message.value,
                            image: false,
                            server: document.querySelector(".servers-div.is-active").getAttribute("server"),
                            channel: document.querySelector(".servers-div.is-active div.channel-div.is-active").getAttribute("channel")
                        });
                        input_message.value = "";
                        input_message.blur();

                        document.querySelector(".messages").scrollTop = 999999;

                        // Un focus the message send textbox, don"t worry we auto refocus it when they start typing again
                    } else {
                        input_message.blur();
                    }
                }
            },
            call: function (user) {
                navigator.getUserMedia({ video: false, audio: true },
                    function (stream) {
                        let call = peer.call(user, stream);
                        voicechat.push({ name: username, id: id });
                        call.on("stream", function (remoteStream) {
                            let audio = document.createElement("audio")
                            audio.autoplay = true;
                            document.body.append(audio)
                            audio.srcObject = remoteStream;
                        });
                        call.on("error", function () { console.log("sadly"); });
                        call.on("close", function () {
                            voicechat.splice(
                                voicechat.indexOf(voicechat.find(p => p.id === id)),
                                1
                            );
                        })
                    },
                    function (err) {
                        console.log("Failed to get local stream", err);
                    }
                );
        },
        mounted: () => {}
    });
    peer.on("call", function (call) {
        navigator.getUserMedia({ video: false, audio: true },
            function (stream) {
                app.openCall(call, stream)
                call.on("stream", async function (remoteStream) {
                    let audio = document.createElement("audio")
                    audio.autoplay = true;
                    document.body.append(audio)
                    audio.srcObject = remoteStream;
                });
            },
            function (err) {
                console.log("Failed to get local stream", err);
            }
        );
    });
    // SOCKET IO LISTENERS
    socket.on("message_create", async data => messageCreate(app, data));
    socket.on("message_delete", async data => messageDelete(app, data));
    socket.on("channel_create", async data => channelCreate(app, data));
    socket.on("server_create", async data => serverCreate(app, data));

    socket.on("offline", async data => offlineEvent(app, data));
    socket.on("online", async data => onlineEvent(app, data));
    socket.on("disconnect", () => {
        window.location.replace("/login");
    });
    socket.on("kick", () => {
        window.location.replace("/logged-in");
    });

    // DOM
    let global = document.querySelector("html"); // Global DOM, used for click & keyboard events
    document.body.addEventListener("keypress", event => {
        if (event.target.id === messagebody.id && event.target !== document.querySelector(".name-input") && event.target !== document.querySelector(".desc-input")) {
            const input_message = document.querySelector(`.servers-div.is-active .center-panel .area-container form textarea`)
            if (!(document.activeElement === input_message)) {
                const key = event.shiftKey ? event.code.replace("Key", "") : event.code.replace("Key", "").toLowerCase()
                if (event.code.startsWith("Key")) input_message.value += key;
            }
            input_message.focus();
        }
    });
})();