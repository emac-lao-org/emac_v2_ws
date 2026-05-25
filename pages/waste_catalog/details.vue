<template>
  <div class="mx-6 my-6">
    <title-page :title="title" :width="width" />
    <div class="mt-4">
      <v-tabs v-model="tab" class="mb-6">
        <v-tab v-for="item in items" :key="item"> {{ item }}</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-card flat>
            <WasteGeneralInfo />
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <WdCatalog />
            <v-divider style="border:1px solid" class="my-10"></v-divider>
            <WtCatalog />
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
           <WasteCatagories />
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </div>
  </div>
</template>

<script>
import TitlePage from '~/components/titlePage.vue'
import WasteCatagories from '~/components/waste_catalog/wasteCatagories.vue'
import WasteGeneralInfo from '~/components/waste_catalog/wasteGeneralInfo.vue'
import WdCatalog from '~/components/waste_catalog/wdCatalog.vue'
import WtCatalog from '~/components/waste_catalog/wtCatalog.vue'

export default {
  components: { WdCatalog, WasteGeneralInfo, TitlePage, WtCatalog, WasteCatagories },
  data() {
      return {
      id: this.$route.query.id,
      // title: 'Waste Catalog information',
      width: '35%',
      tab: null,
      items: [],
    }
  },
  computed:{
    title(){
      return this.$t("waste_catalog_info")
    }
  },
  mounted() {
    this.items = [this.$t("catalog_detail"), this.$t("wd_wt"), this.$t("waste_contain_in_this_catalog")]
  },
}
</script>

<style>
</style>