<template>
  <v-row justify="end" class="mr-6">
    <v-dialog v-model="dialog" persistent>
      <!-- <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" v-bind="attrs" v-on="on">
          <v-icon class="">mdi-plus</v-icon>
          <span>Create waste</span>
        </v-btn>
      </template> -->
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
            Create waste
          </p>
          <v-divider
            style="border: 1px solid #0d47a1"
            class="ml-4"
            vertical
          ></v-divider>
        </v-card-title>
        <v-card-text class="mt-4">
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="code"
                outlined
                hide-details="auto"
                label="Code"
                placeholder="ex: 01 01 01"
                required
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="entry_type"
                outlined
                hide-details="auto"
                label="Entry Type"
                required
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="description_2"
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
                v-model="description_4"
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
                v-model="description_6"
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
        </v-card-text>
        <v-card-actions class="mx-4">
          <v-spacer></v-spacer>
          <v-btn
            outlined
            color="primary"
            class="mx-4 my-4"
            @click="toggleDialog"
          >
            Cancel
          </v-btn>
          <v-btn @click="insertWasteCat" color="primary"> create </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import insert_emac_waste_categories from "~/gql/mutations/waste_categories/insert_waste_categories.gql";
import gql from "graphql-tag";
export default {
  data() {
    return {
      code: '',
      entry_type: '',
      description_2: '',
      description_4: '',
      description_6: '',
    }
  },
  methods: {
    toggleDialog() {
      this.$store.commit('SET_DIALOG', !this.$store.state.dialog)
    },
    insertWasteCat() {
      this.$apollo
        .mutate({
          mutation: gql`
            ${insert_emac_waste_categories.insertWasteCat}
          `,
          variables: {
            code: this.code,
            entry_type: this.entry_type,
            description_2: this.description_2,
            description_4: this.description_4,
            description_6: this.description_6,
          },
        })
        .then((data) => {
          // console.log('data :>> ', data)
          alert('Create Waste Category Success')
          window.location.reload()
        })
        .catch((err) => {
          console.log('err :>> ', err)
        })
    },
  },
  computed: {
    dialog: {
      get() {
        return this.$store.state.dialog
      },
      set(newVal) {
        this.$store.commit('SET_DIALOG', newVal)
      },
    },
  },
  mounted() {},
}
</script>