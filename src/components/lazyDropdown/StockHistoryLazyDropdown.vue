<template>
<div>
    <base-input :name="name" :label="label" :rules="rules" autocomplete="off">
        <el-select 
            ref="elselect"
            filterable remote 
            clearable 
            :placeholder="placeholder" 
            :value="value" 
            :remote-method="remoteMethod" 
            :loading="loading" 
            @input="$emit('input', $event)"
            @clear="clear"
            @change="change">
            <el-option
              v-for="entity in entities"
              :key="entity[itemValue]"
              :label="resolveNesting(itemText, entity)"
              :value="resolveNesting(itemValue, entity)"
            >
            </el-option>
        </el-select>
    </base-input>
</div>
</template>

<script lang="ts">
import {
    Component,
    Mixins,
    Prop,
    Vue,
    Watch
} from 'vue-property-decorator';
import TaxonomyMixin from "@/mixins/TaxonomyComponent";

@Component({
    components: {
        
    },
})
export default class StockHistoryLazyDropdown extends Mixins(TaxonomyMixin) {
    @Prop({ default: 'name' })
    itemText!: string;
    @Prop({ default: 'id' })
    itemValue!: string;

    @Prop({ default: null })
    public value!: string;
    @Prop({ default: 'stocks-history' })
    public endPoint!: string;
    @Prop({ default: 'challan_no' })
    name!: string;
    @Prop({ default: 'Challan No' })
    label!: string;
    @Prop({ default: 'Please enter a keyword' })
    placeholder!: string;
    @Prop({ required: false })
    rules!: Object;
    @Prop({ default: 1 })
    apiVersion!: number;
    @Prop({ default: 'challan_no' })
    searchableKey!: string;
    @Prop({ default: 'stocks' })
    resourceKey!: string;
    @Prop({ default: false })
    closeHistoryModal!: Boolean;
    public loading: Boolean = false;
    public entities = [];

    resolveNesting(accessor: string, entity: any) {
        let accessorArray = accessor.split('.');
        let currentObjState = entity;
        for (var i = 0; i < accessorArray.length; i++) {
            currentObjState = currentObjState[accessorArray[i]];
        }
        return currentObjState;
    }

    apiEndpoint(query: string, searchable: boolean): string {
        let api = this.endPoint.startsWith('/') ? this.endPoint : '/'.concat(this.endPoint);
        api = api.includes('?') ? api.concat(`&${this.searchableKey}=${query}`) : api.concat(`?${this.searchableKey}=${query}`);
        if (searchable) {
            api = api.concat(`&searchable=1`);
        }

        let apiUrl = this.$api(api);
        if (this.apiVersion === 2) {
            apiUrl = this.$api2(api);
        } else if (this.apiVersion === 3) {
            apiUrl = this.$api3(api);
        }

        return apiUrl;
    }

    async remoteMethod(query: string) {
        if (query) {
            const { data } = await this.$http.get(this.apiEndpoint(query, true));
            this.entities = data[this.resourceKey];
        } else {
            this.entities = [];
            this.$emit('selected-item', {});
        }
    }

    @Watch('closeHistoryModal')
    clear() {
        this.entities = [];
        this.$parent.$emit('input', null);
        this.$emit('input', null);
    }

    async change(evt: any) {
        this.$parent.$emit('change', evt);
        this.$emit('change', evt);
        
        const { data } = await this.$http.get(this.apiEndpoint(evt, false));

        this.$parent.$emit('selected-item', data);
        this.$emit('selected-item', data);
    }
}
</script>
