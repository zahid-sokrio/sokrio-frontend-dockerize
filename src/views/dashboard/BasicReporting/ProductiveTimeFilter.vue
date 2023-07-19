<template>
    <modal :show="isActive" @close="close">
        <template slot="header">
            <h5 class="modal-title" id="exampleModalLabel">Filter</h5>
        </template>
        <div class="row">
            <div class="col-md-6"> 
                <TerritoryTypeAutocomplete v-model="selectedTerritoryType" label="Territory Type"></TerritoryTypeAutocomplete>
            </div>
            <div class="col-md-6"> 
                <TerritoryAutocomplete :disabled="!selectedTerritoryType" v-model="filters.territory_id" :fetch-on-change-disable="true"
                    :end-point="`territories${selectedTerritoryType ? '?territory_type=' + selectedTerritoryType : ''}`"
                    label="Territory"></TerritoryAutocomplete>

            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <MemberAutocomplete :disabled="!territory_id" label="User" :fetch-on-change-disable="false"
                    :end-point="`users${selectedTerritoryType ? '?t=' + territory_id : ''}`" v-model="filters.user_id">
                </MemberAutocomplete>

            </div>
            <div class="col-md-6">
                <div class="mb-3 ml-1">
                    <span class="text-sm" style="color: #536080; font-size: 0.77875rem; font-weight: 600;">
                        Month
                    </span>
                </div>
                <base-input>
                    <el-select filterable placeholder="Month" v-model="filters.month" clearable>
                        <el-option v-for="(mo,index) in months" :key="index" :label="mo.label" :value="mo.value">
                        </el-option>
                    </el-select>
                </base-input>
            </div> 
        </div>
        <template slot="footer">
            <base-button @click="closeFilter" type="primary">Done</base-button>
            <base-button @click="close" type="secondary">Close</base-button>
        </template>
    </modal>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'; 
import TerritoryTypeAutocomplete from '@/components/resources-autocomplete/TerritoryTypeAutocomplete.vue';
import TerritoryAutocomplete from '@/components/resources-autocomplete/TerritoryAutocomplete.vue';
import MemberAutocomplete from '@/components/resources-autocomplete/MemberAutocomplete.vue';
// @ts-ignore
const flatPicker = require("vue-flatpickr-component");
import "flatpickr/dist/flatpickr.css";
@Component({
    components: {
        TerritoryTypeAutocomplete, 
        TerritoryAutocomplete,
        MemberAutocomplete,
        flatPicker
    }
})

export default class SalesGrowthFilter extends Vue { 
    private selectedTerritoryType: number | null = null;
    private territory_id: number | null = null; 
    @Prop() isActive!: boolean;
    private month!: any;
    @Prop({
        default: () => ({ 
            month: '',
            territory_id: '',
            user_id: ''
        })
    })
    filters!: { 
        month: number,
        territory_id: number,
        user_id: number
    } 
    private months: any = [
        { label: 'January', value: '1' },
        { label: 'February', value: '2' },
        { label: 'March', value: '3' },
        { label: 'April', value: '4' },
        { label: 'May', value: '5' },
        { label: 'June', value: '6' },
        { label: 'July', value: '7' },
        { label: 'August', value: '8' },
        { label: 'September', value: '9' },
        { label: 'October', value: '10' },
        { label: 'November', value: '11' },
        { label: 'December', value: '12' }
    ]
    @Watch('filters', { immediate: true, deep: true })
    onChangeFilter(newVal: any) {
        this.$emit('updateFilter', this.filters)
    }

    closeFilter() {
        this.$emit('update:isActive', false);
    }


    close() {
        this.$emit('update:isActive', false);
        this.$emit('update:filters', { 
            month: this.month
        })
    }
}
</script>
