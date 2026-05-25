<template>
  <div>
    <titlePage :title="title" :width="width" />
  <TableFacPer />
  </div>
</template>

<script>
import TableFacPer from '~/components/company_management/facility/tableFacPer.vue'
import titlePage from '~/components/titlePage.vue'
export default {
  components: { titlePage, TableFacPer,  },
  data() {
    return {
      id: this.$route.params.id,
        title: 'Treatment plants',
        width: '35%',
    }
  },
}
</script>

<style>
</style>