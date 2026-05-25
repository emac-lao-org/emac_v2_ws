<template>
  <div>
    <div v-if="range.start == '' && range.end == ''" align="center">
      <!-- <vc-date-picker
        class="mt-8"
        :model-config="modelConfig"
        :min-date="minDate"
        :max-date="new Date()"
        v-model="range"
        is-range
      /> -->
      <vc-date-picker
        class="mt-12"
        v-model="range"
        is-range
        :model-config="modelConfig"
        :min-date="minDate"
        :max-date="new Date()"
      >
      </vc-date-picker>
    </div>
    <div v-else>
      <v-row class="my-6">
        <v-col class="d-flex justify-center" align-self="center" cols="5">
          <apexchart
            width="900"
            height="250"
            :options="options"
            :series="series"
          >
          </apexchart>
        </v-col>
        <v-col>
          <v-row class="mt-4">
            <v-col cols="4" v-for="(i, index) in data" :key="index">
              <v-alert border="left" dense colored-border :color="i.color">
                <div class="ml-4">
                  <v-row>
                    <h4>{{ i.title }}</h4>
                  </v-row>
                  <v-row>
                    <h4>{{ i.amount }}</h4>
                  </v-row>
                </div>
              </v-alert>
            </v-col>
            <v-col>
              <div align="center">
                <v-icon color="primary" @click="resetDate">
                  mdi-calendar-range
                </v-icon>
                <h6 class="text-uppercase">change date</h6>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import getManifestAmount from "~/mixins/dashboard/manifestChart/getManifestAmount.js";
import moment from "moment";

export default {
  mixins: [getManifestAmount],
  data() {
    return {
      from: `${moment().startOf("year").format("YYYY-MM-DD")}`,
      to: `${moment().endOf("year").format("YYYY-MM-DD")}`,
      picker: false,
      data: [
        { title: `${this.$t("draft")}`, amount: 0, color: "#c4c4c4" },
        { title: `${this.$t("Requested")}`, amount: 0, color: "#7864CC" },
        { title: `${this.$t("ready")}`, amount: 0, color: "#3423E2" },
        { title: `${this.$t("processing")}`, amount: 0, color: "#fb8c00" },
        { title: `${this.$t("completed")}`, amount: 0, color: "#FAD02C" },
        { title: `${this.$t("certified")}`, amount: 0, color: "#56CC4A" },
        { title: `${this.$t("rejected")}`, amount: 0, color: "#ff5252" },
        { title: `${this.$t("expired")}`, amount: 0, color: "#000000" },
      ],
      minDate: moment().startOf("year").format("YYYY-MM-DD"),
      modelConfig: {
        type: "string",
        mask: "YYYY-MM-DD", // Uses 'iso' if missing
      },
      options: {
        dataLabels: {
          enabled: false,
        },
        // tooltip: {
        //   y: {
        //     formatter: function (i) {
        //       return new Intl.NumberFormat().format(i) + " " + "LAK";
        //     },
        //   },
        // },

        chart: {
          type: "donut",
          toolbar: {
            show: true,
            offsetX: 0,
            offsetY: -30,
          },
        },
      labels: [
          `${this.$t("draft")}`,
          `${this.$t("Requested")}`,
          `${this.$t("ready")}`,
          `${this.$t("processing")}`,
          `${this.$t("completed")}`,
          `${this.$t("certified")}`,
          `${this.$t("rejected")}`,
          `${this.$t("expired")}`,
        ],
        legend: {
          show: false,
        },
       colors: [
          "#c4c4c4",
          "#7864CC",
          "#3423E2",
          "#fb8c00",
          "#FAD02C",
          "#56CC4A",
          "#ff5252",
          "#000000",
        ],
        plotOptions: {
          pie: {
            donut: {
              labels: {
                // total: {
                //   show: true,
                //   formatter: function (w) {
                //     let a = w.globals.seriesTotals[0];
                //     let b = w.globals.seriesTotals[1];
                //     let c = a + b;
                //     return new Intl.NumberFormat().format(c) + " " + "LAK";
                //   },
                // },
                show: false,
                // value: {
                //   formatter: function (i) {
                //     return new Intl.NumberFormat().format(i) + " " + "LAK";
                //   },
                // },
              },
            },
          },
        },
      },
    };
  },
  methods: {
    resetDate() {
      this.from = "";
      this.to = "";
    },
  },
  computed: {
    series() {
      return this.data.map((i) => i.amount);
    },
    range: {
      get() {
        return {
          start: this.from,
          end: this.to,
        };
      },
      set(value) {
        this.from = value.start;
        this.to = value.end;
        this.getManifestDraft();
        this.getManifestRequested();
        this.getManifestReady();
        this.getManifestProcess();
        this.getManifestCompleted();
        this.getManifestCertifield();
        this.getManifestRejected();
        this.getManifestExpired();
      },
    },
  },
  mounted() {
    console.log("moment() :>> ", moment().startOf("year").format("YYYY-MM-DD"));
    console.log(
      "moment() 2:>> ",
      moment().startOf("year").format("YYYY-MM-DD")
    );
    console.log("this.from :>> ", this.from);
    console.log("this.to :>> ", this.to);
    // console.log("new Date(2020, 0, 1), :>> ", new Date(2020, 0, 1));
  },
};
</script>

<style>
</style>