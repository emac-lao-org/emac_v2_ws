<template>
  <v-card class="mt-4 mx-6">
    <v-card-title class="py-0 pt-2">
      <v-row>
        <v-col cols="4">
          <p class="display-1" style="border-right: 3px solid #0d47a1">
            {{ text_title }}
          </p>
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
      <template v-slot:[`item.time_left`]="{ item }">
       <span class="warning--text"> {{ item.time_left }} days</span>
      </template>
      <template v-slot:[`item.status`]="{ item }">
        <div v-if="item.status == 1">
          <v-chip small color="success">Active</v-chip>
        </div>
        <div v-else-if="item.status == 2">
          <v-chip small>Out of time</v-chip>
        </div>
        <div v-else-if="item.status == 3">
          <v-chip small color="warning">Waiting for time extention</v-chip>
        </div>
        <div v-else-if="item.status == 4">
          <v-chip small>Out of quota</v-chip>
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
        {{ item.quota_amount }} / {{ item.remaining_amount }}
      </template>
      <!-- 
      <template v-slot:[`item.action`]="{ item }">
        <v-icon @click="viewItem(item)" class="mr-2"> mdi-eye</v-icon>
        <v-icon @click="update(7, item)" color="error" class="mr-2">
          mdi-close-circle-outline
        </v-icon>
        <v-icon @click="update(1, item)" color="success" class="mr-2">
          mdi-check-circle-outline</v-icon
        >
        <v-icon> mdi-delete-outline </v-icon>
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
import gql from "graphql-tag";
import updateWasteCategorieStt from "~/gql/mutations/waste_categories/updateWasteCategorieStt.gql";
// import updateR_D from '~/gql/mutations/r_and_d/updateR_D'
// import deleteR_D from '~/gql/mutations/r_and_d/delete_r_d_code'
// import getWasteCatalog from '~/mixins/getWasteCat'
import moment from "moment";
import wasteCodeMixin from "~/mixins/wasteCode";
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
      let text = "Are you sure?";
      var d = new Date();
      d.setDate(d.getDate() + item.extension_operations[0].time_extended);
      const date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

      if (confirm(text) == true) {
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
            alert("Success");
            window.location.reload();
          });
      } else {
        return false;
      }
    },
    toggleEdit() {
      this.$store.commit("SET_EDITREJECTT", true);
    },
    // editItem(item) {
    //   this.editInfo = true
    //   this.dialogEdit = true
    //   this.view = this.data[item]
    //   console.log('this.view :>> ', this.view)
    // },
    async getWasteCat() {
      this.loading = true;

      //moment get current date xxxx-xx-xx
      const date = moment().format("YYYY-MM-DD");
      // var d = new Date();
      // d.setDate(d.getDate());
      // const date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      console.log("date :>> ", date);

      this.$apollo
        .query({
          query: require("~/gql/queries/waste_categories/wasteCatagoriesExpire")
            .wasteCatagoriesExpire,
          variables: {
            expire_date: date,
          },
        })
        .then((data) => {
          this.loading = false;

          this.data = data.data.emac_catalog_operations;
          this.data.forEach((item) => {
            item.time_left = moment(date).diff(
              moment(item.expire_date),
              "days"
            );
          });
          console.log(
            "🚀 ~ file: expireWaste.vue:260 ~ .then ~   this.data",
            this.data
          );

          this.generator = this.data.map((item) => {
            return item.extension_operations.map((item) => {
              return item.generator;
            });
          });
        })
        .catch((err) => {
          // console.log('err :>> ', err)
          // window.location.reload()
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
  },
  mounted() {
    this.getWasteCat();
  },
  computed: {
    text_title() {
      return this.$t("expired_categories");
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
          text: this.$t("waste_generator"),
          // filterable: false,
          value: "catalog.generator.gen_name",
        },
        {
          text: this.$t("emcg_id"),
          // filterable: false,
          value: "catalog.generator.emac_id",
        },
        {
          text: this.$t("categories_name"),
          // filterable: false,
          value: "cat_name",
        },
        {
          text: this.$t("waste_code"),
          // filterable: false,
          value: "waste_category.code",
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
          text: this.$t("time_left") + " (Day)",
          // filterable: false,
          value: "time_left",
        },
        {
          text: this.$t("status"),
          align: "center",
          // filterable: false,
          value: "status",
        },
        // { text: this.$t("action"), align: 'center', sortable: false, value: 'action' },
      ];
    },
  },
};
</script>
