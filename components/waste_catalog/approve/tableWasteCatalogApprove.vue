<template>
  <div class="mx-4 my-4">
    <title-page :title="title" :width="width" />
    <card-tab-small
      color_a="grey"
      color_b="grey"
      color="green"
      height="100"
      width="240"
      :title="text_w8"
      :total="this.amountWasteWaiting"
    />
    <v-card class="mt-6">
      <v-card-title class="py-0 pt-2">
        <v-row>
          <v-col cols="4">
            <h2 style="border-right: 3px solid #0d47a1">
            {{ this.$t("waste_catalog") }}
            </h2>
          </v-col>
          <v-spacer></v-spacer>
          <v-col>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="data"
        :search="search"
        :page.sync="pagination.page"
        :itemsPerPage.sync="pagination.itemsPerPage"
      >
        <!-- <template v-slot:[`item.no`]="{ index }">
        {{ (pagination.page - 1) * pagination.itemsPerPage + index + 1 }}
      </template> -->

        <template v-slot:[`item.status`]="{ item }">
          <div v-if="item.status == 0">
            <v-chip small color="warning">{{text_w8}}</v-chip>
          </div>
        </template>
        <template v-slot:[`item.totalQuota`]="{ item }">
          {{ item.totalQuota }} kg/year
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <v-icon @click="viewItem(item)" class="mr-2"> mdi-eye</v-icon>
          <!-- <v-icon class="mr-2" @click="seeMoreItem(item)"> mdi-eye</v-icon> -->
          <!-- <v-icon class="mr-2"> mdi-pencil-outline </v-icon> -->
          <!-- <v-icon> mdi-delete-outline </v-icon> -->
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>
<script>
import gql from "graphql-tag";
// import updateR_D from '~/gql/mutations/r_and_d/updateR_D'
// import deleteR_D from '~/gql/mutations/r_and_d/delete_r_d_code'
// import getWasteCatalog from '~/mixins/getWasteCat'
export default {
  // mixins: [getWasteCatalog],
  data() {
    return {
      id: "",
      pagination: {
        page: 1,
        itemsPerPage: 15,
      },
      search: "",
      view: [],
      totalQuota: 0,
      data: [],
      amountWasteWaiting: 0,
      // title: "Waste Catalog approvement",
      width: "45%",
      // transporters: [],
    };
  },
  methods: {
    toggleEdit() {
      this.$store.commit("SET_EDIT", true);
    },
    async getWasteCat() {
      this.$apollo
        .query({
          query: require("~/gql/queries/waste_catalog/getWasteCatalog")
            .getWasteCatalogN,
        })
        .then((data) => {
          this.data = data.data.emac_catalogs;
          // console.log(
          //   "🚀 ~ file: tableWatesCatalog.vue ~ line 213 ~ getWasteCat ~ this.data",
          //   this.data
          // );
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
        })
        .catch(() => {
          window.location.reload();
        });
    },

    viewItem(item) {
      this.$router.push("/waste_catalog/details?id=" + item.id);
      this.toggleEdit();
      // console.log("🚀 ~ file: tableRandD.vue ~ line 211 ~ viewItem ~ this.view", this.view)
      // console.log('this.view :>> ', this.view)
    },
    editItem(item) {
      this.dialogEdit = true;
      this.view = this.data[item];
      // console.log("this.view :>> ", this.view);
    },
    // deleteItem(item) {
    //   this.id = this.data[item].id
    //   let text = 'Press a button!\nEither OK or Cancel.'
    //   if (confirm(text) == true) {
    //     this.$apollo
    //       .mutate({
    //         mutation: gql`
    //           ${deleteR_D.delete_r_d_code}
    //         `,
    //         variables: {
    //           id: this.id,
    //         },
    //       })
    //       .then(() => {
    //         alert('Deleted R&D Code Success')
    //         this.data.splice(this.data.indexOf(item), 1)
    //       })
    //       .catch((err) => {
    //         console.log('err :>> ', err)
    //       })
    //   } else {
    //     return false
    //   }
    // },
    // update() {
    //   this.$apollo
    //     .mutate({
    //       mutation: gql`
    //         ${updateR_D.update_emac_r_d_code}
    //       `,
    //       variables: {
    //         id: this.view.id,
    //         code: this.view.code,
    //         description: this.view.description,
    //       },
    //     })
    //     .then(() => {
    //       alert('Successfully Updated')
    //       this.dialogEdit = false
    //       window.location.reload()
    //     })
    // },
  },
  mounted() {
    this.getWasteCat();
  },
  computed: {
    title() {
      return this.$t("waste_catalog_approvement");
    },
    text_w8() {
      return this.$t("waiting");
    },

    edit: {
      get() {
        return this.$store.state.edit;
      },
      set(newVal) {
        this.$store.commit("SET_EDIT", newVal);
      },
    },
    headers(){
      return  [
        {
          text: this.$t("enterprise_name"),
          value: "generator.gen_name_lo",
        },
        {
          text: "EMCG ID",
          value: "generator.emac_id",
        },
        { text:  this.$t("catalog_name"), value: "name" },
        { text:  this.$t("catalog_type"), value: "type_of_service.name_short" },
        { text:  this.$t("quota_weight"), value: "totalQuota" },
        { text: this.$t("status"), value: "status" },
        { text: this.$t("action"),align: "center", value: "action" },
      ]
    }
  },
};
</script>