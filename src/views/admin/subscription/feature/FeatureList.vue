<template>
    <div class="card">
        <div class="card-header border-0">
            <div class="row">
                <div class="col-6">
                    <h3 class="mb-0">Features</h3>
                </div>
                <div class="col-6 text-right">
                    <el-tooltip content="Add New Feature" placement="top">
                        <base-button type="primary" icon size="sm" @click.prevent="isActive = true">
                                <span class="btn-inner--icon">
                                    <i class="fas fa-plus"></i>
                                </span>
                            <span class="btn-inner--text">Add</span>
                        </base-button>
                    </el-tooltip>
                </div>
            </div>
            <create-feature-form
                    :is-active.sync="isActive"
                    :form.sync="form"
                    :is-update.sync="isUpdate"
                    :current-entity="isUpdate ? currentFeature : null"
                    @created="entityCreated($event)"
                    @updated="entityUpdated($event)"
            ></create-feature-form>
        </div>
        <el-table
                class="table-responsive align-items-center table-flush table-striped"
                header-row-class-name="thead-light"
                v-loading="loading"
                :data="features"
        >
            <el-table-column label="Title" min-width="250px" prop="label" sortable>
                <template v-slot="{row}">
                    <b>{{row.title}}</b>
                </template>
            </el-table-column>
            <el-table-column label="created at" min-width="250px" prop="label" sortable>
                <template v-slot="{row}">
                    <b>{{row.created_at | datetime('ll')}}</b>
                </template>
            </el-table-column>
            <el-table-column min-width="250" align="center">
                <div slot-scope="{row}" class="table-actions">
                    <el-tooltip content="Update Feature" placement="top">
                        <a
                                href="#!"
                                @click.prevent="onEdit(row)"
                                class="table-action"
                                data-toggle="tooltip"
                                data-original-title="Edit feature"
                        >
                            <i class="fas fa-edit"></i>
                        </a>
                    </el-tooltip>
                    <el-tooltip content="Delete" placement="top">
                        <a
                                href="#!"
                                @click.prevent="showDeleteModal = true, currentFeature = row"
                                class="table-action table-action-delete"
                                data-toggle="tooltip"
                                data-original-title="Delete feature"
                        >
                            <i class="fas fa-trash"></i>
                        </a>
                    </el-tooltip>
                </div>
            </el-table-column>
        </el-table>
        <base-pagination
                class="mt-3"
                v-if="features.length > 0"
                v-model="features.currentPage"
                :perPage="features.entityPerPage"
                :total="features.totalEntity"
                align="center"
                :disabled="loading"
        ></base-pagination>

        <!--        Feature Delete Modal-->

        <modal :show.sync="showDeleteModal">
            <template>
                <h5 class="modal-title" id="exampleModalLabel1">Are you sure you want to delete this ? </h5>
            </template>
            <template slot="footer">
                <base-button type="secondary" @click="showDeleteModal = false">Close</base-button>
                <base-button type="danger" @click.prevent="deleteFeature">Delete</base-button>
            </template>
        </modal>

        <!--        End Feature Delete Modal     -->
    </div>
</template>
<script lang="ts">
    import {Component, Mixins, Watch} from "vue-property-decorator";
    import{
        Table,
        TableColumn,
        DropdownMenu,
        DropdownItem,
        Dropdown,
        Tooltip,
    } from "element-ui";
    import PaginationComponentMixin from "@/mixins/PaginationComponent";
    import Feature from "@/intefaces/Feature";
    import CreateFeatureForm from "@/views/admin/subscription/feature/CreateFeatureForm.vue"

    @Component({
        components: {
            [Tooltip.name]: Tooltip,
            [Table.name]: Table,
            [TableColumn.name]: TableColumn,
            [Dropdown.name]: Dropdown,
            [DropdownItem.name]: DropdownItem,
            [DropdownMenu.name]: DropdownMenu,
            CreateFeatureForm
        }
    })
    export default class FeatureList extends Mixins(PaginationComponentMixin){
        // Variable section +++
        private features: Feature[] = [];
        private showDeleteModal = false;
        private currentFeature!: Feature;
        private isActive: boolean = false;
        private isUpdate: boolean = false;
        private form = {
            title: ''
        }
        // Variable section ---

        //method +++
        deleteFeature(){
            this.$http.delete(this.$landLordApi(`/features/${this.currentFeature.id}`)).then(response =>{
                this.showDeleteModal = false;
                this.features.splice(this.features.findIndex(feature => feature.id == this.currentFeature.id),1);
                this.$notify({
                    title: 'Success',
                    message: 'Successfully Deleted',
                    duration: 5000,
                    iconClass: 'ni ni-bell-55',
                    type: 'success'
                });
            })
        }

        save(){
            alert(1);
        }

        entityCreated(entity: Feature){
            this.features.unshift(entity);
        }

        entityUpdated(entity: Feature){
            this.features.splice(this.features.findIndex(feature => feature.id == entity.id),1, entity);
        }

        onEdit(row: Feature){
            this.isUpdate = true;
            this.currentFeature = row;
            this.form = {
                title: this.currentFeature.title
            };
            this.isActive = true;
        }
        //method --

        // Watcher +++
        @Watch('pagination.currentPage')
        fetchFeatures(){
           this.loading = true;
           this.$http.get(this.$landLordApi(`/features?page=${this.pagination.currentPage}`))
             .then(response => {
                this.features = response.data.features;
                this.setPagination(response.data);
                this.loading = false;
             })
        }
        // Watcher ---

        // Lifecycle hooks +++
        created(){
            this.fetchFeatures();
        }
        // Lifecycle hooks ---
    }
</script>
