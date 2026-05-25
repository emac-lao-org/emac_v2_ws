<template>
  <div>
    <v-card-title class="py-0 pt-2">
      <v-row>
        <v-col cols="3">
          <h2 style="border-right: 3px solid #0d47a1">
            {{ text_wr }}
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
      :items="dataUserWrPer"
      :items-per-page="10"
      class="elevation-1"
      :search="search"
    >
      <template v-slot:[`item.verification_status`]="{ item }">
        <div v-if="item.verification_status == 1">
          <v-chip small color="primary">{{active_stt}}</v-chip>
        </div>
        <div v-else-if="item.verification_status == 2">
          <v-chip small color="warning">{{suspended_stt}}</v-chip>
        </div>
        <div v-else-if="item.verification_status == 3">
          <v-chip small color="error">{{deleted_stt}}</v-chip>
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
           {{ text_update }}
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
            {{this.$t('cancel')}}
          </v-btn>
          <v-btn @click="update" color="primary">{{this.$t('update')}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import getWRUsersPer from '~/mixins/getWRUsersPer'
import update_wr_user from '~/gql/mutations/users_management/updateWRUserPer'
import delete_wr_user from '~/gql/mutations/users_management/deleteWRUserPer'
import gql from 'graphql-tag'
export default {
  mixins: [getWRUsersPer],
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

      // headers: [
      //   {
      //     text: 'Name',
      //     align: 'start',
      //     sortable: false,
      //     value: 'name',
      //   },
      //   {
      //     text: 'Email',
      //     value: 'email',
      //   },
      //   {
      //     text: 'Phone',
      //     value: 'tel',
      //   },
      //   {
      //     text: 'Status',
      //     value: 'verification_status',
      //   },
      //   {
      //     text: 'Actions',
      //     value: 'actions',
      //     sortable: false,
      //   },
      // ],
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
            ${update_wr_user.updateWRUserPer}
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
              ${delete_wr_user.deleteWRUserPer}
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
  computed:{
    active_stt(){
      return this.$t('active')
    },
    suspended_stt(){
      return this.$t('suspended')
    },
    deleted_stt(){
      return this.$t('deleted')
    },
    text_update(){
      return this.$t('update_user')
    },
    text_wr(){
      return this.$t('waste_regulator')
    }, headers() {
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
  }
}
</script>

<style>
</style>