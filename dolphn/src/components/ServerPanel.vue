<template>
    <div class="server-panel">
        <div class="server" @click="setFriends">
            <p class="is-48x48">
                <img class="is-rounded" src="http://localhost/assets/friend-panel.svg" />
            </p>
        </div>
        <div class="server-divider"></div>
        <div
            class="server"
            v-for="server in servers"
            v-bind:key="server.id"
            v-bind:class="{ selected: server.id === selectedServerId }"
            @click="setServer(server.id)"
        >
            <p class="is-48x48">
                <img class="is-rounded" src="http://localhost/assets/avatar.png" />
            </p>
        </div>
        <div class="server" @click="$parent.showNewServerModal = true">
            <p class="is-48x48">
                <img class="is-rounded" src="http://localhost/assets/add.svg" />
            </p>
        </div>
        <div class="server-self">
            <span class="status"></span>
            <p class="is-48x48">
                <img class="is-rounded" src="http://localhost/assets/avatar.png" />
            </p>
        </div>
    </div>
</template>

<script>
// const token = localStorage.getItem("token");
// if (!token) window.location.replace("/login");

export default {
    name: "ServerPanel",
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
        },
        active: function () {
            return this.$store.state.active
        }
    },
    methods: {
        setFriends: function () {
            this.$store.commit("setState", { k: "active", v: "friends" })
        },
        setServer: async function (server) {
            if (this.active !== "servers") this.$store.commit("setState", { k: "active", v: "servers" })

            localStorage.setItem("selectedServerId", server);

            this.$store.commit("setState", { k: "selectedServerId", v: server })
            this.$store.commit("setState", { k: "selectedServer", v: this.servers.find((server) => server.id === this.selectedServerId) })

            this.$parent.setChannel(this.selectedServer.channels[0].id);
        },
    }
}
</script>

<style>
</style>