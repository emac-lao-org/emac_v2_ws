<template>
  <div>
    <titlePage :title="title" :width="width" />
    <TableManifestPer />
  </div>
</template>

<script>
import TableManifestPer from '~/components/company_management/manifestPer/tableManifestPer.vue'
import titlePage from '~/components/titlePage.vue'
export default {
  components: { titlePage, TableManifestPer },
  data() {
    return {
      id: this.$route.params.id,
        width: '35%',
    }
  },
  computed:{
    title(){
      return this.$t('manifest_tracking')
    }
  },
 
}
</script>