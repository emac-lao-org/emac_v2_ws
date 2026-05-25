<template>
  <div>
    <v-card-title class="py-0 pt-2">
      <v-row>
        <v-col cols="3">
          <h2 style="border-right: 3px solid #0d47a1">
           {{text_wt}}
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
      <!-- <template v-slot:[`item.verification_status`]="{ item }">
        <div v-if="item.verification_status == 0">
          <v-chip small color="primary">Active</v-chip>
        </div>
        <div v-else-if="item.verification_status == 1">
          <v-chip small color="warning">Suspened</v-chip>
        </div>
        <div v-else-if="item.verification_status == 2">
          <v-chip small color="error">Deleted</v-chip>
        </div>
      </template> -->
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon class="mr-2" @click="viewCompany(item)"> mdi-eye</v-icon>
        <!-- <v-icon class="mr-2" @click="editItem(item)">
          mdi-pencil-outline
        </v-icon> -->
        <!-- <v-icon @click="updateStatus(item)"> mdi-delete-outline </v-icon> -->
      </template>
    </v-data-table>

    <!-- <v-dialog v-model="dialog" persistent>
      <v-card>
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
            Update user
          </p>
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
    </v-dialog> -->
  </div>
</template>

<script>
import getWDUsers from '~/mixins/getWDUsers'
import update_wd_user from '~/gql/mutations/users_management/updateWDUser'
import delete_wd_user from '~/gql/mutations/users_management/deleteWDUser'
import gql from 'graphql-tag'

export default {
  data() {
    return {
      search: '',
      tod: [],
      tos: [],
      data: [],
      statuses: this.$store.state.statuses,
      edit: [],
    }
  },
  methods: {
    viewCompany(item) {
      console.log('item :>> ', item)
      this.$router.push('/company_management/WT/' + item.id)
    },
    getWDCatalog() {
      this.$apollo
        .query({
          query: require('~/gql/queries/waste_catalog/getWasteCatalog')
            .getWasteCatalogById,
          variables: {
            id: this.$route.query.id,
          },
        })
        .then((data) => {
          this.data = data.data.emac_catalogs[0].catalog_wt_operations
          this.data = this.data.map((item) => {
            return item.transporter
          })

          this.tos = this.data.map((item) => {
            return item.type_operations.map((item) => {
              return item.type_of_service.name_short
            })
          })
          for (let i = 0; i < this.tos.length; i++) {
            this.data[i].tos = this.tos[i]
          }


          console.log('this.data :>> ', this.data);


        })
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
    this.getWDCatalog()
  },
  computed:{
    text_wt(){
      return this.$t("waste_transporter");
    },
    headers(){
      return [
        {
           text: this.$t("enterprise_name"),
          sortable: false,
          value: 'tran_name',
        },
        {
          text: this.$t("enterprise_number"),
          sortable: false,
          value: 'enterprise_no',
        },
        { text: 'EMCT ID', sortable: false, value: 'emac_id' },
        { text:  this.$t("custom_address"), sortable: false, value: 'custom_address' },
        {  text: this.$t("telephone"), sortable: false, value: 'tel' },
        {  text: this.$t("type_of_service"), align: 'center', value: 'tos' },
        {  text: this.$t("action"), align: 'center', sortable: false, value: 'actions' },
      ]
    }
  }
}
</script>

<style>
</style>