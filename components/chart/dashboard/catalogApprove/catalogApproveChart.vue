<template>
  <v-card height="390">
    <v-app-bar height="100" flat color="white">
      <v-toolbar-title align="start" class="text-h6 primary--text">
        <span class="text-uppercase font-weight-bold">
          Catalog approvement
        </span>
        <br />
        <span class="text-h3 font-weight-bold">
          {{ amountWasteWaiting }}
        </span>
        <span class="text-uppercase primary--text"> catalogs </span>
      </v-toolbar-title>
    </v-app-bar>
    <v-divider></v-divider>
    <v-data-table
      :headers="headers"
      :items="data"
      hide-default-footer
      :items-per-page="4"
    >
      <template v-slot:[`item.totalQuota`]="{ item }">
        {{ item.totalQuota }} KG
      </template>
    </v-data-table>

    <v-col class="">
      <h4
        style="cursor: pointer"
        @click="viewMore"
        class="d-flex justify-end primary--text"
      >
        {{ this.$t("view_more") }} >>
      </h4>
    </v-col>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        {
          text: "Organizaiton",
          sortable: false,
          value: "generator.gen_name",
        },
        {
          text: "No",
          sortable: false,
          align: "center",
          value: "catalog_no",
        },
        {
          text: "Type",
          sortable: false,
          value: "type_of_service.name_short",
        },
        {
          text: "Quantity",
          sortable: false,
          value: "totalQuota",
        },
      ],
      data: [],
      amountWasteWaiting: 0,
      totalQuota: 0,
    };
  },
  methods: {
    viewMore() {
      this.$router.push("/waste_catalog_approved");
    },
    async getWasteCat() {
      this.$apollo
        .query({
          fetchPolicy: "no-cache",
          query: require("~/gql/queries/waste_catalog/getWasteCatalog")
            .getWasteCatalogN,
        })
        .then((data) => {
          this.data = data.data.emac_catalogs;

          this.amountWasteWaiting = this.data
            .filter((item) => item.status === 0)
            .length.toString();
          //   console.log("🚀 ~ file: getWasteCat.js ~ line 31 ~ getWasteCat ~ this.amountWasteActive", this.amountWasteActive)

          //   console.log("🚀 ~ file: getWasteCat.js ~ line 36 ~ getWasteCat ~ this.amountWasteSuspended", this.amountWasteSuspended)

          //   console.log('typeof(this.amountWasteDeleted) :>> ', typeof(this.amountWasteDeleted));
          //   console.log("🚀 ~ file: getWasteCat.js ~ line 41 ~ getWasteCat ~ this.amountWasteDeleted", this.amountWasteDeleted)

          this.totalQuota = this.data.map(
            (item) => item.catalog_operations_aggregate.aggregate.sum
          );
          this.totalQuota = this.totalQuota.map((item) => item.quota_amount);

          for (let i = 0; i < this.data.length; i++) {
            this.data[i].totalQuota = this.totalQuota[i];
          }
          // console.log(
          //   "🚀 ~ file: tableWatesCatalog.vue ~ line 213 ~ getWasteCat ~ this.data",
          //   this.data
          // );
        });
    },
  },
  created() {
    this.getWasteCat();
  },
};
</script>

<style scoped>
</style>