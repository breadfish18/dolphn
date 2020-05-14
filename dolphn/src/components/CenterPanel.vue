<template>
    <div class="center-panel" id="test">
        <div
            v-if="selectedChannel"
            class="channel-bar"
        >{{ selectedChannel.name || selectedChannel.username }}</div>
        <div class="messages">
            <span class="la-ball-atom loading">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </span>
            <div class="message-container" v-for="message in messages" v-bind:key="message.id">
                <!-- <div v-if="showExtras(message)" class="messages-divider"></div> -->
                <!-- v-if="showExtras(message.id) && currentChannel.messages[0].id !== message.id" -->
                <!-- v-bind:class="{ 'no-extra': !showExtras(message.id) }" -->
                <article
                    v-bind:message-id="message.id"
                    class="message"
                    v-bind:class="{ 'no-extra': !showExtras(message) }"
                >
                    <figure class="message-avatar" v-if="showExtras(message)">
                        <p class="is-40x40">
                            <img class="is-rounded" src="http://localhost/assets/avatar.png" />
                        </p>
                    </figure>
                    <div class="message-content">
                        <div
                            class="message-username"
                            v-if="showExtras(message)"
                        >{{ message.username || "Deleted User" }}</div>
                        <div
                            class="timestamp"
                            v-if="showExtras(message)"
                            v-text="formatDate(message.timestamp)"
                        ></div>
                        <div
                            class="message-text"
                            v-if="message.content"
                            v-html="compiledMarkdown(message.content)"
                        ></div>
                        <br v-if="!message.content" />
                        <iframe
                            class="message-video"
                            v-if="
                    /(http\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/.test(message.content) &&
                      !message.image
                  "
                            width="460"
                            height="258"
                            v-bind:src="
                    'http://www.youtube-nocookie.com/embed/' +
                      message.content
                        .split('/')
                        .pop()
                        .replace('watch?v=', '') +
                      '?modestbranding=1&showinfo=0&rel=0&color=white'
                  "
                            frameborder="0"
                            allow="accelerometer; autoplay; gyroscope; picture-in-picture"
                            allowfullscreen
                        ></iframe>
                        <img
                            v-if="message.image"
                            v-bind:src="'https://cdn.dolphn.app/messages/' + message.image"
                            v-on:load="scroll"
                            class="message-image"
                        />
                    </div>
                </article>
            </div>
        </div>
        <!-- <div class="area-divider"></div> -->
        <div class="area-container">
            <!-- <form ref='uploadForm' id='uploadForm' action='http://localhosthttp://localhost/api/uploadimages' method='post' encType="multipart/form-data"> -->
            <!-- <input type="file" id="image-up" required accept="image/png, image/jpeg" ref="file" @change="uploadImg" /> -->
            <svg
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <ellipse
                    cx="12.1853"
                    cy="12"
                    rx="12.0855"
                    ry="12"
                    fill="#18A0FB"
                    fill-opacity="0.85"
                />
                <rect x="11.1781" y="5" width="2.01425" height="14" rx="1.00713" fill="#2D3345" />
                <rect
                    x="5.13538"
                    y="13"
                    width="2"
                    height="14.0998"
                    rx="1"
                    transform="rotate(-90 5.13538 13)"
                    fill="#2D3345"
                />
            </svg>

            <textarea
                type="text"
                rows="1"
                @keypress="keypress"
                class="type-area"
                placeholder="Send a message"
            ></textarea>
        </div>
    </div>
</template>

<script>
// const token = localStorage.getItem("token");
import moment from "moment";
import marked from "marked";

export default {
    name: "CenterPanel",
    computed: {
        username: function () {
            return this.$store.state.username;
        },
        servers: function () {
            return this.$store.state.servers;
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
        }
    },
    methods: {
        keypress: function (event) {
            if (event.keyCode == 13 && !event.shiftKey) {
                event.preventDefault();
                const input_message = event.target;
                if (input_message.value.trim().length > 0) {
                    this.$parent.sendMessage({
                        content: input_message.value,
                        channel: this.selectedChannelId,
                    }).then((result) => console.log(result));
                    input_message.value = "";
                    input_message.blur();
                } else {
                    input_message.blur();
                }
            }
        },
        formatDate: function (date) {
            return moment(date).calendar();
        },
        compiledMarkdown: function (text) {
            return marked(text, { sanitize: true });
        },
        showExtras: function (message) {
            const lastMessage = this.messages[this.messages.indexOf(message) - 1];
            if (!lastMessage) return true;
            if ((message.author === lastMessage.author) === false) return true;
            if ((message.channel === lastMessage.channel) === false) return true;
            return message.timestamp - lastMessage.timestamp > 60000;
        },
    }
}
</script>

<style>
</style>