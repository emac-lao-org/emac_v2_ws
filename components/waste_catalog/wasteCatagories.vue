<template>
  <div>
    <div>
      <v-row>
        <v-col cols="4">
          <v-alert border="left" colored-border color="warning" elevation="1">
            <v-row>
              <v-col cols="8">
                <div class="text-uppercase warning--text">
                  <b>
                    {{ text_remaining }}
                  </b>
                </div>
              </v-col>
              <v-col align="end">
                <div class="text-h6 font-weight-bold">
                  {{ remaining_amount }}
                </div>
              </v-col>
            </v-row>

            <v-progress-linear
              v-model="quota_amount_show"
              color="warning"
              rounded
              height="15"
            >
              <template v-slot:default="{ value }">
                <strong>{{ Math.ceil(value) }}%</strong>
              </template>
            </v-progress-linear>
          </v-alert>
        </v-col>
        <v-col cols="4">
          <v-alert border="left" colored-border color="primary" elevation="1">
            <v-row>
              <v-col>
                <div class="text-uppercase primary--text">
                  <b> {{ text_used }} </b>
                </div>
              </v-col>
              <v-col align="end">
                <div class="text-h6 font-weight-bold">
                  {{ amount }}
                </div>
              </v-col>
            </v-row>

            <v-progress-linear
              v-model="remaining_amount_show"
              color="primary"
              dark
              rounded
              height="15"
            >
              <template v-slot:default="{ value }">
                <strong>{{ Math.ceil(value) }}%</strong>
              </template>
            </v-progress-linear>
          </v-alert>
        </v-col>
      </v-row>
    </div>
    <v-card-title class="py-0 pt-2">
      <v-row>
        <v-col cols="3">
          <h2 style="border-right: 3px solid #0d47a1">
            {{ this.$t("waste_categories") }}
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
      :items-per-page="10"
      class="elevation-1"
      :search="search"
    >
      <template v-slot:[`item.waste_category.code`]="{ item }">
        {{ formatWasteCode(item.waste_category.code, item.waste_category.entry_type) }}
      </template>
      <template v-slot:[`item.quota_amount`]="{ item }">
        {{ item.quota_amount }} KG
      </template>
      <template v-slot:[`item.remaining_amount`]="{ item }">
        {{ item.remaining_amount }} KG
      </template>
      <template v-slot:[`item.weight`]="{ item }">
        <span class="warning--text">
          <b> {{ item.weight }} KG</b></span
        >
      </template>
      <template v-slot:[`item.status`]="{ item }">
        <div v-if="item.status == 1">
          <v-chip small color="primary">{{ text_active }}</v-chip>
        </div>
        <div v-else-if="item.status == 2">
          <v-chip small color="warning">{{ text_out_of_time }}</v-chip>
        </div>
        <div v-else-if="item.status == 3">
          <v-chip small color="error">{{
            text_waiting_for_time_extention
          }}</v-chip>
        </div>
        <div v-else-if="item.status == 4">
          <v-chip small color="error">{{ text_out_of_quota }}/</v-chip>
        </div>
        <div v-else-if="item.status == 5">
          <v-chip small color="error">{{
            text_waiting_for_quota_extention
          }}</v-chip>
        </div>
        <div v-else-if="item.status == 6">
          <v-chip small color="error">{{ text_reject_time_extention }}</v-chip>
        </div>
        <div v-else-if="item.status == 7">
          <v-chip small color="error">{{ text_reject_quota_extention }}</v-chip>
        </div>
        <div v-else-if="item.status == 8">
          <v-chip small color="error">Deleted</v-chip>
        </div>
        <div v-else-if="item.status == 9">
          <v-chip small color="error">{{ text_rejected }}</v-chip>
        </div>
      </template>
      <!-- <template v-slot:[`item.actions`]="{ item }">
        <v-icon class="mr-2" @click="viewCompany(item)"> mdi-eye</v-icon>
        <v-icon class="mr-2" @click="editItem(item)">
          mdi-pencil-outline
        </v-icon>
        <v-icon @click="updateStatus(item)"> mdi-delete-outline </v-icon>
      </template> -->
    </v-data-table>

    <!-- <v-dialog v-model="dialog" persistent>
      <v-card>
        <div class="mx-6">
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
          <v-row>
            <v-col cols="4">
              <v-text-field
                :value="formatWasteCode(view.waste_category.code, view.waste_category.entry_type)"
                outlined
                readonly
                label="Code"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="view.waste_category.entry_type"
                outlined
                readonly
                label="Entry Type"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="view.quota_amount"
                outlined
                readonly
                label="Quota weight(Kg/Month)"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="view.remaining_amount"
                outlined
                readonly
                label="Remaining weight(Kg/Year)"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="view.expire_date"
                outlined
                readonly
                label="Expire Date"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="view.custom_description"
                outlined
                readonly
                label="Description"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <v-card-actions class="mx-4">
            <v-spacer></v-spacer>
            <v-btn
              outlined
              color="primary"
              class="mx-4 my-4"
              @click="dialog = false"
            >
              Cancel
            </v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-dialog> -->
  </div>
</template>

<script>
import getWDUsers from "~/mixins/getWDUsers";
import update_wd_user from "~/gql/mutations/users_management/updateWDUser";
import delete_wd_user from "~/gql/mutations/users_management/deleteWDUser";
import gql from "graphql-tag";
import wasteCodeMixin from "~/mixins/wasteCode";

export default {
  mixins: [wasteCodeMixin],
  data() {
    return {
      dialog: false,
      search: "",
      tod: [],
      tos: [],
      data: [],
      statuses: this.$store.state.statuses,
      quota_amount: 0,
      remaining_amount: 0,
      remaining_amount_show: 0,
      quota_amount_show: 100,
      amount: 0,
      view: [],
    };
  },
  methods: {
    viewCompany(item) {
      item = JSON.parse(JSON.stringify(item));
      this.view = item;
      this.dialog = true;
    },
    getWDCatalog() {
      this.$apollo
        .query({
          query: require("~/gql/queries/waste_catalog/getWasteCatalog")
            .getWasteCatalogById,
          variables: {
            id: this.$route.query.id,
          },
        })
        .then((data) => {
          this.data = data.data.emac_catalogs[0].catalog_operations;
          // this.view = data.data.emac_catalogs[0].catalog_operations[0]
          // console.log("🚀 ~ file: wasteCatagories.vue ~ line 295 ~ .then ~ this.view", this.view)

          this.data.forEach((element) => {
            element.weight = element.quota_amount - element.remaining_amount;
          });

          this.quota_amount =
            data.data.emac_catalogs[0].catalog_operations_aggregate.aggregate.sum.quota_amount;

          this.remaining_amount =
            data.data.emac_catalogs[0].catalog_operations_aggregate.aggregate.sum.remaining_amount;

          this.amount = this.quota_amount - this.remaining_amount;

          this.remaining_amount_show = (this.amount / this.quota_amount) * 100;
          this.remaining_amount_show = this.remaining_amount_show.toFixed(0);

          this.quota_amount_show = 100 - this.remaining_amount_show;
          this.quota_amount_show = this.quota_amount_show.toFixed(0);
        });
    },
    // editItem(item) {
    //   this.edit = item
    //   console.log('this.edit :>> ', this.edit)
    //   this.dialog = true
    // },
    // update() {
    //   this.$apollo
    //     .mutate({
    //       mutation: gql`
    //         ${update_wd_user.updateWDUser}
    //       `,
    //       variables: {
    //         id: this.edit.id,
    //         name: this.edit.name,
    //         tel: this.edit.tel,
    //         verification_status: this.edit.verification_status,
    //       },
    //     })
    //     .then(() => {
    //       //   console.log(data)
    //       alert('Updated')
    //       window.location.reload()
    //     })
    //     .catch((error) => {
    //       console.log(error)
    //     })
    // },
    // updateStatus(item) {
    //   let text = 'Press a button!\nEither OK or Cancel.'
    //   if (confirm(text) == true) {
    //     this.$apollo
    //       .mutate({
    //         mutation: gql`
    //           ${delete_wd_user.deleteWDUser}
    //         `,
    //         variables: {
    //           id: item.id,
    //         },
    //       })
    //       .then(() => {
    //         alert('Deleted Success')
    //         window.location.reload()
    //         // this.data.splice(this.data.indexOf(item), 1)
    //       })
    //       .catch((err) => {
    //         console.log('err :>> ', err)
    //       })
    //   } else {
    //     return false
    //   }
    // },
  },
  mounted() {
    this.getWDCatalog();
  },
  computed: {
    text_remaining() {
      return this.$t("remaining_amount");
    },
    text_rejected() {
      return this.$t("rejected");
    },
    text_used() {
      return this.$t("used_amount");
    },
    text_active() {
      return this.$t("active");
    },
    text_out_of_time() {
      return this.$t("out_of_time");
    },
    text_waiting_for_time_extention() {
      return this.$t("waiting_for_time_extention");
    },
    text_out_of_quota() {
      return this.$t("out_of_quota");
    },
    text_waiting_for_quota_extention() {
      return this.$t("waiting_for_quota_extention");
    },
    text_reject_time_extention() {
      return this.$t("reject_time_extention");
    },
    text_reject_quota_extention() {
      return this.$t("reject_quota_extention");
    },

    headers() {
      return [
        {
          text: this.$t("code"),
          // filterable: false,
          value: "waste_category.code",
        },
        {
          text: this.$t("Custom description"),
          // filterable: false,
          value: "custom_description",
        },
        {
          text: this.$t("entry_type"),
          // filterable: false,
          value: "waste_category.entry_type",
        },
        {
          text: `${this.$t("quota_weight")}(kg/year)`,
          // filterable: false,
          value: "quota_amount",
        },
        {
          text: `${this.$t("remaining_weight")}(kg/year)`,
          // filterable: false,
          value: "remaining_amount",
        },
        {
          text: this.$t("weight"),
          // filterable: false,
          value: "weight",
        },
        {
          text: this.$t("expired_date"),
          // filterable: false,
          value: "expire_date",
        },
        {
          text: this.$t("status"),
          // filterable: false,
          value: "status",
        },
        // { text: this.$t("action"), align: 'center', sortable: false, value: 'actions' },
      ];
    },
  },
};
</script>

<style>
</style>
