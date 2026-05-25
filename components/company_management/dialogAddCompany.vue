<template>
  <v-row justify="end" class="mr-6">
    <v-dialog v-model="dialog" persistent>
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" v-bind="attrs" v-on="on">
          <v-icon class="">mdi-plus</v-icon>
          <span>{{ create_org }}</span>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <h2
            style="margin-bottom: -6px"
            class="blue--text text--darken-4 font-weight-bold text-uppercase"
          >
            {{ create_org }}
          </h2>
          <v-divider
            style="border: 1px solid #0d47a1"
            class="ml-4"
            vertical
          ></v-divider>
        </v-card-title>
        <v-card-text>
          <p class="blue--text text--darken-2 font-weight-bold text-uppercase">
            <span v-if="tab == '0'"> {{ text_wg }} </span>
            <span v-else-if="tab == '1'"> {{ text_wt }}</span>
            <span v-else-if="tab == '2'">{{ text_wd }} </span>
            <span v-else-if="tab == '3'"> {{ text_wr }}</span>
          </p>
          <v-row>
            <v-col cols="3"
              ><v-select
                outlined
                v-model="tab"
                item-text="name"
                item-value="value"
                :items="items"
                label="Role"
                required
              ></v-select
            ></v-col>
          </v-row>
          <div v-if="tab == '0'">
            <DialogInfoInsertWG />
          </div>
          <div v-else-if="tab == '1'">
            <DialogInfoInsertWT />
          </div>
          <div v-else-if="tab == '2'">
            <DialogInfoInsertWD />
          </div>
          <div v-else-if="tab == '3'">
            <DialogInfoInsertWR />
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import DialogInfoInsertWG from "./dialogInfo/dialogInfoInsertWG.vue";
import DialogInfoInsertWT from "./dialogInfo/dialogInfoInsertWT.vue";
import DialogInfoInsertWD from "./dialogInfo/dialogInfoInsertWD.vue";
import DialogInfoInsertWR from "./dialogInfo/dialogInfoInsertWR.vue";

export default {
  data() {
    return {
      // select: this.$store.state.tab,
      create_org: `${this.$t("create_organizaiton")}`,
      text_wg: `${this.$t("waste_generator")}`,
      text_wt: `${this.$t("waste_transporter")}`,
      text_wd: `${this.$t("waste_disposal")}`,
      text_wr: `${this.$t("waste_regulator")}`,
      items: [],
    };
  },
  components: {
    DialogInfoInsertWG,
    DialogInfoInsertWT,
    DialogInfoInsertWD,
    DialogInfoInsertWR,
  },
  methods: {},
  computed: {
    tab: {
      get() {
        return this.$store.state.tab;
      },
      set(newVal) {
        this.$store.commit("SET_TAB", newVal);
      },
    },
    dialog: {
      get() {
        return this.$store.state.dialog;
      },
      set(newVal) {
        this.$store.commit("SET_DIALOG", newVal);
      },
    },
  },
  mounted() {
    this.items = [
      { name: this.$t("waste_generator"), value: 0 },
      { name: this.$t("waste_transporter"), value: 1 },
      { name: this.$t("waste_disposal"), value: 2 },
      { name: this.$t("waste_regulator"), value: 3 },
    ];
  },
};
</script>