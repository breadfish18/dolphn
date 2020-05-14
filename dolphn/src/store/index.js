import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        username: null,
        servers: null,
        friends: null,
        users: null,
        selectedServerId: localStorage.getItem("selectedServerId"),
        selectedChannelId: localStorage.getItem("selectedChannelId"),
        selectedServer: null,
        selectedChannel: null,
        messages: null,
        active: "friends"
    },
    mutations: {
        setState (state, { k, v }) {
            state[k] = v
        }
    },
    actions: {},
    modules: {}
})