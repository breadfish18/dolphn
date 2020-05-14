<template>
    <div class="right-panel animated faster">
        <div class="channel-bar"></div>
        <!-- <article class="self">
            <div class="self-text">
                <div class="self-username">{{ username }}</div>
                <div class="self-status">online</div>
            </div>
            <figure class="self-avatar is-48x48">
                <form ref='uploadForm' id='uploadForm' action='http://localhosthttp://localhost/api/uploadavatar' method='post' encType="multipart/form-data">
                <input type="file" id="avatar-up" required accept="image/png, image/jpeg" ref="file" @change="upload" />
                @click="uploadPrompt"
                <img
                    class="avatar-img is-rounded"
                    id="self-avatar"
                    src="http://localhost/assets/avatar.png"
                />
                </form>
            </figure>
        </article>-->
    </div>
</template>

<script>
// const token = localStorage.getItem("token"); 
export default {
    name: "RightPanel",
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

<style>
</style>