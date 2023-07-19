<template>
  <validation-observer ref="formValidator" v-slot="{handleSubmit}">
    <div class="card">
      <div class="card-header border-0">
        <div class="row">
          <div class="col-11">
            <div class="form-inline">
              <h3 class="mb-0">SMS</h3>
              <el-tooltip class="ml-3" content="Manage basic configuration settings for SMS notifications"
                          placement="right">
                <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
              </el-tooltip>
              <el-tooltip class="ml-3" content="Watch video tutorials" placement="right">
                <i class="fab fa-youtube" style="color: grey; font-size: 18px; cursor: pointer;"
                   @click="showGIF = true"></i>
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>
      <template>
        <!-- Dropdown header -->
        <div class="px-3 py-3">
        </div>
        <!-- List group -->
        <div class="list-group list-group-flush">
          <div class="list-group-item">
            <div class="row align-items-center  mb-5">
              <div class="col-12">
                <el-card class="box-card text-center"
                         header="Dynamic Keywords"
                         body-style="background-color: #f7fafb">
                  <div class="text item">
                    <div class="row">
                      <div class="col-1"></div>
                      <div class="col-2" v-for="(keyword, index) in keywords" :key="index">
                        <el-popover
                          placement="top-start"
                          width="200"
                          trigger="hover"
                        >
                          <span>{{ keyword.about }}</span>
                          <b class="text-sokrio" slot="reference">{{ keyword.name }}</b><br>
                        </el-popover>
                      </div>
                    </div>
                  </div>
                </el-card>
              </div>
            </div>
            <div class="row align-items-center">
              <div class="col-12">
                <collapse :multiple-active="false">
                  <collapse-item :key="index" v-for="(sms, index) in smsEvents">
                    <h5 slot="title" class="mb-0">{{ decamelize(sms.name) }}</h5>
                    <div>
                      <el-checkbox v-model="sms.enabled" class="mb-3">Enable</el-checkbox>
                      <div class="row">
                        <div class="col-6">
                          <base-input :disabled="!sms.enabled" placeholder="SMS Format" v-model="sms.format">
                          </base-input>
                        </div>
                      </div>
                      <div class="row mt-3">
                        <div class="col-1">
                          <h5 class="mb-3">Send to:</h5>
                        </div>
                        <div class="col-1">
                          <base-radio name="buyer" class="mb-3" v-model="sms.recipient">
                            buyer
                          </base-radio>
                        </div>
                        <div class="col-1">
                          <base-radio name="seller" class="mb-3" v-model="sms.recipient">
                            seller
                          </base-radio>
                        </div>
                        <div class="col-1">
                          <base-radio v-if="sms.recipient==='buyer' || sms.recipient==='seller' || !sms.recipient"
                                      name="" class="mb-3" v-model="sms.recipient">
                            others
                          </base-radio>
                          <base-radio v-if="sms.recipient.length > 0 && sms.recipient!='seller' && sms.recipient!='buyer'"
                                      :name="sms.recipient.length > 0" class="mb-3" v-model="alwaysTrue">
                            others
                          </base-radio>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-6 mt-2">
                          <base-input label="Recipients:" :rules="{ required: true, regex: /^[0-9,]*$/ }"
                                      v-if="sms.recipient!=='buyer' && sms.recipient!=='seller'"
                                      placeholder="for multiple numbers, use comma (,) and no space eg: 01710400400,01810400400 "
                                      name="recipient"
                                      v-model="sms.recipient">
                          </base-input>
                        </div>
                      </div>
                    </div>
                  </collapse-item>

                </collapse>
                <div class="row">
                  <div class="col-2">
                    <base-button block class="mx-3" type="success" @click="updateSMS()">Save</base-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div href="#!" class="dropdown-item text-center text-primary font-weight-bold py-3"></div>
      </template>
      <!--        Demo Tour GIF Modal-->
      <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle"
                :showGIF.sync="showGIF"></GIFModal>
    </div>
  </validation-observer>
</template>
<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
// @ts-ignore
import Collapse from '@/components/argon-core/Collapse/Collapse.vue';
// @ts-ignore
import CollapseItem from '@/components/argon-core/Collapse/CollapseItem.vue';
import SmsEvents from '@/assets/json/SmsEvents.json'
import {Checkbox, Card, Tag, Popover} from 'element-ui'
import GIFModal from "@/components/tour/GIFModal.vue";

@Component({
  components: {
    [Checkbox.name]: Checkbox,
    [Card.name]: Card,
    [Tag.name]: Tag,
    [Popover.name]: Popover,
    Collapse,
    CollapseItem,
    GIFModal
  }
})
export default class SMS extends Vue {
  private smsEvents: Array<object> = []
  private keywords: Array<object> = [
    {
      "name": "{buyer}",
      "about": "Indicates the department which is buying."
    },
    {
      "name": "{seller}",
      "about": "Indicates the department which is selling."
    },
    {
      "name": "{invoice}",
      "about": "Indicates the invoice ID."
    },
    {
      "name": "{fieldforce}",
      "about": "Indicates the associated field force."
    },
    {
      "name": "{amount}",
      "about": "Indicates the total amount of invoice."
    }
  ]
  private alwaysTrue: boolean = true;
  private showGIF: boolean = false;
  private demoTourEntity: string = 'smsEvents';
  private GIFs: Array<any> = [
    {
      label: 'Create an SMS event',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
    },
    {
      label: 'Update an SMS event',
      url: 'https://www.youtube.com/embed/WoM3wuI4sJQ'
    },
    {
      label: 'Delete an SMS event',
      url: 'https://www.youtube.com/embed/LeAltgu_pbM'
    }
  ];
  private demoTourTitle: string = 'A quick demo of SMS events';

  fetchSettings() {
    this.$http.get(this.$api(`/settings`)).then(response => {
      if (response.data.settings.sms_events != null) {
        if (!JSON.parse(response.data.settings.sms_events)[0].hasOwnProperty('recipient')) {
          this.smsEvents = JSON.parse(response.data.settings.sms_events).map(function (el: any) {
            var smsEvent = Object.assign({}, el);
            smsEvent.recipient = 'buyer';
            return smsEvent;
          })
          this.$http.patch(this.$api('/settings/1'), {sms_events: this.smsEvents});
        } else {
          this.smsEvents = JSON.parse(response.data.settings.sms_events);
        }
      } else {
        this.smsEvents = SmsEvents;
        this.$http.patch(this.$api('/settings/1'), {sms_events: this.smsEvents});
      }
    });
  }

  decamelize(str: string) {
    var result = str.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
  }

  updateSMS() {
    this.$http.patch(this.$api('/settings/1'), {sms_events: this.smsEvents}).then(response => {
      if (response.status == 200) {
        this.updateSMSNotification(response.status);
      } else {
        this.updateSMSNotification(response.status);
      }
    })
  }

  updateSMSNotification(status: number) {
    this.$notify({
      title: status == 200 ? 'Success' : 'Error',
      message: status == 200 ? "SMS settings updated" : "SMS settings could not be updated",
      duration: 5000,
      iconClass: 'fa fa-sms',
      // @ts-ignore
      verticalAlign: 'bottom',
      horizontalAlign: 'right',
      type: status == 200 ? 'success' : 'warning'
    });
  }

  created() {
    this.fetchSettings();
  }
}
</script>
<style scoped>
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: auto;
}
</style>
