<template>
  <v-card>
    <v-card-title class="py-0 pt-2">
      <v-row>
        <v-col cols="4">
          <h2 style="border-right: 3px solid #0d47a1">
            {{text_title}}
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

      <!-- <template v-slot:[`item.action`]="{ item }">
        <v-icon @click="viewItem(item)" class="mr-2"> mdi-eye</v-icon>
        <v-icon class="mr-2" @click="seeMoreItem(item)"> mdi-eye</v-icon>
        <v-icon class="mr-2"> mdi-pencil-outline </v-icon>
        <v-icon @click="deleteItem(item)"> mdi-delete-outline </v-icon>
      </template> -->
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
                  v-model="view.code"
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
                  v-model="view.code"
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
</template>
<script>
import gql from "graphql-tag";
import Swal from "sweetalert2";
// import updateR_D from '~/gql/mutations/r_and_d/updateR_D'
// import deleteR_D from '~/gql/mutations/r_and_d/delete_r_d_code'
// import getWasteCatalog from "~/mixins/getWasteCat";
// import updateCatalog from "~/gql/mutations/waste_catalog/updateCatalogStt";
export default {
  // mixins: [getWasteCatalog],
  data() {
    return {
      id: "",
      data: [],
      editInfo: false,
      pagination: {
        page: 1,
        itemsPerPage: 15,
      },
      search: "",
      headers: [
        {
          text: "Date",
          value: "log_date",
        },
        {
          text: "Action",
          value: "log_name",
        },
        { text: "Catalog name", value: "catalog_operation.cat_name" },
        { text: "Description", value: "description",width:"60%" },
      ],
      view: [],
      // transporters: [],
    };
  },
  methods: {
    getData() {
      this.$apollo
        .query({
          query: require("~/gql/queries/getCatalogLog").getCatalogLog,
        })
        .then((res) => {
          this.data = res.data.emac_catalog_logs;
          
        });
    },
    // viewItem(item) {
    //   this.toggleEdit();
    //   this.$router.push("/waste_catalog/" + item.id);
    //   // console.log("🚀 ~ file: tableRandD.vue ~ line 211 ~ viewItem ~ this.view", this.view)
    //   // console.log('this.view :>> ', this.view)
    // },
    // deleteItem(item) {
    //   Swal.fire({
    //     icon: "question",
    //     title: "Are you sure?",
    //     showConfirmButton: true,
    //     showCancelButton: true,
    //     confirmButtonText: "Yes, delete it!",
    //     cancelButtonText: "No, cancel!",
    //     reverseButtons: true,
    //     allowOutsideClick: false,
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       this.$apollo
    //         .mutate({
    //           mutation: gql`
    //             ${updateCatalog.updateCatalogStt}
    //           `,
    //           variables: {
    //             id: item.id,
    //           },
    //         })
    //         .then(() => {
    //           Swal.fire({
    //             icon: "success",
    //             title: "Deleted!",
    //             showConfirmButton: false,
    //             timer: 1500,
    //           });
    //           window.location.reload();
    //         });
    //     } else if (result.isDenied) {
    //       Swal.fire({
    //         icon: "error",
    //         title: "Cancelled",
    //         showConfirmButton: false,
    //         timer: 1500,
    //       });
    //     }
    //   });
    // },
    // toggleEdit() {
    //   this.$store.commit("SET_EDIT", false);
    // },
    // editItem(item) {
    //   this.editInfo = true
    //   this.dialogEdit = true
    //   this.view = this.data[item]
    //   console.log('this.view :>> ', this.view)
    // },
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
    this.getData();
  },
  computed: {
  //   edit: {
  //     get() {
  //       return this.$store.state.edit;
  //     },
  //     set(newVal) {
  //       this.$store.commit("SET_EDIT", newVal);
  //     },
  //   },
  text_title() {
    return this.$t('data_entry_log');
  },

  },
};
</script>