<template>
  <v-card class="allOrg" height="400">
    <div class="d-flex justify-center" v-if="loading == true">
      <v-progress-linear
        :size="70"
        :width="7"
        color="primary"
        indeterminate
      ></v-progress-linear>
    </div>
    <div v-else>
      <v-app-bar height="100" flat color="white">
        <v-toolbar-title align="start">
          <span class="primary--text text-uppercase font-weight-bold">
            All Organizations
          </span>
          <br />
          <span class="text-h3 font-weight-bold primary--text">
            {{ amount }}
          </span>
          <b class="primary--text">
            {{ this.$t("organization") }}
          </b>
          <!-- <span class="text-uppercase primary--text"> {{this.$t("organization")}} </span> -->
        </v-toolbar-title>
      </v-app-bar>
      <v-divider class="mb-5"></v-divider>
      <div id="chart">
        <apexchart
          type="bar"
          width="100%"
          height="220"
          :options="chartOptions"
          :series="series"
        ></apexchart>
      </div>
      <v-col>
        <h4
          style="cursor: pointer"
          @click="viewMore"
          class="d-flex justify-end mr-4 primary--text"
        >
          {{ this.$t("view_more") }} >>
        </h4>
      </v-col>
    </div>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      amount: 0,
      wt: 0,
      wd: 0,
      wg: 0,
      wr: 0,

      // series: [
      //   {
      //     data: [
      //       {
      //         x: "Generator",
      //         y: 0,
      //       },
      //       {
      //         x: "Transporter",
      //         y: 0,
      //       },
      //       {
      //         x: "Disposal ",
      //         y: 0,
      //       },
      //       {
      //         x: "Regulator",
      //         y: 0,
      //       },
      //     ],
      //   },
      // ],
      chartOptions: {
        xaxis: {
          categories: ["Generator", "Transporter", "Disposal", "Regulator"],
        },
        tooltip: {
          x: {
            show: true,
          },
          y: {
            title: {
              formatter: function (e) {
                return "Amount:" + "";
              },
            },
          },
        },
        chart: {
          height: 350,
          type: "bar",
        },
        plotOptions: {
          bar: {
            columnWidth: "60%",
          },
        },
        colors: ["#165DFF"],
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
          showForSingleSeries: true,
          //   customLegendItems: ["Credits", "Debits"],
          //   showForSingleSeries: true,
          // customLegendItems: ["Actual", "Expected"],
        },
      },
    };
  },
  methods: {
    amountCompany() {
      this.$apollo
        .query({
          fetchPolicy: "no-cache",
          query: require("~/gql/queries/amountCompany").amount,
        })
        .then((t) => {
          this.wt = t.data.emac_transporters.length;
          this.wd = t.data.emac_disposals.length;
          this.wg = t.data.emac_generators.length;
          this.wr = t.data.emac_regulators.length;
          this.amount = this.wt + this.wd + this.wg + this.wr;
        });
    },
    viewMore() {
      this.$router.push("/company_management");
    },
  },
  mounted() {
    this.loading = true;
    this.amountCompany();
    setTimeout(() => {
      this.loading = false;
    }, 2000);
  },
  computed: {
    series() {
      return [
        {
          data: [
            {
              x: "Generator",
              y: this.wg,
            },
            {
              x: "Transporter",
              y: this.wt,
            },
            {
              x: "Disposal ",
              y: this.wd,
            },
            {
              x: "Regulator",
              y: this.wr,
            },
          ],
        },
      ];
    },
  },
};
</script>

<style>
.allOrg {
  font-family: "Phetsarath OT";
}
</style>