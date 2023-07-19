<template>
    <div class="card">
        <div class="card-header border-0">
            <div class="row">
                <div class="col-6">
                    <h3 class="mb-0">Subscribers</h3>
                </div>
            </div>
        </div>
        <el-table
                class="table-responsive align-items-center table-flush table-striped"
                header-row-class-name="thead-light"
                v-loading="loading"
                :data="orgs"
        >
            <el-table-column label="Org" min-width="120px" prop="name" sortable>
                <template v-slot="{row}">
                    <b>{{row.name}}</b>
                </template>
            </el-table-column>
            <el-table-column label="Package" min-width="120px" prop="subscriptions" sortable>
                <template v-slot="{row}">
                    <b v-if="row.subscriptions != ''">{{row.subscriptions[0].scheme_meta.package.name}} ({{row.subscriptions[0].scheme_meta.cycle}} month(s))</b>
                </template>
            </el-table-column>
            <el-table-column min-width="80" align="center">
                <div slot-scope="{row}" class="table-actions">
                    <el-tooltip content="View Org Package List" placement="top">
                        <a
                                href="#!"
                                @click.prevent="currentOrg = row, isActive = true"
                                class="table-action"
                                data-toggle="tooltip"
                                data-original-title="Edit feature"
                        >
                            <i class="fas fa-eye"></i>
                        </a>
                    </el-tooltip>
                </div>
            </el-table-column>
        </el-table>
        <base-pagination
                class="mt-3"
                v-if="orgs.length > 0"
                v-model="pagination.currentPage"
                :perPage="pagination.entityPerPage"
                :total="pagination.totalEntity"
                align="center"
                :disabled="loading"
        ></base-pagination>
        <view-list-of-subscription
                :is-active.sync="isActive"
                :current-org="currentOrg"
        ></view-list-of-subscription>
    </div>
</template>
<script lang="ts">
    import {Vue, Component, Mixins, Watch} from 'vue-property-decorator';
    import { Dropdown, DropdownItem, DropdownMenu, Table, TableColumn, Tooltip, Tag } from 'element-ui';
    import PaginationComponentMixin from "@/mixins/PaginationComponent";
    import ViewListOfSubscription from "@/views/admin/subscription/subscriber/ViewListOfSubscription.vue";
    @Component({
        components: {
            [Tooltip.name]: Tooltip,
            [Table.name]: Table,
            [TableColumn.name]: TableColumn,
            [Dropdown.name]: Dropdown,
            [DropdownItem.name]: DropdownItem,
            [DropdownMenu.name]: DropdownMenu,
            [Tag.name]: Tag,
            ViewListOfSubscription
        }
    })
    export default class SubscriberList extends Mixins(PaginationComponentMixin){
        private orgs: any = [];
        private currentOrg: any = [];
        private isActive: boolean = false;

        @Watch('pagination.currentPage')
        fetchSubscriber(){
            this.loading = true;
            this.$http.get(this.$landLordApi(`/orgs?page=${this.pagination.currentPage}`)).then(response => {
                this.orgs = response.data.orgs;
                this.setPagination(response.data);
                this.loading = false;
            })
        }

        created(){
            this.fetchSubscriber();
        }
    }
</script>
