<template>
  <v-card height="400">
    <div class="d-flex justify-center" v-if="loading == true">
      <v-progress-linear
        :size="70"
        :width="7"
        color="primary"
        indeterminate
      ></v-progress-linear>
    </div>
    <v-app-bar v-else flat color="white">
      <v-toolbar-title align="start" class="text-h6 primary--text">
        <span class="text-uppercase font-weight-bold"> Catalog status </span>
      </v-toolbar-title>
    </v-app-bar>
    <v-divider class="mb-5"></v-divider>
<center>
    <apexchart
      width="430"
      height="190"
      :options="options"
      :series="series"
    ></apexchart>
</center>

    <div class="d-flex justify-center" v-if="loading == true">
      <v-progress-linear
        :size="70"
        :width="7"
        color="primary"
        indeterminate
      ></v-progress-linear>
    </div>

    <v-row v-else class="d-flex justify-center mt-4">
      <v-col
        cols="2"
        class="mx-1 d-flex justify-center"
        v-for="(i, index) in data"
        :key="index"
      >
        <v-alert border="left" dense colored-border :color="i.color">
          <div class="ml-4">
            <v-row>
              <h5>{{ i.title }}</h5>
            </v-row>
            <v-row>
              <h4>{{ i.amount }}</h4>
            </v-row>
          </div>
        </v-alert>
      </v-col>
      <v-col class="mt-2">
        <h4
          style="cursor: pointer"
          @click="viewMore"
          class="d-flex justify-end mr-4 primary--text"
        >
        {{this.$t("view_more")}} >>
        </h4>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      draftAmount: 0,
      activeAmount: 0,
      suspendedAmount: 0,
      expiredAmount: 0,
      rejectedAmount: 0,

      data: [
        { title: "Draft", amount: 0, color: "#c4c4c4" },
        { title: "Active", amount: 0, color: "#165DFF" },
        { title: "Suspened", amount: 0, color: "#FF8500" },
        { title: "Expired", amount: 0, color: "#000000" },
        { title: "Rejected", amount: 0, color: "#ff5252" },
      ],

      series: [],
      options: {
        dataLabels: {
          enabled: false,
        },
        chart: {
          type: "donut",
          toolbar: {
            offsetY: -65,
            show: true,
          },
        },
        // labels: ["Non-Hazardous", "Hazardous"],
        labels: [],
        legend: {
          position: "bottom",
          fontSize: "10px",
          show: false,
        },
        colors: [],
        // colors: ["rgb(0, 227, 150)", "#165DFF"],
        plotOptions: {
          pie: {
            donut: {
              labels: {
                total: {
                  show: true,
                  //   formatter: function (w) {
                  //     let a = w.globals.seriesTotals[0];
                  //     let b = w.globals.seriesTotals[1];
                  //     let c = a + b;
                  //     return new Intl.NumberFormat().format(c) + " " + "LAK";
                  //   },
                },
                show: true,
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
    viewMore() {
      this.$router.push("/waste_catalog");
    },
    getCatalogDraft() {
      this.$apollo
        .query({
          query:
            require("~/gql/queries/dashboard/all/catalogStatusChartAll.gql")
              .catalogChartDraft,
        })
        .then((res) => {
          this.draftAmount = res.data.emac_catalogs_aggregate.aggregate.count;

          this.data[0].amount = this.draftAmount;
        });
    },
    getCatalogActive() {
      this.$apollo
        .query({
          query:
            require("~/gql/queries/dashboard/all/catalogStatusChartAll.gql")
              .catalogChartActive,
        })
        .then((res) => {
          this.activeAmount = res.data.emac_catalogs_aggregate.aggregate.count;

          this.data[1].amount = this.activeAmount;
        });
    },
    getCatalogSuspended() {
      this.$apollo
        .query({
          query:
            require("~/gql/queries/dashboard/all/catalogStatusChartAll.gql")
              .catalogChartSuspended,
        })
        .then((res) => {
          this.suspendedAmount =
            res.data.emac_catalogs_aggregate.aggregate.count;

          this.data[2].amount = this.suspendedAmount;
        });
    },
    getCatalogExpired() {
      this.$apollo
        .query({
          query:
            require("~/gql/queries/dashboard/all/catalogStatusChartAll.gql")
              .catalogChartExpired,
        })
        .then((res) => {
          this.expiredAmount = res.data.emac_catalogs_aggregate.aggregate.count;

          this.data[3].amount = this.expiredAmount;
        });
    },
    getCatalogRejected() {
      this.$apollo
        .query({
          query:
            require("~/gql/queries/dashboard/all/catalogStatusChartAll.gql")
              .catalogChartRejected,
        })
        .then((res) => {
          this.rejectedAmount =
            res.data.emac_catalogs_aggregate.aggregate.count;

          this.data[4].amount = this.rejectedAmount;
        })
        .then(() => {
          this.series = [
            this.draftAmount,
            this.activeAmount,
            this.suspendedAmount,
            this.expiredAmount,
            this.rejectedAmount,
          ];
        });
    },
  },
  created() {
    this.loading = true;
    this.getCatalogDraft();
    this.getCatalogActive();
    this.getCatalogSuspended();
    this.getCatalogExpired();
    this.getCatalogRejected();
    setTimeout(() => {
      this.loading = false;
    }, 2000);
  },
  mounted() {
    this.options = {
      colors: this.data.map((i) => i.color),
      labels: this.data.map((i) => i.title),
    };
  },
  computed: {
    // series() {
    //   return this.data.map((i) => i.amount);
    // },
  },
};
</script>

<style>
</style>