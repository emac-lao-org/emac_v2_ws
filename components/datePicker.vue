<template>
  <v-menu
    :disabled="disabled"
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="auto"
    
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :label="label"
        dense
        :value="displayDate"
        color="primary"
        append-icon="mdi-calendar"
        readonly
        outlined
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <v-card>
      <vc-date-picker
        class="my-6"
        v-model="computedDate"
        :model-config="modelConfig"
        color="blue"
      >
      </vc-date-picker>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="menu = false"> ຍົກເລີກ </v-btn>
        <v-btn text color="primary" @click="save"> ຕົກລົງ </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import moment from "moment";
export default {
  props: {
    date: {
      type: String,
      default: moment(new Date()).format("YYYY-MM-DD"),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "ວັນທີ",
    },
  },
  data() {
    return {
      modelConfig: {
        type: "string",
        mask: "YYYY-MM-DD", // Uses 'iso' if missing
      },
      menu: "",
      date_pick: null,
    };
  },
  computed: {
    computedDate: {
      get() {
        return this.date_pick || this.date;
      },
      set(val) {
        this.date_pick = val;
      },
    },
    displayDate() {
      if (!this.computedDate) return "";
      return moment(this.computedDate).format("DD-MM-YYYY");
    }
  },
  methods: {
    save() {
      this.menu = false;
      this.$emit("date_emit", this.date_pick);
    },
  },
};
</script>

<style>
</style>
