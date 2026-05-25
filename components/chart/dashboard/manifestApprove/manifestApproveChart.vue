<template>
  <v-card height="390">
    <v-app-bar height="100" flat color="white">
      <v-toolbar-title align="start" class="text-h6 primary--text">
        <span class="text-uppercase font-weight-bold"> manifest approval </span>
        <br />
        <span class="text-h3 font-weight-bold">
          {{ amount }}
        </span>
        <span class="text-uppercase primary--text"> Manifests </span>
      </v-toolbar-title>
    </v-app-bar>
    <v-divider></v-divider>
    <v-data-table
      :headers="headers"
      :items="data"
      hide-default-footer
      :items-per-page="4"
    >
      <template v-slot:[`item.status`]="{ item }">
        <div v-if="item.wg_stt == 0">
          <v-chip small>Draft</v-chip>
        </div>
      </template>
    </v-data-table>
    <v-col align-self="end">
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
          value: "manifest_no",
        },
        {
          text: "Type",
          sortable: false,
          value: "type_of_service.name_short",
        },
        {
          text: "Status",
          sortable: false,
          value: "status",
        },
      ],
      data: [],
      amount: 0,
    };
  },
  methods: {
    async getManifest() {
      await this.$apollo
        .query({
          fetchPolicy: "no-cache",
          query: require("~/gql/queries/manifest/getManifest")
            .getManifestApproveSub,
        })
        .then((data) => {
          this.data = data.data.emac_manifest_approve;
          // console.log(
          //   "🚀 ~ file: manifestApproveChart.vue:78 ~ .then ~ this.data",
          //   this.data
          // );
          this.amount = this.data.length;
          // console.log(
          //   "🚀 ~ file: manifestApproveChart.vue ~ line 74 ~ .then ~ this.data",
          //   this.data
          // );
        })
        .catch((err) => {
          // console.log("err :>> ", err);
        });
    },
    viewMore() {
      this.$router.push("/manifest/manifest_approval");
    },
  },
  mounted() {
    this.getManifest();
  },
};
</script>

<style scoped>
</style>