<template>
  <div class="mt-4">
    <v-tabs v-model="tab" class="mb-6">
      <v-tab v-for="item in items" :key="item"> {{ item }}</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-card flat>
         <table-manifest-approve />
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
import TableManifestApprove from './tableManifestApprove.vue'
export default {
  components: {TableManifestApprove  },
  data: () => ({
    tab: null,
    items: ['Manifest',],
  }),
}
</script>

<style>
</style>