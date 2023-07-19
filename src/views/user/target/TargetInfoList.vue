<template>
<div class="card">
    <div class="card-header border-0">
        <div class="row">
            <div class="col-6">
                <div class="form-inline">
                    <h3 class="mb-0">Base Targets</h3>
                    <el-tooltip class="ml-3" content="Manage target for sales representative, to increase their work efficiency" placement="right">
                        <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
                    </el-tooltip>
                    <el-tooltip class="ml-3" content="Watch video tutorials" placement="right">
                        <i class="fab fa-youtube" style="color: grey; font-size: 18px; cursor: pointer;" @click="showGIF = true"></i>
                    </el-tooltip>
                </div>
            </div>
            <div class="col-6 text-right">
                <el-tooltip content="Filters" placement="top">
                    <base-button icon size="sm" type="primary" @click="handlefilter()">
                        <span class="btn-inner--text">Filters</span>
                        <span class="btn-inner--icon">
                            <i class="fas fa-filter"></i>
                        </span>
                    </base-button>
                </el-tooltip>
                <el-tooltip content="New Target Name" placement="top" v-can="permissionEnum.CREATE_TARGET">
                    <base-button icon size="sm" style="float:right;" type="primary" @click="isAdded = true">
                        <span class="btn-inner--text">Add</span>
                        <span class="btn-inner--icon">
                            <i class="fas fa-plus"></i>
                        </span>
                    </base-button>
                </el-tooltip>
            </div>
            <filter-drawer-component v-if="isFilterModelActive" :visible.sync="isFilterModelActive" direction="rtl" title="Target Filter" @closeBtn="closeBtn" @resetBtn="resetBtn">
                <base-input label="Month" name="month">
                    <el-date-picker v-model="filters.month" type="month" placeholder="Pick a month" clearable format="MMMM, yyyy" value-format="yyyy-MM-dd"></el-date-picker>
                </base-input>
                <base-input label="Employee Code" v-model="filters.user_code" clearable placeholder="e.g. jone123"></base-input>
                <base-input label="Employee Name" v-model="filters.user_name" clearable placeholder="e.g. John Doe"></base-input>
                <base-input label="Value Type">
                    <el-select v-model="filters.value_type" filterable placeholder="e.g. amount" style="border: none">
                        <el-option v-for="(type, index) in types" :key="index" :label="type.name" :value="type.value"></el-option>
                    </el-select>
                </base-input>
                <base-input label="Category" v-model="filters.category" clearable placeholder="e.g. Soap"></base-input>
                <base-input label="Brand" v-model="filters.brand" clearable placeholder="e.g. General"></base-input>
                <base-input label="Product SKU" v-model="filters.product_sku" clearable placeholder="e.g. lux"></base-input>
                <base-input label="Status">
                    <el-select v-model="filters.status" clearable filterable placeholder="e.g. Active">
                        <el-option v-for="(status, index) in [
                  { label: 'Active', value: '1' },
                  { label: 'Inactive', value: '0' }
                ]" :key="index" :label="status.label" :value="status.value"></el-option>
                    </el-select>
                </base-input>
            </filter-drawer-component>
        </div>
        <target-info :show-modal.sync="isAdded" @targetFetch="fetchTarget()" :types="types"></target-info>
    </div>
    <el-table v-loading="loading" :data="targets" class="table-responsive align-items-center table-flush table-striped" header-row-class-name="thead-light">
        <el-table-column label="Month" min-width="150px" prop="month" sortable>
            <template v-slot="{ row }">
                <b> {{ row.name }}</b>
            </template>
        </el-table-column>
        <el-table-column label="Employee Code" min-width="200px" prop="code" sortable>
            <template v-slot="{ row }">
                <b> {{ row.user_code }}</b>
            </template>
        </el-table-column>
        <el-table-column label="Employee Name" min-width="200px" prop="name" sortable>
            <template v-slot="{ row }">
                <b> {{ row.user_name }}</b>
            </template>
        </el-table-column>
        <el-table-column label="Value Based On" min-width="120px" prop="value_based_on">
            <template v-slot="{ row }">
                {{ getValueBased(row.value_based_on) }}
            </template>
        </el-table-column>
        <el-table-column label="Value" min-width="100px" prop="value">
            <template v-slot="{ row }">
                {{ row.value }}
            </template>
        </el-table-column>
        <el-table-column label="Category" min-width="150px" prop="category">
            <template v-slot="{ row }">
                {{ row.category_name }}
            </template>
        </el-table-column>
        <el-table-column label="Brand" min-width="100px" prop="brand">
            <template v-slot="{ row }">
                {{ row.brand_name }}
            </template>
        </el-table-column>
        <el-table-column label="Product SKU" min-width="200px" prop="product_sku">
            <template v-slot="{ row }">
                {{ row.product_sku }}
            </template>
        </el-table-column>
        <el-table-column label="Product Name" min-width="200px" prop="product_name">
            <template v-slot="{ row }">
                {{ row.product_name }}
            </template>
        </el-table-column>
        <el-table-column label="Status" min-width="100px" prop="status" sortable>
            <template v-slot="{ row }">
                <el-tag :type="`${row.status == 1 ? 'success' : 'danger'}`">
                    <span v-text="`${row.status == 1 ? 'Active' : 'Inactive'}`"></span>
                </el-tag>
            </template>
        </el-table-column>
        <!-- <el-table-column align="center" min-width="100px">
            <div slot-scope="{ row }" class="table-actions">
                <el-tooltip content="Update Target" placement="top" v-can="permissionEnum.UPDATE_TARGET">
                    <a class="table-action" data-original-title="Edit product" data-toggle="tooltip" href="#!" @click.prevent="onEdit(row)">
                        <i class="fas fa-edit"></i>
                    </a>
                </el-tooltip>
                <el-tooltip content="Delete" placement="top">
                    <a @click.prevent="(showDeleteModal = true), (currentTarget = row)" class="table-action table-action-delete" data-original-title="Delete" data-toggle="tooltip" href="#!">
                        <i class="fas fa-trash"></i>
                    </a>
                </el-tooltip>
            </div>
        </el-table-column> -->
    </el-table>
    <!--        Target Delete Modal-->
    <modal :show.sync="showDeleteModal">
        <template>
            <h5 id="exampleModalLabel1" class="modal-title">Are you sure you want to delete this ?</h5>
        </template>
        <template slot="footer">
            <base-button type="secondary" @click="showDeleteModal = false">Close</base-button>
            <base-button type="danger" @click.prevent="deleteTarget">Delete</base-button>
        </template>
    </modal>
    <!--        Target Brand Delete Modal     -->
    <base-pagination v-if="targets.length > 0" v-model="pagination.currentPage" :perPage="pagination.perPage" :total="pagination.total" align="center" class="mt-3" :disabled="loading"></base-pagination>

    <!--        Demo Tour GIF Modal-->
    <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle" :showGIF.sync="showGIF"></GIFModal>
</div>
</template>

<script lang="ts">
import {
    Component,
    Mixins,
    Watch,
    Prop
} from 'vue-property-decorator';
import TargetInfo from '@/views/user/target/TargetInfo.vue';
import GIFModal from '@/components/tour/GIFModal.vue';
import {
    Badge,
    Drawer,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    Table,
    TableColumn,
    Tag,
    Tooltip
} from 'element-ui';
import Target from '@/intefaces/Target';
import TaxonomyMixin from '@/mixins/TaxonomyComponent';
import {
    QueryBuilder
} from '@/classes/QueryBuilder';
import FilterDrawerComponent from '@/components/FilterDrawerComponent.vue';
import AsyncImage from '@/components/AsyncImage.vue';
import {
    Permission as PermissionEnum
} from '@/enums/Permission';

const flatPicker = require('vue-flatpickr-component');

@Component({
    components: {
        AsyncImage,
        [Tooltip.name]: Tooltip,
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [Dropdown.name]: Dropdown,
        [DropdownItem.name]: DropdownItem,
        [DropdownMenu.name]: DropdownMenu,
        [Badge.name]: Badge,
        [Drawer.name]: Drawer,
        [Tag.name]: Tag,
        GIFModal,
        FilterDrawerComponent,
        flatPicker,
        TargetInfo,
    }
})
export default class TargetInfoList extends Mixins(TaxonomyMixin) {
    public isAdded = false;
    public targets: Target[] = [];
    public types: any = [{
            value: 'amount',
            name: 'Amount'
        },
        {
            value: 'qty',
            name: 'Quantity'
        }
    ];
    public filters: any = {
        month: '',
        user_code: '',
        user_name: '',
        value_type: '',
        category: '',
        brand: '',
        product_sku: '',
        status: ''
    };
    public showDeleteModal = false;
    public currentTarget: any = [];
    public isUpdate = false;
    public loading: boolean = false;
    public isFilterModelActive: boolean = false;
    public showGIF: boolean = false;
    public queryBuilder: QueryBuilder = new QueryBuilder();
    public form: any = {
        month: '',
        value_type: '',
    };
    private pagination = {
        currentPage: 1,
        total: 0,
        perPage: 0
    };
    public getUnits: boolean = true;
    private demoTourEntity: string = 'target';
    private GIFs: Array < any > = [{
            label: 'Create a target',
            url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
        },
        {
            label: 'Update a target',
            url: 'https://www.youtube.com/embed/WoM3wuI4sJQ'
        },
        {
            label: 'Delete a target',
            url: 'https://www.youtube.com/embed/LeAltgu_pbM'
        }
    ];
    private demoTourTitle: string = 'A quick demo of target';

    get permissionEnum() {
        return PermissionEnum;
    }

    @Watch('filters.month', {
        deep: true
    })
    filterMonth(value: string) {
        this.queryBuilder.addListener('month', value);
    }
    @Watch('filters.user_code', {
        deep: true
    })
    filterEmployeeCode(value: string) {
        this.queryBuilder.addListener('user_code', value);
    }
    @Watch('filters.user_name', {
        deep: true
    })
    filterEmployeeName(value: string) {
        this.queryBuilder.addListener('user_name', value);
    }
    @Watch('filters.value_type', {
        deep: true
    })
    filterValueType(value: string) {
        this.queryBuilder.addListener('value_type', value);
    }
    @Watch('filters.category', {
        deep: true
    })
    filterCategory(value: string) {
        this.queryBuilder.addListener('category', value);
    }
    @Watch('filters.brand', {
        deep: true
    })
    filterBrand(value: string) {
        this.queryBuilder.addListener('brand', value);
    }
    @Watch('filters.product_sku', {
        deep: true
    })
    filterProductSku(value: string) {
        this.queryBuilder.addListener('product_sku', value);
    }
    @Watch('filters.status', {
        deep: true
    })
    onChangeStatusFilter(value: string) {
        this.queryBuilder.addListener('status', value);
    }

    onEdit(row: any) {
        this.currentTarget = row;
        this.form = {
            value_type: this.currentTarget.value_based_on,
            month: this.currentTarget.name,
        };
        this.isUpdate = true;
    }

    deleteTarget() {
        this.$http.delete(this.$api3(`/targets/${this.currentTarget.id}`)).then(response => {
            this.showDeleteModal = false;
            this.targets.splice(
                this.targets.findIndex((target: any) => target.id == this.currentTarget.id),
                1
            );
        });
    }
    
    @Watch('pagination.currentPage')
    async fetchTarget() {
        this.loading = true;
        let isFirstPage = this.pagination.currentPage < 2;
        let url = isFirstPage ?
            `/targets?${this.queryBuilder.getFilters()}` :
            `/targets?${this.queryBuilder.getFilters()}&page=${this.pagination.currentPage}`;

        await this.$http.get(this.$api3(url)).then(response => {
            this.targets = response.data.data;
            this.pagination.total = response.data.total;
            this.pagination.perPage = response.data.per_page;
            this.loading = false;
        });
    }

    created() {
        this.fetchTarget();
        if (this.getUnits) {
            this.$http.get(this.$api(`/units`)).then(response => {
                const units = this.sortItems(response.data.units);
                units.forEach((element: any, key: number) => {
                    this.types.push({
                        name: element.name,
                        value: 'unit' + (key + 1)
                    });
                })
            });
            this.getUnits = false;
        }
    }

    closeBtn() {
        this.fetchTarget();
        this.isFilterModelActive = false;
    }
    resetBtn() {
        this.filters = {
            month: '',
            user_code: '',
            user_name: '',
            value_type: '',
            category: '',
            brand: '',
            product_sku: '',
            status: ''
        }
        this.fetchTarget();
    }
    handlefilter() {
        this.isFilterModelActive == true ? (this.isFilterModelActive = false) : (this.isFilterModelActive = true);
    }

    sortItems(arr: []) {
        return arr.sort((a: any, b: any) => (a.id > b.id ? 1 : -1));
    }

    getValueBased(value_based_on: String) {
        let value = this.types.find((type: any) => type.value === value_based_on);
        if (value) {
            return value.name;
        }
    }
}
</script>

<style scoped>
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
    width: 100%;
}
</style>
