<template>
    <main id="app">
        <!-- <div id="1" class="modal-content animated zoomIn faster none">
            <div class="caller">
                <p class="is-128x128">
                    <img class="is-rounded" v-bind:src="getImageUrl(id)" @error="imageUrlAlt" v-on:click="call(user.id)">
                </p>
                <h3>Username</h3>
                <h4>is calling you</h4>
            </div>
            <button class="answer-call">Answer</button>
            <button class="decline-call">Decline</button>
        </div>
        <div id="2" class="modal-content animated zoomIn faster none">
            <div class="title">Create a new channel</div>
            <div class="new-descriptor">Channel name</div>
            <input type="text" class="name-input">
            <div class="new-descriptor">Description</div>
            <textarea class="desc-input" rows="2"></textarea>
            <div class="bottom">
                <button class="cancel-button" @click="closeModal('2')">Cancel</button><button class="create-button" @click="createChannel">Create</button>
            </div>
        </div>-->
        <!-- <div class="modal-darken animated fadeIn faster none"></div> -->
        <div class="window-title-bar">
            <h3 class="window-name">DOLPHN</h3>
        </div>
        <div class="wrap">
            <ServerPanel></ServerPanel>
            <NewServerModal
                :show="showNewServerModal"
                @close="showNewServerModal = false"
                @create="createServer"
            ></NewServerModal>
            <NewChannelModal
                :show="showNewChannelModal"
                @close="showNewChannelModal = false"
                @create="createChannel"
            ></NewChannelModal>
            <AddFriendModal
                :show="showAddFriendModal"
                @close="showAddFriendModal = false"
                @create="addFriend"
            ></AddFriendModal>
            <LeftPanel v-if="active === 'servers'"></LeftPanel>
            <Friends v-if="active === 'friends'"></Friends>
            <!-- <div class="top-bar">

            </div>-->
            <CenterPanel></CenterPanel>
            <RightPanel></RightPanel>
        </div>
    </main>
</template>

<script>
import NewServerModal from './NewServerModal.vue';
import NewChannelModal from './NewServerModal.vue';
import AddFriendModal from './AddFriendModal.vue';

import ServerPanel from './ServerPanel.vue';
import LeftPanel from './LeftPanel.vue';
import CenterPanel from './CenterPanel.vue';
import RightPanel from './RightPanel.vue';
import Friends from './Friends.vue';

import io from "socket.io-client";
import Peer from "peerjs";

const token = localStorage.getItem("token");
// if (!token) window.location.replace("/login");
const id = atob(token).split(".")[0];

console.log(id)

let socket = io.connect("http://localhost/chat", {
    transportOptions: {
        polling: {
            extraHeaders: {
                authentication: token,
            },
        },
    },
});

const me = new Peer(id, {
    host: "localhost",
    port: 9000,
    path: "/peer",
});

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

var stream;


export default {
    name: "Chat",
    components: {
        NewServerModal,
        NewChannelModal,
        AddFriendModal,
        ServerPanel,
        LeftPanel,
        CenterPanel,
        RightPanel,
        Friends
    },
    data() {
        return {
            showNewServerModal: false,
            showNewChannelModal: false,
            showAddFriendModal: false
        };
    },
    computed: {
        username: function () {
            return this.$store.state.username;
        },
        servers: function () {
            return this.$store.state.servers;
        },
        friends: function () {
            return this.$store.state.friends;
        },
        users: function () {
            return this.$store.state.users;
        },
        messages: function () {
            return this.$store.state.messages;
        },
        selectedServerId: function () {
            return this.$store.state.selectedServerId;
        },
        selectedChannelId: function () {
            return this.$store.state.selectedChannelId;
        },
        selectedServer: function () {
            return this.$store.state.selectedServer;
        },
        selectedChannel: function () {
            return this.$store.state.selectedChannel;
        },
        active: function () {
            return this.$store.state.active;
        }
    },
    methods: {
        login: async function () {
            return new Promise((resolve, reject) => {
                fetch("http://localhost/api/login", {
                    method: "GET",
                    headers: new Headers({
                        "Content-Type": "application/json",
                        Authorization: token,
                    }),
                })
                    .then((res) => res.json()).then(body => {
                        if (body && body.ok) {
                            return resolve(body.username);
                        } else {
                            return reject("Error");
                        }
                    })
                    .catch((e) => reject(e));
            });
        },
        getUsername: async function (id) {
            return new Promise((resolve, reject) => {
                fetch(`http://localhost/api/users/${id}`, {
                    method: "GET",
                    headers: new Headers({
                        "Content-Type": "application/json",
                        Authorization: token,
                    }),
                })
                    .then((res) => res.json()).then(body => {
                        if (body && body.username) {
                            return resolve(body.username);
                        } else {
                            return reject("Error");
                        }
                    })
                    .catch((e) => reject(e));
            });
        },
        getUsers: async function () {
            return new Promise((resolve, reject) => {
                fetch("http://localhost/api/users", {
                    method: "GET",
                    headers: new Headers({
                        "Content-Type": "application/json",
                        Authorization: token,
                    }),
                })
                    .then((res) => res.json()).then(body => {
                        if (body && body.users) {
                            return resolve(body.users);
                        } else {
                            return reject("Error");
                        }
                    })
                    .catch((e) => reject(e));
            });
        },
        getServers: async function () {
            return new Promise((resolve, reject) => {
                fetch("http://localhost/api/servers", {
                    method: "GET",
                    headers: new Headers({
                        "Content-Type": "application/json",
                        Authorization: token,
                    }),
                })
                    .then((res) => res.json()).then(body => {
                        if (body && body.servers) {
                            return resolve(body.servers);
                        } else {
                            return reject("Error");
                        }
                    })
                    .catch((e) => reject(e));
            });
        },
        getFriends: async function () {
            return new Promise((resolve, reject) => {
                fetch("http://localhost/api/relationships", {
                    method: "GET",
                    headers: new Headers({
                        "Content-Type": "application/json",
                        Authorization: token,
                    }),
                })
                    .then((res) => res.json()).then(body => {
                        if (body && body.relationships) {
                            return resolve(body.relationships);
                        } else {
                            return reject("Error");
                        }
                    })
                    .catch((e) => reject(e));
            });
        },
        getMessages: async function (channel) {
            return new Promise((resolve, reject) => {
                fetch(`http://localhost/api/messages/${channel}`, {
                    method: "GET",
                    headers: new Headers({
                        "Content-Type": "application/json",
                        Authorization: token,
                    }),
                })
                    .then((res) => res.json()).then(body => {
                        if (body && body.messages) {
                            return resolve(body.messages);
                        } else {
                            return reject("Error");
                        }
                    })
                    .catch((e) => reject(e));

            });
        },
        getStatus: async function () {
            return new Promise((resolve, reject) => {
                fetch("http://localhost/api/status", {
                    method: "GET",
                    headers: new Headers({
                        "Content-Type": "application/json",
                        Authorization: token,
                    }),
                })
                    .then((res) => res.json()).then(body => {
                        if (body) {
                            return resolve({ online: body.online, offline: body.offline });
                        } else {
                            return reject("Error");
                        }
                    })
                    .catch((e) => reject(e));

            });
        },
        getRelationships: async function () {
            return new Promise((resolve, reject) => {
                fetch("http://localhost/api/relationships", {
                    method: "GET",
                    headers: new Headers({
                        "Content-Type": "application/json",
                        Authorization: token,
                    }),
                })
                    .then((res) => res.json()).then(body => {
                        if (body && body.relationships) {
                            return resolve(body.relationships);
                        } else {
                            return reject("Error");
                        }
                    })
                    .catch((e) => reject(e));

            });
        },
        sendMessage: async function (message) {
            return new Promise((resolve, reject) => {
                fetch(`http://localhost/api/messages/${message.channel}`, {
                    method: "POST",
                    headers: new Headers({
                        "Content-Type": "application/json",
                        Authorization: token,
                    }),
                    body: JSON.stringify({ content: message.content }),
                })
                    .then((res) => res.json()).then(body => {
                        if (body && body.id) {
                            return resolve(body);
                        } else {
                            return reject("Error");
                        }
                    })
                    .catch((e) => reject(e));
            });
        },
        createServer: async function (name) {
            return new Promise((resolve, reject) => {
                fetch(`http://localhost/api/servers`, {
                    method: "POST",
                    headers: new Headers({
                        "Content-Type": "application/json",
                        Authorization: token,
                    }),
                    body: JSON.stringify({ name }),
                })
                    .then((res) => res.json()).then(body => {
                        if (body && body.id) {
                            return resolve(body);
                        } else {
                            return reject("Error");
                        }
                    })
                    .catch((e) => reject(e));

            });
        },
        createChannel: async function (name, server) {
            return new Promise((resolve, reject) => {
                fetch(`http://localhost/api/servers/${server}/channels`, {
                    method: "POST",
                    headers: new Headers({
                        "Content-Type": "application/json",
                        Authorization: token,
                    }),
                    body: JSON.stringify({ name }),
                })
                    .then((res) => res.json()).then(body => {
                        if (body && body.id) {
                            return resolve(body);
                        } else {
                            return reject("Error");
                        }
                    })
                    .catch((e) => reject(e));
            });
        },
        addFriend: async function (name, server) {
            return new Promise((resolve, reject) => {
                fetch(`http://localhost/api/servers/${server}/channels`, {
                    method: "POST",
                    headers: new Headers({
                        "Content-Type": "application/json",
                        Authorization: token,
                    }),
                    body: JSON.stringify({ name }),
                })
                    .then((res) => res.json()).then(body => {
                        if (body && body.id) {
                            return resolve(body);
                        } else {
                            return reject("Error");
                        }
                    })
                    .catch((e) => reject(e));
            });
        },
        setChannel: async function (channel) {
            localStorage.setItem("selectedChannelId", channel);

            this.$store.commit("setState", { k: "selectedChannelId", v: channel })

            this.$store.commit("setState", { k: "selectedChannel", v: this.selectedServer.channels.find((channel) => channel.id === this.selectedChannelId) })
            this.$store.commit("setState", { k: "messages", v: await this.getMessages(this.selectedChannelId) })
        },
        setFriend: async function (channel) {
            localStorage.setItem("selectedChannelId", channel);

            this.$store.commit("setState", { k: "selectedChannelId", v: channel })

            this.$store.commit("setState", { k: "selectedChannel", v: this.friends.find((f) => f.channel === this.selectedChannelId) })
            this.$store.commit("setState", { k: "messages", v: await this.getMessages(this.selectedChannelId) })
        },
        playStream: function (stream) {
            let audio = document.createElement("audio");
            audio.autoplay = true;
            document.body.append(audio);
            audio.srcObject = stream;
            // audio.src = (URL || webkitURL || mozURL).createObjectURL(stream);
        },
        getUserMedia: async function () {
            return new Promise((resolve, reject) => {
                navigator.getUserMedia(
                    { video: false, audio: true },
                    function success(localAudioStream) {
                        return resolve(localAudioStream);
                    },
                    function error(err) {
                        return reject(err);
                    }
                );
            });
        },
        callPeer: async function (peer) {
            return new Promise(resolve => {
                var outgoing = me.call(peer, stream);
                outgoing.on("stream", function (remoteStream) {
                    return resolve(remoteStream);
                });
            });
        },
        joinVoice: async function () {
            stream = await this.getUserMedia();
            socket.emit("voice_join", {
                token,
            });
            socket.on("call_peers", async (data) => {
                for (let i = 0; i < data.peers.length; i++) {
                    console.log("okay");
                    const peer = data.peers[i];
                    this.playStream(await this.callPeer(peer));
                }
            });
        },
        scroll: function () {
            document.querySelector(".messages").scrollTop = document.querySelector(".messages").scrollHeight;
        },
    },
    updated: function () {
        this.scroll();
    },
    mounted: async function () {
        await this.login().catch(() => {
            // localStorage.removeItem("token");
            // location.replace("/login");
        });
        this.$store.commit("setState", { k: "username", v: await this.getUsername(id) })
        this.$store.commit("setState", { k: "servers", v: await this.getServers() })
        this.$store.commit("setState", { k: "friends", v: await this.getFriends() })

        console.log(this.friends)
        if (!this.selectedServerId) {
            localStorage.setItem("selectedServerId", this.servers[0].id);
            this.$store.commit("setState", { k: "selectedServerId", v: await this.servers[0].id })
        }
        if (!this.selectedChannelId) {
            let id = this.servers.find((server) => server.id === this.selectedServerId).channels[0].id;
            localStorage.setItem("selectedChannelId", id);
            this.$store.commit("setState", { k: "selectedChannelId", v: id })
        }
        this.$store.commit("setState", { k: "selectedServer", v: this.servers.find((server) => server.id === this.selectedServerId) })

        this.$store.commit("setState", { k: "selectedChannel", v: this.selectedServer.channels.find((channel) => channel.id === this.selectedChannelId) })

        this.$store.commit("setState", { k: "messages", v: await this.getMessages(this.selectedChannelId) })

        socket.on("message_create", async data => {
            console.log("message event")
            if (data.channel === this.selectedChannelId)
                this.messages.push({
                    id: data.id,
                    timestamp: data.timestamp,
                    username: data.username,
                    author: data.author,
                    content: data.content,
                    image: data.image
                });
        });
        socket.on("channel_create", async data => {
            this.servers.find(s => s.id === data.server).channels.push({
                id: data.id,
                author: data.author,
                name: data.name,
                timestamp: data.timestamp
            })
        });
        socket.on("server_create", async data => {
            this.servers.push(data)
        });
        me.on('call', function (incoming) {
            incoming.answer(stream)
            incoming.on('stream', function (remoteStream) {
                this.playStream(remoteStream)
            });
        });

        document.body.addEventListener("keypress", event => {
            const input_message = document.querySelector(`.type-area`)
            if (event.target !== document.body) return
            if (!document.activeElement === input_message && navigator.userAgent.search("Firefox") !== -1 && event.key.length === 1)
                input_message.value += event.key;
            input_message.focus();
        });
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
