<template>
  <div class="mt-4">
    <v-tabs v-model="tab" class="mb-6">
      <v-tab v-for="item in items" :key="item"> {{ item }}</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-card flat>
          <tableWatesCatalog />
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
         <TableWatesCatalogLog />
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import tableWatesCatalog from './tableWatesCatalog.vue'
import TableWatesCatalogLog from './tableWatesCatalogLog.vue'
export default {
  components: { tableWatesCatalog, TableWatesCatalogLog },
  data: () => ({
    tab: null,
    items: [],
  }),
  mounted() {
    this.items = [this.$t('waste_catalog'), this.$t('data_entry_log')]
  },
}
</script>

<style>
</style>