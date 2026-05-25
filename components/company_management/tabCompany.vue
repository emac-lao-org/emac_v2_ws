<template>
  <div class="mt-4">
    <v-tabs v-model="tab" class="mb-6">
      <v-tab v-for="item in items" :key="item"
        ><b> {{ item }}</b></v-tab
      >
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-card flat>
          <DataTableWG />
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <DataTableWT />
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <DataTableWD />
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <DataTableWR />
        </v-card>
      </v-tab-item>
      <!-- <v-tab-item>
        <v-card flat>
          <h2>log</h2>
        </v-card>
      </v-tab-item> -->
    </v-tabs-items>
  </div>
</template>

<script>
import DataTableWR from "./dataTableWR.vue";
import DataTableWT from "./dataTableWT.vue";
import DataTableWD from "./dataTableWD.vue";
import DataTableWG from "./dataTableWG.vue";
export default {
  data() {
    return {
      items: [],
    };
  },
  components: { DataTableWT, DataTableWR, DataTableWD, DataTableWG },
  methods: {
    toggleTab(number) {
      this.$store.commit("SET_TAB", (this.$store.state.tab = number));
    },
  },
  mounted() {
    this.items = [
      this.$t("waste_generator"),
      this.$t("waste_transporter"),
      this.$t("waste_disposal"),
      this.$t("waste_regulator"),
    ];
  },
  computed: {
    tab: {
      get() {
        return this.$store.state.tab;
      },
      set(newVal) {
        this.$store.commit("SET_TAB", newVal);
      },
    },
    // items() {
    //   return [
    //     this.$t("waste_generator"),
    //     this.$t("waste_transporter"),
    //     this.$t("waste_disposal"),
    //     this.$t("waste_regulator"),
    //     // 'Data Entry Log',
    //     // 'log',
    //   ];
    // },
  },
};
</script>

<style>
</style>