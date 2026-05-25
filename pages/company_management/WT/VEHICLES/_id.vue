<template>
  <div>
    <titlePage :title="title" :width="width" />
    <TableVehiclePer />
  </div>
</template>

<script>
import TableVehiclePer from '~/components/company_management/vehicles/tableVehiclePer.vue'
import titlePage from '~/components/titlePage.vue'

export default {
  components: { titlePage, TableVehiclePer  },
  data() {
    return {
      id: this.$route.params.id,
      title: 'Vehicles Management',
      width: '35%',
    }
  },
  methods: {
  },
  created() {
    // this.getCatalog()
  },
}
</script>

<style>
</style>