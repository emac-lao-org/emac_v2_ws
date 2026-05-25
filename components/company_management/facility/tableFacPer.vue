<template>
  <div>
    <div v-if="this.loading == true">
      <loading />
    </div>
    <div v-else>
      <div>
        <v-card-title class="py-0 pt-2">
          <v-row>
            <v-col cols="3">
              <p class="display-1" style="border-right: 3px solid #0d47a1">
                Treatment Plants
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

            <template v-slot:[`item.r_d`]="{ item }">
              <v-chip
                v-for="(i, index) in item.r_d"
                :key="index"
                color="primary"
                >{{ i }}</v-chip
              >
            </template>

            <template v-slot:[`item.actions`]="{ item }">
              <v-icon class="mr-2" @click="viewCompany(item)">
                mdi-pencil</v-icon
              >
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
                  <v-col cols="6">
                    <v-text-field
                      label="Facility Name"
                      outlined
                      v-model="view.name"
                      clearable
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      label="Facility description"
                      outlined
                      v-model="view.description"
                      clearable
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-select
                      v-model="view.r_d_id"
                      item-text="title"
                      item-value="id"
                      multiple
                      :menu-props="{ top: true, offsetY: true }"
                      chips
                      color="primary"
                      :items="dataCode"
                      label="R&D"
                      required
                      outlined
                    >
                      <template #selection="{ item }">
                        <v-chip color="primary">{{ item.code }}</v-chip>
                      </template>
                    </v-select>
                  </v-col>
                </v-row>
              </div>
              <div v-else>
                <v-row class="mt-4">
                  <v-col cols="6">
                    <v-text-field
                      label="Facility Name"
                      outlined
                      v-model="view.name"
                      :clearable="this.edit"
                      required
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      label="Facility description"
                      outlined
                      v-model="view.description"
                         :clearable="this.edit"
                      required
                      readonly
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-select
                      v-model="view.r_d_id"
                      item-text="title"
                      item-value="id"
                      multiple
                      :menu-props="{ top: true, offsetY: true }"
                      chips
                      color="primary"
                      :items="dataCode"
                      label="R&D"
                      required
                      readonly
                      outlined
                    >
                      <template #selection="{ item }">
                        <v-chip color="primary">{{ item.title }}</v-chip>
                      </template>
                    </v-select>
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
    </div>
  </div>
</template>

<script>
import updateFacility from '~/gql/mutations/r_and_d/update_r_d_per.gql'
import update_r_d_per_details from '~/gql/mutations/r_and_d/update_r_d_per_details.gql'
import clear_r_d from '~/gql/mutations/r_and_d/delete_r_d.gql'
import delete_fac from '~/gql/mutations/r_and_d/delete_fac.gql'
import gql from 'graphql-tag'
import loading from '~/components/loading.vue'
export default {
  components: { loading },
  data() {
    return {
      statuses: [
        { name: 'Enable', value: true },
        { name: 'Disable', value: false },
      ],
      dialog: false,
      loading: false,
      edit: false,
      search: '',
      headers: [
        {
          text: 'No',
          // filterable: false,
          value: 'no',
        },
        { text: 'Facility name', value: 'name' },
        { text: 'R&D code', value: 'r_d' },
        { text: 'Description', value: 'description' },
        { text: 'Action', align: 'center', value: 'actions' },
      ],
      loading: false,
      pagination: {
        page: 1,
        itemsPerPage: 15,
      },
      data: [],
      dataCode: [],
      dataCode_fil: [],
      dataCode_fil_id: [],
      r_d: [],
      view: [],
      result_id: '',
      // transporters: [],
    }
  },
  methods: {
    async getRandD() {
      this.dataCode = await this.$apollo.query({
        query: require('~/gql/queries/r_and_d/getR_Dcode').emac_r_d_code,
      })
      this.dataCode = this.dataCode.data.emac_r_d_code

      this.dataCode_fil = this.dataCode.map((item) => {
        return {
          title: item.code + ' - ' + item.description,
        }
      })
      // console.log(
      //   '🚀 ~ file: tableFacPer.vue ~ line 243 ~ this.dataCode_fil=this.dataCode.map ~ this.dataCode_fil',
      //   this.dataCode_fil
      // )

      for (let i = 0; i < this.dataCode_fil.length; i++) {
        this.dataCode[i].title = this.dataCode_fil[i].title
      }
      // console.log(
      //   '🚀 ~ file: tableFacPer.vue ~ line 234 ~ getRandD ~ this.dataCode',
      //   this.dataCode
      // )
    },
    async getFacility() {
      this.loading = true
      this.$apollo
        .query({
          query: require('~/gql/queries/getFacilities').getFacilities,
          variables: {
            id: this.$route.params.id,
          },
        })
        .then(({ data }) => {
          this.data = data.emac_disposals[0].disposal_facilities

          this.dataCode_fil_id = this.data.map((item) => {
            return item.disposal_facility_operations.map((item) => {
              return item.r_d_code.id
            })
          })
          for (let i = 0; i < this.data.length; i++) {
            this.data[i].r_d_id = this.dataCode_fil_id[i]
          }

          this.r_d = this.data.map((item) => {
            return item.disposal_facility_operations.map((item) => {
              return item.r_d_code.code
            })
          })

          for (let i = 0; i < this.data.length; i++) {
            this.data[i].r_d = this.r_d[i]
          }

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
      // console.log(
      //   '🚀 ~ file: tableFacPer.vue ~ line 280 ~ viewCompany ~ this.view',
      //   this.view
      // )
      // console.log(
      //   '🚀 ~ file: tableFacPer.vue ~ line 333 ~ update ~ this.view.disposal_facility_operations.dis_fac_id,',
      //   this.view.id
      // )
      this.edit = true
      this.dialog = true
    },
    seeMoreItem(item) {
      this.view = item
      this.dialog = true
    },
    async updateStatus(item) {
      this.view = item
      let text = 'Press a button!\nEither OK or Cancel.'
      if (confirm(text) == true) {
        this.loading = true
        await this.$apollo.mutate({
          mutation: gql`
            ${clear_r_d.delete_r_d}
          `,
          variables: {
            dis_fac_id: this.view.id,
          },
        })
        await this.$apollo
          .mutate({
            mutation: gql`
              ${delete_fac.delete_fac}
            `,
            variables: {
              id: this.view.id,
            },
          })
          .then(() => {
            this.loading = false
            alert('Delete Success')
            window.location.reload()
          })
          .catch((err) => {
            console.log('err :>> ', err)
          })
      }
    },
    async update() {
      await this.$apollo.mutate({
        mutation: gql`
          ${update_r_d_per_details.update_r_d_per_details}
        `,
        variables: {
          id: this.view.id,
          name: this.view.name,
          description: this.view.description,
        },
      })
      await this.$apollo.mutate({
        mutation: gql`
          ${clear_r_d.delete_r_d}
        `,
        variables: {
          dis_fac_id: this.view.id,
        },
      })

      for (let i = 0; i < this.view.r_d_id.length; i++) {
        // console.log('i :>> ', i)
        await this.update_r_d_loop(i)
        setTimeout(() => {}, 100)
      }

      await alert('Updated')
      window.location.reload()
    },

    update_r_d_loop(index) {
      this.$apollo.mutate({
        mutation: gql`
          ${updateFacility.update_r_d_per}
        `,
        variables: {
          dis_fac_id: this.view.id,
          r_d_code_id: this.view.r_d_id[index],
        },
      })
    },
  },
  created() {
    this.getFacility(), this.getRandD()
  },
}
</script>

<style>
</style>