<template>
    <Modal :show="show" @close="close">
        <div class="modal-header">
            <h3>Add a friend</h3>
        </div>
        <div class="modal-body">
            <label class="form-label">
                Username
                <input v-model="title" class="form-control" />
            </label>
        </div>
        <div class="modal-footer text-right">
            <button class="cancel-button" @click="close()">Cancel</button>
            <button class="create-button" @click="createChannel()">Create</button>
        </div>
    </Modal>
</template>

<script>
import Modal from "./Modal.vue";
export default {
    name: "AddFriendModal",
    props: ['show'],
    components: {
        Modal
    },
    data: function () {
        return {
            title: '',
        };
    },
    methods: {
        close: function () {
            this.$emit('close');
            this.title = '';
        },
        createChannel: async function () {
            this.$emit('create', this.title)
            this.close();
        }
    }
}
</script>

<style>
</style>