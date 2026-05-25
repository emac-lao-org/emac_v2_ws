<template>
  <div class="mt-4">
    <v-tabs v-model="tab" class="mb-6">
      <v-tab v-for="item in items" :key="item"> {{ item }}</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-card flat>
          <tableManifest :page="this.page" :checkPage="this.checkPage"  />
        </v-card>
      </v-tab-item>
      <!-- <v-tab-item>
        <v-card flat>
          <TableManifestCP />
        </v-card>
      </v-tab-item> -->
    </v-tabs-items>
  </div>
</template>

<script>
import tableManifest from './tableManifest.vue'
import TableManifestCP from './tableManifestCP.vue'
export default {
  components: { tableManifest, TableManifestCP },
  
  props: {
    page:{
      type: String,
      default: 'tracking'
    },
    checkPage:{
      type: String,
      default: 'tracking'
    }
  },
  data: () => ({
    tab: null,
    items: [],
  }),
  mounted() {
    this.items = [this.$t('manifest')]
  },
}
</script>

<style>
</style>