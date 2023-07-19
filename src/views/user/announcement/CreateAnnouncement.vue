<template>
  <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
    <modal :show="newAnnouncement" @close="close('closed')">
      <template slot="header">
        <h5 class="modal-title" id="exampleModalLabel">{{ isUpdate ? 'Update' : 'Add New ' }} Announcement</h5>
      </template>
      <div>
        <base-input v-model="form.title" label="Title" name="title" placeholder="e.g. Eid Vacation" />
        <base-input label="Description" name="body">
          <textarea class="form-control" v-model="form.body" id="body" rows="3" placeholder="e.g. Hello. We would like to announce..."></textarea>
        </base-input>
        <base-input label="Type" name="type">
          <select class="form-control" id="announcementtype" v-model="form.type">
            <option selected disabled value="">Select Type</option>
            <option value="event">Event</option>
            <option value="holiday">Holiday</option>
            <option value="promotion">Promotion</option>
            <option value="others">Others</option>
          </select>
        </base-input>
        <base-input label="Start From" name="starts_at" prepend-icon="fas fa-calendar">
          <flat-picker
            slot-scope="{ focus, blur }"
            v-model="form.starts_at"
            :config="{ allowInput: true }"
            class="form-control datepicker"
            @on-open="focus"
            @on-close="blur"
          >
          </flat-picker>
        </base-input>
        <base-input label="Ends On" name="ends_at" prepend-icon="fas fa-calendar">
          <flat-picker
            slot-scope="{ focus, blur }"
            v-model="form.ends_at"
            :config="{ allowInput: true }"
            class="form-control datepicker"
            @on-open="focus"
            @on-close="blur"
          >
          </flat-picker>
        </base-input>
      </div>
      <template slot="footer">
        <slot name="footer" v-bind:handleSubmit="handleSubmit">
          <base-button type="secondary" @click="close">Close</base-button>
          <base-button type="success" @click="save('closed')" :disabled="disableBtn">Save</base-button>
        </slot>
      </template>
    </modal>
  </validation-observer>
</template>
<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
  import Announcement from '@/intefaces/Announcement';
  import Permission from '@/intefaces/Permission';
  import BaseCUModalComponent from "@/mixins/BaseCUModalComponent";
  import {AxiosResponse} from "axios";
  import BaseProduct from "@/intefaces/BaseProduct";
  import DepartmentType from "@/intefaces/DepartmentType";
  const flatPicker = require('vue-flatpickr-component');

  @Component({
    name: 'CreateAnnouncement',

    components: {
      flatPicker,
    },
  })
  export default class CreateAnnouncement extends Vue {
    @Prop() newAnnouncement!: boolean;
    @Prop() isUpdate!: boolean;
    private announcement: Announcement[] = [];
    @Prop() isForSetupWizard!: boolean;
    @Prop() currentEntity!: any;
    @Prop() currentAnnouncement!: any;
    @Prop({
      default: () => ({
        title: '',
        body: '',
        type: '',
        starts_at: '',
        ends_at: '',
      }),
    })
    form!: {
      title: string;
      body: string;
      type: string;
      starts_at: string;
      ends_at: string;
    };
    private is_remove_permission = false;
    private permissions: Permission[] = [];
    private disableBtn = false;
    private isActivePermission: boolean = false;

    createAnnouncement() {
      this.isUpdate=false;
      this.disableBtn = true;
      this.$http
        .post(this.$api('/announcements'), this.form)
        .then((response) => {
          this.$notify({
            title: 'Success',
            message: 'Successfully Created',
            duration: 5000,
            iconClass: 'ni ni-bell-55',
            type: 'success',
          });
          this.$emit('created', response.data.announcement);
          this.form.title = '';
          this.form.body = '';
          this.form.type = '';
          this.form.starts_at = '';
          this.form.ends_at = '';
          this.disableBtn = false;
        })
        .catch((error) => {
          this.disableBtn = false;
          (
            this.$refs.formValidator as Vue & {
              setErrors: (errors: []) => any;
            }
          ).setErrors(error.response.data.errors);
        });
      this.formReset();
    }

    /* save() {
       this.createAnnouncement() ;
       this.formReset();

     }*/
    save()
    {
      this.isUpdate ? this.updateAnnouncement() : this.createAnnouncement();

    }


    formReset(): any {
      this.form.title = '';
      this.form.body = '';
      this.form.type = '';
      this.form.starts_at = '';
      this.form.ends_at = '';
      return this.form;
    }



    updateAnnouncement() {
      this.disableBtn = true;
      this.$http.patch(this.$api(`/announcements/${this.currentEntity.id}`), {
        title:this.form.title,
        body:this.form.body,
        type:this.form.type,
        starts_at:this.form.starts_at,
        ends_at:this.form.ends_at,

      })
        .then(response => {
          this.$emit('updated', response.data.announcement);
          this.$notify({

            title: 'Success',
            message: 'Successfully Updated',
            duration: 3000,
            iconClass: 'ni ni-bell-55',
            type: 'success'
          });
        })
        .catch(error => {
          this.disableBtn = false;
          (this.$refs.formValidator as Vue & {
            setErrors: (errors: []) => any;
          }).setErrors(error.response.data.errors);
        });
      this.formReset();

    }


    close(){
      this.disableBtn=false;
      this.$emit('closed');
      this.$emit('update:isActive', false);
      this.$emit('update:form', {
        title: '',
        body: '',
        type: '',
        starts_at: '',
        ends_at: '',
      });
      this.isUpdate = true;
      this.disableBtn=false;

    }

  }
</script>
