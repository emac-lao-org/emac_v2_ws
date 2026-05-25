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
    <div v-else id="chart">
      <apexchart
        type="area"
        height="300"
        :options="chartOptions"
        :series="series"
      ></apexchart>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  data() {
    return {
      loading: false,

      dateFrom: [],
      dataSetHz: [],
      dataSetNHz: [],
      data: [
        { title: "Draft", amount: 12, color: "#c4c4c4" },
        { title: "Requested", amount: 15, color: "#7864CC" },
        { title: "Ready", amount: 5, color: "#3423E2" },
        { title: "Processing", amount: 5, color: "#fb8c00" },
        { title: "Completed", amount: 6, color: "#FF8500" },
        { title: "Certified", amount: 2, color: "#56CC4A" },
        { title: "Rejected", amount: 8, color: "#ff5252" },
        { title: "Expired", amount: 2, color: "#000000" },
      ],

      series: [
        {
          name: "Hazardous",
          data: [],
        },
        {
          name: "Non-Hazardous",
          data: [],
        },
      ],

      chartOptions: {
        chart: {
          height: 350,
          type: "area",
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
        },
        xaxis: {
          type: "datetime",
          tickPlacement: "between",
          categories: [],
        },
        tooltip: {
          x: {
            format: "dd/MM/yy HH:mm",
          },
        },
      },
    };
  },
  methods: {
    getDataSetHz() {
      this.$apollo
        .query({
          fetchPolicy: "no-cache",
          query: require("~/gql/queries/dashboard/all/createWaste.gql")
            .createWaste,
          variables: {
            from: this.dateFrom[0].from,
            to: this.dateFrom[0].to,
            type: "Hz",
          },
        })
        .then((res) => {
          this.dataSetHz = res.data.getdisposalsumtypev2;
          // console.log("this.dataSetHz :>> ", this.dataSetHz);
          const mapData = this.dataSetHz.map((item) => {
            return {
              x: item.manifest_date,
              y: item.weight_sum
            };
          });

          this.series = [
            { name: "Hazardous", data: mapData },
            this.series[1]
          ];
          // this.series = res.data.manifestLineChart;
        });
    },
    getDataSetNHz() {
      this.$apollo
        .query({
          fetchPolicy: "no-cache",
          query: require("~/gql/queries/dashboard/all/createWaste.gql")
            .createWaste,
          variables: {
            from: this.dateFrom[0].from,
            to: this.dateFrom[0].to,
            type: "NHz",
          },
        })
        .then((res) => {
          this.dataSetNHz = res.data.getdisposalsumtypev2;
          // console.log("this.dataSetNHz :>> ", this.dataSetNHz);
          const mapData = this.dataSetNHz.map((item) => {
            return {
              x: item.manifest_date,
              y: item.weight_sum
            };
          });

          this.series = [
            this.series[0],
            { name: "Non-Hazardous", data: mapData }
          ];
          // this.series = res.data.manifestLineChart;
        });
    },
  },

  computed: {
    to() {
      const dateTo = moment().format("YYYY-MM-DD");
      return `${dateTo}`;
    },
    from() {
      const dateTo = moment()
        .subtract(0, "month")
        .endOf("month")
        .format("YYYY-MM-DD");
      const dateSub = moment().subtract(6, "month").format("YYYY-MM-01");
      this.dateFrom[0] = {
        from: `${dateSub}`,
        to: `${dateTo}`,

        // console.log("i :>> ", this.dateFrom);
      };
    },
  },

  created() {
    console.log(this.from);
    //   console.log("this.to :>> ", this.to);
  },
  mounted() {
    this.getDataSetHz();
    this.getDataSetNHz();
    this.loading = true;
    // console.log('this.dateFrom[0].from :>> ', this.dateFrom[0].from);
    // console.log('this.dateFrom[0].to :>> ', this.dateFrom[0].to);
    setTimeout(() => {
      this.loading = false;
    }, 500);
  },
};
</script>

<style>
</style>