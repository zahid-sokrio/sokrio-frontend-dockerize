<template>
<div class="row pl-3">
    <div class="col-xl-12 col-md-12 col-lg-12">
        <div class="card">
            <div class="card-header">
                <div class="row">
                    <div class="col-xl-3 col-md-3 col-lg-3">
                        <DateRange v-model="range" label-prop="Date Range"></DateRange>
                    </div>
                    <div class="col-xl-3 col-md-3 col-lg-3">

                    </div>
                    <div v-if="reports.length > 0" class="offset-3 col-xl-3 col-md-3 col-lg-3 text-right">
                        <base-button :disabled="!range && reports.length==0" :loading="downloading" type="primary" @click.prevent="onClickDownload">
                            <i class="fa fa-download"></i>
                        </base-button>
                    </div>
                </div>
            </div>

            <div class="card-body" v-loading="loading">
                <el-table v-if="reports.length > 0" class="table-responsive  table-flush table-striped" header-row-class-name="thead-light" :data="reports">
                    <el-table-column label="SL" min-width="100px" prop="name" sortable type="index"></el-table-column>
                    <el-table-column v-for="(column, key) in fields" :key="key" :label="column.name" :prop="column.name">
                            <template v-slot="{ row }">
                                <b>{{ row[column.value] }}</b>
                            </template>
                        </el-table-column>
                </el-table>
                <base-pagination v-if="reports.length > 0" v-model="pagination.currentPage" :perPage="pagination.entityPerPage" :total="pagination.totalEntity" align="center" class="mt-3" :disabled="loading"></base-pagination>
            </div>
        </div>
    </div> 
</div>
</template>

<script lang="ts">
import {
    Component,
    Prop,
    Vue,
    Watch,
    Mixins,
} from 'vue-property-decorator';
import {
    QueryBuilder
} from "@/classes/QueryBuilder";
import moment from "moment";
import DateRange from "@/components/DateRange.vue";
import PaginationComponentMixin from '@/mixins/PaginationComponent';
import {
    Permission as PermissionEnum
} from "@/enums/Permission";

const flatPicker = require('vue-flatpickr-component');
@Component({
    components: {
        flatPicker,
        DateRange,

    }
})

export default class DownloadReprot extends Mixins(PaginationComponentMixin, Vue) {
    public downloading: boolean = false;
    public loading: boolean = false;
    public printing: boolean = false;
    private showModal: boolean = false;
    public created_by: number | null = null;
    @Prop() currentReport!: any;
    public queryBuilder: QueryBuilder = new QueryBuilder();
    public reports = [];
    public fields = [];
    public range: string = '';
    public rangeSelectConfig = {
        allowInput: true,
        disable: [
            function (range: Date) {
                return moment().diff(range) < 0;
            }
        ]
    }

    todaysDate() {
        var currentDate = new Date()
            .toJSON()
            .slice(0, 10)
            .replace(/-/g, '/');
        return currentDate;
    }

    @Watch('queryBuilder.watch')
    async getReport() {
        if (!this.range) {
            this.reports = [];
            return
        }
        this.loading = true;
        try {
            let {
                data
            } = await this.$http.get(
                this.$api3('/custom-report/' + this.$route.params.reportId + this.queryBuilder.getFilters(true))
                );
            this.fields = data.fields;
            this.reports = data.data.data;
            this.setPagination(data.data);
            if (this.reports.length === 0) {
                this.$notify({
                    message: "Data isn't available in this selected date",
                    title: "Data Empty!",
                    type: 'info'
                })
            }
        } catch (e) {
            this.$notify({
                message: "Please contact your service provider.",
                title: "Something went wrong!",
                type: 'warning'
            })
        } finally {
            this.loading = false;
        }
    }
    async onClickDownload() {
        this.downloading = true;
        try {
            let {
                data,
                headers
            } = await this.$http.get(this.$api3('/custom-report/' + this.$route.params.reportId + this.queryBuilder.getFilters(true) + '&download'), {
                responseType: 'arraybuffer'
            });
            const blob = await new Blob([data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            const link = document.createElement("a");
            link.href = await URL.createObjectURL(blob);
            link.download = this.$getFileNameFromContentDisposition(headers);
            link.click();
        } catch (e) {
            this.$notify({
                title: 'Something wants wrong!',
                type: 'warning',
                message: 'Unable to download reports.',
            })
        } finally {
            this.downloading = false;
        }
    }

    @Watch('range')
    onChangeRange(value: number) {
        this.queryBuilder.addListener('page', 1);
        this.queryBuilder.addListener('range', value);
    }

    @Watch('pagination.currentPage')
    onChangePage(newVal: any) {
        this.queryBuilder.addListener('page', newVal);
    }

    get permissionEnum() {
        return PermissionEnum;
    }
}
</script>
