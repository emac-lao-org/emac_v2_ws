<template>
  <div>
    <v-card-title class="py-0 pt-2">
      <v-row>
        <v-col cols="3">
          <h2 style="border-right: 3px solid #0d47a1">
           {{text_tran}}
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
      :items="dataUserWtPer"
      :items-per-page="10"
      class="elevation-1"
      :search="search"
    >
     <template v-slot:[`item.verification_status`]="{ item }">
        <div v-if="item.verification_status == 1">
          <v-chip small color="primary">{{text_active}}</v-chip>
        </div>
        <div v-else-if="item.verification_status == 2">
          <v-chip small color="warning">{{text_suspended}}</v-chip>
        </div>
        <div v-else-if="item.verification_status == 3">
          <v-chip small color="error">{{text_deleted}}</v-chip>
        </div>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <!-- <v-icon class="mr-2" @click="viewCompany(item)"> mdi-eye</v-icon> -->
        <v-icon class="mr-2" @click="editItem(item)">
          mdi-pencil-outline
        </v-icon>
        <v-icon @click="updateStatus(item)"> mdi-delete-outline </v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" persistent>
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
            {{text_update}}
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
                clearable
                required
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                :label="label[4]"
                outlined
                clearable
                v-model="edit.tel"
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
import getWTUsersPer from '~/mixins/getWTUsersPer'
import update_wt_user from '~/gql/mutations/users_management/updateWTUserPer'
import delete_wt_user from '~/gql/mutations/users_management/deleteWTUserPer'
import gql from 'graphql-tag'
export default {
  mixins: [getWTUsersPer],
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      select: null,
      company_id: null,
      dialog: false,
      search: '',
      status: 0,
      label: [
        'First name',
        'Last name',
        'Email',
        'Password',
        'Phone',
        'Role',
        'Organizaiton',
      ],
           statuses: this.$store.state.statuses,
      edit: [],
    }
  },
  methods: {
    editItem(item) {
      this.edit = item
      // console.log('this.edit :>> ', this.edit)

      this.dialog = true
    },
    update() {
      this.$apollo
        .mutate({
          mutation: gql`
            ${update_wt_user.updateWTUserPer}
          `,
          variables: {
            id: this.edit.id,
            name: this.edit.name,
            tel: this.edit.tel,
            verification_status: this.edit.verification_status,
          },
        })
        .then(() => {
          //   console.log(data)
          alert('Updated')
          window.location.reload()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    updateStatus(item) {
      let text = 'Press a button!\nEither OK or Cancel.'
      if (confirm(text) == true) {
        this.$apollo
          .mutate({
            mutation: gql`
              ${delete_wt_user.deleteWTUserPer}
            `,
            variables: {
              id: item.id,
            },
          })
          .then(() => {
            alert('Deleted Success')
            window.location.reload()
            // this.data.splice(this.data.indexOf(item), 1)
          })
          .catch((err) => {
            console.log('err :>> ', err)
          })
      } else {
        return false
      }
    },
  },
  computed: {
    text_update() {
      return this.$t('update_user')
    },
    text_tran(){
      return this.$t('waste_transporter')
    },
     text_active(){
      return this.$t("active");
    },
    text_suspended(){
      return this.$t("suspended");
    },
    text_deleted(){
      return this.$t("deleted");
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
}
</script>

<style>
</style>