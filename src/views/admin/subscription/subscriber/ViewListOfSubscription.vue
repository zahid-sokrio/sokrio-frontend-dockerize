<template>
    <modal :show="isActive" @close="close">
        <template slot="header">
            <h5 class="modal-title">Subscriptions History </h5>
        </template>
        <div >
            <ul class="list-group list-group-flush" data-toggle="checklist">
                <li class="list-group-item px-0" v-for="(subscription, index) in subscriptions" :key="index">
                    <el-tooltip :disabled="index !== 0" content="Current Subscription" placement="left">
                        <div class="checklist-item" :class="`${index == 0 && pagination.currentPage == 1 ? 'checklist-item-info' : 'checklist-item-warning'}`">
                            <div class="checklist-info">
                                <h5 class="checklist-title mb-0">{{subscription.scheme_meta.package.name}} ({{ subscription.scheme_meta.cycle.toString().toUpperCase() }} month(s))</h5>
                                <small>No. of User: {{ subscription.user_quota }}</small>
                                <br />
                                <small>Subscribes At : {{ subscription.created_at | datetime('ll') }}</small>
                            </div>
                            <div>
                                <i v-if="index == 0 && pagination.currentPage == 1" class="ni ni-check-bold text-info"></i>
                            </div>
                        </div>
                    </el-tooltip>
                </li>
            </ul>
        </div>
        <div class="mt-2">
            <base-pagination
                    v-model="pagination.currentPage"
                    :perPage="pagination.perPage"
                    :total="pagination.total"
                    align="center"
                    @input="fetchSubscription"
            ></base-pagination>
        </div>
        <template slot="footer">
            <base-button type="secondary" @click="close">Close</base-button>
        </template>
    </modal>
</template>
<script lang="ts">
    import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
    import {Dropdown, DropdownItem, DropdownMenu, Table, TableColumn, Tag, Tooltip} from "element-ui";
    @Component({
        components: {
            [Tooltip.name]: Tooltip,
            [Table.name]: Table,
            [TableColumn.name]: TableColumn,
            [Dropdown.name]: Dropdown,
            [DropdownItem.name]: DropdownItem,
            [DropdownMenu.name]: DropdownMenu,
            [Tag.name]: Tag
        }
    })
    export default class ViewListOfSubscription extends Vue{
        @Prop() isActive!: boolean;
        @Prop() currentOrg!: any;
        private subscriptions: any = [];
        private pagination = {
            currentPage: 1,
            total: 0,
            perPage: 0
        };

        @Watch('isActive')
        fetchSubscription(){
            let isFirstPage = this.pagination.currentPage < 2;
            let url = isFirstPage
                ? `/orgs/${this.currentOrg.id}/subscriptions`
                : `/orgs/${this.currentOrg.id}/subscriptions?page=${this.pagination.currentPage}`;
            this.$http.get(this.$landLordApi(url)).then(response => {
                this.subscriptions = response.data.subscriptions;
                this.pagination.total = response.data.total;
                this.pagination.perPage = response.data.per_page;
            })
        }

        close(){
            this.$emit('update:isActive', false);
        }
    }
</script>
