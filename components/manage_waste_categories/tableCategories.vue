<template>
  <v-card>
    <v-card-title class="py-0 pt-2">
      <v-row>
        <v-col cols="3">
          <h2 style="border-right: 3px solid #0d47a1">
            {{text_waste_cat}}
          </h2>
        </v-col>
        <v-spacer></v-spacer>
           <v-col>
          <v-select
            item-text="name"
            item-value="value"
            :items="items_filter_type"
            v-model="typeFilterValue"
            label="Type of service"
            required
          ></v-select>
        </v-col>
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
    >
      <template v-slot:[`item.code`]="{ item }">
        {{ formatWasteCode(item.code, item.entry_type) }}
      </template>
      <template v-slot:[`item.description_2`]="{ item }">
        <div class="text-truncate" style="max-width: 250px">
        {{ item.description_2 }}
        </div>
      </template>
      <template v-slot:[`item.description_4`]="{ item }">
        <div class="text-truncate" style="max-width: 250px">
        {{ item.description_4 }}
        </div>
      </template>
      <template v-slot:[`item.description_6`]="{ item }">
        <div class="text-truncate" style="max-width: 250px">
        {{ item.description_6 }}
        </div>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon class="mr-2" @click="viewItem(item)"> mdi-eye</v-icon>
        <v-icon class="mr-2" @click="editItem(item)">
          mdi-pencil-outline
        </v-icon>
        <v-icon class="mr-2" @click="manageNames(item)">
          mdi-format-list-bulleted-square
        </v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="dialogEdit" persistent>
      <div v-if="editInfo == false">
        <v-card>
          <div class="mx-6">
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

            <v-row>
              <v-col cols="6">
                <v-text-field
                  :value="formatWasteCode(view.code, view.entry_type)"
                  outlined
                  readonly
                  hide-details="auto"
                  label="Code"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="view.entry_type"
                  outlined
                  readonly
                  hide-details="auto"
                  label="Entry Type"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="view.description_2"
                  outlined
                  readonly
                  hide-details="auto"
                  rows="1"
                  label="Description 2"
                  required
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="view.description_4"
                  outlined
                  readonly
                  hide-details="auto"
                  class="text-uppercase"
                  rows="2"
                  label="Description 4"
                  required
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="view.description_6"
                  outlined
                  readonly
                  hide-details="auto"
                  class="text-uppercase"
                  rows="2"
                  label="Description 6"
                  required
                ></v-textarea>
              </v-col>
            </v-row>

            <br />
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
              <v-btn @click="toggleEdit" color="primary"> edit </v-btn>
            </v-card-actions>
          </div>
        </v-card>
      </div>
      <div v-else>
        <v-card>
          <div class="mx-6">
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
                Edit
              </p>
              <v-divider
                style="border: 1px solid #0d47a1"
                class="ml-4"
                vertical
              ></v-divider>
            </v-card-title>

            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="edit.code"
                  outlined
                  hide-details="auto"
                  label="Code"
                  required
                  clearable
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="edit.entry_type"
                  outlined
                  hide-details="auto"
                  label="Entry Type"
                  required
                  clearable
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="edit.description_2"
                  outlined
                  hide-details="auto"
                  rows="1"
                  label="Description 2"
                  required
                  clearable
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="edit.description_4"
                  outlined
                  hide-details="auto"
                  class="text-uppercase"
                  rows="2"
                  label="Description 4"
                  required
                  clearable
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="edit.description_6"
                  outlined
                  hide-details="auto"
                  class="text-uppercase"
                  rows="2"
                  label="Description 6"
                  required
                  clearable
                ></v-textarea>
              </v-col>
            </v-row>

            <br />
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
              <v-btn @click="updateWasteCat" color="primary"> update </v-btn>
            </v-card-actions>
          </div>
        </v-card>
      </div>
    </v-dialog>
  </v-card>
</template>
<script>
import updateWasteCat from '~/gql/mutations/waste_categories/update_waste_categories.gql'
import gql from 'graphql-tag'
import wasteCodeMixin from '~/mixins/wasteCode'
export default {
  mixins: [wasteCodeMixin],
  data() {
    return {
            items_filter_type: [
        {
          name: "All",
          value: null,
        },
        {
          name: "Non Hazardous",
          value: "nhz",
        },
      ],
      typeFilterValue: '',
      loading: false,
      search: '',
      data: [],
      edit: [],
      view: [],
      editInfo: false,
      text: '',
    }
  },
  methods: {
     typeFilter(value) {
      // If this filter has no value we just skip the entire filter.
      if (!this.typeFilterValue) {
        return true;
      }
     return value.toLowerCase().includes(this.typeFilterValue.toLowerCase());
    },
    async getWasteCategories() {
      this.loading = true
      await this.$apollo
        .query({
          query: require('~/gql/queries/waste_categories/getWastCategories')
            .getWasteCategories,
        })
        .then((data) => {
          this.data = data.data.emac_waste_categories
          // console.log("🚀 ~ file: tableCategories.vue ~ line 276 ~ .then ~ this.data", this.data)
          this.loading = false
        })
        .catch((err) => {
          let text = "Can't connect to server \n Please try again";
          if (confirm(text) == true) {
            window.location.reload();
          } else {
            return false;
          }
        })
    },
    viewItem(item) {
      this.toggleDialogEdit()
      this.view = item
      this.edit = item
      // console.log('this.edit :>> ', this.edit)
    },
    editItem(item) {
      this.toggleDialogEdit()
      this.edit = item
      this.editInfo = true
    },
    toggleEdit() {
      this.editInfo = true
    },
    toggleDialogEdit() {
      this.$store.commit('SET_DIALOGEDIT', !this.$store.state.dialogEdit)
      this.editInfo = false
    },

    updateWasteCat() {
      this.$apollo
        .mutate({
          mutation: gql`
            ${updateWasteCat.update_emac_waste_categories}
          `,
          variables: {
            id: this.edit.id,
            code: this.edit.code,
            entry_type: this.edit.entry_type,
            description_2: this.edit.description_2,
            description_4: this.edit.description_4,
            description_6: this.edit.description_6,
          },
        })
        .then(() => {
          alert('Update Waste Categories Success')
          this.toggleDialogEdit()
          window.location.reload()
        })
        .catch((error) => {
         let text = "Can't connect to server \n Please try again";
          if (confirm(text) == true) {
            window.location.reload();
          } else {
            return false;
          }
        })
    },
    manageNames(item) {
      this.$router.push({
        path: "/waste_category_names",
        query: { waste_cat_id: item.id },
      })
    },
  },
  created() {
    this.getWasteCategories()
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
    text_waste_cat(){
      return this.$t('waste_categories');
    },
    headers(){
      return[
        {
          text: 'Code',
          align: 'center',
          // filterable: false,
          value: 'code',
        },
        { text: this.$t("entry_type"), align: 'center', value: 'entry_type', filter:this.typeFilter },
        { text: 'Chapter discription 2', value: 'description_2' },
        { text: 'Chapter discription 4', value: 'description_4' },
        { text: 'Chapter discription 6', value: 'description_6' },
        { text: 'Actions', align: 'center', sortable: false, value: 'actions' },
      ]
    }
  },
}
</script>
