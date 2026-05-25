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
        :max-date="new Date()"
      >
      </vc-date-picker>
    </div>
    <div v-else>
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

      <div align="center">
        <v-icon color="primary" @click="resetDate"> mdi-calendar-range </v-icon>
        <h6 class="text-uppercase">change date</h6>
      </div>
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
      dataHz: [],
      dataNHz: [],
      dataSetNHz: [],
      date: [],
      from: `${moment()
        .subtract(1, "year")
        .startOf("year")
        .format("YYYY-MM-DD")}`,
      to: `${moment().endOf("year").format("YYYY-MM-DD")}`,
      // minDate: moment().startOf("year").format("YYYY-MM-DD"),
      modelConfig: {
        type: "string",
        mask: "YYYY-MM-DD", // Uses 'iso' if missing
      },
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

      // series: [
      //   {
      //     name: "Hazardous",
      //     data: [],
      //   },
      //   {
      //     name: "Non-Hazardous",
      //     data: [],
      //   },
      // ],
    };
  },
  methods: {
    resetDate() {
      this.from = "";
      this.to = "";
      this.dataHz = [];
      this.dataNHz = [];
    },
    getDataSetHz() {
      this.$apollo
        .query({
          fetchPolicy: "no-cache",
          query: require("~/gql/queries/dashboard/all/createWaste.gql")
            .createWaste,
          variables: {
            from: this.from,
            to: this.to,
            type: "Hz",
          },
        })
        .then((res) => {
          this.dataSetHz = res.data.getdisposalsumtypev2;
          // console.log("this.dataSetHz :>> ", this.dataSetHz);
          this.dataHz = this.dataSetHz.map((item) => {
            return { x: item.manifest_date, y: item.weight_sum };
          });
          // this.date = ... not needed
        })
        .then(() => {
          this.$apollo
            .query({
              fetchPolicy: "no-cache",
              query: require("~/gql/queries/dashboard/all/createWaste.gql")
                .createWaste,
              variables: {
                from: this.from,
                to: this.to,
                type: "NHz",
              },
            })
            .then((res) => {
              this.dataSetNHz = res.data.getdisposalsumtypev2;
              // console.log("this.dataSetNHz :>> ", this.dataSetNHz);
              this.dataNHz = this.dataSetNHz.map((item) => {
                return { x: item.manifest_date, y: item.weight_sum };
              });
              // this.series[1].data = this.dataNHz;
              this.series[0].data = this.dataHz;
            });
        });
    },
    getDataSetNHz() {},
  },

  computed: {
    series() {
      return [
        {
          name: "Hazardous",
          data: this.dataHz,
        },
        {
          name: "Non-Hazardous",
          data: this.dataNHz,
        },
      ];
    },
    chartOptions() {
      return {
        chart: {
          height: 300,
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
          tickPlacement: "between"
        },
        tooltip: {
          x: {
            format: "dd/MM/yy HH:mm",
          },
        },
      };
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
        this.getDataSetHz();
        // console.log("this.series :>> ", this.series);
        // console.log("this.date :>> ", this.date);
      },
    },
  },

  created() {
    // console.log(this.from);
    //   console.log("this.to :>> ", this.to);
  },
  mounted() {
    this.loading = true;
    this.getDataSetHz();
    this.loading = true;
    // this.series[0].data = this.dataSetHz;
    // this.series[1].data = this.dataSetNHz;

    // console.log("this.series :>> ", this.series);
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