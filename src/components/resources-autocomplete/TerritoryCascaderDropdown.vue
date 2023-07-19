<template>
    <div>
        <base-input :name="name" :label="label" :rules="rules" autocomplete="off">
            <el-cascader ref="cascaderRef" :props="props" clearable :show-all-levels="showAllLevels" @change="handleClick"
                :collapse-tags="collapseTags" filterable>
                <template v-if="childrenCount" slot-scope="{ node, data }">
                    <span>{{ data.label }}</span>
                    <span v-if="!node.isLeaf"> ({{ data.children_count }})</span>
                </template>
            </el-cascader>
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
import {
    Cascader
} from 'element-ui';
import TaxonomyMixin from "@/mixins/TaxonomyComponent";

@Component({
    components: {
        [Cascader.name]: Cascader,
    },
})
export default class TerritoryCascaderDropdown extends Mixins(TaxonomyMixin) {
    @Prop({
        default: 'territories'
    })
    public endPoint!: string;
    @Prop({
        default: 'name'
    })
    name!: string;
    @Prop({
        default: 'Territory'
    })
    label!: string;
    @Prop({
        required: false
    })
    rules!: Object;
    @Prop({
        default: 'click'
    })
    public expandTrigger!: String;
    @Prop({
        default: true
    })
    public checkStrictly!: Boolean;
    @Prop({
        default: false
    })
    public multiple!: Boolean;
    @Prop({
        default: false
    })
    public collapseTags!: Boolean;
    @Prop({
        default: false
    })
    public showAllLevels!: Boolean;
    @Prop({
        default: true
    })
    public childrenCount!: Boolean;
    @Prop({
        default: false
    })
    public emitPath!: Boolean;
    private user: any = {};
    public selectedOptions: any = [];
    public checkParentId: any = '';
    public props: any = {
        expandTrigger: this.expandTrigger,
        checkStrictly: this.checkStrictly,
        emitPath: this.emitPath,
        multiple: this.multiple,
        lazy: true,
        lazyLoad: this.lazyLoad
    }

    async lazyLoad(node: any, resolve: any) {
        this.user = this.$store.getters['Auth/getCurrentUser'];
        
        if (this.user && this.user.managed_territory && this.user.managed_territory.id) {
            if (this.user.managed_territory.id != 1) {
                this.checkParentId = this.user.managed_territory.parent_id;
            } else {
                this.checkParentId = '';
            }
        } else {
            if (this.user.territory && this.user.territory.parent_id) {
                this.checkParentId = this.user.territory.parent_id;
            } else {
                this.checkParentId = '';
            }
        }

        var territories: any[] = [];
        this.$http.get(this.$api(`/${this.endPoint}?parent_id=${node.level === 0 ? this.checkParentId : node.data.value}`)).then((response) => {
            territories = response.data.territories;
            let treeData = territories.map((territory) => {
                const container: any = {};
                container['label'] = territory.name;
                container['leaf'] = !territory.children_count;
                container['children_count'] = territory.children_count;
                container['value'] = territory.id;
                return container;
            });
            resolve(treeData);
        });
    }

    async handleClick(value: any) {
        //     if (this.multiple) {
        //         let temp: any[] = [];
        //         value.forEach((element: any) => {
        //             temp.push(element[element.length - 1]);
        //         });
        //         this.selectedOptions = temp;
        //     } else {
        //         this.selectedOptions = value[value.length - 1];
        //     }
        this.$emit('input', value);
        if (!this.multiple) {
            // @ts-ignore
            this.$refs.cascaderRef.toggleDropDownVisible(false);
        }
    }
}
</script>