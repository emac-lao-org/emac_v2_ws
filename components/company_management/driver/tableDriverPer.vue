<template>
  <div>
    <v-card-title class="py-0 pt-2">
      <v-row>
        <v-col cols="3">
          <p class="display-1" style="border-right: 3px solid #0d47a1">
            Drivers
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
    <v-card-text>
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="data"
        :search="search"
        :page.sync="pagination.page"
        :itemsPerPage.sync="pagination.itemsPerPage"
      >
        <template v-slot:[`item.no`]="{ index }">
          {{ (pagination.page - 1) * pagination.itemsPerPage + index + 1 }}
        </template>

        <template v-slot:[`item.status`]="{ item }">
          <div v-if="item.status == 0">
            <v-chip small color="primary"> Active</v-chip>
          </div>
          <div v-if="item.status == 1">
            <v-chip small color="warning">Inactive</v-chip>
          </div>
          <div v-if="item.status == 2">
            <v-chip small color="error">Deleted</v-chip>
          </div>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon class="mr-2" @click="viewCompany(item)"> mdi-pencil</v-icon>
          <v-icon class="mr-2" @click="seeMoreItem(item)"> mdi-eye</v-icon>
          <v-icon @click="updateStatus(item)"> mdi-delete-outline </v-icon>
        </template>
      </v-data-table>
    </v-card-text>

    <v-dialog v-model="dialog" persistent>
      <v-card>
        <v-card-title>
          <p
            style="margin-bottom: -6px"
            class="
              text-h4
              blue--text
              text--darken-4d
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
        <v-card-text>
          <div v-if="this.edit == true">
            <v-row class="mt-4">
              <v-col cols="4">
                <v-text-field
                  label="Contrainer"
                  outlined
                  v-model="view.drive_name"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="Gps no"
                  outlined
                  v-model="view.license"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="Note"
                  outlined
                  v-model="view.note"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="License"
                  outlined
                  v-model="view.tel"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="view.status"
                  item-text="name"
                  item-value="value"
                  :items="statuses"
                  label="Status"
                  required
                  outlined
                ></v-select>
              </v-col>
            </v-row>
          </div>
          <div v-else>
         <v-row class="mt-4">
              <v-col cols="4">
                <v-text-field
                  label="Contrainer"
                  outlined
                  v-model="view.drive_name"
                  required
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="Gps no"
                  outlined
                  v-model="view.license"
                  required
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="Note"
                  outlined
                  v-model="view.note"
                  required
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="License"
                  outlined
                  v-model="view.tel"
                  required
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="view.status"
                  item-text="name"
                  item-value="value"
                  :items="statuses"
                  label="Status"
                  required
                  readonly
                  outlined
                ></v-select>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
        <v-card-actions class="mx-4">
          <v-spacer></v-spacer>
          <v-btn outlined color="primary" class="mx-4 my-4" @click="close">
            Cancel
          </v-btn>

          <div v-if="this.edit == true">
            <v-btn @click="update" color="primary">Update</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import updateDriver from '~/gql/mutations/updateDriverPer.gql'
import deleteDriver from '~/gql/mutations/deleteDriverPer.gql'
import gql from 'graphql-tag'
export default {
  data() {
    return {
      statuses: [
        { name: 'Active', value: 0 },
        { name: 'Suspended', value: 1 },
        { name: 'Deleted', value: 2 },
      ],
      dialog: false,
      edit: false,
      search: '',
      headers: [
        {
          text: 'No',
          // filterable: false,
          value: 'no',
        },
        { text: 'Drive name', value: 'drive_name' },
        { text: 'License', value: 'license' },
        { text: 'Tel', value: 'tel' },
        { text: 'Note', value: 'note' },
        { text: 'Status', value: 'status' },
        { text: 'Action', align: 'center', value: 'actions' },
      ],
      loading: false,
      pagination: {
        page: 1,
        itemsPerPage: 15,
      },
      data: [],
      facilities: [],
      view: [],
      result_id: '',
      // transporters: [],
    }
  },
  methods: {
    async getVehicle() {
      this.loading = true
      this.$apollo
        .query({
          query: require('~/gql/queries/getDrivers').getDrivers,
          variables: {
            id: this.$route.params.id,
          },
        })
        .then(({ data }) => {
          this.data = data.emac_drivers
          // console.log('this.data :>> ', this.data)

          this.loading = false
        })
    },
    close() {
      this.dialog = false
      this.edit = false
    },
    viewCompany(item) {
      this.view = item
      this.edit = true
      this.dialog = true
    },
    seeMoreItem(item) {
      this.view = item
      this.dialog = true
    },
    updateStatus(item) {
      let text = 'Press a button!\nEither OK or Cancel.'
      if (confirm(text) == true) {
        this.$apollo
          .mutate({
            mutation: gql`
              ${deleteDriver.deleteDriverPer}
            `,
            variables: {
              id: item.id,
            },
          })
          .then(() => {
            alert('Delete Success')
            this.data.splice(this.data.indexOf(item), 1)
          })
          .catch((err) => {
            console.log('err :>> ', err)
          })
      }
    },
    update() {
      this.$apollo
        .mutate({
          mutation: gql`
            ${updateDriver.updateDriverPer}
          `,
          variables: {
            id: this.view.id,
            drive_name: this.view.drive_name,
            note: this.view.note,
            license: this.view.license,
            note: this.view.note,
            status: this.view.status,
            tel: this.view.tel,
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
  },
  created() {
    this.getVehicle()
  },
}
</script>

<style>
</style>