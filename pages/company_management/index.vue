<template>
  <div class="ml-4 mt-8">
    <dir v-if="this.loading == true">
      <v-progress-linear
        color="primary"
        indeterminate
        rounded
        height="8"
      ></v-progress-linear>
    </dir>
    <div v-else>
      <v-row>
        <v-col @click="toggleTab(0)" cols="3">
          <CardTab
            :title="text_all"
            :amount="amount"
            color="#0d47a1"
            color_hover="#eeeeee"
          />
        </v-col>
        <v-col>
          <v-row>
            <v-col cols="8">
              <h2
                style="margin-bottom: -6px"
                class="
                  blue--text
                  text--darken-4
                  font-weight-bold
                  text-uppercase
                "
              >
               {{text_dash}}
              </h2>
            </v-col>
            <v-col>
              <DialogAddCompany />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col @click="toggleTab(0)" cols="3">
              <CardTabSmall
                color="#0d47a1"
                height="100"
                width="240"
                :title="text_wg"
                :total="totalWG"
                color_hover="#eeeeee"
              />
            </v-col>
            <v-col @click="toggleTab(1)" cols="3">
              <CardTabSmall
                color="#0d47a1"
                height="100"
                width="240"
                :title="text_wt"
                color_hover="#eeeeee"
                :total="totalWT"
              />
            </v-col>
            <v-col @click="toggleTab(2)" cols="3">
              <CardTabSmall
                color="#0d47a1"
                height="100"
                width="240"
                :title="text_wd"
                color_hover="#eeeeee"
                :total="totalWD"
              />
            </v-col>
            <v-col @click="toggleTab(3)" cols="3">
              <CardTabSmall
                color="#0d47a1"
                height="100"
                width="240"
                :title="text_wr"
                color_hover="#eeeeee"
                :total="totalWR"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
    <div>
      <tab-company />
    </div>
  </div>
</template>

<script>
import CardTab from "~/components/cardTab.vue";
import TabCompany from "~/components/company_management/tabCompany.vue";
import DialogAddCompany from "~/components/company_management/dialogAddCompany.vue";
import getTransporterAmount from "~/mixins/getTransportersNeq.js";
import getDisposalsAmount from "~/mixins/getDisposalNeq.js";
import getAmountCompany from "~/mixins/getAmountCompany.js";

export default {
  name: "company_management",
  components: { CardTab, TabCompany, DialogAddCompany },
  mixins: [getTransporterAmount, getDisposalsAmount, getAmountCompany],
  data() {
    return {
      dataWG: [],
      dataWR: [],
      totalWG: "",
      totalWR: "",
      loading: false,
    };
  },

  methods: {
    toggleTab(number) {
      this.$store.commit("SET_TAB", number);
      // console.log('this.$store.state.tab :>> ', this.$store.state.tab);
    },
    openDialog() {},
    async getGeneratoramount() {
      this.loading = true;
      await this.$apollo
        .query({
          query: require("~/gql/queries/getGenerator").getGeneratorNeqCount,
          variables: { where: { status: { _neq: 4 } } },
          fetchPolicy: "network-only"
        })
        .then((data) => {
          this.totalWG = data.data.emac_generators_aggregate.aggregate.count.toString();
          this.loading = false;
        })
        .catch((err) => { 
          console.error(err);
          this.loading = false;
        });
    },
    async getRegulatoramount() {
      await this.$apollo
        .query({
          query: require("~/gql/queries/getRegulator").getRegulatorNeqCount,
          variables: { where: { status: { _neq: 4 } } },
          fetchPolicy: "network-only"
        })
        .then((data) => {
          this.totalWR = data.data.emac_regulators_aggregate.aggregate.count.toString();
        })
        .catch((err) => {
          // console.log("err :>> ", err);
        });
    },
  },
  computed: {
    tab: {
      get() {
        return this.$store.state.tab;
      },
      set(newVal) {
        this.$store.commit("SET_TAB", newVal);
      },
    },
  },
  mounted() {
    this.getGeneratoramount(), this.getRegulatoramount();
  },
  computed:{
    text_all(){
      return this.$t('all_organizaiton')
    },
    text_wg(){
      return this.$t('waste_generator')
    },
    text_wt(){
      return this.$t('waste_transporter')
    },
    text_wd(){
      return this.$t('waste_disposal')
    },
    text_wr(){
      return this.$t('waste_regulator')
    },
    text_dash(){
      return this.$t('organizations_dashboard')
    } 
  }
};
</script>

<style scoped>
</style>