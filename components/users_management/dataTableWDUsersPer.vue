<template>
  <div>
    <v-card-title class="py-0 pt-2">
      <v-row>
        <v-col cols="3">
          <h2 style="border-right: 3px solid #0d47a1">
            {{ text_wd }}
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
      :items="dataUserWdPer"
      :items-per-page="10"
      class="elevation-1"
      :search="search"
    >
      <template v-slot:[`item.verification_status`]="{ item }">
        <div v-if="item.verification_status == 1">
          <v-chip small color="primary">{{ text_active }}</v-chip>
        </div>
        <div v-else-if="item.verification_status == 2">
          <v-chip small color="warning">{{ text_suspended }}</v-chip>
        </div>
        <div v-else-if="item.verification_status == 3">
          <v-chip small color="error">{{ text_deleted }}</v-chip>
        </div>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <!-- <v-icon class="mr-2" @click="viewCompany(item)"> mdi-eye</v-icon> -->
        <v-icon class="mr-2" @click="editItem(item)">
          mdi-pencil-outline
        </v-icon>
        <v-icon @click="updateStatus()"> mdi-delete-outline </v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" persistent>
      <v-card>
        <v-card-title>
          <h2
            style="margin-bottom: -6px"
            class="blue--text text--darken-4 font-weight-bold text-uppercase"
          >
            {{ title_update }}
          </h2>
          <v-divider
            style="border: 1px solid #0d47a1"
            class="ml-4"
            vertical
          ></v-divider>
        </v-card-title>
        <v-card-text>
          <v-row class="mt-4">
            <v-col cols="4">
              <v-text-field
                label="Full name"
                outlined
                v-model="edit.name"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                :label="label[4]"
                outlined
                v-model="edit.tel"
                :rules="[
                  (v) =>
                    (String(v).length >= 8 && String(v).length <= 12) ||
                    'The phone must be 8 to 12 digits',
                ]"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-select
                v-model="edit.verification_status"
                item-text="name"
                item-value="value"
                :items="statuses"
                label="Status"
                required
                outlined
              ></v-select>
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
            Cancel
          </v-btn>
          <v-btn @click="update" color="primary">Update</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import getWDUsersPer from "~/mixins/getWDUsersPer";
import update_wd_user from "~/gql/mutations/users_management/updateWDUserPer";
import delete_wd_user from "~/gql/mutations/users_management/deleteWDUserPer";
import gql from "graphql-tag";
import Swal from "sweetalert2";
export default {
  mixins: [getWDUsersPer],
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      select: null,
      company_id: null,
      dialog: false,
      search: "",
      status: 0,
      label: [
        "First name",
        "Last name",
        "Email",
        "Password",
        "Phone",
        "Role",
        "Organizaiton",
      ],
      statuses: this.$store.state.statusUser,

      edit: [],
    };
  },
  methods: {
    editItem(item) {
      this.edit = item;
      // console.log("this.edit :>> ", this.edit);

      this.dialog = true;
    },
    update() {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, update it!",
      }).then((result) => {
        if (result.isConfirmed) {
          this.$apollo
            .mutate({
              mutation: update_wd_user,
              variables: {
                id: this.edit.id,
                name: this.edit.name,
                tel: this.edit.tel.toString(),
                verification_status: this.edit.verification_status,
              },
            })
            .then(() => {
              this.dialog = false;
              Swal.fire("Updated!", "User has been updated.", "success").then(
                () => {
                  window.location.reload();
                }
              );
            })
            .catch((err) => {
              console.log("err :>> ", err);
              Swal.fire("Error!", "Something went wrong.", "error");
            });
        }
      });
    },
    updateStatus(item) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          this.$apollo
            .mutate({
              mutation: gql`
                ${delete_wd_user.deleteWDUserPer}
              `,
              variables: {
                id: item.id,
              },
            })
            .then(() => {
              Swal.fire("Deleted!", "Your file has been deleted.").then(() => {
                window.location.reload();
              });
            });
        } else {
          Swal.fire("Cancelled", "Your imaginary file is safe :)", "error");
        }
      });
    },
  },
  computed: {
    text_active() {
      return this.$t("active");
    },
    text_suspended() {
      return this.$t("suspended");
    },
    text_deleted() {
      return this.$t("deleted");
    },

    text_wd() {
      return this.$t("waste_disposal");
    },
    title_update() {
      return this.$t("update_user");
    },
    headers() {
      return [
        {
          text: this.$t("name"),
          align: "start",
          sortable: false,
          value: "name",
        },
        {
          text: this.$t("email"),
          value: "email",
        },
        {
          text: this.$t("telephone"),
          value: "tel",
        },
        {
          text: this.$t("status"),
          value: "verification_status",
        },
        {
          text: this.$t("action"),
          value: "actions",
          sortable: false,
        },
      ];
    },
  },
};
</script>

<style>
</style>