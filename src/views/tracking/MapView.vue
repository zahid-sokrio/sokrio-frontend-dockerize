<template>
  <div>
    <base-header class="pb-6" style="background-color: white">
      <div class="row align-items-center py-2 mt-2 mb-3">
        <div v-bind:class="{ 'col-md-8': isDefault, 'col-md-8': !isDefault }">
          <h3 class="mb-0 ml-5">
            Map View
            <el-tooltip class="ml-3" content="Map View of All Field Forces and Departments" placement="top">
              <i class="fas fa-info-circle" style="color: grey; font-size: 18px"></i>
            </el-tooltip>
            <el-tooltip class="ml-3" content="Watch video tutorials" placement="right">
              <i class="fab fa-youtube" style="color: grey; font-size: 18px; cursor: pointer;"
                 @click="showGIF = true"></i>
            </el-tooltip>
          </h3>
        </div>

        <div class="col-7 text-right">


        </div>

        <div class="offset-1 col-2 d-flex justify-content-end">
          <div class="btn-group mr-2" role="group" aria-label="Basic example">
            <el-tooltip content="Field Force" placement="top">
              <base-button size="sm" type="primary" :class="viewType == 'fieldforce' ? 'active' : ''"
                           @click="(viewType = 'fieldforce'), fetchEntityFieldForce()">
              <span class="btn-inner--icon">
                <i class="fas fa-walking"></i>
              </span>
              </base-button>
            </el-tooltip>
            <el-tooltip content="Outlet" placement="top">
              <base-button size="sm" type="primary" :class="viewType == 'department' ? 'active' : ''"
                           @click="(viewType = 'department'), fetchEntityDepartment()">
              <span class="btn-inner--icon">
                <i class="fas fa-store"></i>
              </span>
              </base-button>
            </el-tooltip>
          </div>
          <el-tooltip content="Filters" placement="top" v-show="viewType === 'department'">
            <base-button
              type="primary"
              icon
              size="sm"
              @click="isFilterModelActive == true ? (isFilterModelActive = false) : (isFilterModelActive = true)"
            >

              <span class="btn-inner--icon">
                <i class="fas fa-filter"></i>
              </span>
              <span class="btn-inner--text">Filters</span>
            </base-button>
          </el-tooltip>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--6">
      <div class="row">
        <div class="col">
          <div class="card border-0">
            <div id="map-custom" class="map-canvas" style="height: 530px"></div>

          </div>
        </div>
      </div>
    </div>

    <DepartmentFilterDrawer
      v-if="viewType === 'department'"
      :is-filter-model-active.sync="isFilterModelActive"
      :loading.sync="loading"
      :entity-current-page.sync="pagination.currentPage"
      :entity-per-page.sync="pagination.entityPerPage"
      :total-entity.sync="pagination.totalEntity"
      @update="departments = $event"
    ></DepartmentFilterDrawer>

    <!--        Demo Tour GIF Modal-->
    <GIFModal :GIFs="GIFs" :demoTourEntity="demoTourEntity" :demoTourTitle="demoTourTitle"
              :showGIF.sync="showGIF"></GIFModal>
  </div>
</template>
<script lang="ts">
import {Vue, Component, Mixins, Watch} from 'vue-property-decorator';

const {Loader} = require('google-maps');
const moment = require('moment');
const flatPicker = require('vue-flatpickr-component');
import 'flatpickr/dist/flatpickr.css';
import GIFModal from '@/components/tour/GIFModal.vue';
import AsyncImage from "@/components/AsyncImage.vue";
import DepartmentFilterDrawer from "@/views/department/DeparmentFilterDrawer.vue";
import PaginationComponentMixin from '@/mixins/PaginationComponent';
import GoogleMapStyle from "@/data/GoogleMapStyle";

@Component({
  components: {
    DepartmentFilterDrawer,
    AsyncImage,
    flatPicker,
    GIFModal
  }
})
export default class MapView extends Mixins(PaginationComponentMixin) {
  private showGIF: boolean = false;
  private isDefault: boolean = true;
  private isFilterModelActive: boolean = false;
  private viewType: string = 'fieldforce';
  private infowindow : any = '';
  private demoTourEntity: string = 'mapView';
  private lastTrackings: Array<any> = [
    {
      lat: 0,

      long: 0
    }
  ];
  private departments: Array<any> = [
    {
      lat: 0,

      long: 0
    }
  ];
  private filteredDepartments: Array<any> = [
    {
      lat: 0,

      long: 0
    }
  ];
  private GIFs: Array<any> = [
    {
      label: 'See all trackings',
      url: 'https://www.youtube.com/embed/jNQXAC9IVRw'
    },
    {
      label: 'See trackings by specific date',
      url: 'https://www.youtube.com/embed/WoM3wuI4sJQ'
    }
  ];
  private demoTourTitle: string = 'A quick demo of Map View';

  get todaysDate() {
    return moment().format('YYYY-MM-DD');
  }

  public async fetchEntityFieldForce() {
    let {data} = await this.$http.get(this.$api(`/tracking-users?created_at=${this.todaysDate}`));
    this.lastTrackings = data.trackingUsers;

    let GoogleMapsLoader = await require('google-maps');
    GoogleMapsLoader = GoogleMapsLoader.default || GoogleMapsLoader;
    GoogleMapsLoader.KEY = process.env.VUE_APP_GMAP_KEY;
    GoogleMapsLoader.load((google: any) => {
      this.initMapForFieldForce(google);
    });
  }

  public async fetchEntityDepartment() {
    let {data} = await this.$http.get(this.$api(`/departments`));

    let filteredDepartments = data.departments.filter((item: any) => item.lat  && item.long);
    this.departments = filteredDepartments;
  }

  @Watch('departments')
  public async onDepartmentUpdate(value: any) {
    this.filteredDepartments = value.filter((item: any) => item.lat && item.long);
    let GoogleMapsLoader = await require('google-maps');
    GoogleMapsLoader = GoogleMapsLoader.default || GoogleMapsLoader;
    GoogleMapsLoader.KEY = process.env.VUE_APP_GMAP_KEY;
    GoogleMapsLoader.load((google: any) => {
      this.initMapForFilteredDepartment(google);
    });
  }

  async initMapForFieldForce(google: any) {
    let map: any;
    var lat;
    var lng;
    if (this.lastTrackings[0] == undefined) {
      lat = 23.68;
      lng = 90.35;
    } else {
      lat = this.lastTrackings[this.lastTrackings.length - 1].lat;
      lng = this.lastTrackings[this.lastTrackings.length - 1].long;
    }

    let color = '#5e72e4';

    let markerlLatLongs = this.lastTrackings.map(item => {
      return {
        lat: item.lat,
        lng: item.long
      };
    });
    map = document.getElementById('map-custom');

    let myLatlng = new google.maps.LatLng(lat, lng);

    let mapOptions = {
      zoom: 7,
      scrollwheel: true,
      center: myLatlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: GoogleMapStyle
    };

    map = new google.maps.Map(map, mapOptions);

    const markers = [];


    markerlLatLongs.forEach((location, index) => {
      const markerOptions = {
        position: location,
        icon: this.checkIcon(moment().diff(moment(this.lastTrackings[index].created_at).format('lll'), 'minute')),
        map: map,
        animation: google.maps.Animation.DROP,
        title: `${this.lastTrackings[index] && this.lastTrackings[index].user ?
          this.lastTrackings[index].user.name : ''}`,
      };
      const marker = new google.maps.Marker(markerOptions);
      marker.addListener("click", async () => {
        if(this.infowindow){
          this.infowindow.close();
        }
        const contentString = await this.contentStringFieldForce(index);

        this.infowindow = new google.maps.InfoWindow({
          content: contentString,
          maxWidth: 250,
          minWidth: 250
        });
        this.infowindow.open({
          anchor: marker,
          map,
          shouldFocus: false,
        });
      });
      markers.push(marker);
    });
  }

  async initMapForFilteredDepartment(google: any) {
    let map: any;
    var lat;
    var lng;
    if (this.filteredDepartments[0] == undefined) {
      lat = 23.68;
      lng = 90.35;
    } else {
      lat = Number(this.filteredDepartments[this.filteredDepartments.length - 1].lat);
      lng = Number(this.filteredDepartments[this.filteredDepartments.length - 1].long);
    }

    let color = '#5e72e4';

    let markerlLatLongs = this.filteredDepartments.map(item => {
      return {
        lat: Number(item.lat),
        lng: Number(item.long)
      };
    });
    map = document.getElementById('map-custom');

    let myLatlng = new google.maps.LatLng(lat, lng);

    let mapOptions = {
      zoom: 7,
      scrollwheel: true,
      center: myLatlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: GoogleMapStyle
    };

    map = new google.maps.Map(map, mapOptions);

    const markers = [];

    markerlLatLongs.forEach((location, index) => {
      const markerOptions = {
        position: location,
        icon: this.checkDepartmentIcon(this.filteredDepartments[index].department_type.has_outlet),
        index: index,
        map: map,
        animation: google.maps.Animation.DROP,
        title: `${this.filteredDepartments[index].name}`,
      };
      const marker = new google.maps.Marker(markerOptions);

      marker.addListener("click", async () => {
        if (this.infowindow) {
          this.infowindow.close();
        }
        const contentString = await this.contentStringDepartment(index);
        this.infowindow = new google.maps.InfoWindow({
          content: contentString,
          minWidth: 250,
          maxWidth: 250
        });
        this.infowindow.open({
          anchor: marker,
          map,
          shouldFocus: false,
        });
      });
      markers.push(marker);
    });
  }

  private async contentStringDepartment(index: number) {
    const contentString = `
    <div id="content">
    <h1 id="firstHeading" class="firstHeading text-center text-primary">${this.filteredDepartments[index] &&
    this.filteredDepartments[index].name ? this.filteredDepartments[index].name : ''}</h1>
            <div id="bodyContent" class="d-flex justify-content-center mt-4 mb-4" >
                    <img class="avatar avatar-lg rounded-circle" src="${this.filteredDepartments[index] &&
    this.filteredDepartments[index].photo_url ?
      await this.$blob2Url(this.filteredDepartments[index].photo_url) : this.$cdn + '/img/store.png'}">
        </div>
             <h2 class="firstHeading text-center"> ${this.filteredDepartments[index] &&
    this.filteredDepartments[index].owner_name ? this.filteredDepartments[index].owner_name : ''} </h2>
             <p class="text-center"> ${this.filteredDepartments[index] &&
    this.filteredDepartments[index].phone_no ? this.filteredDepartments[index].phone_no
      : ''
    } </p>
             <p class="text-center"> ${this.filteredDepartments[index] &&
    this.filteredDepartments[index].address ?
      this.filteredDepartments[index].address
      : ''
    } </p>
        </div>
    `;
    return contentString;
  }


  private async contentStringFieldForce(index: number) {
    const contentString = `
    <div id="content" v-if="${this.lastTrackings[index] && this.lastTrackings[index].user}">
        <div id="bodyContent" class="d-flex justify-content-center mt-4 mb-4" >
                    <img class="avatar avatar-lg rounded-circle" src="${this.lastTrackings[index] &&
    this.lastTrackings[index].user &&
    this.lastTrackings[index].user.propic_url ?
      await
        this.$blob2Url(this.lastTrackings[index].user.propic_url) :
      this.$cdn + '/img/avatar.png'}">
        </div>
             <h1 id="firstHeading" class="firstHeading text-center"> ${this.lastTrackings[index] &&
    this.lastTrackings[index].user &&
    this.lastTrackings[index].user.name ? this.lastTrackings[index].user.name : ''} </h1>
             <p class="text-center"> ${this.lastTrackings[index] && this.lastTrackings[index].user &&
    this.lastTrackings[index].user.phone ?
      this.lastTrackings[index].user.phone
      : ''
    } </p>
        </div>
    `;
    return contentString;
  }


  async mounted() {
    await this.fetchEntityFieldForce();
  }

  checkIcon(created_at: any) {
    if (created_at <= 15) {
      return `${this.$cdn}/img/icons/green-walking.svg`;
    } else {
      if (created_at > 15 &&
        created_at <= 30) {
        return `${this.$cdn}/img/icons/yellow-walking.svg`
      } else {
        return `${this.$cdn}/img/icons/red-walking.svg`
      }
    }
  }

  checkDepartmentIcon(department_type: any) {
    if (department_type) {
      return `${this.$cdn}/img/icons/store.svg`;
    } else {
      return `${this.$cdn}/img/icons/warehouse.svg`
    }
  }
}
</script>
<style scoped>
</style>
