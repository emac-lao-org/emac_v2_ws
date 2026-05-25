<template>
  <v-card class="overflow-auto" height="400">
    <div class="d-flex justify-center" v-if="loading == true">
      <v-progress-linear
        :size="70"
        :width="7"
        color="primary"
        indeterminate
      ></v-progress-linear>
    </div>
    <div v-else>
      <v-app-bar flat color="white">
        <v-toolbar-title align="start" class="text-h6 primary--text">
          <span class="text-uppercase font-weight-bold">
            All most waste code
          </span>
        </v-toolbar-title> 
      </v-app-bar>
      <v-divider class="mb-5"></v-divider>
      <div id="chart">
        <apexchart
          height="300"
          type="bar"
          :options="chartOptions"
          :series="series"
        ></apexchart>
      </div>
    </div>
  </v-card>
</template>

<script>
const moment = require("moment");
import wasteCodeMixin from "~/mixins/wasteCode";

export default {
  mixins: [wasteCodeMixin],
  data() {
    return {
      data: [],
      dataSum: [],
      loading: false,
      series: [
        {
          data: [],
        },
      ],
      start: moment().startOf("year").format("YYYY-MM-DD"),
      end: moment().endOf("year").format("YYYY-MM-DD"),

      chartOptions: {
        chart: {
          type: "bar",
          height: 350,
          stacked: true,
        },
        tooltip: {
          enabled: true,
          shared: true,
          followCursor: true,
          intersect: false,
          x: {
            show: false,
          },
          y: {
            title: {
              formatter: function (e) {
                return "Amount:" + "";
              },
            },
          },
        },
        grid: {
          show: false,
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true,
            barHeight: "20%",
          },
        },
        dataLabels: {
          enabled: false,
        },
        colors: ["#165DFF"],
      },
    };
  },
  methods: {
    getWasteCode() {
      this.$apollo
        .query({
          fetchPolicy: "no-cache",
          query: require("~/gql/queries/dashboard/all/wasteCodeAlmost.gql"),
          variables: {
            from: this.start,
            to: this.end,
          },
        })
        .then((data) => {
          this.loading = false;
          this.data = data.data.get_sum_create_waste;
          // console.log(
          //   "🚀 ~ file: wasteCode.vue ~ line 85 ~ .then ~ this.data",
          //   this.data
          // );

          this.dataSum = this.data.map((item) => {
            return {
              x: this.formatWasteCode(item.code, item.entry_type),
              y: item.total,
            };
          });

          this.dataSum = Object.entries(this.dataSum)
            .slice(0, 5)
            .map((x) => x[1]);
          this.series[0].data = this.dataSum;

          // console.log("dataSum :>> ", this.dataSum);
        });
    },
  },
  mounted() {
    // console.log("this.start :>> ", this.start);
    // console.log("this.end :>> ", this.end);
  },

  created() {
    this.loading = true;
    this.getWasteCode();

    setTimeout(() => {
      this.loading = false;
    }, 2000);
  },
};
</script>

<style>
</style>
