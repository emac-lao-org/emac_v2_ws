<template>
  <div>
    <v-card-title class="py-0 pt-2">
      <v-row>
        <v-col cols="3">
          <h2 style="border-right: 3px solid #0d47a1">
            {{this.$t('catalog')}}
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

        <template v-slot:[`item.status`]="{ item }">
          <div v-if="item.status == 0">
            <v-chip small> Draft</v-chip>
          </div>
          <div v-if="item.status == 1">
            <v-chip small color="success">Active</v-chip>
          </div>
          <div v-if="item.status == 2">
            <v-chip small color="error">Suspened</v-chip>
          </div>
          <div v-if="item.status == 5">
            <v-chip small color="error">Deleted</v-chip>
          </div>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-icon class="mr-2" @click="viewCompany(item)"> mdi-pencil</v-icon>
          <v-icon class="mr-2" @click="seeMoreItem(item)"> mdi-eye</v-icon>
          <v-icon class="mr-2" @click="goToCatalogDetail(item)">
            mdi-file-document-outline
          </v-icon>
          <!-- <v-icon @click="updateStatus(item)"> mdi-delete-outline </v-icon> -->
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
                  label="Catalog Name"
                  v-model="view.name"
                  outlined
                  clearable
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="4">
                <v-text-field
                  label="Description"
                  outlined
                  v-model="view.description"
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
                  label="Catalog Name"
                  outlined
                  readonly
                  v-model="view.name"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="Catalog No"
                  outlined
                  readonly
                  v-model="view.catalog_no"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="Description"
                  outlined
                  readonly
                  v-model="view.description"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  label="Expire date"
                  outlined
                  readonly
                  v-model="view.expire_date"
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
                  readonly
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
import updateCatalogPer from '~/gql/mutations/updateCatalogPer.gql'
// import deleteStorage from '~/gql/mutations/deleteStorage.gql'
import gql from 'graphql-tag'
export default {
  data() {
    return {
      statuses: [
        { name: 'Draft', value: 0 },
        { name: 'Active', value: 1 },
        { name: 'Suspened', value: 2 },
        { name: 'Deleted', value: 3 },
      ],
      id: this.$route.params.id,
      dialog: false,
      edit: false,
      search: '',
      // gen_name:'',
      headers: [
        {
          text: 'Catalog no',
          // filterable: false,
          value: 'catalog_no',
        },
        { text: 'Catalog name', value: 'name' },
        { text: 'Generator name', value: 'generator.gen_name_lo' },
        { text: 'Description', value: 'description' },
        { text: 'Type', value: 'type_of_service.name_short' },
        { text: 'Expire date', value: 'expire_date' },
        { text: 'Status', value: 'status' },
        { text: 'Action', align: 'center', value: 'actions' },
      ],
      loading: false,
      pagination: {
        page: 1,
        itemsPerPage: 15,
      },
      data: [],
      view: [],
      // result_id: '',
      // transporters: [],
    }
  },
  methods: {
    async getCatalog() {
      this.loading = true
      this.$apollo
        .query({
          query: require('~/gql/queries/getCatalog').getCatalog,
          variables: {
            id: this.id,
          },
        })
        .then((data) => {
          this.data = data.data.emac_generators[0].catalogs
          // console.log('data :>> ', this.data)

          // console.log('this.generators :>> ', this.generators);

          this.loading = false
        })
        .catch((err) => {
          // console.log('err :>> ', err)
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
    goToCatalogDetail(item) {
      this.$router.push('/waste_catalog/details?id=' + item.id)
    },

    updateStatus(item) {
      let text = 'Press a button!\nEither OK or Cancel.'
      if (confirm(text) == true) {
        this.$apollo
          .mutate({
            mutation: gql`
              ${updateCatalogPer.updateStatus}
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
            // console.log('err :>> ', err)
          })
      }
    },

    update() {
      this.$apollo
        .mutate({
          mutation: gql`
            ${updateCatalogPer.updateCatalogPer}
          `,
          variables: {
            id: this.view.id,
            name: this.view.name,
            description: this.view.description,
            status: this.view.status,
          },
        })
        .then(() => {
          //   console.log(data)
          alert('Updated')
          window.location.reload()
        })
        .catch((error) => {
          // console.log(error)
        })
    },
  },
  mounted() {
    this.getCatalog()
  },
}
</script>

<style>
</style>
