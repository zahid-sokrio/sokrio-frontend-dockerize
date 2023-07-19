<template>
  <div>
    <base-button size="sm" block type="primary" @click="modal = true">
      Staff
    </base-button>
    <modal :show.sync="modal">
      <h6 slot="header" class="modal-title" id="modal-title-default">Assigned Staff.</h6>
      <div class="row" v-if="modal">
        <div class="col-6">
          <MemberAutocomplete
            v-if="refresh"
            placeholder="Add more staff."
            v-model="addableStaff"
            :end-point="'users'"
            :multiple="true"
          ></MemberAutocomplete>
        </div>
        <div class="col-6" v-show="addableStaff.length>0">
          <base-button type="primary" @click="onClickAddManager" class="mt-1">Add</base-button>
        </div>
      </div>
      <ul v-if="managers.length>0" class="list-group list-group-flush list my--3">
        <li v-for="manager in managers" :key="manager.id" class="list-group-item px-0">
          <div class="row text-left">
            <div class="col-auto">
              <!-- Avatar -->
              <a href="#" class="avatar rounded-circle">
                <async-image v-slot="slotProps" v-if="manager.propic_url"
                             :url="manager.propic_url">
                  <img :src="slotProps.imageSrc" class="rounded-circle" height="30px" width="30px"
                       alt="Profile Picture"/>
                </async-image>
                <img v-else :src="`${$cdn}/img/avatar.png`" class="rounded-circle" height="50px" width="35px"
                     alt="Profile Picture"/>
              </a>
            </div>
            <div class="col">
              <h4><i class="fas fa-address-card text-primary"></i> {{ manager.name + ' - ' }}
                <span style="color: #474791">{{ manager.code }}</span></h4>
              <h5><i class="fa fa-envelope text-sokrio"></i> {{ manager.email }}</h5>
            </div>
            <div class="ml-auto col text-right">
              <base-button @click="onClickRemoveManager(manager)" size="sm" type="warning">
                <i class="fas fa-trash"></i>
              </base-button>
            </div>
          </div>
        </li>
      </ul>
      <h3 v-else class="text-gray text-center">Staff Not Assigned</h3>
      <template slot="footer">
        <base-button type="success" class="ml-auto" @click="onClickModalClose">Close</base-button>
      </template>
    </modal>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Mixins, Watch, Prop } from 'vue-property-decorator';
import DepartmentType from '@/intefaces/DepartmentType';
//@ts-ignore
import CreateChannelForm from '@/views/department/CreateChannelForm.vue';
import PaginationComponentMixin from '@/mixins/PaginationComponent';
import AsyncImage from "@/components/AsyncImage.vue";
import User from "@/intefaces/User";
import MemberAutocomplete from "@/components/resources-autocomplete/MemberAutocomplete.vue";
import Department from "@/intefaces/Department";

@Component({
  components: {MemberAutocomplete, AsyncImage}
})
export default class StaffList extends Mixins(PaginationComponentMixin) {
  public modal: boolean = false
  public loading: boolean = false
  public refresh: boolean = true
  public managers: any = [];
  public addableStaff: number[] = [];

  @Prop({required: true})
  public department!: Department;

  @Watch('modal')
  async onChangeModelState(value: boolean) {
    this.addableStaff = []
    if (value) {
      this.loading = true;
      try {
        this.managers = this.department.users
      } catch (e) {
        this.$notify({title: 'Something went wrong.', message: 'Unable to load staff.', type: "error"});
      } finally {
        this.loading = false;
      }
    }
  }

  onClickRemoveManager(manager: User) {
    this.$conformation({
      title: `Are you sure want to remove "${manager.name}" ?`,
      onAccept: async () => {
        try {
          await this.$http.delete(this.$api(`/users/${manager.id}/outlets/${this.department.id}`))
          this.managers.splice(this.managers.findIndex((value: any) => value.id == manager.id), 1)
          this.$notify({title: 'Successful!', message: 'Staff removed successfully.'})
        } catch (e) {
          this.$notify({title: 'Something went wrong.', message: 'Unable to remove manager.', type: "error"})
        }
      }
    });
  }

  onClickAddManager() {
    this.$conformation({
      title: `Are you sure want to add manager ?`,
      onAccept: async () => {
        try {
          this.addableStaff.forEach((staff: any) => {
            this.$http.post(this.$api(`/users/${staff}/outlets`),
              {
                'department_id': this.department.id
              }).then(response => {
              var staffName = '';
              this.$http.get(this.$api(`/users/${staff}`)).then(response => {
                this.managers.unshift(response.data.user)
                staffName = response.data.user.name;
              })
              this.$notify({title: 'Successful!', message: 'Staff added successfully.'})
            }).catch(error => {
              this.$notify({title: 'Something went wrong.', message: 'Unable to add staff.', type: "warning"})
            });
          })
          this.addableStaff = []
        } catch (e) {
          this.$notify({title: 'Something went wrong.', message: 'Unable to add staff.', type: "warning"})
        }
      }
    });
  }

  onClickModalClose() {
    if (this.addableStaff.length > 0) {
      this.$conformation({
        title: "You have unsaved staff. Are you sure you want to leave?",
        onAccept: async () => {
          this.modal = false
        }
      })
    } else {
      this.modal = false;
    }
  }

  @Watch('managers')
  refreshMemberAutocomplete() {
    this.refresh = false
    this.$nextTick(function () {
      this.refresh = true
    })
  }
}
</script>
