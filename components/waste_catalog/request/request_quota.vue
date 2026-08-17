<template>
  <v-card class="mt-4 mx-6">
    <v-card-title class="py-0 pt-2">
      <v-row>
        <v-col cols="4">
          <h2 style="border-right: 3px solid #0d47a1">
            {{ text_title }}
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
      </template>

      <template v-slot:[`item.quota_amount`]="{ item }">
        {{ (item.quota_amount * 1).toLocaleString("en-US") }} /
        {{ (item.remaining_amount * 1).toLocaleString("en-US") }}
      </template>
      <template
        v-slot:[`item.extension_operations[0]?.quota_extended`]="{ item }"
      >
        <div class="warning--text">
          {{
            (item.extension_operations[0]?.quota_extended * 1).toLocaleString(
              "en-US"
            )
          }}
          KG
        </div>
      </template>
      <template v-slot:[`item.extension_operations[0]?.comment`]="{ item }">
        <span v-if="item.extension_operations[0]?.comment">
          {{ item.extension_operations[0].comment }}
        </span>
        <span v-else class="grey--text">—</span>
      </template>
      <template v-slot:[`item.action`]="{ item }">
        <v-icon
          v-if="item.extension_operations && item.extension_operations[0]?.attachment_url"
          @click="openAttachment(item)"
          color="primary"
          class="mr-2"
          >mdi-paperclip</v-icon
        >
        <v-icon @click="update(7, item, 0)" color="error" class="mr-2">
          mdi-close-circle-outline
        </v-icon>
        <v-icon @click="update(1, item, 1)" color="success" class="mr-2">
          mdi-check-circle-outline</v-icon
        >
        <!-- <v-icon class="mr-2"> mdi-pencil-outline </v-icon> -->
        <!-- <v-icon> mdi-delete-outline </v-icon> -->
      </template>
    </v-data-table>

    <v-dialog v-model="attachmentDialog" max-width="850" persistent>
      <v-card>
        <v-card-title primary-title class="blue--text darken-4">
          <h3>Attachment</h3>
          <v-spacer></v-spacer>
          <v-btn icon @click="attachmentDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="text-center">
          <img
            v-if="isImageAttachment"
            :src="attachmentUrl"
            style="max-width: 100%; max-height: 70vh"
            alt="attachment"
          />
          <iframe
            v-else-if="isPdfAttachment"
            :src="attachmentUrl"
            style="width: 100%; height: 70vh"
          ></iframe>
          <div v-else>
            <p>This file type cannot be previewed.</p>
            <v-btn
              color="primary"
              target="_blank"
              :href="attachmentUrl"
              >Open in new tab</v-btn
            >
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

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
</template>
<script>
import Swal from "sweetalert2";
import gql from "graphql-tag";
// import approve from '~/gql/mutations/waste_catalog/approveWasteCat.gql'
import updateWasteCategorieQ from "~/gql/mutations/waste_categories/updateWasteCategoriesQ.gql";
import moment from "moment";
import wasteCodeMixin from "~/mixins/wasteCode";

// import updateR_D from '~/gql/mutations/r_and_d/updateR_D'
// import deleteR_D from '~/gql/mutations/r_and_d/delete_r_d_code'
// import getWasteCatalog from '~/mixins/getWasteCat'
export default {
  mixins: [wasteCodeMixin],
  // mixins: [getWasteCatalog],
  data() {
    return {
      id: "",
      loading: false,
      editInfo: false,
      re_amount: 0,
      data: [],
      pagination: {
        page: 1,
        itemsPerPage: 15,
      },
      search: "",
      view: [],
      generator: [],
      lastInx: [],
      attachmentDialog: false,
      attachmentUrl: "",
      // transporters: [],
    };
  },
  methods: {
    openAttachment(item) {
      this.attachmentUrl =
        item.extension_operations && item.extension_operations[0]?.attachment_url
          ? item.extension_operations[0].attachment_url
          : "";
      if (this.attachmentUrl) {
        this.attachmentDialog = true;
      }
    },
    update(number, item, context) {
      let text = "Are you sure?";
      Swal.fire({
        title: text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#56CC4A",
        cancelButtonColor: "#FF5252",
        confirmButtonText: "Yes",
      }).then(async (result) => {
        if (result.isConfirmed) {
          if (context == 0) {
            this.$apollo
              .mutate({
                mutation: gql`
                  ${updateWasteCategorieQ.updateWasteCategorieQ}
                `,
                variables: {
                  id: item.id,
                  extension_id: item.extension_operations[0]?.id,
                  status: number,
                  quota_amount: item.quota_amount,
                  remaining_amount: item.remaining_amount,
                },
              })
              .then(() => {
                Swal.fire(
                  "Updated!",
                  "extend has been rejected.",
                  "error"
                ).then(() => {
                  window.location.reload();
                });
              });
          } else {
            this.re_amount =
              item.remaining_amount +
              item.extension_operations[0]?.quota_extended;
            this.re_amount = this.re_amount.toFixed(2);
            // console.log("re_amount :>> ", this.re_amount);
            this.$apollo
              .mutate({
                mutation: gql`
                  ${updateWasteCategorieQ.updateWasteCategorieQ}
                `,
                variables: {
                  id: item.id,
                  extension_id: item.extension_operations[0]?.id,
                  status: number,
                  quota_amount:
                    item.quota_amount +
                    item.extension_operations[0]?.quota_extended,
                  remaining_amount: this.re_amount,
                },
              })
              .then(() => {
                Swal.fire(
                  "Updated!",
                  "extend has been updated.",
                  "success"
                ).then(() => {
                  window.location.reload();
                });
              });
          }
        }
      });
    },
    viewItem(item) {
      this.toggleEdit();
      this.$router.push("/waste_catalog/" + item.id);
      // console.log("🚀 ~ file: tableRandD.vue ~ line 211 ~ viewItem ~ this.view", this.view)
      // console.log('this.view :>> ', this.view)
    },
    toggleEdit() {
      this.$store.commit("SET_EDITREJECTQ", true);
    },
    editItem(item) {
      this.editInfo = true;
      this.dialogEdit = true;
      this.view = this.data[item];
      // console.log("this.view :>> ", this.view);
    },
    async getWasteCat() {
      this.loading = true;
      this.$apollo
        .query({
          query: require("~/gql/queries/waste_categories/wasteCatagoriesExtend")
            .wasteCatagoriesTimeQuotaExtend,
         
        })
        .then((data) => {
          this.loading = false;
          this.data = data.data.emac_catalog_operations;

          this.data.forEach((element) => {
            element.time_request = moment(
              element.extension_operations[0].updated_at
            ).format("YYYY-MM-DD");
          });

          // console.log('this.data :>> ', this.data);
          // if (this.data.length > 0) {
          //   this.lastInx = this.data[0].extension_operations.length - 1;
          //   if (this.lastInx > 0) {
          //     this.data[0].gen_name =
          //       this.data[0].extension_operations[
          //         this.lastInx
          //       ].generator.gen_name;
          //     this.data[0].quota_extended =
          //       this.data[0].extension_operations[this.lastInx].quota_extended;
          //   }
          // }
          // console.log(
          //   "🚀 ~ file: request_quota.vue ~ line 255 ~ .then ~ this.data",
          //   this.data
          // );
        })
        .catch((err) => {
          // console.log('err :>> ', err);
          // window.location.reload();
        });
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

    checkLanguage() {
      const locale = localStorage.getItem("lang");
      this.$i18n.locale = locale;
    },
  },
  mounted() {
    this.getWasteCat();
    this.checkLanguage();
  },
  computed: {
    isImageAttachment() {
      return /\.(png|jpe?g|gif|webp)(\?|$)/i.test(this.attachmentUrl || "");
    },
    isPdfAttachment() {
      return /\.pdf(\?|$)/i.test(this.attachmentUrl || "");
    },
    text_title() {
      return this.$t("quota_extended");
    },
    editRejectQ: {
      get() {
        return this.$store.state.editRejectQ;
      },
      set(newVal) {
        this.$store.commit("SET_EDITREJECTQ", newVal);
      },
    },
    headers() {
      return [
        {
          text: "Request Date",
          // filterable: false,
          value: `time_request`,
        },
        {
          text: this.$t("waste_generator"),
          // filterable: false,
          value: `catalog.generator.gen_name_lo`,
        },
        {
          text: this.$t("emcg_id"),
          // filterable: false,
          value: `catalog.generator.emac_id`,
        },
        {
          text: this.$t("categories_name"),
          // filterable: false,
          value: "custom_description",
          width: "150px",
        },
        {
          text: this.$t("code"),
          // filterable: false,
          value: "waste_category.code",
          width: "100px",
        },
        

        {
          text: this.$t("entry_type"),
          // filterable: false,
          value: "waste_category.entry_type",
        },

        {
          text: `${this.$t("quota_weight")} / ${this.$t("remaining_weight")}`,
          align: "center",
          // filterable: false,
          value: "quota_amount",
          width: "150px",
        },
        {
          text: `${this.$t("extended")} KG`,
          value: `extension_operations[0]?.quota_extended`,
        },
        {
          text: "Comment",
          value: `extension_operations[0]?.comment`,
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
