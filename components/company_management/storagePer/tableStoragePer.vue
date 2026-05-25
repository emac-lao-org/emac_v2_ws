<template>
  <div>
    <v-card-title class="py-0 pt-2">
      <v-row>
        <v-col cols="3">
          <h2 style="border-right: 3px solid #0d47a1">
            {{this.$t('storage')}}
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
        <template v-slot:[`item.facility`]="{ item }">
          <div class="text-truncate" style="max-width: 130px">
            {{ item.facility.join(', ') }}
          </div>
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <div v-if="item.status == true">
            <v-chip small color="primary"> Enable </v-chip>
          </div>
          <div v-else>
            <v-chip small> Disable </v-chip>
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
        <v-card-text>
          <div v-if="this.edit == true">
            <v-row class="mt-4">
              <v-col cols="4">
                <v-text-field
                  label="Storage Name"
                  outlined
                  v-model="view.storage_name"
                  clearable
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="Area"
                  outlined
                  v-model="view.area"
                  clearable
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="Note"
                  outlined
                  v-model="view.note"
                  clearable
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="Quantity"
                  outlined
                  v-model="view.quantity"
                  clearable
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
                  label="Storage Name"
                  outlined
                  v-model="view.storage_name"
                  required
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="Area"
                  outlined
                  v-model="view.area"
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
                  label="Quantity"
                  outlined
                  v-model="view.quantity"
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
            <v-row>
              <v-col>
                <v-textarea outlined readonly v-model="view.facility">
                </v-textarea>
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
import updateStorage from '~/gql/mutations/updateStorage.gql'
import deleteStorage from '~/gql/mutations/deleteStorage.gql'
import gql from 'graphql-tag'
export default {
  data() {
    return {
      statuses: [
        { name: 'Enable', value: true },
        { name: 'Disable', value: false },
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
        { text: 'Storage name', value: 'storage_name' },
        { text: 'Note', value: 'note' },
        { text: 'Area', value: 'area' },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Facility', value: 'facility' },
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
    async getStorage() {
      this.loading = true
      this.$apollo
        .query({
          query: require('~/gql/queries/getStoragePer').storagePer,
          variables: {
            id: this.$route.params.id,
          },
        })
        .then(({ data }) => {
          this.data = data.emac_generators[0].storages
          // console.log('this.data :>> ', this.data)

          this.facilities = this.data.map((item) => {
            return item.facility_operations.map((item) => {
              return item.description
            })
          })

          for (let i = 0; i < this.data.length; i++) {
            this.data[i].facility = this.facilities[i]
          }

          // console.log('this.facilities :>> ', this.data)
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
              ${deleteStorage.deleteStorage}
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
            ${updateStorage.updateStorage}
          `,
          variables: {
            id: this.view.id,
            area: this.view.area,
            note: this.view.note,
            quantity: this.view.quantity,
            status: this.view.status,
            storage_name: this.view.storage_name,
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
    this.getStorage()
  },
}
</script>

<style>
</style>