<template>
  <div>
    <titlePage :title="title" :width="width" />
    <TableCatalogPer />
  </div>
</template>

<script>
import titlePage from '~/components/titlePage.vue'
import TableCatalogPer from '~/components/company_management/catalog/tableCatalogPer.vue'

export default {
  components: { titlePage, TableCatalogPer },
  data() {
    return {
      id: this.$route.params.id,
     
      width: '35%',
    }
  },
  methods: {
  },
  computed: {
    title(){
      return this.$t('waste_catalog_management');
    }
  },
  created() {
    // this.getCatalog()
  },
}
</script>

<style>
</style>