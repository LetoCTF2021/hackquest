<template>
<div>
  <GmapMap
    :center="{lat: lat, lng: lng}"
    :zoom="14"
    :options="{
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: true,
    fullscreenControl: false,
    disableDefaultUi: false
  }"
    map-type-id="satellite"
    style="width: 100%; height: 80%"
  >
    <GmapMarker
      :key="index"
      v-for="(m, index) in markers"
      :position="m.position"
      :clickable="true"
      :draggable="false"
    />
  </GmapMap>

  <div class="blocks">
    <div> {{teamName}}  | Задачи: 0/5</div>

    <div>
      <a-button type="primary"  @click="startGame">
        Старт
      </a-button>
    </div>

  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      markers: [
        { position: { lat: 55.733510, lng: 36.825376 } }
      ],
      lat: 55.733510,
      lng: 36.825376,
      location:null,
      gettingLocation: false,
      errorStr:null,
      teamName: 'Серо-голубые'
    }
  },
  methods: {
    async startGame () {

    },
    async getLocation() {
      
      return new Promise((resolve, reject) => {

        if(!("geolocation" in navigator)) {
          reject(new Error('Geolocation is not available.'));
        }

        navigator.geolocation.getCurrentPosition(pos => {
          resolve(pos);
        }, err => {
          reject(err);
        });

      });
    },
    async locateMe() {

      this.gettingLocation = true;
      try {
        this.gettingLocation = false;
        this.location = await this.getLocation();
        this.lat = this.location.coords.latitude
        this.lng = this.location.coords.longitude
        setTimeout(() => {
          this.markers.push({
            position: { 
              lat: this.location.coords.latitude,
              lng: this.location.coords.longitude
            }
          })
        }, 1);
      } catch(e) {
        this.gettingLocation = false;
        this.errorStr = e.message;
      }
      
    }
  },
  async mounted () {
    await this.locateMe()
  }
}
</script>

<style scoped>
  .blocks {
    position: absolute;
    top: 80%;
    width: 100%;
  }
  .blocks div {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .vue-map-container {
    position: absolute;
  }
</style>