<template>
  <div class="mt-4">
    <v-tabs v-model="tab" class="mb-6">
      <v-tab v-for="item in items" :key="item"> {{ item }}</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-card flat>
          <DataTableWRUsers />
        </v-card>
      </v-tab-item>
      <!-- <v-tab-item>
        <v-card flat>
          <h1>Test1</h1>
        </v-card>
      </v-tab-item> -->
    </v-tabs-items>
  </div>
</template>

<script>
import DataTableWRUsers from './dataTableWRUsers.vue'
export default {
  components: { DataTableWRUsers },
  data: () => ({
    tab: null,
    items: [],
  }),
  mounted() {
    this.items = [this.$t('waste_regulator_user')]
  },
}
</script>

<style>
</style>