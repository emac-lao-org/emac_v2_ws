<template>
  <div>
    <v-card-title class="py-0 pt-2">
      <v-row>
        <v-col cols="3">
          <p class="display-1" style="border-right: 3px solid #0d47a1">
            Vehicles
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
            <v-chip small color="primary">Active</v-chip>
          </div>
          <div v-if="item.status == 1">
            <v-chip small color="warning">Suspended</v-chip>
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
          <h2
            style="margin-bottom: -6px"
            class="
             
              blue--text
              text--darken-4d
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
        <v-card-text>
          <div v-if="this.edit == true">
            <v-row class="mt-4">
              <v-col cols="4">
                <v-text-field
                  label="Contrainer"
                  outlined
                  v-model="view.contrainer"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="Gps no"
                  outlined
                  v-model="view.gps_no"
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
                  v-model="view.license"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="Color"
                  outlined
                  v-model="view.color"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="Registration plate"
                  outlined
                  v-model="view.registration_plate"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="Vehicle model"
                  outlined
                  v-model="view.vehicle_model"
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
                  v-model="view.contrainer"
                  required
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="Gps no"
                  outlined
                  v-model="view.gps_no"
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
                  v-model="view.license"
                  required
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="Color"
                  outlined
                  v-model="view.color"
                  required
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="Registration plate"
                  outlined
                  v-model="view.registration_plate"
                  required
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="Vehicle model"
                  outlined
                  v-model="view.vehicle_model"
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
import updateVehicle from '~/gql/mutations/updateVehiclePer.gql'
import deleteVehicle from '~/gql/mutations/deleteVehiclePer.gql'
import gql from 'graphql-tag'
export default {
  data() {
    return {
      statuses: [
        { name: 'Active', value: 0 },
        { name: 'Suspended', value: 1 },
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
        { text: 'Contrainer', value: 'contrainer' },
        { text: 'GPS', value: 'gps_no' },
        { text: 'License', value: 'license' },
        { text: 'Note', value: 'note' },
        { text: 'Registration plate', value: 'registration_plate' },
        { text: 'Vehicle model', value: 'vehicle_model' },
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
          query: require('~/gql/queries/getVehiclePer').getWTVehiclePer,
          variables: {
            id: this.$route.params.id,
          },
        })
        .then(({ data }) => {
          this.data = data.emac_transporters[0].vehicles
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
              ${deleteVehicle.deleteVehiclePer}
            `,
            variables: {
              id: item.id,
            },
          })
          .then(() => {
            alert('Delete Success')
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
            ${updateVehicle.updateVehiclePer}
          `,
          variables: {
            id: this.view.id,
            color: this.view.color,
            note: this.view.note,
            gps_no: this.view.gps_no,
            license: this.view.license,
            note: this.view.note,
            registration_plate: this.view.registration_plate,
            contrainer: this.view.contrainer,
            status: this.view.status,
            vehicle_model: this.view.vehicle_model,
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