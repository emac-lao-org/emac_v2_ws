<template>
<div>
      <div class="d-flex justify-center" v-if="loading == true">
      <v-progress-linear
        :size="70"
        :width="7"
        color="primary"
        indeterminate
      ></v-progress-linear>
    </div>
  <v-row v-else class="my-6">
    <v-col class="d-flex justify-center" align-self="center" cols="5">
      <apexchart width="900" height="250" :options="options" :series="manifest">
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
      </v-row>
    </v-col>
  </v-row>
</div>
</template>

<script>
import moment from 'moment';
import getManifestAmount from "~/mixins/dashboard/manifestChart/getManifestAmount.js";
export default {
  mixins: [getManifestAmount],
  data() {
    return {
      loading: false,
      previousMonth: 12,
      // to: `${new Date().getFullYear()}-${
      //   (new Date().getMonth() + 1).toString().length > 1
      //     ? new Date().getMonth() + 1
      //     : "0" + (new Date().getMonth() + 1)
      // }-${new Date().getDate()}T00:00:00.000000+00:00`,
      // from: `${new Date().getFullYear()}-${
      //   this.prevMonth.toString().length > 1
      //     ? new Date().getMonth()
      //     : "0" + new Date().getMonth()
      // }-${"01"}T23:59:59.000000+00:00`,

      prevMonth: "",
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

      options: {
        dataLabels: {
          enabled: false,
        },
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
                show: false,
              },
            },
          },
        },
      },
    };
  },
  methods: {
    // daysInMonth(month, year) {
    //   return new Date(year, month, 0).getDate();
    // },
    // getFirstDayPreviousMonth() {
    //   const date = new Date();
    //   this.prevMonth = date.getMonth() - this.previousMonth;
    //   this.prevMonth = this.prevMonth + 1;
    //   console.log(
    //     "🚀 ~ file: month.vue ~ line 103 ~ getFirstDayPreviousMonth ~ const prevMonth",
    //     this.prevMonth
    //   );
    // },
  },
  computed: {
    manifest() {
      return this.data.map((i) => i.amount);
    },
   to() {
      const dateTo = moment().format("YYYY-MM-DD");
      return `${dateTo}T23:59:59.000000+00:00`;
    },
    from() {
      const dateSub = moment()
        .subtract(this.previousMonth, "month")
        .format("YYYY-MM-01");
      return `${dateSub}T00:00:00.000000+00:00`;
    },
  },
  created() {
    this.loading = true;
    // this.getFirstDayPreviousMonth();
    console.log("this.from :>> ", this.from);
    console.log("this.to :>> ", this.to);
        this.getManifestDraft();
    this.getManifestRequested();
    this.getManifestReady();
    this.getManifestProcess();
    this.getManifestCompleted();
    this.getManifestCertifield();
    this.getManifestRejected();
    this.getManifestExpired();
    setTimeout(() => {
      this.loading = false;
    }, 500);
  },
};
</script>

<style>
</style>