<template>
<validation-observer v-slot="{ handleSubmit }" ref="formValidator">
    <div class="card">
        <div class="card-header border-0">
            <div class="row">
                <div class="col-8">
                    <div class="form-inline">
                        <h3 class="mb-0">Custom Report Generator</h3>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col col-2">
                    <base-input name="Report Name" v-model="form.name" label="Report Name" :rules="{ required: true }" placeholder="e.g Date wise Sales Users"></base-input>
                </div>
                <TerritoryTypeAutocomplete label="Select Territory" placeholder="Select" :multiple="false" :add-button="false" v-model="form.territory_type_id" name="territory_types"></TerritoryTypeAutocomplete>
                <div class="p-3"></div>
                <TerritoryAutocomplete :disabled="!form.territory_type_id" label="Territory" :collapseTags="true" :rules="{ required: true }" name="territories" v-model="form.territory_id" :fetch-on-change-disable="false" :end-point="`territories${form.territory_type_id ? '?territory_type=' + form.territory_type_id : ''}`">
                </TerritoryAutocomplete>
                <div class="p-3"></div>
                <div class="col col-2">
                    <base-input name="values" label="Select Values" autocomplete="off" :rules="{ required: true }">
                        <el-select v-model="form.parameter" :multiple="true" :collapse-tags="true" clearable placeholder="Select" filterable :multiple-limit="2">
                            <el-option v-for="parameter in parameters" :key="parameter.value" :label="parameter.name" :value="parameter.value"></el-option>
                        </el-select>
                    </base-input>
                </div>
                <div class="p-3"></div>
                <div class="col col-2">
                    <base-input name="Sums" label="Sums of" autocomplete="off" :rules="{ required: true }">
                        <el-select v-model="form.sums" :multiple="true" :collapse-tags="true" clearable placeholder="Select" filterable :multiple-limit="2">
                            <el-option v-for="parameter in parametersSums" :key="parameter.value" :label="parameter.name" :value="parameter.value"></el-option>
                        </el-select>
                    </base-input>
                </div>
                <div class="p-5"></div>
                <div class="col col-2">
                    <base-input label="Report Type" name="Report Type" :rules="{ required: true }">
                        <el-radio-group v-model="form.type">
                            <el-radio label="Order"></el-radio>
                            <el-radio label="Delivery"></el-radio>
                        </el-radio-group>
                    </base-input>
                </div>
                <div class="p-4"></div>
                <div class="col col-2">
                    <base-button class="btn-block" @click="handleSubmit(createEntity)" :loading="loading" type="success" style="margin-top: 20px;">
                        <i class="fa fa-save"> Save</i>
                    </base-button>
                </div>
            </div>
            <br>
            <div class="card-body">
                <el-table v-loading="fetchloading" class="table-responsive align-items-center table-flush table-striped" header-row-class-name="thead-light" :data="customReports">
                    <el-table-column label="SL" min-width="100px" sortable type="index"></el-table-column>
                    <el-table-column label="Report Name" min-width="100px" prop="name" sortable>
                        <template v-slot="{ row }">
                            <b>{{ row.name }}</b>
                        </template>
                    </el-table-column>
                    <el-table-column label="Territory" min-width="100px" prop="territory" sortable>
                        <template v-slot="{ row }">
                            <b>{{ row.territories }}</b>
                        </template>
                    </el-table-column>
                    <el-table-column label="Values" min-width="100px" prop="parameter">
                        <template v-slot="{ row }">
                            <b>{{ row.parameter }}</b>
                        </template>
                    </el-table-column>
                    <el-table-column label="Sums" min-width="100px" prop="sums">
                        <template v-slot="{ row }">
                            <b>{{ row.sums }}</b>
                        </template>
                    </el-table-column>
                    <el-table-column label="Report Type" min-width="100px" prop="type" sortable>
                        <template v-slot="{ row }">
                            <b>{{ row.type }}</b>
                        </template>
                    </el-table-column>
                    <el-table-column label="Created At" prop="created_at" min-width="100px" sortable>
                        <template v-slot="{ row }">
                            <b v-if="row.created_at">{{ row.created_at | datetime('ll') }}</b>
                            <b v-else> - </b>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</validation-observer>
</template>

<script lang="ts">
import {
    Component,
    Mixins,
    Prop,
    Vue,
    Watch
} from 'vue-property-decorator';
import TerritoryTypeAutocomplete from "@/components/resources-autocomplete/TerritoryTypeAutocomplete.vue";
import TerritoryAutocomplete from "@/components/resources-autocomplete/TerritoryAutocomplete.vue";
import PaginationComponentMixin from "@/mixins/PaginationComponent";
import {
    Table,
    TableColumn,
    Radio,
    RadioGroup
} from "element-ui";

@Component({
    components: {
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [Radio.name]: Radio,
        [RadioGroup.name]: RadioGroup,
        TerritoryAutocomplete,
        TerritoryTypeAutocomplete,
    }
})
export default class CustomReport extends Mixins(PaginationComponentMixin, Vue) {
    public loading: boolean = false;
    public fetchloading: boolean = false;
    public customReports: any = [];
    public parameters: any = [{
        'name': 'Date',
        'value': 'date'
    }, {
        'name': 'User',
        'value': 'user'
    }, {
        'name': 'Category',
        'value': 'category'
    }, {
        'name': 'Brand',
        'value': 'brand'
    }];

    public parametersSums: any = [{
        'name': 'Amount',
        'value': 'amount'
    }, {
        'name': 'Quantity',
        'value': 'qty'
    }];

    @Prop({
        default: () => ({
            name: '',
            territory_type_id: null,
            territory_id: null,
            parameter: [],
            sums: [],
            type: '',

        }),
    })

    form!: {
        name: '';
        territory_type_id: number | null;
        territory_id: number | null;
        type: '';
        parameter: [];
        sums: [];
    };

    created() {
        this.$http.get(this.$api(`/units?page=${this.pagination.currentPage}`)).then(response => {
            const units = this.sortItems(response.data.units);
            units.forEach((element: any, key: number) => {
                this.parametersSums.push({
                    name: element.name,
                    value: 'unit' + (key + 1)
                });
            })
        });
        this.fetchSummaries();
    }

    sortItems(arr: []) {
        return arr.sort((a: any, b: any) => (a.id > b.id ? 1 : -1));
    }

    fetchSummaries() {
        this.fetchloading = true;
        this.$http.get(this.$api3('/custom-report')).then((response) => {
                this.customReports = response.data;
                this.fetchloading = false;
            })
            .catch(error => window.console.log(error))
    }

    formReset(): any {
        this.form.name = '';
        this.form.territory_id = null;
        this.form.territory_type_id = null;
        this.form.parameter = [];
        this.form.type = '';
        this.form.sums = [];
        //return this.form;
    }

    createEntity() {
        this.loading = true;
        this.$http
            .post(this.$api3('/custom-report'), this.form)
            .then((response) => {
                if (response.data.error) {
                    this.$notify({
                        title: 'error',
                        message: 'The maximum limit for creating custom report is 5',
                        duration: 5000,
                        iconClass: 'ni ni-bell-55',
                        type: 'warning',
                    });
                } else {
                    this.$notify({
                        title: 'Success',
                        message: 'Successfully Created',
                        duration: 5000,
                        iconClass: 'ni ni-bell-55',
                        type: 'success',
                    });
                    this.fetchSummaries();
                    this.formReset();
                }
            })
            .catch((error) => {
                this.loading = false;
                (
                    this.$refs.formValidator as Vue & {
                        setErrors: (errors: []) => any;
                    }
                ).setErrors(error.response.data.errors);
            }).finally(() => {
                this.loading = false;
            });
    }
    getSums(sums: any) {
        let sumsName: any = [];
        // sums.join(', ').forEach((element: any) => {
        //   sumsName.push =  this.parametersSums.find((parameter: any) => parameter.value === element).name;
        // });
        window.console.log(sums.join(', '));
    }
}
</script>

<style>
.el-select .el-input .el-input__inner {
    height: calc(1em + 1.25rem + 4px) !important;
}
</style>
