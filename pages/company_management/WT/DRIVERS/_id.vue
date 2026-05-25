<template>
  <div>
    <titlePage :title="title" :width="width" />
    <TableDriverPer />
  </div>
</template>

<script>
import TableDriverPer from '~/components/company_management/driver/tableDriverPer.vue'
// import TableVehiclePer from '~/components/company_management/vehicles/tableVehiclePer.vue'
import titlePage from '~/components/titlePage.vue'

export default {
  components: { titlePage, TableDriverPer },
  data() {
    return {
      id: this.$route.params.id,
      title: 'Drivers Management',
      width: '35%',
    }
  },
  methods: {},
  created() {
    // this.getCatalog()
  },
}
</script>

<style>
</style>