<template>
  <div>
    <div v-if="loading == true">
      <loading />
    </div>
    <div v-else class="mx-4" id="title">
      <title-page :title="title" :width="width" />
      <v-row>
        <v-col cols="3">
          <card-tab-small
            color="#0d47a1"
            height="100"
            width="240"
            :title="text_all"
            :total="totalCat"
          />
        </v-col>
        <v-col cols="2">
          <card-tab-small
            color_a="#cb2d3e"
            color_b="#ef473a"
            color="red"
            height="100"
            width="240"
            :title="text_Hz"
            :total="totalHz"
          />
        </v-col>
        <v-col>
          <card-tab-small
            color_a="#00692F"
            color_b="#55BC3B"
            color="green"
            height="100"
            width="240"
            :title="text_NHz"
            :total="totalNHz"
          />
        </v-col>
        <v-col class="mb-2" align-self="end">
          <dialog-create-waste-cat />
        </v-col>
      </v-row>

      <tab-header />
    </div>
  </div>
</template>

<script>
import CardTabSmall from "~/components/cardTabSmall.vue";
import DialogCreateWasteCat from "~/components/manage_waste_categories/dialogCreateWasteCat.vue";
import TabHeader from "~/components/manage_waste_categories/tabHeader.vue";
import titlePage from "~/components/titlePage.vue";

export default {
  components: { titlePage, CardTabSmall, TabHeader, DialogCreateWasteCat },
  data() {
    return {
      width: "35%",
      totalHz: "",
      totalHz_n: 0,
      totalNHz: "",
      totalNHz_n: 0,
      totalCat: "",
      loading: false,
    };
  },
  methods: {
    async getWasteCategoriesWithNHz() {
      this.loading = true;
      await this.$apollo
        .query({
          query: require("~/gql/queries/waste_categories/getWastCategories")
            .getWasteCategoriesWithNHz,
        })
        .then((data) => {
          this.totalNHz = data.data.emac_waste_categories.length;
          this.totalNHz = this.totalNHz.toString();
          this.totalNHz_n = data.data.emac_waste_categories.length;
          this.totalCat = this.totalHz_n + this.totalNHz_n;
          this.totalCat = this.totalCat.toString();

          this.loading = false;
        })
        .catch((err) => {
          // console.log("err :>> ", err);
        });
    },
    async getWasteCategoriesWithHz() {
      await this.$apollo
        .query({
          query: require("~/gql/queries/waste_categories/getWastCategories")
            .getWasteCategoriesWithHz,
        })
        .then((data) => {
          this.totalHz = data.data.emac_waste_categories.length;
          this.totalHz = this.totalHz.toString();
          this.totalHz_n = data.data.emac_waste_categories.length;
        })
        .catch((err) => {
          // console.log("err :>> ", err);
        });
    },
  },
  computed: {
    title() {
      return this.$t("manage_waste_categories");
    },
    text_all() {
      return this.$t("all_catagories");
    },
    text_Hz() {
      return this.$t("hazardous");
    },
    text_NHz() {
      return this.$t("non_hazardous");
    },
  },

  mounted() {
    this.getWasteCategoriesWithHz(), this.getWasteCategoriesWithNHz();
  },
};
</script>

<style scoped>
</style>