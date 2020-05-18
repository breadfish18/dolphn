<template>
    <div class="center-panel" id="test">
        <div class="requests">
            <!-- <span class="la-ball-atom loading">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </span>-->
            <div
                class="request"
                v-for="req in friendRequests"
                v-bind:key="req.id"
                @click="acceptRequest(req.id)"
            >{{req.user.username}}</div>
        </div>
    </div>
</template>

<script>
const token = localStorage.getItem("token");
export default {
    name: "Requests",
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
        friendRequests: function () {
            return this.$store.state.friends.filter(f => f.type === 1);
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
        acceptRequest: function (id) {
            return new Promise((resolve, reject) => {
                fetch(`http://localhost/api/relationships/${id}`, {
                    method: "POST",
                    headers: new Headers({
                        "Content-Type": "application/json",
                        Authorization: token,
                    }),
                    body: JSON.stringify({ type: 2 })
                })
                    .then((res) => res.json()).then(body => {
                        if (body && body.relationship) {
                            return resolve(body.relationship);
                        } else {
                            return reject("Error");
                        }
                    })
                    .catch((e) => reject(e));

            });
        }
    }
}
</script>

<style scoped>
.requests {
    display: flex;
    flex-direction: column;
}
.request {
    height: 32px;
    margin-left: 24px;
}
</style>