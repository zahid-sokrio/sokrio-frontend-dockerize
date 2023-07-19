<template>
  <modal :show="showStatus" modal-classes="modal-dialog-centered modal-lg" @close="close()" class="modal-dialog-scrollable">
    <template slot="header">
      <h5 class="modal-title" id="statusModal">Last Status</h5>
    </template>

    <div class="container-fluid">
      <div class="card border-0" style="clear: both">
        <div id="map-custom" class="map-canvas"></div>
      </div>
    </div>

    <template slot="footer">
      <base-button type="primary" @click="close()">Close</base-button>
    </template>
  </modal>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Dropdown, DropdownItem, Switch, DropdownMenu, Table, TableColumn, Tooltip } from 'element-ui';

@Component({
  components: {
    [Tooltip.name]: Tooltip,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu
  }
})
export default class LastStatusMapView extends Vue {
  @Prop()
  lastTracking!: any;

  @Prop({ type: Boolean, default: false })
  public showStatus!: boolean;

  close() {
    this.$emit('update:showStatus', false);
  }

  async mounted(){
    let GoogleMapsLoader = await require('google-maps');
    GoogleMapsLoader = GoogleMapsLoader.default || GoogleMapsLoader;
    GoogleMapsLoader.KEY = process.env.VUE_APP_GMAP_KEY;
    GoogleMapsLoader.load((google: any) => {
      this.initMap(google);
    });
  }

  initMap(google: any) {
    var directionsService = new google.maps.DirectionsService();
    var directionsRenderer = new google.maps.DirectionsRenderer();
    let map: any;
    var dhanmondi = new google.maps.LatLng(23.7461, 90.3642);
    let lat = this.lastTracking[0].lat;
    let lng = this.lastTracking[0].long;

    let color = '#5e72e4';

    map = document.getElementById('map-custom');

    let myLatlng = new google.maps.LatLng(lat, lng);

    let mapOptions = {
      zoom: 12,
      scrollwheel: true,
      center: myLatlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: [
        {
          featureType: 'administrative',
          elementType: 'labels.text.fill',
          stylers: [{color: '#444444'}]
        },
        {
          featureType: 'landscape',
          elementType: 'all',
          stylers: [{color: '#f2f2f2'}]
        },
        {
          featureType: 'poi',
          elementType: 'all',
          stylers: [{visibility: 'off'}]
        },
        {
          featureType: 'road',
          elementType: 'all',
          stylers: [{saturation: -100}, {lightness: 45}]
        },
        {
          featureType: 'road.highway',
          elementType: 'all',
          stylers: [{visibility: 'simplified'}]
        },
        {
          featureType: 'road.arterial',
          elementType: 'labels.icon',
          stylers: [{visibility: 'on'}]
        },
        {
          featureType: 'transit',
          elementType: 'all',
          stylers: [{visibility: 'on'}]
        },
        {featureType: 'water', elementType: 'all', stylers: [{color: '#b7dbf5'}, {visibility: 'on'}]}
      ]
    };

    map = new google.maps.Map(map, mapOptions);
    directionsRenderer.setMap(map);

    let marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      animation: google.maps.Animation.DROP,
      title: 'Last Status'
    });

    // var request = {
    //   origin: myLatlng,
    //   destination: dhanmondi,
    //   waypoints: [
    //     { location: new google.maps.LatLng(23.755613, 90.368591) },
    //     { location: new google.maps.LatLng(23.7646693, 90.3599619) },
    //   ],
    //   // Note that JavaScript allows us to access the constant
    //   // using square brackets and a string value as its
    //   // "property."
    //
    //   travelMode: google.maps.TravelMode['WALKING']
    // };
    // directionsService.route(request, function(response: any, status: any) {
    //   if (status == 'OK') {
    //     directionsRenderer.setDirections(response);
    //   }
    // });
  }
}
</script>
