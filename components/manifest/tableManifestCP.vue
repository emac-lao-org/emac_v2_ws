<template>
  <v-card>
    <v-card-title class="py-0 pt-2">
      <v-row>
        <v-col cols="3">
          <h2 style="border-right: 3px solid #0d47a1">
            {{this.$t('manifest')}}
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
      :loading="loading"
      :headers="headers"
      :items="data"
      :search="search"
      :page.sync="pagination.page"
      :itemsPerPage.sync="pagination.itemsPerPage"
      :sort-by="['manifest_stt']"
      :sort-desc="[false, true]"
    >
      <template v-slot:[`item.no`]="{ index }">
        {{ (pagination.page - 1) * pagination.itemsPerPage + index + 1 }}
      </template>
      <template v-slot:[`item.transporter`]="{ item }">
        <div v-if="item.transporter.length == 1">
          {{ item.transporter[0] }}
        </div>
        <div v-else-if="item.transporter.length == 2">
          {{ item.transporter[0] }}
          <br />
          {{ item.transporter[1] }}
        </div>
        <div v-else>
          {{ item.transporter[0] }}
          <br />
          {{ item.transporter[1] }}
          <br />
          {{ item.transporter[2] }}
        </div>
      </template>

      <template v-slot:[`item.manifest_stt`]="{ item }">
        <div v-if="item.manifest_stt == 0">
          <v-chip small> Draft</v-chip>
        </div>
        <div v-if="item.manifest_stt == 1">
          <v-chip small dark color="#7864CC">Requested</v-chip>
        </div>
        <div v-if="item.manifest_stt == 2">
          <v-chip small dark color="#7864CC">Requested</v-chip>
        </div>
        <div v-if="item.manifest_stt == 3">
          <v-chip small dark color="#3423E2">Ready</v-chip>
        </div>
        <div v-if="item.manifest_stt == 5">
          <v-chip small dark color="warning">WT Processing</v-chip>
        </div>
        <div v-if="item.manifest_stt == 8">
          <v-chip small dark color="warning">WD Processing</v-chip>
        </div>
        <div v-if="item.manifest_stt == 9">
          <v-chip small dark color="#FF8500">Completed</v-chip>
        </div>
        <div v-if="item.manifest_stt == 10">
          <v-chip small dark color="#56CC4A">Certified</v-chip>
        </div>
        <div v-if="item.manifest_stt == 11">
          <v-chip small dark color="error">WT Denied</v-chip>
        </div>
        <div v-if="item.manifest_stt == 12">
          <v-chip small dark color="error">WD Denied</v-chip>
        </div>
        <div v-if="item.manifest_stt == 21">
          <v-chip small dark color="error">Unapprove</v-chip>
        </div>
        <div v-if="item.manifest_stt == 22">
          <v-chip small dark color="error">WT Rejected</v-chip>
        </div>
        <div v-if="item.manifest_stt == 24">
          <v-chip small dark color="error">WD Rejected</v-chip>
        </div>
        <div v-if="item.manifest_stt == 100">
          <v-chip small dark color="error">WS Denied</v-chip>
        </div>
        <div v-if="item.manifest_stt == 102">
          <v-chip small dark color="#000000">Expired</v-chip>
        </div>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip top color="error">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-if="item.manifest_stt < 3"
              v-bind="attrs"
              v-on="on"
              class="mr-2"
              @click="editItem(item)"
              >mdi-file-document-alert</v-icon
            >
          </template>
          <span>Reset to draft</span>
        </v-tooltip>
        <!-- <v-icon class="mr-2" @click="viewItem(item)"> mdi-file-document</v-icon> -->
        <v-icon class="mr-2" @click="seeMoreItem(item)"> mdi-eye</v-icon>
        <!-- <v-icon class="mr-2" @click="editItem(item)">
          mdi-pencil-outline
        </v-icon> -->
      </template>
    </v-data-table>

    <v-dialog v-model="dialogView" persistent>
      <v-card>
        <div class="pa-2">
          <v-card-title>
            <h2
              style="margin-bottom: -6px"
              class="
                text-h4
                blue--text
                text--darken-4
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
          <v-row>
            <v-col>
              <v-textarea
                v-model="view.note"
                outlined
                readonly
                hide-details="auto"
                class="text-uppercase"
                rows="10"
                label="Description"
                required
              ></v-textarea>
            </v-col>
          </v-row>
        </div>

        <v-card-actions class="mx-4">
          <v-spacer></v-spacer>
          <v-btn
            outlined
            color="primary"
            class="mx-4 my-4"
            @click="dialogView = false"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import setToDraft from '~/gql/mutations/manifest/setToDraft.gql'
import gql from 'graphql-tag'
export default {
  data() {
    return {
      dialog: false,
      loading: false,
      pagination: {
        page: 1,
        itemsPerPage: 15,
      },
      search: '',
      headers: [
        {
          text: 'No',
          // filterable: false,
          value: 'no',
        },
        {
          text: 'Manifest no',
          // filterable: false,
          value: 'manifest_no',
        },
        { text: 'Type', value: 'type_of_service.name_short' },
        { text: 'Create code', value: 'manifest_date' },
        { text: 'Generator', value: 'generator.gen_name' },
        { text: 'Disposal', value: 'disposal.dis_name' },
        { text: 'Transporter', value: 'transporter' },
        { text: 'Status', value: 'manifest_stt' },
        { text: 'Action', align: 'center', value: 'actions' },
      ],
      data: [],
      view: [],
      transporters: [],
      dialogView: false,
      manifest_stt: '',
    }
  },
  methods: {
    async getManifest() {
      this.loading = true
      try {
        const { data } = await this.$apollo.query({
          query: require('~/gql/queries/manifest/getManifest').getManifestCPQuery,
          fetchPolicy: 'network-only',
        })
        
        this.data = data.emac_manifests

        this.transporters = this.data.map((item) => {
          return item.transporter_operations.map((item) => {
            return item.transporter.tran_name
          })
        })

        this.manifest_stt = this.data.map((item) => {
          return item.wg_stt + item.wt_stt + item.wd_stt + item.wr_stt
        })

        for (let i = 0; i < this.data.length; i++) {
          this.data[i].transporter = this.transporters[i]
          this.data[i].manifest_stt = this.manifest_stt[i]
        }

        this.loading = false
      } catch (error) {
        console.error("Error fetching getManifestCPQuery: ", error)
        window.location.reload()
      }
    },

    editItem(item) {
      this.view = item
      let text = 'Press a button!\nEither OK or Cancel.'
      if (confirm(text) == true) {
        this.$apollo
          .mutate({
            mutation: gql`
              ${setToDraft.setToDraft}
            `,
            variables: {
              id: this.view.id,
              ws_user: this.$nuxt.$fire.auth.currentUser.uid,
            },
          })
          .then((data) => {
            // console.log('data :>> ', data)
            alert('Set to draft sucessful')
            window.location.reload()
          })
          .catch((err) => {
            console.log('err :>> ', err)
          })
      } else {
        return false
      }
    },
    seeMoreItem(item) {
      this.$router.push('/manifest/' + item.id)
    },
    toggleDialogEdit() {
      this.$store.commit('SET_DIALOGEDIT', !this.$store.state.dialogEdit)
      this.editInfo = false
    },
  },
  mounted() {
    this.getManifest()
  },
  computed: {
    dialogEdit: {
      get() {
        return this.$store.state.dialogEdit
      },
      set(newVal) {
        this.$store.commit('SET_DIALOGEDIT', newVal)
      },
    },
  },
}
</script>