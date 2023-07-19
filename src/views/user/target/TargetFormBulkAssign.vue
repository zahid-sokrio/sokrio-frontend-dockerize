<template>
  <div>
    <validation-observer ref="formValidator" v-slot="{ handleSubmit }">
      <!--      <form class="needs-validation"-->
      <!--            @submit.prevent="handleSubmit(save)">-->
      <modal :show="isBulkActive" v-if="isBulkActive" size="lg" @close="close" class="modal-dialog-scrollable">
        <template slot="header">
          <h5 class="modal-title">Bulk Assign Target</h5>
        </template>
        <div class="row">
          <div class="col-md-6">
            <base-input :rules="{ required: true }" label="Action On" name="action on">
              <el-select v-model="actionOn" filterable placeholder="Action On" style="border: none">
                <el-option v-for="(type, index) in types" :key="index" :label="type.label" :value="type.value"></el-option>
              </el-select>
            </base-input>
          </div>
          <div class="col-md-6">
            <base-input :rules="{ required: true }" label="Schemes" name="schemes">
              <el-select v-model="theScheme" :disabled="!actionOn" filterable placeholder="Select Timespan" style="border: none">
                <el-option v-for="(scheme, index) in schemes" :key="index" :label="scheme.label" :value="scheme.val"></el-option>
              </el-select>
            </base-input>
          </div>
        </div>
        <div class="alignContent">
          <base-button :loading="downloading" class="btn-sm" type="primary" @click.prevent="onClickDownload">
            <i class="fa fa-download"></i> Download Bulk Format
          </base-button>
          <base-button :disabled="!theScheme" icon size="sm" type="primary" @click.prevent="modalAddView">
            <span class="btn-inner--icon">
              <i class="fas fa-plus"></i>
            </span>
            <span class="btn-inner--text">Bulk Add</span>
          </base-button>
          <base-button icon size="sm" type="primary" @click.prevent="modalUpdateView">
            <span class="btn-inner--icon">
              <i class="fas fa-edit"></i>
            </span>
            <span class="btn-inner--text">Bulk Update</span>
          </base-button>
        </div>
        <template slot="footer">
          <base-button type="secondary" @click="close">Close</base-button>
        </template>
      </modal>
      <!--      </form>-->
    </validation-observer>

    <modal :show="BulkAddModal" @close="BulkAddModal = false">
      <template slot="header">
        <h5 class="modal-title">Bulk Assign Add</h5>
      </template>
      <div class="card">
        <div class="card-header">
          <h3 class="mb-0">Select a CSV file:</h3>
        </div>
        <form>
          <file-input @change="filesChange" accept=".csv"></file-input>
        </form>
      </div>
      <ul>
        <li class="text-danger" v-for="(errorBag, index) in errors" :key="index">
          <h5 class="text-danger" v-for="(error, index) in errorBag" :key="index">{{ error }}</h5>
        </li>
      </ul>
      <template slot="footer">
        <base-button @click="closeBulkUpload" type="secondary">Close</base-button>
        <base-button :loading="btnDisabled" :disabled="btnDisabled" type="success" @click.prevent="_import">Import</base-button>
      </template>
    </modal>
    <modal :show="BulkUpdateModal" @close="BulkUpdateModal = false">
      <template slot="header">
        <h5 class="modal-title">Bulk Assign Update</h5>
      </template>
      <div class="card">
        <div class="card-header">
          <h3 class="mb-0">Select a CSV file:</h3>
        </div>
        <form>
          <file-input @change="filesChange" accept=".csv"></file-input>
        </form>
      </div>
      <ul>
        <li class="text-danger" v-for="(errorBag, index) in errors" :key="index">
          <h5 class="text-danger" v-for="(error, index) in errorBag" :key="index">{{ error }}</h5>
        </li>
      </ul>
      <template slot="footer">
        <base-button @click="BulkUpdateModal = false" type="secondary">Close</base-button>
        <base-button :loading="btnDisabled" :disabled="btnDisabled" type="success" @click.prevent="importFileUpdate">Import</base-button>
      </template>
    </modal>
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Prop, Vue, Watch } from 'vue-property-decorator';
import Target from '@/intefaces/Target';
import UserAutocomplete from '@/components/lazyDropdown/UserLazydropdown.vue';
import ProductLazydropdown from '@/components/lazyDropdown/ProductLazydropdown.vue';
import TaxonomyMixin from '@/mixins/TaxonomyComponent';
import RegularTargetComponent from '@/views/user/target/RegularTargetComponent.vue';
import RouteWiseTargetComponent from '@/views/user/target/RouteWiseTargetComponent.vue';
import RouteWiseTargetLists from '@/intefaces/RouteWiseTargetLists';
import { TabPane, Tabs } from 'element-ui';
import FileInput from '@/components/argon-core/Inputs/FileInput.vue';
import { AxiosError, AxiosResponse } from 'axios';
@Component({
  components: {
    UserAutocomplete,
    ProductLazydropdown,
    RegularTargetComponent,
    RouteWiseTargetComponent,
    FileInput,
    [Tabs.name]: Tabs,
    [TabPane.name]: TabPane
  },
  name: 'TargetForm'
})
export default class TargetForm extends Mixins(TaxonomyMixin) {
  @Prop() isBulkActive!: boolean;
  @Prop() isUpdate!: boolean;
  @Prop() currentTraget!: Target;
  @Prop() currentLableForInvoice!: string;
  @Prop() passTargetAssignId!: number;
  @Prop() routeColumnTitle!: string;
  private disableSaveBtn = false;
  private routeWiseTargetLists: RouteWiseTargetLists[] = [];
  public BulkAddModal: boolean = false;
  public BulkUpdateModal: boolean = false;
  private csvFile: Blob | string = '';
  public actionOn: string = '';
  public theScheme: string = '';
  public errors: Array<string> = [];
  public downloading: boolean = false;
  public btnDisabled: boolean = false;

  data() {
    return {
      types: [
        {
          value: 'invoice',
          label: 'Invoice'
        },
        {
          value: 'order',
          label: 'Order'
        },
        {
          value: 'delivery',
          label: 'Delivery'
        }
      ],
      schemes: [
        {
          val: 'onetime',
          label: 'ONETIME'
        }
      ],
      value: '',
      val: ''
    };
  }

  filesChange(files: FileList) {
    this.csvFile = files[0];
  }
  modalAddView() {
    this.isBulkActive = false;
    this.BulkAddModal = true;
  }
  modalUpdateView() {
    this.BulkUpdateModal = true;
    this.isBulkActive = false;
  }
  _import() {
    this.btnDisabled = true;
    let form = new FormData();
    form.append('bulkTarget', this.csvFile);
    this.$http
      .post(this.$api(`/target/bulk-import/add?target_name_id=${this.passTargetAssignId}&action_on=${this.actionOn}&scheme=${this.theScheme}`), form)
      .then((response: AxiosResponse) => {
        this.$notify({
          title: 'Success',
          message: response.data.message,
          duration: 3000,
          iconClass: 'ni ni-bell-55',
          type: 'success'
        });
        this.btnDisabled = false;
        this.BulkAddModal = false;
        this.actionOn = '';
        this.theScheme = '';
        this.errors = [];
        this.$emit('created', response.data);
      })
      .catch((err: any) => {
        if (this.csvFile) {
          if (err.response.status == 422) {
            this.errors = err.response?.data.errors;
          } else {
            this.$notify({
              title: 'Warning',
              message: 'Please import the correct file',
              duration: 3000,
              iconClass: 'ni ni-bell-55',
              type: 'warning'
            });
          }
        } else {
          this.errors = err.response?.data.errors;
        }
        this.btnDisabled = false;
      });
  }
  importFileUpdate() {
    this.btnDisabled = true;
    let form = new FormData();
    form.append('bulkTarget', this.csvFile);
    this.$http
      .post(
        this.$api(`/target/bulk-import/update?target_name_id=${this.passTargetAssignId}&action_on=${this.actionOn}&scheme=${this.theScheme}`),
        form
      )
      .then((response: AxiosResponse) => {
        this.$notify({
          title: 'Success',
          message: response.data.message,
          duration: 3000,
          iconClass: 'ni ni-bell-55',
          type: 'success'
        });
        this.btnDisabled = false;
        this.BulkUpdateModal = false;
        this.actionOn = '';
        this.theScheme = '';
        this.errors = [];
        this.$emit('created', response.data);
      })
      .catch((err: any) => {
        if (this.csvFile) {
          if (err.response.status == 422) {
            this.errors = err.response?.data.errors;
          } else {
            this.$notify({
              title: 'Warning',
              message: 'Please import the correct file',
              duration: 3000,
              iconClass: 'ni ni-bell-55',
              type: 'warning'
            });
          }
        } else {
          this.errors = err.response?.data.errors;
        }
        this.btnDisabled = false;
      });
  }
  async onClickDownload() {
    this.downloading = true;
    try {
      let { data, headers } = await this.$http.get(this.$api('/target/bulk-export?download'), {
        responseType: 'arraybuffer'
      });
      const blob = await new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = await URL.createObjectURL(blob);
      link.download = this.$getFileNameFromContentDisposition(headers);
      link.click();
    } catch (e) {
      this.$notify({ title: 'Something wants wrong!', type: 'warning', message: 'Unable to download reports.' });
    } finally {
      this.downloading = false;
    }
  }

  notify(title: string, message: string, type: 'success' | 'warning' | 'info' | 'error') {
    this.$notify({
      title: title,
      message: message,
      duration: 3000,
      iconClass: 'ni ni-bell-55',
      type: type
    });
  }
  closeBulkUpload() {
    this.BulkAddModal = false;
    this.errors = [];
    this.theScheme = '';
    this.actionOn = '';
  }
  close() {
    this.$emit('update:isBulkActive', false);
    this.$emit('assignIdFromTargetAssignReset', (this.passTargetAssignId = 0));
    this.routeWiseTargetLists = [];
    this.disableSaveBtn = false;
  }
}
</script>
<style scoped>
.invalid-feedback {
  display: none;
}
.alignContent {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>
