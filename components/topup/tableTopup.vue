<template>
  <v-card>
    <v-card-title class="py-0 pt-2">
      <v-row>
        <v-col cols="3">
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

    <v-data-table :headers="headers" :items="data" :search="search">
      <template v-slot:[`item.actions`]="{ item }">
        <!-- <v-icon class="mr-2" @click="viewItem(item)"> mdi-file-document</v-icon> -->
        <v-icon class="mr-2" @click="seeMoreItem(item)"> mdi-eye</v-icon>
        <v-btn depressed color="success" @click="editItem(item)">
    <b>  {{text_button}}</b>
        </v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" persistent>
      <v-card>
        <div class="pa-2">
          <v-card-title>
            <h2
              style="margin-bottom: -6px"
              class="
               
                blue--text
                text--darken-4
                font-weight-bold
                text-uppercase
              "
            >
             {{this.$t('view')}}
            </h2>
            <v-divider
              style="border: 1px solid #0d47a1"
              class="ml-4"
              vertical
            ></v-divider>
          </v-card-title>
          <div class="ml-6" style="color: #5c6bc0">
            <v-row class="mb-2" no-gutters>
              <v-col cols="6">
                <v-row>
                  <v-col>
                    <h3 class="text-uppercase">{{this.$t('enterprise_infomation')}}</h3>
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col class="font-weight-medium" align="end">
                    EMCD ID: {{ emac_id }} <br />
                    USER ID: {{ wd_request }}
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="6">
                <div class="pa-2" tile>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Enterprise Name(Lao)"
                        outlined
                        v-model="dis_name_lo"
                        readonly
                      ></v-text-field>
                      <v-text-field
                        label="District"
                        readonly
                        v-model="district"
                        outlined
                      ></v-text-field>
                      <v-text-field
                        label="Office Telephone"
                        readonly
                        v-model="tel"
                        outlined
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Enterprise Name(Eng)"
                        readonly
                        v-model="dis_name"
                        outlined
                      ></v-text-field>
                      <v-text-field
                        label="Village"
                        readonly
                        v-model="village"
                        outlined
                      ></v-text-field>
                      <v-text-field
                        label="Province"
                        readonly
                        v-model="province"
                        outlined
                      ></v-text-field>
                      <v-alert dense color="red" text>
                        <h3 class="error--text">{{this.$t('credit_amount')}}</h3>
                        <h4 class="error--text">
                          {{ new Intl.NumberFormat().format(view.amount) }} LAK
                        </h4>
                      </v-alert>
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col>
                <div class="pa-2" outlined tile>
                  <div>
                    <div align="center" v-if="this.loading == true">
                      <v-progress-circular
                        :size="70"
                        :width="7"
                        color="primary"
                        indeterminate
                      >
                      </v-progress-circular>
                    </div>

                    <div v-else>
                      <div v-show="this.isPDF == false">
                      <v-img
                        :src="url"
                        :aspect-ratio="1.7"
                        contain
                        max-height="300"
                      ></v-img>
                      </div>
                     <div v-show="this.isPDF == true">
                      <vue-pdf-embed :source="url" />
                      </div>
                    </div>
                  </div>
                </div>
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
            @click="toggleDialog"
          >
             <b>  {{text_cancel_button}}</b>
          </v-btn>
          <v-btn depressed color="success" @click="approve()">  <b>  {{text_button}}</b> </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import gql from "graphql-tag";
import approve from "~/gql/mutations/topup/approveTopup";
import VuePdfEmbed from "vue-pdf-embed/dist/vue2-pdf-embed";

import { getStorage, ref, getDownloadURL } from "firebase/storage";
import Swal from "sweetalert2";
export default {
  components: {
    VuePdfEmbed,
  },
  data() {
    return {
      url: "",
      isPDF: false,
      loading: false,
      key: "",
      urlImage: "",
      search: "",
      loading: false,
      pagination: {
        page: 1,
        itemsPerPage: 15,
      },
      search: "",
      data: [],
      view: [],
    };
  },
  methods: {
         checkLanguage() {
      const locale = localStorage.getItem("lang");
      this.$i18n.locale = locale;
    },
    getRequest() {
      this.$apollo
        .query({
          query: require("~/gql/queries/topup/getTopup.gql").getTopup,
        })
        .then((res) => {
          this.data = res.data.emac_topup_requests;
  
        });
    },

    seeMoreItem(item) {
      this.view = item;
    
      const functions = getStorage();
      const storageRef = ref(functions, item.attachment);
      getDownloadURL(storageRef).then((url) => {
        this.urlImage = url;
    

        //check file type
        if (this.urlImage.toString().includes("pdf")) {
          this.isPDF = true;
          this.url = this.urlImage;
        } else {
          this.isPDF = false;
          this.url = this.urlImage;
        }
      });
      //     .catch((error) => {
      //       console.log(
      //         "🚀 ~ file: tableTopup.vue ~ line 158 ~ grtDownloadURL ~ error",
      //         error
      //       );
      //     });

      this.toggleDialog();
    },
    approve() {
      Swal.fire({
        icon: "question",
        title: "Are you sure?",
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes, approve it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this.$apollo
            .mutate({
              mutation: gql`
                ${approve.approveTopup}
              `,
              variables: {
                id: this.view.id,
                ws_approve: this.$nuxt.$fire.auth.currentUser.uid,
              },
            })
            .then(() => {
              Swal.fire({
                icon: "success",
                title: "Approved!",
                showConfirmButton: false,
                timer: 1500,
              }).then(() => {
                window.location.reload();
              });
            });
        } else {
          Swal.fire({
            icon: "error",
            title: "Cancelled",
            text: "Your imaginary file is safe :)",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
    },
    editItem(item) {
      Swal.fire({
        icon: "question",
        title: "Are you sure?",
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes, approve it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this.$apollo
            .mutate({
              mutation: gql`
                ${approve.approveTopup}
              `,
              variables: {
                id: item.id,
                ws_approve: this.$nuxt.$fire.auth.currentUser.uid,
              },
            })
            .then(() => {
              Swal.fire({
                icon: "success",
                title: "Approved!",
                showConfirmButton: false,
                timer: 1500,
              }).then(() => {
                window.location.reload();
              });
            });
        } else {
          Swal.fire({
            icon: "error",
            title: "Cancelled",
            text: "Your imaginary file is safe :)",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
    },
    toggleDialog() {
      this.$store.commit("SET_DIALOG", !this.$store.state.dialog);
    },
  },
  mounted() {
    this.checkLanguage();
    this.loading = true;
    this.getRequest();
    setTimeout(() => {
      this.loading = false;
    }, 4000);
  },
  computed: {
    text_button() {
      return this.$t("approve");
    },
    text_cancel_button() {
      return this.$t("cancel");
    },

    headers(){
      return  [
        {
          text: this.$t("enterprise_name"),
          // filterable: false,
          value: "disposal.dis_name",
        },
        { text: this.$t("enterprise_number"), value: "disposal.enterprise_no" },
        { text: "EMCD ID", value: "disposal.emac_id" },
        { text: this.$t("request_date"), value: "request_date" },
        { text: this.$t("credit_amount"), value: "amount" },
        { text: this.$t("action"), align: "center", value: "actions" },
      ]
    },
    text_title(){
      return this.$t("top_up_approvement")
    },
    wd_request() {
      if (this.view.length == 0) {
        return "";
      } else {
        return this.view.wd_request;
      }
    },
    emac_id() {
      if (this.view.length == 0) {
        return "";
      } else {
        return this.view.disposal.emac_id;
      }
    },
    dis_name() {
      if (this.view.length == 0) {
        return "";
      } else {
        return this.view.disposal.dis_name;
      }
    },
    dis_name_lo() {
      if (this.view.length == 0) {
        return "";
      } else {
        return this.view.disposal.dis_name_lo;
      }
    },
    tel() {
      if (this.view.length == 0) {
        return "";
      } else {
        return this.view.disposal.tel;
      }
    },
    province() {
      if (this.view.length == 0) {
        return "";
      } else {
        return this.view.disposal.village.district.province.pr_name_lo;
      }
    },
    village() {
      if (this.view.length == 0) {
        return "";
      } else {
        return this.view.disposal.village.vill_name_lo;
      }
    },
    district() {
      if (this.view.length == 0) {
        return "";
      } else {
        return this.view.disposal.village.district.dr_name_lo;
      }
    },
    dialog: {
      get() {
        return this.$store.state.dialog;
      },
      set(newVal) {
        this.$store.commit("SET_DIALOG", newVal);
      },
    },
  },
};
</script>