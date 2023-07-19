<template>
    <modal :show="showUserAclList" @close="close" size="lg">
        <template slot="header">
            <h5 class="modal-title" id="exampleModalLabel">Roles & Permissions</h5>
        </template>
        <div class="row section">
            <div class="col-md-6">
                <h4 class="hr">Roles</h4><br>
                <b v-if="this.currentUser.roles == ''">None</b>
                <ul class="list">
                    <li class="list-item" v-for="role in this.currentUser.roles" :key="role.id">{{role.name}}</li>
                </ul>
            </div>
            <div class="divider"></div>
            <div class="col-md-5">
                <h4 class="hr">Permissions</h4><br>
                <b v-if="this.currentUser.permissions == ''">None</b>
                <ul class="list">
                    <li class="list-item" v-for="permission in this.currentUser.permissions" :key="permission.id">{{_.startCase(permission.name.replace(/([A-Z])/g, ' $1').trim())}}</li>
                </ul>
            </div>
        </div>
        <template slot="footer">
            <base-button type="secondary" @click="close">Close</base-button>
        </template>
    </modal>
</template>
<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    @Component({
        name: 'CreateRole'
    })
    export default class ViewUserAcl extends Vue{
        @Prop() showUserAclList!: boolean;
        @Prop() currentUser!: any;

        close(){
            this.$emit('update:showUserAclList', false);
        }
    }
</script>
<style>
    .divider {
        width: 1px;
        margin: 6px 0;
        background: black;
    }
    .section{
        display: flex;
    }
    .hr {
        display: inline-block;
    }
    .hr:after {
        content: '';
        display: block;
        border-top: 1px solid black;
        margin-top: 0.5em;
    }
</style>
