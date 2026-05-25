<template>
  <div class="ma-4">
    <v-row>
      <v-col cols="10">
        <title-page :title="title" :width="width" />
      </v-col>
      <v-col align="end" align-self="center">
        <v-dialog v-model="dialog" persistent>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" v-bind="attrs" v-on="on">
              <v-icon class="">mdi-plus</v-icon>
              <span>{{ text_create }}</span>
            </v-btn>
          </template>
          <v-card>
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
                {{ title_create }}
              </h2>
              <v-divider
                style="border: 1px solid #0d47a1"
                class="ml-4"
                vertical
              ></v-divider>
            </v-card-title>
            <v-card-text>
              <v-row class="mx-6 mt-4">
                <v-col cols="4">
                  <v-text-field
                    v-model="code"
                    label="Code"
                    outlined
                    hide-details="auto"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row class="mx-6">
                <v-col>
                  <v-textarea
                    v-model="description"
                    outlined
                    hide-details="auto"
                    rows="5"
                    label="Description"
                    required
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-actions class="mx-4">
              <v-spacer></v-spacer>
              <v-btn
                outlined
                color="primary"
                class="mx-4 my-4"
                @click="dialog = false"
              >
                {{this.$t('cancel')}}
              </v-btn>
              <v-btn color="primary" class="mx-4 my-4" @click="create">
                {{this.$t('create')}}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>

    <div class="mt-4">
      <v-tabs v-model="tab" class="mb-6">
        <v-tab v-for="item in items" :key="item"> {{ item }}</v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-card flat>
            <table-rand-d />
          </v-card>
        </v-tab-item>
        <!-- <v-tab-item>
          <v-card flat>
            <h1>Test1</h1>
          </v-card>
        </v-tab-item> -->
      </v-tabs-items>
    </div>
  </div>
</template>

<script>
import TableRandD from "~/components/r_d/tableRandD.vue";
import TitlePage from "~/components/titlePage.vue";
import insert_r_d_code from "~/gql/mutations/r_and_d/insert_r_d_code";
import gql from "graphql-tag";
const Swal = require("sweetalert2");

export default {
  components: { TitlePage, TableRandD },
  data() {
    return {
      code: "",
      description: "",
      dialog: false,
      tab: null,
      items: [],
      width: "35%",
    };
  },

  created() {
    this.getToken();
    this.items = [this.$t('waste_catalog')];
  },

  methods: {
    async getToken() {
      const result = await $nuxt.$fire.auth.currentUser
        .getIdTokenResult()
        .catch((err) => console.log(err));
      this.token = result.token;
      console.log('this.token :>> ', this.token);
      localStorage.setItem("token", this.token);
      document.cookie = "token=" + this.token;
      // await window.location.reload()
    },
    create() {
      this.$apollo
        .mutate({
          mutation: gql`
            ${insert_r_d_code.insert_r_d_code}
          `,
          variables: {
            code: this.code,
            description: this.description,
          },
        })
        .then(() => {
          alert("success");
          this.dialog = false;
          window.location.reload();
        })
        .catch((err) => {
          let text = "Can't connect to server \n Please try again";
          if (confirm(text) == true) {
            window.location.reload();
          } else {
            return false;
          }
        });
    },
  },
  computed: {
    text_create() {
      return this.$t("create");
    },
    title_create() {
      return this.$t("create_r_and_d_code");
    },
    title(){
      return this.$t("manage_r_and_d_code") 
    }
  },
};
</script>

<style>
</style>