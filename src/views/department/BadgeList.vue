<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row">
        <div class="col-6">
          <div class="form-inline">
            <h3 class="mb-0">Badges</h3>
            <el-tooltip class="ml-3" content="Manage group or category for your department. Ex: Gold, sliver etc" placement="right">
              <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
            </el-tooltip>
            <el-tooltip class="ml-3" content="Watch video tutorials" placement="right">
              <i class="fab fa-youtube" style="color: grey; font-size: 18px; cursor: pointer;" @click="showGIF = true"></i>
            </el-tooltip>
          </div>
        </div>
        <div class="col-6 text-right">
          <el-tooltip content="Filters" placement="top">
            <base-button
              type="primary"
              icon
              size="sm"
              @click="isFilterModelActive == true ? (isFilterModelActive = false) : (isFilterModelActive = true)"
            >
              <span class="btn-inner--text">Filters</span>
              <span class="btn-inner--icon">
                <i class="fas fa-filter"></i>
              </span>
            </base-button>
          </el-tooltip>
          <el-tooltip content="Add New Badge" placement="top">
            <base-button type="primary" icon size="sm" @click="isActive = true">
              <span class="btn-inner--icon">
                <i class="fas fa-plus"></i>
              </span>
              <span class="btn-inner--text">Add</span>
            </base-button>
          </el-tooltip>
        </div>

        <!--                Start of Create & update Modal           -->
        <CreateBadgeForm
          :currentEntity="isUpdate ? currentEntity : null"
          :form.sync="form"
          :is-active.sync="isActive"
          :is-update.sync="isUpdate"
          @created="entityCreated($event)"
          @updated="entityUpdated($event)"
        >
        </CreateBadgeForm>
        <!--                End of Create & update Modal           -->
      </div>
    </div>
    <el-table
      v-loading="loading"
      class="table-responsive align-items-center table-flush table-striped"
      header-row-class-name="thead-light"
      :data="badges"
    >
      <el-table-column label="Name" min-width="250px" prop="name" sortable>
        <template v-slot="{ row }">
          <b>{{ row.name }}</b>
        </template>
      </el-table-column>
      <el-table-column label="MRP Discount (%)" min-width="210px" prop="name" sortable>
        <template v-slot="{ row }">
          <b>{{ row.mrp_discount }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Created At" min-width="210px" prop="created_at" sortable>
        <template v-slot="{ row }">
          <b>{{ row.created_at | datetime('ll') }}</b>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" align="center">
        <div slot-scope="{ row }" class="table-actions">
          <el-tooltip content="Update Badge" placement="top">
            <a href="#!" @click.prevent="onEdit(row)" class="table-action" data-toggle="tooltip" data-original-title="Edit product">
              <i class="fas fa-edit"></i>
            </a>
          </el-tooltip>
          <!--          <el-tooltip content="Delete" placement="top">-->
          <!--            <a-->
          <!--              href="#!"-->
          <!--              @click.prevent="(showDeleteModal = true), (currentEntity = row)"-->
          <!--              class="table-action table-action-delete"-->
          <!--              data-toggle="tooltip"-->
          <!--              data-original-title="Delete Territory Type"-->
          <!--            >-->
          <!--              <i class="fas fa-trash"></i>-->
          <!--            </a>-->
          <!--          </el-tooltip>-->
        </div>
      </el-table-column>
    </el-table>
    <base-pagination
      class="mt-3"
      v-if="badges.length > 0"
      v-model="pagination.currentPage"
      :perPage="pagination.entityPerPage"
      :total="pagination.totalEntity"
      align="center"
      :disabled="loading"
    ></base-pagination>

    <filter-drawer-component v-if="isFilterModelActive" :visible.sync="isFilterModelActive" direction="rtl"
                             title="Badge Channel Filter" @closeBtn="onFilterSubmit"
                             @resetBtn="resetBtn">
      <base-input label="Badge Name" v-model="filters.name" name="name" placeholder="e.g. ABC Badge"></base-input>
      <div class="clr"></div>

      <div class="clr"></div>
      <DateRangeForReport v-model="filters.range" label-prop="Date Range"></DateRangeForReport>

      <div class="clr"></div>
      <br>


    </filter-drawer-component>
    <!--    Delete Modal-->

    <modal :show.sync="showDeleteModal">
      <template>
        <h5 class="modal-title" id="exampleModalLabel1">
          Are you sure you want to delete this ?
        </h5>
      </template>
      <template slot="footer">
        <base-button type="secondary" @click="showDeleteModal = false">Close</base-button>
        <base-button type="danger" @click.prevent="deleteEntity">Delete</base-button>
      </template>
    </modal>

    <!--        End Delete Modal     -->

    <!--        Demo Tour GIF Modal-->
    <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle" :showGIF.sync="showGIF"></GIFModal>
  </div>
</template>
<script lang="ts">
  import {Vue, Component, Mixins, Watch} from 'vue-property-decorator';
  import CreateBadgeForm from '@/views/department/CreateBadgeForm.vue';
  import {Dropdown, DropdownItem, DropdownMenu, Table, TableColumn, Tooltip, Tag} from 'element-ui';
  import Badge from '@/intefaces/Badge';
  import PaginationComponentMixin from '@/mixins/PaginationComponent';
  import GIFModal from '@/components/tour/GIFModal.vue';
  import FilterDrawerComponent from "@/components/FilterDrawerComponent.vue";
  import DateRangeForReport from '@/components/DateRangeForReports.vue';
  import { QueryBuilder } from '@/classes/QueryBuilder';

  @Component({
    components: {
      CreateBadgeForm,
      GIFModal,
      [Tooltip.name]: Tooltip,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      [Dropdown.name]: Dropdown,
      [DropdownItem.name]: DropdownItem,
      [DropdownMenu.name]: DropdownMenu,
      [Tag.name]: Tag,
      FilterDrawerComponent,
      DateRangeForReport,
    }
  })
  export default class BadgeList extends Mixins(PaginationComponentMixin) {
    private badges: Badge[] = [];
    private showDeleteModal = false;
    private isActive = false;
    private isUpdate = false;
    private showGIF: boolean = false;
    private isFilterModelActive = false;
    private currentEntity!: Badge;
    private queryBuilder = new QueryBuilder();
    protected form = {
      name: '',
      mrp_discount: 0
    };
    private demoTourEntity: string = 'badge';
    private GIFs: Array<any> = [
      {
        label: 'Create a badge',
        url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
      },
      {
        label: 'Update a badge',
        url: 'https://www.youtube.com/embed/WoM3wuI4sJQ'
      },
      {
        label: 'Delete a badge',
        url: 'https://www.youtube.com/embed/LeAltgu_pbM'
      }
    ];
    private demoTourTitle: string = 'A quick demo of badge';

    created() {
      this.fetchEntity();
    }

    entityCreated(entity: Badge) {
      this.badges.unshift(entity);
    }

    entityUpdated(entity: Badge): void {
      this.badges.splice(
        this.badges.findIndex(type => type.id == entity.id),
        1,
        entity
      );
    }

    onEdit(row: Badge) {
      this.isUpdate = true;
      this.currentEntity = row;
      this.form = {
        name: this.currentEntity.name,
        mrp_discount: this.currentEntity.mrp_discount
      };
      this.isActive = true;
    }

    @Watch('filters.name', { deep: true })
    onChangeNameFiler(newVal: string) {
      this.queryBuilder.addListener('name', newVal);
    }
    @Watch('filters.range', { deep: true })
    onChangeSubmissionDateRange(value: string) {
      this.queryBuilder.addListener('range', value);
    }
    private filters: any = {
      name: '',
      range: ''
    };
    resetBtn() {
      this.filters.name= '';
      this.filters.range= '';
    }
    onFilterSubmit() {
      this.isFilterModelActive = false;
    }
    @Watch('queryBuilder.watch')

    @Watch('pagination.currentPage')
    fetchEntity(): void {
      this.loading = true;
      this.$http.get(this.$api(`/badges${this.queryBuilder.getFilters(true) ?this.queryBuilder.getFilters(true): '?'}&allStatus&page=${this.pagination.currentPage}`)).then(response => {
        this.badges = response.data.badges;
        this.setPagination(response.data);
        this.loading = false;
      });
    }

    deleteEntity(): void {
      this.$http.delete(this.$api(`/badges/${this.currentEntity.id}`)).then(response => {
        this.showDeleteModal = false;
        this.badges.splice(
          this.badges.findIndex(value => value.id == this.currentEntity.id),
          1
        );
        this.$notify({
          title: 'Success',
          message: 'Successfully Deleted',
          duration: 5000,
          iconClass: 'ni ni-bell-55',
          type: 'success'
        });
      });
    }
  }
</script>
