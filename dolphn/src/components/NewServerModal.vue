<template>
    <Modal :show="show" @close="close">
        <div class="modal-header">
            <h3>Create a new server</h3>
        </div>
        <div class="modal-body">
            <label class="form-label">
                Server name
                <input v-model="title" class="form-control" />
            </label>
        </div>
        <div class="modal-footer text-right">
            <button class="cancel-button" @click="close()">Cancel</button>
            <button class="create-button" @click="createServer()">Create</button>
        </div>
    </Modal>
</template>

<script>
import Modal from "./Modal.vue";
export default {
    name: "NewServerModal",
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
        createServer: async function () {
            this.$emit('create', this.title)
            // await app.createServer(this.title)
            this.close();
        }
    }
}
</script>

<style>
</style>