<template>
  <v-card>
    <v-card-title class="py-0 pt-2">
      <v-row>
        <v-col cols="4">
          <h2 style="border-right: 3px solid #0d47a1">
           {{text_title}}
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
    >
      <!-- <template v-slot:[`item.no`]="{ index }">
        {{ (pagination.page - 1) * pagination.itemsPerPage + index + 1 }}
      </template> -->

      <template v-slot:[`item.description`]="{ item }">
        {{ item.description.substring(0, 150) }}...
      </template>
      <template v-slot:[`item.actions`]="{ index }">
        <v-icon
          class="mr-2"
          @click="
            viewItem(
              (pagination.page - 1) * pagination.itemsPerPage + index + 0
            )
          "
        >
          mdi-eye</v-icon
        >
        <!-- <v-icon class="mr-2" @click="seeMoreItem(item)"> mdi-eye</v-icon> -->
        <v-icon
          class="mr-2"
          @click="
            editItem(
              (pagination.page - 1) * pagination.itemsPerPage + index + 0
            )
          "
        >
          mdi-pencil-outline
        </v-icon>
        <!-- <v-icon
          @click="
            deleteItem(
              (pagination.page - 1) * pagination.itemsPerPage + index + 0
            )
          "
        >
          mdi-delete-outline
        </v-icon> -->
      </template>
    </v-data-table>

    <v-dialog v-model="dialogEdit" persistent>
      <v-card>
        <div class="pa-2">
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
             {{this.$t('view')}}
            </h2>
            <v-divider
              style="border: 1px solid #0d47a1"
              class="ml-4"
              vertical
            ></v-divider>
          </v-card-title>
          <div v-if="edit == true">
            <v-row class="mx-6">
              <v-col cols="4">
                <v-text-field
                  v-model="view.code"
                  label="Code"
                  outlined
                  hide-details="auto"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="mx-6">
              <v-col>
                <v-textarea
                  v-model="view.description"
                  outlined
                  hide-details="auto"
                  rows="5"
                  label="Description"
                  required
                ></v-textarea>
              </v-col>
            </v-row>
          </div>
          <div v-else>
            <v-row class="mx-6">
              <v-col cols="4">
                <v-text-field
                  v-model="view.code"
                  label="Code"
                  outlined
                  readonly
                  hide-details="auto"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="mx-6">
              <v-col>
                <v-textarea
                  v-model="view.description"
                  outlined
                  readonly
                  hide-details="auto"
                  rows="5"
                  label="Description"
                  required
                ></v-textarea>
              </v-col>
            </v-row>
          </div>
        </div>

        <v-card-actions class="mx-4">
          <v-spacer></v-spacer>
          <v-btn
            outlined
            color="primary"
            class="mx-4 my-4"
            @click="toggleDialogEdit"
          >
            Cancel
          </v-btn>
          <div v-if="edit == true">
            <v-btn @click="update" color="primary" class="mx-4 my-4">
              Update
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import gql from 'graphql-tag'
import updateR_D from '~/gql/mutations/r_and_d/updateR_D'
import deleteR_D from '~/gql/mutations/r_and_d/delete_r_d_code'
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      loading: false,
      id: '',
      edit: false,
      pagination: {
        page: 1,
        itemsPerPage: 15,
      },
      search: '',
      headers: [
        {
          text: 'Code',
          value: 'code',
        },
        {
          text: 'Description',
          value: 'description',
        },
        { text: 'Action', align: 'center', value: 'actions' },
      ],
      data: [],
      view: [],
      // transporters: [],
      dialogView: false,
    }
  },
  methods: {
    async getRandD() {
      this.loading = true
      this.data = await this.$apollo.query({
        query: require('~/gql/queries/r_and_d/getR_Dcode').emac_r_d_code,
      })
       this.loading = false
        this.data = this.data.data.emac_r_d_code
    },
    viewItem(item) {
      this.dialogEdit = true
      this.view = this.data[item]
      // console.log("🚀 ~ file: tableRandD.vue ~ line 211 ~ viewItem ~ this.view", this.view)
      // console.log('this.view :>> ', this.view)
    },
    editItem(item) {
      this.edit = true
      this.dialogEdit = true
      this.view = this.data[item]
      // console.log('this.view :>> ', this.view)
    },
    // deleteItem(item) {
    //   this.id = this.data[item].id
    //   let text = 'Press a button!\nEither OK or Cancel.'
    //   if (confirm(text) == true) {
    //     this.$apollo
    //       .mutate({
    //         mutation: gql`
    //           ${deleteR_D.delete_r_d_code}
    //         `,
    //         variables: {
    //           id: this.id,
    //         },
    //       })
    //       .then(() => {
    //         alert('Deleted R&D Code Success')
    //         this.data.splice(this.data.indexOf(item), 1)
    //       })
    //       .catch((err) => {
    //         let text = "Can't connect to server \n Please try again";
    //       if (confirm(text) == true) {
    //         window.location.reload();
    //       } else {
    //         return false;
    //       }
    //       })
    //   } else {
    //     return false
    //   }
    // },
    update() {
 Swal.fire({
        icon: "question",
        title: "Are you sure?",
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes, approve it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this.$apollo
        .mutate({
          mutation: gql`
            ${updateR_D.update_emac_r_d_code}
          `,
          variables: {
            id: this.view.id,
            code: this.view.code,
            description: this.view.description,
          },
        }).then(() => {
          Swal.fire({
            icon: "success",
            title: "Update R&D Code Success",
            showConfirmButton: false,
            timer: 1500,
          });
          this.dialogEdit = false;
          window.location.reload();
        })
        }else{  
          Swal.fire({
            icon: "error",
            title: "Update R&D Code Failed",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });

      
    },
    toggleDialogEdit() {
      this.$store.commit('SET_DIALOGEDIT', !this.$store.state.dialogEdit)
      this.edit = false
    },
  },
  mounted() {
    this.getRandD()
  },
  computed: {
    text_title(){
      return this.$t("r_and_d_code_management")
    },
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