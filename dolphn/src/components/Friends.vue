<template>
    <div class="left-panel">
        <div class="server-card">
            <h3 v-if="selectedServer" class="server-name">Friends</h3>
        </div>
        <span @click="$parent.showAddFriendModal = true">
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
        <div v-if="friends" class="channels">
            <div class="channel" @click="$parent.openRequests()">
                <h3>Friend Requests</h3>
            </div>
            <div
                class="channel"
                v-for="friend in addedFriends"
                v-bind:key="friend.id"
                v-bind:class="{ selected: friend.channel === selectedChannelId }"
                @click="$parent.setFriend(friend.channel)"
            >
                <h3>@{{ friend.recipient.username }}</h3>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Friends",
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
        addedFriends: function () {
            return this.$store.state.friends.filter(f => f.type === 2);
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