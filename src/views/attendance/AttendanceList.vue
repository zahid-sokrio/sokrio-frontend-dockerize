<template>
  <div>
    <base-header class="pb-6 content__title content__title--calendar" style="background-color: white">
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-7">
          <h3 class="mb-0">
            Attendance
            <el-tooltip class="ml-3" content="Calendar view of Field Forces' attendance" placement="right">
              <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
            </el-tooltip>
            <el-tooltip class="ml-3" content="Watch video tutorials" placement="right">
              <i class="fab fa-youtube" style="color: grey; font-size: 18px; cursor: pointer;" @click="showGIF = true"></i>
            </el-tooltip>
          </h3>
        </div>
        <div class="col-lg-6 mt-3 mt-lg-0 text-lg-right">
          <a href="#" @click.prevent="prev" class="fullcalendar-btn-prev btn btn-sm btn-default">
            <i class="fas fa-angle-left"></i>
          </a>
          <a href="#" @click.prevent="next" class="fullcalendar-btn-next btn btn-sm btn-default">
            <i class="fas fa-angle-right"></i>
          </a>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--6">
      <div class="row">
        <div class="col">
          <div class="card card-calendar">
            <div class="card-header">
              <h5 class="h3 mb-0">{{ currentMonthName }}</h5>
            </div>

            <div class="card-body p-0 card-calendar-body">
              <full-calendar
                :plugins="calendarPlugins"
                :editable="true"
                contentHeight="auto"
                :theme="true"
                :selectable="true"
                :selectHelper="true"
                ref="fullCalendar"
                class="calendar"
                :defaultView="defaultView"
                @dateClick="onDateClick"
                display="background"
                style="cursor: pointer"
              >
              </full-calendar>
            </div>
          </div>
        </div>
      </div>
    </div>
    <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle" :showGIF.sync="showGIF"></GIFModal>
  </div>
</template>
<script lang="ts">
import Modal from '@/components/argon-core/Modal.vue';
// @ts-ignore
import FullCalendar from '@fullcalendar/vue';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {Component as componentCalendar} from '@fullcalendar/core';
import {Vue, Component, Mixins, Watch} from 'vue-property-decorator';
import CreateBadgeForm from '@/views/department/CreateBadgeForm.vue';
import {Dropdown, DropdownItem, DropdownMenu, Table, TableColumn, Tooltip, Tag} from 'element-ui';
import PaginationComponentMixin from '@/mixins/PaginationComponent';
import GIFModal from '@/components/tour/GIFModal.vue';

const moment = require('moment');

@Component({
  components: {
    Modal,
    FullCalendar,
    CreateBadgeForm,
    GIFModal,
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    [Tag.name]: Tag
  }
})
export default class AttendanceList extends Vue {
  private calendarPlugins: any = [dayGridPlugin, timeGridPlugin, interactionPlugin];
  private defaultView: any = 'dayGridMonth';
  private counter: number = 0;
  private currentYear = moment().format('YYYY');
  private demoTourEntity: string = 'attendance';
  private showGIF: boolean = false;
  private GIFs: Array<any> = [
    {
      label: 'Create an attendance',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
    },
    {
      label: 'Update an attendance',
      url: 'https://www.youtube.com/embed/WoM3wuI4sJQ'
    },
    {
      label: 'Delete an attendance',
      url: 'https://www.youtube.com/embed/LeAltgu_pbM'
    }
  ];
  private demoTourTitle: string = 'A quick demo of attendance';
  private model: any = {
    title: '',
    className: 'bg-default',
    start: '',
    end: ''
  };

  get currentMonthName(): string {
    return moment()
      .subtract(this.counter, 'month')
      .startOf('month')
      .format('MMMM, YYYY');
  }

  calendarApi() {
    return (this.$refs.fullCalendar as any).getApi();
  }

  changeView(viewType: any) {
    this.defaultView = viewType;
    this.calendarApi().changeView(viewType);
  }

  next() {
    this.calendarApi().next();
    this.counter--;
  }

  prev() {
    this.calendarApi().prev();
    this.counter++;
  }

  onDateClick({date}: any) {
    let formattedDate = moment(date).format('YYYY-MM-DD');
    this.model.start = formattedDate;
    this.model.end = formattedDate;

    this.$router.push({name: 'details', params: {currentEntity: formattedDate}});
  }

  onDetails(row: any) {
    this.$router.push({name: 'details', params: {currentEntity: row}});
  }
}
</script>
<style lang="scss">
@import '~@fullcalendar/core/main.css';
@import '~@fullcalendar/daygrid/main.css';
@import '~@fullcalendar/timegrid/main.css';
@import '~@/assets/sass/core/vendors/_fullcalendar.scss';
</style>
