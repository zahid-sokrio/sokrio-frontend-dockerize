<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <div class="form-inline">
            <h3 class="mb-0">Announcements</h3>
            <el-tooltip class="ml-3" content="Manage assignable announcements for user, such as Admin, Manager etc" placement="right">
              <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
            </el-tooltip>
            <el-tooltip class="ml-3" content="Watch video tutorials" placement="right">
              <i class="fab fa-youtube" style="color: grey; font-size: 18px; cursor: pointer" @click="showGIF = true"></i>
            </el-tooltip>
          </div>
        </div>
        <div class="col-6 text-right">
          <el-tooltip content="Add New Announcement" placement="top">
            <base-button type="primary" icon size="sm" @click="newAnnouncement = true,isUpdate=false" >
              <span class="btn-inner--icon">
                <i class="fas fa-plus"></i>
              </span>
              <span class="btn-inner--text">Add</span>
            </base-button>
          </el-tooltip>
        </div>
        <create-announcement
          :currentEntity="isUpdate ? currentEntity : null"
          v-if="newAnnouncement"
          :new-announcement.sync="newAnnouncement"
          :form.sync="form"
          :current-announcement="currentAnnouncement"
          :is-update.sync="isUpdate"
          @created="announcementCreated($event)"
          @updated="entityUpdated($event)"
          @closed="newAnnouncement = false"
        ></create-announcement>
      </div>
    </div>

    <el-table
      v-loading="loading"
      class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light"
      :data="announcements"
    >
      <el-table-column label="Name" min-width="310px" prop="title" sortable>
        <template v-slot="{ row }">
          <b>{{ row.title }}</b>
        </template>
      </el-table-column>

      <el-table-column label="Description" min-width="200px" prop="body" sortable>
        <template v-slot="{ row }">
          <b>{{ row.body }}</b>
        </template>
      </el-table-column>

      <el-table-column label="Type" min-width="200px" prop="body" sortable>
        <template v-slot="{ row }">
          <b>{{ row.type }}</b>
        </template>
      </el-table-column>

      <el-table-column label="Status" min-width="200px">
        <template v-slot="{ row }">
          <b>{{ new Date(row.ends_at) > new Date() ? 'Ongoing' : '-' }}</b>
        </template>
      </el-table-column>

      <el-table-column label="Created At" prop="created_at" min-width="140px" sortable>
        <template v-slot="{ row }">
          <b v-if="row.created_at">{{ row.created_at | datetime('ll') }}</b>
          <b v-else> - </b>
        </template>
      </el-table-column>

      <el-table-column label="Ends At" prop="ends_at" min-width="140px" sortable>
        <template v-slot="{ row }">
          <b v-if="row.ends_at">{{ row.ends_at | datetime('ll') }}</b>
          <b v-else> - </b>
        </template>
      </el-table-column>

      <el-table-column min-width="150px" align="center">
        <div slot-scope="{ row }" class="table-actions">
          <el-tooltip content="Update Announcement" placement="top">
            <a href="#!" @click.prevent="onEdit(row)" class="table-action" data-toggle="tooltip"
               data-original-title="Edit Announcement">
              <i class="fas fa-edit"></i>
            </a>
          </el-tooltip>
        </div>
      </el-table-column>
    </el-table>

    <base-pagination
      v-if="pagination.total > pagination.perPage"
      class="mt-2"
      align="center"
      :total="pagination.total"
      :perPage="pagination.perPage"
      @input="fetchAnnouncements"
      v-model="pagination.currentPage"
      :disabled="loading"
    ></base-pagination>

    <!--        Demo Tour GIF Modal-->
    <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle" :showGIF.sync="showGIF"></GIFModal>

    <base-pagination
      v-if="announcements.length > 0"
      v-model="pagination.currentPage"
      :perPage="pagination.entityPerPage"
      :total="pagination.totalEntity"
      align="center"
      class="mt-3"
      :disabled="loading"
    ></base-pagination>
  </div>
</template>
<script lang="ts">
  import {Component, Mixins, Prop, Vue} from 'vue-property-decorator';
  import Announcement from '@/intefaces/Announcement';
  import CreateAnnouncement from '@/views/user/announcement/CreateAnnouncement.vue';
  import GIFModal from '@/components/tour/GIFModal.vue';
  import { Permission as PermissionEnum } from '@/enums/Permission';
  import PaginationComponentMixin from '@/mixins/PaginationComponent';
  import { Table, TableColumn, DropdownMenu, DropdownItem, Dropdown, Tooltip, Tag } from 'element-ui';
  import Transport from "@/intefaces/Transport";

  @Component({
    components: {
      [Tooltip.name]: Tooltip,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      [Dropdown.name]: Dropdown,
      [DropdownItem.name]: DropdownItem,
      [DropdownMenu.name]: DropdownMenu,
      [Tag.name]: Tag,
      CreateAnnouncement,
      GIFModal,
    },
  })
  export default class AnnouncementList extends Mixins(PaginationComponentMixin) {
    private announcements: Announcement[] = [];
    private isActive = false;
    private newAnnouncement = false;
    private isUpdate = false;
    private currentEntity!: any;
    private currentAnnouncement: any = [];
    public loading = false;
    private showGIF: boolean = false;
    private form = {
      title: '',
      body: '',
      type: '',
      starts_at: '',
      ends_at: '',
    };
    private demoTourEntity: string = 'announcement';
    private GIFs: Array<any> = [
      {
        label: 'Create a announcement',
        url: 'https://www.youtube.com/embed/jNQXAC9IVRw',
      },
      {
        label: 'Update a announcement',
        url: 'https://www.youtube.com/embed/WoM3wuI4sJQ',
      },
      {
        label: 'Delete a announcement',
        url: 'https://www.youtube.com/embed/LeAltgu_pbM',
      },
    ];
    private demoTourTitle: string = 'A quick demo of announcement';

    get permissionEnum() {
      return PermissionEnum;
    }

    fetchAnnouncements() {
      this.loading = true;
      let isFirstPage = this.pagination.currentPage < 2;
      let url = isFirstPage ? '/announcements' : `/announcements?page=${this.pagination.currentPage}`;

      this.$http.get(this.$api(url)).then((response) => {
        this.announcements = response.data.announcements;
        this.setPagination(response.data);
        this.loading = false;
      });
    }

    announcementCreated(announcement: Announcement) {
      this.newAnnouncement = false;
      this.isUpdate = false;
      this.announcements.unshift(announcement);
    }

    created() {
      this.newAnnouncement = false;
      this.isUpdate = false;
      this.fetchAnnouncements();
    }



    entityUpdated(entity: Announcement): void {
      this.newAnnouncement = false;
      this.announcements.splice(
        this.announcements.findIndex(type => type.id == entity.id),
        1,
        entity
      );
    }

    onEdit(row: Announcement) {
      this.isUpdate = true;
      this.newAnnouncement = true;
      this.currentEntity = row;
      this.form = {
        title:this.currentEntity.title,
        body:this.currentEntity.body,
        type:this.currentEntity.type,
        starts_at:this.currentEntity.starts_at,
        ends_at:this.currentEntity.ends_at,
      };
      this.isActive = true;

    }
  }
</script>
