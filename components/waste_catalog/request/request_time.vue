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
        v-slot:[`item.extension_operations[0].time_extended`]="{ item }"
      >
        <div class="warning--text">
          {{ item.extension_operations[0].time_extended }} Days
        </div>
      </template>
      <template v-slot:[`item.extension_operations[0].comment`]="{ item }">
        <span v-if="item.extension_operations[0]?.comment">
          {{ item.extension_operations[0].comment }}
        </span>
        <span v-else class="grey--text">—</span>
      </template>
      <template v-slot:[`item.action`]="{ item }">
        <!-- <v-icon @click="viewItem(item)" class="mr-2"> mdi-eye</v-icon> -->
        <v-icon @click="update(6, item, 0)" color="error" class="mr-2">
          mdi-close-circle-outline
        </v-icon>
        <v-icon @click="update(1, item, 1)" color="success" class="mr-2">
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
</template>
<script>
import Swal from "sweetalert2";
import gql from "graphql-tag";
import updateWasteCategorieStt from "~/gql/mutations/waste_categories/updateWasteCategorieStt.gql";
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
      data: [],
      pagination: {
        page: 1,
        itemsPerPage: 15,
      },
      search: "",
      view: [],
      generator: [],
      lastInx: [],
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
    async update(number, item, context) {
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
            // console.log('item :>> ', item.expire_date);
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
              .then(() => {
                Swal.fire("Updated!", "extend has been updated.", "success");
                window.location.reload();
              });
          } else {
            const date = moment(item.expire_date)
              .add(item.extension_operations[0]?.time_extended, "days")
              .format("YYYY-MM-DD");
            // console.log('date :>> ', date);
            this.$apollo
              .mutate({
                mutation: gql`
                  ${updateWasteCategorieStt.updateWasteCategorieStt}
                `,
                variables: {
                  id: item.id,
                  status: number,
                  expire_date: date,
                },
              })
              .then(() => {
                Swal.fire("Updated!", "extend has been updated.", "success");
                window.location.reload();
              });
          }
        }
      });
    },
    toggleEdit() {
      this.$store.commit("SET_EDITREJECTT", true);
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
            .wasteCatagoriesTimeExtend,
        })
        .then((data) => {
          this.loading = false;
          this.data = data.data.emac_catalog_operations;
          console.log(
            "🚀 ~ file: request_time.vue:290 ~ .then ~ this.data:",
            this.data
          );

          this.data.forEach((e) => {
            e.time_request = moment(
              e.extension_operations[0].created_at
            ).format("YYYY-MM-DD");
          });

          // if (this.data.length > 0) {
          //   this.lastInx = this.data[0].extension_operations.length - 1;
          //   // console.log("🚀 ~ file: request_time.vue ~ line 329 ~ .then ~  this.lastInx ",  this.lastInx )
          //   // this.data[0].time_extended = this.data[0].extension_operations[this.lastInx].time_extended;
          //   // this.data[0].gen_name = this.data[0].extension_operations[this.lastInx].generator.gen_name;
          // }

          // console.log(
          //   "🚀 ~ file: request_time.vue ~ line 271 ~ .then ~ this.data",
          //   this.data
          // );
        })
        .catch((err) => {
          console.log("err :>> ", err);
          // let text = "Can't connect to server \n Please try again";

          if (confirm(err) == true) {
            window.location.reload();
          } else {
            return false;
          }
        });
    },
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
    text_title() {
      return this.$t("time_extended");
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
          text: "Request Date",
          // filterable: false,
          value: "time_request",
        },

        {
          text: this.$t("waste_generator"),
          // filterable: false,
          value: "extension_operations[0].generator.gen_name_lo",
        },
        {
          text: this.$t("emcg_id"),
          // filterable: false,
          value: "extension_operations[0].generator.emac_id",
        },
        // {
        //   text: this.$t("catalog_name"),
        //   // filterable: false,
        //   value: "cat_name",
        // },
        {
          text: this.$t("categories_name"),
          // filterable: false,
          value: "custom_description",
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
        },
        {
          text: this.$t("expired_date"),
          // filterable: false,
          value: "expire_date",
        },
        {
          text: `${this.$t("extended")} Day`,
          // filterable: false,
          value: "extension_operations[0].time_extended",
        },
        {
          text: "Comment",
          value: "extension_operations[0].comment",
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
          width: "120px",
        },
      ];
    },
  },
};
</script>
