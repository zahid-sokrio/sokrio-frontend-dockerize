<template>
  <validation-observer v-if="isActive" v-slot="{ handleSubmit }" ref="formValidator">
    <modal :show="isActive" @close="close">
      <template slot="header">
        <h5 class="modal-title" id="exampleModalLabel">{{ isUpdate ? 'Update' : 'Add New' }} Territory</h5>
      </template>
      <div>
        <TerritoryTypeAutocomplete
          name="Territory Type"
          label="Territory Type"
          placeholder="Select"
          :create-button="true"
          :rules="{ required: true }"
          v-model="form.territory_type_id"
          @level="onChangeTerritoryLevel($event)"
        ></TerritoryTypeAutocomplete>
        <el-row :gutter="10">
          <el-col :span="12">
            <base-input
              name="Territory Name"
              :rules="{ required: true }"
              label="Territory Name"
              v-model="form.name"
              placeholder="e.g. Laraville"
            ></base-input>
          </el-col>
          <el-col :span="12">
            <base-input name="code" :rules="{ required: true }" label="Territory Code" v-model="form.code" placeholder="e.g. DHK-101"></base-input>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12" v-if="!isUpdate">
            <MemberAutocomplete
              label="Territory Manager"
              name="Territory Manager"
              placeholder="Assign a manager"
              @input="form.managed_by = $event"
              :end-point="'users?non_manager'"
              :multiple="true"
              :value="
                isUpdate && form.manager
                  ? form.manager.id == form.managed_by
                    ? `${form.manager.name} | ${form.manager.email}`
                    : form.managed_by
                  : form.managed_by
              "
            ></MemberAutocomplete>
          </el-col>
          <el-col :span="12" v-if="requireParent">
            <div v-if="isUpdate">
              <TerritoryAutocomplete
                label="Parent Territory"
                name="Parent Territory"
                :rules="{ required_if: requireParent }"
                placeholder="Select"
                @input="form.parent_id = $event"
                :value="
                  isUpdate && form.parent
                    ? form.parent.id == form.parent_id
                      ? `${form.parent.name} | ${form.parent.code}`
                      : form.parent_id
                    : form.parent_id
                "
              ></TerritoryAutocomplete>
            </div>
            <div v-else>
              <label for="parent_territory">Parent Territory</label>
              <el-select v-model="form.parent_id" filterable allow-create default-first-option placeholder="Parent Territory">
                <el-option label="Parent Territory"> </el-option>
                <el-option v-for="item in territoryList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
      </div>
      <template slot="footer">
        <base-button type="secondary" @click="close">Close</base-button>
        <base-button type="success" :loading="loading" @click="handleSubmit(save)">{{ isUpdate ? 'Update' : 'Save' }}</base-button>
      </template>
    </modal>
  </validation-observer>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import Territory from '@/intefaces/Territory';
import BaseCUModalComponentMixin from '@/mixins/BaseCUModalComponent';
import { AxiosResponse } from 'axios';
import { Select, Option, Autocomplete, Row, Col } from 'element-ui';
import User from '@/intefaces/User';
import TerritoryTypeAutocomplete from '@/components/resources-autocomplete/TerritoryTypeAutocomplete.vue';
import MemberAutocomplete from '@/components/resources-autocomplete/MemberAutocomplete.vue';
import TerritoryAutocomplete from '@/components/resources-autocomplete/TerritoryAutocomplete.vue';

@Component({
  components: {
    TerritoryAutocomplete,
    TerritoryTypeAutocomplete,
    MemberAutocomplete,
    [Row.name]: Row,
    [Col.name]: Col,
    [Select.name]: Select,
    [Option.name]: Option,
    [Autocomplete.name]: Autocomplete
  }
})
export default class CreateTerritoryForm extends Mixins(BaseCUModalComponentMixin) {
  @Prop()
  currentEntity!: Territory;
  public territoryList: any = [];

  @Prop({
    default: () => ({
      name: '',
      code: '',
      territory_type_id: null,
      parent_id: null,
      managed_by: '',
      manager: null
    })
  })
  form!: {
    name: string;
    code: string;
    territory_type_id: number | null;
    parent_id: number | null;
    parent: Territory | null;
    managed_by: [];
    manager: null | User;
  };

  public state: string = '';
  public requireParent: boolean = false;

  get createApi(): string {
    return '/territories';
  }
  get updateApi(): string {
    return `/territories/${this.currentEntity.id}`;
  }

  @Prop()
  private territories!: Territory[];

  formReset(): any {
    this.form.name = '';
    this.form.code = '';
    this.form.territory_type_id = null;
    this.form.parent_id = null;
    this.form.parent = null;
    this.form.managed_by = [];
    this.form.manager = null;
    return this.form;
  }

  async afterCreate(response: AxiosResponse<any>): Promise<void> {
    this.$emit('created', response.data.territory);
  }

  afterUpdate(response: AxiosResponse<any>): void {
    this.$emit('updated', response.data.territory);
  }

  async onChangeTerritoryLevel(value: any) {
    this.loading = true;
    const { data } = await this.$http.get(this.$api2(`/territory-lists?territory_type=${value}`));
    this.territoryList = data.territories;
    this.loading = false;
    this.requireParent = value > 1 ? true : false;
  }

  @Watch('isUpdate')
  onChangeUpdate(value: boolean) {
    if (value) {
      this.requireParent = !!this.form.parent_id;
    }
  }

  @Watch('form.parent_id', { deep: true })
  onChangeParentId(value: number) {
    if (this.isUpdate && value == this.currentEntity.id) {
      this.$nextTick(() => (this.form.parent_id = null));
      this.$notify({ message: 'Invalid Parent Territory Selected', title: 'Something Went Wrong!', type: 'warning' });
    }
  }
}
</script>
