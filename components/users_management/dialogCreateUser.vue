<template>
  <v-dialog v-model="dialog" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" v-bind="attrs" v-on="on">
        <v-icon class="">mdi-plus</v-icon>
        <span>{{ title_dialog }}</span>
      </v-btn>
    </template>

    <div>
      <v-card>
        <v-card-title>
          <h2
            style="margin-bottom: -6px"
            class="blue--text text--darken-4 font-weight-bold text-uppercase"
          >
            {{ title_dialog }}
          </h2>
          <v-divider
            style="border: 1px solid #0d47a1"
            class="ml-4"
            vertical
          ></v-divider>
        </v-card-title>

        <div v-if="this.process == true">
          <center>
            <v-progress-circular
              :size="70"
              :width="7"
              color="primary"
              indeterminate
            ></v-progress-circular>
          </center>
        </div>

        <div v-else>
          <v-form v-model="valid">
            <v-card-text>
              <v-row class="mt-4">
                <v-col cols="4">
                  <v-text-field
                    :label="label[0]"
                    outlined
                    v-model="name"
                    :rules="[
                      (v) => !!v || 'Name is required',
                      (v) =>
                        v.length <= 100 ||
                        'Name must be less than 50 characters',
                    ]"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="4">
                  <v-text-field
                    :label="label[2]"
                    outlined
                    v-model="email"
                    :rules="[
                      (v) => !!v || 'Email is required',
                      (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
                    ]"
                    type="email"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    :label="label[3]"
                    outlined
                    :value="value"
                    :rules="[(v) => !!v || 'Password is required']"
                    v-model="password"
                    :append-icon="value ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="() => (value = !value)"
                    :type="value ? 'password' : 'text'"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    :label="label[4]"
                    outlined
                    v-model="telephone"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-select
                    outlined
                    v-model="select"
                    item-text="name"
                    item-value="value"
                    :items="items"
                    :rules="[(v) => !!v || 'Item is required']"
                    :label="label[5]"
                    required
                  ></v-select>
                </v-col>
                <v-col cols="4">
                  <div v-if="select == 'staff'">
                    <v-text-field
                      v-model="emac_id"
                      outlined
                      disabled
                      label="EMAC ID"
                      required
                    ></v-text-field>
                    <!-- {{ amountWs }} -->
                  </div>
                  <div v-else-if="select == 'generator'">
                    <v-select
                      outlined
                      v-model="company_id"
                      item-text="name"
                      item-value="id"
                      :items="cp_gen_ids"
                      :rules="[(v) => !!v || 'Item is required']"
                      label="Enterprise"
                      required
                    ></v-select>
                  </div>
                  <div v-else-if="select == 'transporter'">
                    <v-select
                      outlined
                      v-model="company_id"
                      item-text="name"
                      item-value="id"
                      :items="cp_tran_ids"
                      :rules="[(v) => !!v || 'Item is required']"
                      label="Enterprise"
                      required
                    ></v-select>
                  </div>
                  <div v-else-if="select == 'disposal'">
                    <v-select
                      outlined
                      v-model="company_id"
                      item-text="name"
                      item-value="id"
                      :items="cp_dis_ids"
                      :rules="[(v) => !!v || 'Item is required']"
                      label="Enterprise"
                      required
                    ></v-select>
                  </div>
                  <div v-else>
                    <v-select
                      outlined
                      v-model="company_id"
                      item-text="name"
                      item-value="id"
                      :items="cp_regulator_ids"
                      :rules="[(v) => !!v || 'Item is required']"
                      label="Enterprise"
                      required
                    ></v-select>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="mx-4">
              <v-spacer></v-spacer>
              <v-btn
                v-if="select == 'staff'"
                color="primary"
                class="mx-4 my-4"
                @click="generateId"
              >
                Generate ID
              </v-btn>
              <v-btn
                outlined
                color="primary"
                class="mx-4 my-4"
                @click="dialog = false"
              >
                Cancel
              </v-btn>
              <v-btn color="primary" :disabled="!valid" @click="signUp"
                >Create</v-btn
              >
            </v-card-actions>
          </v-form>
        </div>
      </v-card>
    </div>
  </v-dialog>
</template>

<script>
import gql from "graphql-tag";
import { getFunctions, httpsCallable } from "firebase/functions";
import getDisposal_id from "~/mixins/getDisposalId";
import getTransporter_id from "~/mixins/getTransporterId";
import getGenerator_id from "~/mixins/getGeneratorId";
import getRegulator_id from "~/mixins/getRegulatorId";
import getWSUsers from "~/mixins/getWSUsers";
import updateWS from "~/gql/queries/users_management/insertEMCS.gql";
const Swal = require("sweetalert2");

export default {
  mixins: [
    getDisposal_id,
    getTransporter_id,
    getGenerator_id,
    getRegulator_id,
    getWSUsers,
  ],

  data: () => ({
    valid: true,
    process: false,
    emac_id: null,
    telephone: null,
    label: [
      "Full name",
      "Last name",
      "Email",
      "Password",
      "Phone",
      "Role",
      "Organizaiton",
    ],
    dialog: false,
    name: "",
    email: null,
    value: "",
    password: null,
    select: "generator",
    incresase_c: null,
    company_id: null,
    incresase: null,
    data: null,
    pr_code: null,
    org_type: null,
    last2digits: null,
    date: null,
    org: null,
    items: [
      { name: "Staff (WS)", value: "staff" },
      { name: "Generator (WG)", value: "generator" },
      { name: "Transporter (WT)", value: "transporter" },
      { name: "Disposal (WD)", value: "disposal" },
      { name: "Regulator (WR)", value: "regulator" },
    ],
  }),
  methods: {
    async generateId() {
      // console.log("this.totalWT  :>> ", this.totalWT);
      this.incresase = parseInt(this.amountWs) + 1;
      this.incresase_c = this.incresase.toString().length;
      // console.log("this.incresase :>> ", this.incresase);
      this.org = "S";
      this.date = new Date();
      this.last2digits = this.date.getFullYear().toString().slice(-2);
      // if (this.selected == "7372727f-c0f0-4bae-81f3-47bad3f1012d") {
      //   this.org_type = 1;
      // } else {
      //   this.org_type = 2;
      // }
      this.org_type = 0;
      this.pr_code = "021";

      if (this.incresase_c == 1) {
        this.emac_id = `EMC${this.org}${this.last2digits}${this.pr_code}00${this.incresase}${this.org_type}`;
      } else if (this.incresase_c == 2) {
        this.emac_id = `EMC${this.org}${this.last2digits}${this.pr_code}0${this.incresase}${this.org_type}`;
      } else if (this.incresase_c == 3) {
        this.emac_id = `EMC${this.org}${this.last2digits}${this.pr_code}${this.incresase}${this.org_type}`;
      }
    },
    insertID() {
      const variables = {
        id: this.data.uid,
        emc_id: this.emac_id,
      };

      console.log("variables :>> ", variables);

      this.$apollo
        .mutate({
          mutation: gql`
            ${updateWS.insertEMCS}
          `,
          variables: {
            id: this.data.uid,
            emc_id: this.emac_id,
          },
        })
        .then((res) => {
          // console.log("res :>> ", res);
          this.process = false;
          Swal.fire({
            icon: "success",
            title: "User created successfully!",
            showConfirmButton: true,
            confirmButtonText: "Save",
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "/waste_generator";
            }
          });
        });
    },

    async signUp() {
      try {
        if (this.name == null || this.email == null || this.password == null) {
          alert("fills is required");
        } else {
          this.process = true;
          const functions = getFunctions();
          const registerUser = httpsCallable(functions, "registerUser");
          if (this.select == "staff") {
            registerUser({
              email: this.email,
              password: this.password,
              displayName: this.name,
              phone_Number: this.telephone,
              userRole: this.select,
              company_id: "N/A",
              emcs_id: this.emac_id,
            })
              .then((result) => {
                this.data = result.data;
                console.log(
                  "🚀 ~ file: dialogCreateUser.vue:292 ~ signUp ~ this.data",
                  this.data
                );
                console.log(
                  "🚀 ~ file: dialogCreateUser.vue:292 ~ signUp ~ this.data",
                  this.data.uid
                );
                setTimeout(() => {
                  this.insertID();
                }, 1500);
              })
              .catch((error) => {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Something went wrong!",
                });
                this.process = false;
              });
          } else {
            registerUser({
              email: this.email,
              password: this.password,
              displayName: this.name,
              userRole: this.select,
              phone_Number: this.telephone,
              company_id: this.company_id,
            }).then((result) => {
              this.data = result.data;
              // console.log("this.data :>> ", this.data);
              this.process = false;
              Swal.fire({
                icon: "success",
                title: "User created successfully!",
                showConfirmButton: true,
                confirmButtonText: "Save",
                allowOutsideClick: false,
              }).then((result) => {
                if (result.isConfirmed) {
                  window.location.href = "/waste_generator";
                }
              });
            });
          }
        }
      } catch (e) {
        console.log(e.response);
      }
    },
  },
  computed: {
    title_dialog() {
      return this.$t("create_user");
    },
  },
};
</script>

<style>
</style>