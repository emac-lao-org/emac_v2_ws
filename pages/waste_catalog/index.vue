<template>
  <div class="ml-4 mt-8">
    <title-page :title="title" :width="width" />
    <v-row>
      <v-col cols="3">
        <CardTab
          :amount="this.amountWasteAll"
          :title="titleCard"
          color="#0d47a1"
        />
      </v-col>

      <v-col align-self="end" cols="2">
        <card-tab-small
          color_a="#3C9700"
          color_b="#1CBF27"
          color="green"
          height="100"
          width="240"
          :title="text_active"
          :total="this.amountWasteActive"
        />
      </v-col>
      <v-col align-self="end" cols="2">
        <card-tab-small
          color_a="#EB7E12"
          color_b="#FF9B00"
          color="orange"
          height="100"
          width="240"
          :title="text_suspended"
          :total="this.amountWasteSuspended"
        />
      </v-col>
      <v-col align-self="end" cols="2">
        <card-tab-small
          color_a="#000000"
          color_b="#000000"
          color="orange"
          height="100"
          width="240"
          :title="text_expired"
          :total="this.amountWasteExpired"
        />
      </v-col>
      <v-col align-self="end" cols="2">
        <card-tab-small
          color_a="#cb2d3e"
          color_b="#ef473a"
          color="red"
          height="100"
          width="240"
          :title="text_rejected"
          :total="this.amountWasteRejected"
        />
      </v-col>
      <v-col class="mr-2" align="end" align-self="end">
        <!-- <dialogCreateUser /> -->
      </v-col>
    </v-row>
    <tabHeader />
  </div>
</template>

<script>
import tabHeader from "~/components/waste_catalog/tabHeader";
import getWasteCatalog from "~/mixins/getWasteCat";

export default {
  mixins: [getWasteCatalog],
  components: { tabHeader },
  data() {
    return {
      width: "35%",
    };
  },
  computed: {
    titleCard() {
      return this.$t("all_catalog");
    },
    title() {
      return this.$t("waste_catalog");
    },
    text_active() {
      return this.$t("active");
    },
    text_suspended() {
      return this.$t("suspended");
    },
    text_expired() {
      return this.$t("expired");
    },
    text_rejected() {
      return this.$t("rejected");
    },

  },
};
</script>

<style>
</style>