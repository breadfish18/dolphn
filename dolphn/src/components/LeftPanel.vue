<template>
    <div class="left-panel">
        <div class="server-card">
            <h3 v-if="selectedServer" class="server-name">{{ selectedServer.name }}</h3>
        </div>
        <div>
            <h3 class="friends-name">Channels</h3>
            <span @click="showNewChannelModal = true">
                <svg
                    class="plus"
                    fill="none"
                    stroke="white"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <line x1="12" x2="12" y1="5" y2="19" />
                    <line x1="5" x2="19" y1="12" y2="12" />
                </svg>
            </span>
        </div>
        <div v-if="selectedServer" class="channels">
            <div
                class="channel"
                v-for="channel in selectedServer.channels"
                v-bind:key="channel.id"
                v-bind:class="{ selected: channel.id === selectedChannelId }"
                @click="$parent.setChannel(channel.id)"
            >
                <h3>#{{ channel.name }}</h3>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "LeftPanel",
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
    }
}
</script>

<style scoped>
</style>