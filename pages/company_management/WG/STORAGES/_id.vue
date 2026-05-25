<template>
  <div>
    <titlePage :title="title" :width="width" />
    <TableStoragePer />
  </div>
</template>

<script>
import TableStoragePer from '~/components/company_management/storagePer/tableStoragePer.vue'
import titlePage from '~/components/titlePage.vue'
export default {
  components: { titlePage, TableStoragePer,  },
  data() {
    return {
      id: this.$route.params.id,
        // title: 'Storage Management',
        width: '35%',
    }
  },
  computed:{
    title(){
      return this.$t('storage_management');
    }
  }
}
</script>

<style>
</style>