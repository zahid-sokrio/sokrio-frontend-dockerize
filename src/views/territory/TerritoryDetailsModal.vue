<template>
  <modal :show="showTerritory" size="lg" modal-classes="modal-dialog-centered" @close="close()"
         class="modal-dialog-scrollable">
    <template slot="header">
      <h5 class="modal-title">Territory Details</h5>
    </template>
    <div>
      <div class="row row-grid justify-content-center">
        <div class="col-lg-10">
          <div class="table-responsive">
            <div class="row mb-5 mt-2">
              <div class="col-6">
                <b>Name: <span class="text-muted text-md-left">{{ loading ? 'loading..' : territory.name }}</span></b>
              </div>
              <div class="col-6">
                <b>Code: <span class="text-muted text-md-left pt-5">{{ loading ? 'loading..' : territory.code }}</span></b>
              </div>
            </div>
            <div class="row mb-5 mt-2">
              <div class="col-6">
                <b>Territory Type: <span
                  class="text-muted text-md-left">{{ loading ? 'loading..' : territory.territory_type &&
                  territory.territory_type.name }}</span></b>
              </div>
              <div class="col-6">
                <b>Parent: <span class="text-muted text-md-left pt-5">{{
                    !loading && territory.parent && territory.parent.name ?
                      territory.parent.name : 'Parent Not Found'
                  }}</span></b>
              </div>
            </div>
            <div class="row mb-5 mt-2">
              <div class="col-6">
                <b>Creation Date: <span v-if="!loading" class="text-muted text-md-left pt-5">{{
                    territory.created_at | datetime('ll')
                  }}</span><span v-else>-</span></b>

              </div>
              <!-- <div class="col-6">
                <ManagerList :territory="territory" v-if="!loading"></ManagerList>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <template slot="footer">
      <base-button type="primary" @click="close()">Close</base-button>
    </template>
  </modal>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import {
  Tooltip,
  Card,
  Tag
} from 'element-ui';
// import ManagerList from "@/views/department/ManagerList.vue";

@Component({
  components: {
    [Tooltip.name]: Tooltip,
    [Card.name]: Card,
    [Tag.name]: Tag,
    // ManagerList,
  }
})
export default class TerritoryDetailsModal extends Vue {
  private territory: any = [];
  private loading: boolean = false;
  @Prop()
  territoryId!: number;

  @Prop({type: Boolean, default: false})
  public showTerritory!: boolean;

  close() {
    this.$emit('update:showTerritory', false);
  }

  async mounted() {
    this.loading = true;
    let {data} = await this.$http.get(this.$api(`/territories/${this.territoryId}`));
    this.territory = data.territory;
    this.loading = false;
  }

}
</script>
<style>

</style>
