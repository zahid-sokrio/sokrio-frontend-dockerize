<template>
<div class="card">
    <div class="card-header border-0">
        <div class="row">
            <div class="col-2">
                <TerritoryTypeAutocomplete v-model="selectedTerritoryType" label="Territory Type"></TerritoryTypeAutocomplete>
            </div>
            <div class="col-3">
                <TerritoryAutocomplete :disabled="!selectedTerritoryType" v-model="selectedTerritory" :fetch-on-change-disable="false" :end-point="`territories${selectedTerritoryType ? '?territory_type=' + selectedTerritoryType : ''}`" label="Territory"></TerritoryAutocomplete>
            </div>
            <div class="col-3">
                <MemberAutocomplete :disabled="!selectedTerritory" label="User" :fetch-on-change-disable="false" :end-point="`users${selectedTerritoryType ? '?t=' + selectedTerritory : ''}`" v-model="selectedUser"></MemberAutocomplete>
            </div>
            <div class="col-4">
                <el-row class="mb-3 ml-1">
                    <span class="text-sm" style="color: #536080; font-size: 0.77875rem; font-weight: 600;">
                        Date
                    </span>
                </el-row>
                <el-row>
                    <el-col :span="11" style="padding: 0 2px">
                        <base-input clearable>
                            <flat-picker ref="selectedDateRange" :config="{ allowInput: true }" class="form-control datepicker" :disabled="false" placeholder="Date" v-model="selectedDateRange" :key="selectedDateRange"></flat-picker>
                        </base-input>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="row">
            <div v-show="error" class="col-6 offset-3">
                <div class="error-notice">
                    <div class="oaerror danger">
                        <div class="form-inline">
                            <strong><small class="mr-2" style="font-size: x-small">❌</small> {{ error }}</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="card-body">
        <div class="row pl-3">
            <ActiveUsers :territory-id="selectedTerritory" :user-id="selectedUser" :date-range="selectedDateRange" />
            <AverageWorking :territory-id="selectedTerritory" :user-id="selectedUser" :date-range="selectedDateRange" />
            <visitVsPlan :territory-id="selectedTerritory" :user-id="selectedUser" :date-range="selectedDateRange" />
        </div>
        <div class="row pl-3 pt-5">
            <NewOutlets :territory-id="selectedTerritory" :user-id="selectedUser" :date-range="selectedDateRange" />
            <CoveredOutlet :territory-id="selectedTerritory" :user-id="selectedUser" :date-range="selectedDateRange" />
        </div>
        <div class="row pl-3 pt-5">
            <ProductiveTime />
            <visitingHours :territory-id="selectedTerritory" :user-id="selectedUser" :date-range="selectedDateRange" />
        </div>
    </div>
</div>
</template>

<script lang="ts">
import {
    Component,
    Mixins,
    Watch
} from 'vue-property-decorator';
import 'flatpickr/dist/flatpickr.css';
import TaxonomyMixin from '@/mixins/TaxonomyComponent';
import TerritoryTypeAutocomplete from '@/components/resources-autocomplete/TerritoryTypeAutocomplete.vue';
import TerritoryAutocomplete from '@/components/resources-autocomplete/TerritoryAutocomplete.vue';
import {
    QueryBuilder
} from '@/classes/QueryBuilder';
import {
    ButtonGroup,
    Button
} from 'element-ui';
import moment from 'moment';
import MemberAutocomplete from '@/components/resources-autocomplete/MemberAutocomplete.vue';
import ActiveUsers from '@/views/dashboard/BasicReporting/ActiveUsers.vue';
import AverageWorking from '@/views/dashboard/BasicReporting/AvgWorking.vue';
import visitVsPlan from '@/views/dashboard/BasicReporting/visitVsPlan.vue';
import NewOutlets from '@/views/dashboard/BasicReporting/NewOutlets.vue';
import CoveredOutlet from '@/views/dashboard/BasicReporting/CoveredOutlet.vue';
import ProductiveTime from '@/views/dashboard/BasicReporting/ProductiveTime.vue';
import visitingHours from '@/views/dashboard/BasicReporting/visitingHours.vue';

const flatPicker = require('vue-flatpickr-component');

@Component({
    components: {
        ActiveUsers,
        AverageWorking,
        visitVsPlan,
        NewOutlets,
        ProductiveTime,
        CoveredOutlet,
        visitingHours,
        MemberAutocomplete,
        TerritoryAutocomplete,
        TerritoryTypeAutocomplete,
        flatPicker,
        [Button.name]: Button,
        [ButtonGroup.name]: ButtonGroup
    }
})
export default class TodaysData extends Mixins(TaxonomyMixin) {
    private selectedDateRange: string = moment().format('YYYY-MM-DD');
    private selectedTerritoryType: number | null = null;
    private selectedTerritory: number | null = null;
    private selectedUser: number | null = null;
    private error: string = '';
    private isFetchData: boolean = false;
    private loading: boolean = false;
    private queryBuilder: QueryBuilder = new QueryBuilder();

    @Watch('queryBuilder.watch')
    fetchTodyasData() {
        this.loading = true;
        this.isFetchData = false;
    }

    @Watch('selectedTerritoryType')
    onChangeTerritoryType(value: number) {}

    @Watch('selectedTerritory')
    onChangeTerritory(value: number) {
        this.queryBuilder.addListener('territory_id', value);
    }

    @Watch('selectedUser')
    onChangeUser(value: number) {
        this.queryBuilder.addListener('user_id', value);
    }

    @Watch('selectedDateRange')
    onChangeDateRange(value: string) {
        this.queryBuilder.addListener('range', value);
    }

    todaysDate() {
        var currentDate = new Date()
            .toJSON()
            .slice(0, 10)
            .replace(/-/g, '/');
        return currentDate;
    }

    created() {
        this.fetchTodyasData();
    }
}
</script>

<style>
.error-notice {
    margin: 5px;
}

.oaerror {
    width: 90%;
    background-color: #ffffff;
    padding: 10px;
    border: 1px solid #eee;
    border-left-width: 5px;
    border-radius: 5px;
    margin: 5px auto;
    font-family: 'Open Sans', sans-serif;
    font-size: 13px;
}

.danger {
    border-left-color: #d9534f;
    /* Left side border color */
    background-color: rgba(217, 83, 79, 0.1);
    /*Same color as the left border with reduced alpha to 0.1*/
}

.danger strong {
    color: #d9534f;
}

.chart {
    box-shadow: 0 0 2rem 0 rgb(136 152 170 / 15%);
}
</style>
