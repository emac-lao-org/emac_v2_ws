<template>
  <div>
    <title-page :title="title" :width="width" />

    <v-card class="mt-4 mx-6">
      <v-card-title class="py-0 pt-2">
        <v-row>
          <v-col cols="4">
            <p class="display-1" style="border-right: 3px solid #0d47a1"></p>
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
        :loading="loading"
        :headers="headers"
        :items="data"
        :search="search"
        :page.sync="pagination.page"
        :itemsPerPage.sync="pagination.itemsPerPage"
      >
        <template v-slot:[`item.waste_category.code`]="{ item }">
          {{ formatWasteCode(item.waste_category.code, item.waste_category.entry_type) }}
        </template>
        <!-- <template v-slot:[`item.no`]="{ index }">
        {{ (pagination.page - 1) * pagination.itemsPerPage + index + 1 }}
      </template> -->

        <template v-slot:[`item.status`]="{ item }">
          <div v-if="item.status == 1">
            <v-chip small color="success">Active</v-chip>
          </div>
          <div v-else-if="item.status == 2">
            <v-chip small color="warning">Out of time</v-chip>
          </div>
          <div v-else-if="item.status == 3">
            <v-chip small color="warning">Waiting for time extention</v-chip>
          </div>
          <div v-else-if="item.status == 4">
            <v-chip small color="warning">Out of quota</v-chip>
          </div>
          <div v-else-if="item.status == 5">
            <v-chip small color="warning">Waiting for quota extention</v-chip>
          </div>
          <div v-else-if="item.status == 6">
            <v-chip small color="warning">Reject time extention</v-chip>
          </div>
          <div v-else-if="item.status == 7">
            <v-chip small color="warning">Reject quota extention</v-chip>
          </div>
          <div v-else-if="item.status == 8">
            <v-chip small color="warning">Deleted</v-chip>
          </div>
          <div v-else-if="item.status == 9">
            <v-chip small color="error">Rejected</v-chip>
          </div>
          <div v-else-if="item.status == 0">
            <v-chip small>Draft</v-chip>
          </div>
        </template>

        <template v-slot:[`item.quota_amount`]="{ item }">
          {{ item.quota_amount }} / {{ item.remaining_amount }}
        </template>
        <!-- <template
          v-slot:[`item.extension_operations[0].time_extended`]="{ item }"
        >
          <div class="warning--text">
            {{ item.extension_operations[0].time_extended }} Days
          </div>
        </template> -->
        <template v-slot:[`item.action`]="{ item }">
          <!-- <v-icon @click="viewItem(item)" class="mr-2"> mdi-eye</v-icon> -->
          <v-icon @click="update(9, item)" color="error" class="mr-2">
            mdi-close-circle-outline
          </v-icon>
          <v-icon @click="update(1, item)" color="success" class="mr-2">
            mdi-check-circle-outline</v-icon
          >
          <!-- <v-icon> mdi-delete-outline </v-icon> -->
        </template>
      </v-data-table>

      <!-- <v-dialog v-model="dialogEdit" persistent>
      <v-card>
        <div class="pa-2">
          <v-card-title>
            <p
              style="margin-bottom: -6px"
              class="
                text-h4
                blue--text
                text--darken-4
                font-weight-bold
                text-uppercase
              "
            >
              View
            </p>
            <v-divider
              style="border: 1px solid #0d47a1"
              class="ml-4"
              vertical
            ></v-divider>
          </v-card-title>
          <div v-if="edit == true">
            <v-row class="mx-6">
              <v-col cols="4">
                <v-text-field
                  :value="formatWasteCode(view.code, view.entry_type)"
                  label="Code"
                  outlined
                  hide-details="auto"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="mx-6">
              <v-col>
                <v-textarea
                  v-model="view.description"
                  outlined
                  hide-details="auto"
                  rows="5"
                  label="Description"
                  required
                ></v-textarea>
              </v-col>
            </v-row>
          </div>
          <div v-else>
            <v-row class="mx-6">
              <v-col cols="4">
                <v-text-field
                  :value="formatWasteCode(view.code, view.entry_type)"
                  label="Code"
                  outlined
                  readonly
                  hide-details="auto"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="mx-6">
              <v-col>
                <v-textarea
                  v-model="view.description"
                  outlined
                  readonly
                  hide-details="auto"
                  rows="5"
                  label="Description"
                  required
                ></v-textarea>
              </v-col>
            </v-row>
          </div>
        </div>

        <v-card-actions class="mx-4">
          <v-spacer></v-spacer>
          <v-btn
            outlined
            color="primary"
            class="mx-4 my-4"
            @click="toggleDialogEdit"
          >
            Cancel
          </v-btn>
          <div v-if="edit == true">
            <v-btn @click="update" color="primary" class="mx-4 my-4">
              Update
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
    </v-card>
  </div>
</template>
<script>
import Swal from "sweetalert2";
import gql from "graphql-tag";
import updateWasteCategorieStt from "~/gql/mutations/waste_categories/updateWasteCategorieStt.gql";
import rejectWasteCategorie from "~/gql/mutations/waste_categories/rejected_categorie.gql";
// import updateR_D from '~/gql/mutations/r_and_d/updateR_D'
// import deleteR_D from '~/gql/mutations/r_and_d/delete_r_d_code'
// import getWasteCatalog from '~/mixins/getWasteCat'
import titlePage from "~/components/titlePage.vue";
import wasteCodeMixin from "~/mixins/wasteCode";

export default {
  mixins: [wasteCodeMixin],
  components: {
    titlePage,
  },
  // mixins: [getWasteCatalog],
  data() {
    return {
      catagories: [],
      width: "35%",
      id: "",
      loading: false,
      editInfo: false,
      data: [],
      pagination: {
        page: 1,
        itemsPerPage: 15,
      },
      search: "",
      view: [],
      generator: [],
      // transporters: [],
    };
  },
  methods: {
    viewItem(item) {
      this.toggleEdit();
      this.$router.push("/waste_catalog/" + item.id);
      // console.log("🚀 ~ file: tableRandD.vue ~ line 211 ~ viewItem ~ this.view", this.view)
      // console.log('this.view :>> ', this.view)
    },
    update(number, item) {
      if (number == 1) {
        Swal.fire({
          title: "Are you sure?",
          text: "to approve this waste category!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, approve it!",
          cancelButtonText: "No, cancel!",
          confirmButtonColor: "#4caf50",
        }).then((result) => {
          if (result.isConfirmed) {
            // const d = [
            //   {
            //     id: item.id,
            //     status: number,
            //     expire_date: item.expire_date,
            //   },
            // ];
            // console.log("d :>> ", d);
            this.$apollo
              .mutate({
                mutation: gql`
                  ${updateWasteCategorieStt.updateWasteCategorieStt}
                `,
                variables: {
                  id: item.id,
                  status: number,
                  expire_date: item.expire_date,
                },
              })
              .then((res) => {
                // console.log("res :>> ", res);
                Swal.fire(
                  "Success!",
                  "Waste catagories has been approved.",
                  "success"
                );
                this.data.splice(-1, 1);
              })
              .catch((error) => {
                // console.log(error);
              });
          } else {
            Swal.fire("Cancelled", "Waste catagories is not approved", "error");
          }
        });
      } else {
        Swal.fire({
          title: "Are you sure?",
          text: "to reject this waste category!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, reject it!",
          cancelButtonText: "No, cancel!",
          confirmButtonColor: "#4caf50",
        }).then((result) => {
          if (result.isConfirmed) {
            this.$apollo
              .mutate({
                mutation: gql`
                  ${rejectWasteCategorie.deleteWasteCategorieStt}
                `,
                variables: {
                  id: item.id,
                },
              })
              .then(() => {
                Swal.fire(
                  "Success!",
                  "Waste catagories has been rejected.",
                  "success"
                );
                this.data.splice(-1, 1);
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            Swal.fire("Cancelled", "Waste catagories is not approved", "error");
          }
        });
      }
    },
    toggleEdit() {
      this.$store.commit("SET_EDITREJECTT", true);
    },
    editItem(item) {
      this.editInfo = true;
      this.dialogEdit = true;
      this.view = this.data[item];
      // console.log('this.view :>> ', this.view)
    },

    async getWasteCat() {
      this.loading = true;
      try {
        const { data } = await this.$apollo.query({
          query: require("~/gql/queries/waste_categories/wasteCatagoriesExtend")
            .wasteCatagoriesExtend,
          variables: {
            status: 0,
          },
          fetchPolicy: "network-only",
        });

        this.data = data.emac_catalog_operations;
        this.loading = false;
        // console.log("this.data :>> ", this.data);
        
        this.generator = this.data.map((item) => {
          return item.extension_operations.map((item) => {
            return item.generator;
          });
        });
        // console.log("this.data :>> ", this.data);
      } catch (error) {
        console.error("Error fetching waste categories: ", error);
        this.loading = false;
      }
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
      return this.$t("approve_waste_categories");
    },
    editRejectT: {
      get() {
        return this.$store.state.editRejectT;
      },
      set(newVal) {
        this.$store.commit("SET_EDITREJECTT", newVal);
      },
    },
    headers() {
      return [
        {
          text: this.$t("Code"),
          // filterable: false,
          value: "waste_category.code",
        },
        {
          text: "Waste Name",
          // filterable: false,
          value: "custom_description",
        },
        {
          text: this.$t("entry_type"),
          // filterable: false,
          value: "waste_category.entry_type",
        },
        {
          text: this.$t("enterprise_name"),
          // filterable: false,
          value: "catalog.generator.gen_name",
        },
        {
          text: this.$t("EMAC ID"),
          // filterable: false,
          value: "catalog.generator.emac_id",
        },
        {
          text: `${this.$t("quota_weight")} / ${this.$t("remaining_weight")}`,
          align: "center",
          // filterable: false,
          value: "quota_amount",
        },
        {
          text: this.$t("expired_date"),
          // filterable: false,
          value: "expire_date",
        },
        {
          text: this.$t("status"),
          align: "center",
          // filterable: false,
          value: "status",
        },
        {
          text: this.$t("action"),
          align: "center",
          sortable: false,
          value: "action",
        },
      ];
    },
  },
};
</script>
