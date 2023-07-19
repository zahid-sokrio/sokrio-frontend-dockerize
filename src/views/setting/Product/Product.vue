<template>
  <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
    <div class="card">
      <div class="card-header border-0">
        <div class="row">
          <div class="col-6">
            <div class="form-inline">
              <h3 class="mb-0">Product</h3>
              <el-tooltip class="ml-3" content="Manage product stock settings"
                          placement="right">
                <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div class="px-3 py-3">
        </div>

        <div class="list-group list-group-flush">
          <div class="list-group-item">
            <div class="row">
              <div class="col-3">
                Product Stock Visible to Mobile User:
              </div>
            </div>
            <div class="row  my-4">
              <div class="col-3">
                <base-input label="Visible">
                  <base-switch on-text="Yes" off-text="No" v-model="showStock"></base-switch>
                </base-input>
                <div v-if="!showStock">
                  <base-input type="text" label="Alternative Text" name="Alternative Text"
                              placeholder="e.g: Stock Available"
                              prepend-icon="far fa-sticky-note"
                              :rules="{required:true}" v-model="form.hidden_stock_message">
                  </base-input>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row my-5">
          <div class="col-2">
            <base-button class="mx-3" block :loading="loading" @click="handleSubmit(updateProductStocksSettings)"
                         type="success">Save
            </base-button>
          </div>
        </div>
      </div>
    </div>
  </validation-observer>
</template>
<script lang="ts">

const flatPicker = require('vue-flatpickr-component');
import {Component, Vue, Watch} from "vue-property-decorator";
import {Popover, Switch, Select, Option} from "element-ui";

@Component({
  components: {
    [Switch.name]: Switch,
    [Popover.name]: Popover,
    [Select.name]: Select,
    [Option.name]: Option,
    flatPicker
  }
})
export default class Product extends Vue {
  private form: any = {
    hidden_stock_message: ''
  };
  private showStock = true;
  private loading = false;

  updateProductStocksSettings() {

    this.loading = true;
    this.$http.patch(this.$api('/settings/1'), {product: this.showStock ? null : this.form}).then(response => {

      if (response.status == 200) {
        this.updateProductNotification(response.status);
      } else {
        this.updateProductNotification(response.status);
      }
    }).catch(error => {
      (this.$refs.formValidator as Vue & {
        setErrors: (errors: []) => any;
      }).setErrors(error.response.data.errors);
      this.$notify({
        message: "Please contact your service provider.",
        title: "Something went wrong!",
        type: 'warning'
      })
    }).finally(
      () => (this.loading = false)
    );
  }


  fetchSettings() {
    this.$http.get(this.$api(`/settings`)).then(response => {
      if (response.data.settings.product != null) {
        this.showStock = false;
        this.form = JSON.parse(response.data.settings.product);
      }
    });
  }

  updateProductNotification(status: number) {
    this.$notify({
      title: status == 200 ? 'Success' : 'Error',
      message: status == 200 ? "Settings successfully updated" : "Settings could not be updated",
      duration: 5000,
      iconClass: 'ni ni-bell-55',
      // @ts-ignore
      verticalAlign: 'bottom',
      horizontalAlign: 'right',
      type: 'success'
    });
  }

  created() {
    this.fetchSettings();
  }
}
</script>
