<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <div class="form-inline">
            <h3 class="mb-0">Taxonomy</h3>
            <el-tooltip class="ml-3" content="Set up aliases according to your business." placement="right">
              <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
    <template>
      <!-- Dropdown header -->
      <div class="px-3 py-3"></div>
      <!-- List group -->
      <div class="list-group list-group-flush">
        <div class="list-group-item">

          <div class="row align-items-center  mb-5">
            <div class="col-12">
              <el-card body-style="background-color: #f7fafb"
                       header="Alias"
                       class="box-card ">
                <div class="text item">
                  <div class="row">
                    <div class="col-1"></div>
                    <div class="col-2">
                      <b class="text-sokrio"> Order : </b><br>
                    </div>
                    <div class="col-6">
                      <base-input v-model="form.order" name="order" placeholder="Order"></base-input>
                    </div>
                    <div class="col-3 text-center">
                      <b class="text-sokrio"> order  <i class="fas fa-exchange-alt"></i> {{form.order}}</b>
                    </div>
                  </div>
                </div>
                <div class="text item">
                  <div class="row">
                    <div class="col-1"></div>
                    <div class="col-2">
                      <b class="text-sokrio"> Requisition : </b><br>
                    </div>
                    <div class="col-6">
                      <base-input v-model="form.requisition" name="requisition" placeholder="Requisition"></base-input>
                    </div>
                    <div class="col-3 text-center">
                      <b class="text-sokrio"> requisition  <i class="fas fa-exchange-alt"></i> {{form.requisition}}</b>
                    </div>
                  </div>
                </div>
                <div class="text item">
                  <div class="row">
                    <div class="col-1"></div>
                    <div class="col-2">
                      <b class="text-sokrio"> Invoice : </b><br>
                    </div>
                    <div class="col-6">
                      <base-input v-model="form.invoice" name="invoice" placeholder="Invoice"></base-input>
                    </div>
                    <div class="col-3 text-center">
                      <b class="text-sokrio"> invoice  <i class="fas fa-exchange-alt"></i> {{form.invoice}}</b>
                    </div>
                  </div>
                </div>
                <div class="text item">
                  <div class="row">
                    <div class="col-1"></div>
                    <div class="col-2">
                      <b class="text-sokrio"> Sales Return : </b><br>
                    </div>
                    <div class="col-6">
                      <base-input v-model="form.salesReturn" name="salesReturn" placeholder="Sales Return"></base-input>
                    </div>
                    <div class="col-3 text-center">
                      <b class="text-sokrio"> sales return  <i class="fas fa-exchange-alt"></i> {{ form.salesReturn }}</b>
                    </div>
                  </div>
                </div>
                <div class="text item">
                  <div class="row">
                    <div class="col-1"></div>
                    <div class="col-2">
                      <b class="text-sokrio"> Department : </b><br>
                    </div>
                    <div class="col-6">
                      <base-input v-model="form.department" name="department" placeholder="Department"></base-input>
                    </div>
                    <div class="col-3 text-center">
                      <b class="text-sokrio"> department  <i class="fas fa-exchange-alt"></i> {{form.department}}</b>
                    </div>
                  </div>
                </div>
              </el-card>
            </div>
          </div>
          <div class="row">
            <div class="col-2">
              <base-button class="mx-3" block type="success" @click="updateTaxonomy()">Save</base-button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>

</template>
<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {Card, Option, Popover, Select, Switch} from "element-ui";
import TaxonomyJson  from '@/assets/json/Taxonomy.json';

@Component({
  components: {
    [Switch.name]: Switch,
    [Popover.name]: Popover,
    [Select.name]: Select,
    [Option.name]: Option,
    [Card.name]: Card,
  }
})
export default class Taxonomy extends Vue {
  private taxonomyArray: any = [];
  private retrievedSettings: any = [];
  private form: any = {
    order: '',
    requisition: '',
    invoice: '',
    salesReturn: '',
    department: ''
  }

  updateTaxonomy () {
    this.taxonomyArray = [
      {"order": this.form.order},
      {"requisition": this.form.requisition},
      {"salesReturn": this.form.salesReturn},
      {"invoice": this.form.invoice},
      {"department": this.form.department}
    ]
    this.$http.patch(this.$api('/settings/1'), {taxonomy: this.taxonomyArray}).then(response => {
      this.updateSMSNotification(response.status);
      this.taxonomySyncLocalStorage();
      location.reload();
    })
  }

  updateSMSNotification(status: number) {
    this.$notify({
      title: status == 200 ? 'Success' : 'Error',
      message: status == 200 ? "Taxonomy settings updated" : "Taxonomy settings could not be updated",
      duration: 5000,
      iconClass: 'fa fa-clone',
      // @ts-ignore
      verticalAlign: 'bottom',
      horizontalAlign: 'right',
      type: status == 200 ? 'success' : 'warning'
    });
  }

  getFormData (taxonamyArray: any) {
    taxonamyArray.forEach((taxonomy: any) => {
      this.form[Object.keys(taxonomy)[0]] = Object.values(taxonomy)[0]
    });
  }

  fetchSettings() {
    this.$http.get(this.$api(`/settings`)).then(response => {
      if (response.data.settings.taxonomy != null) {
        this.getFormData(JSON.parse(response.data.settings.taxonomy));
      } else {
        this.taxonomyArray = TaxonomyJson
        this.getFormData(this.taxonomyArray);
        this.$http.patch(this.$api('/settings/1'), {taxonomy: this.taxonomyArray});
        this.taxonomySyncLocalStorage();
      }
    })
  }

  async taxonomySyncLocalStorage() {
    if (localStorage.settings) {
      this.retrievedSettings = JSON.parse(localStorage.settings);
      if(this.retrievedSettings) {
        this.retrievedSettings.taxonomy = this.taxonomyArray;
      }
      localStorage.removeItem('settings');
      this.$store.dispatch('Settings/updateSettings', this.retrievedSettings);
      this.$store.dispatch('Settings/updateTaxonomy', this.taxonomyArray);
    } else {
      let settings = [];
      settings.push({taxonomy: this.taxonomyArray});
      this.$store.dispatch('Settings/updateSettings', this.retrievedSettings);
      this.$store.dispatch('settings/updateTaxonomy', this.taxonomyArray);
    }
  }

  created() {
    this.fetchSettings();
  }
}
</script>
