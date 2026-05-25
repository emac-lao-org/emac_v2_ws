<template>
  <div id="map"></div>
</template>

<script>
import mapboxgl from 'mapbox-gl'

export default {
  data() {
    return {
      loading: false,
      zoom: 6,
      map: {},
      marker: '',
      locations: [102.59316566082543, 19.917065426571796],
      accessToken: process.env.MAPBOX_ACCESS_TOKEN || '',
      latlng: this.locations,
    }
  },
  methods: {
    createMap() {
      if (!this.accessToken) {
        return
      }
      mapboxgl.accessToken = this.accessToken
      const map = new mapboxgl.Map({
        container: 'map',
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/mapbox/satellite-streets-v11',
        center: this.locations,
        zoom: this.zoom,
        
      })

      map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
        }),
        'bottom-right'
      )

      const nav = new mapboxgl.NavigationControl()
      map.addControl(nav, 'top-left')
      map.on('click', (e) => {
        this.latlng = [e.lngLat.lng, e.lngLat.lat]
        // this.getLatlng(this.latlng)
        const marker = new mapboxgl.Marker({
          color: '#D80739',
        })
          .setLngLat(this.latlng)
          .addTo(map)

        map.on('click', () => {
          marker.remove()
        })
        this.$emit('latlng', this.latlng)

        console.log('this.latlng :>> ', this.latlng)
        // coordinates.style.display = 'block'
        // coordinates.innerHTML = `Longitude: ${e.lngLat.lng} <br>Latitude: ${e.lngLat.lat}`
        // this.$store.commit('addLatlon', this.latlng)
        // console.log('store.state.latlngMarker :>> ', this.$store.state.latlngMarker);
      })
    },
    // props: {
    //   getLatlng: Function,
    // },
  },
  mounted() {
    setTimeout(() => {
       this.createMap()
    }, 100)
  },
}
</script>

<style scoped>
#map {
  width: 500px;
  height: 500px;
}
</style>
