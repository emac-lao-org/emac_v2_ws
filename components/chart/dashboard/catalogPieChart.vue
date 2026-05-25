<template>
  <v-card height="430">
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
      <v-toolbar-title align="start" class="text-h6 primary--text">
        <span class="text-uppercase font-weight-bold"> All catalog </span>
        <br />
        <h1>{{ all }}</h1>
      </v-toolbar-title>
    </v-app-bar>
    <v-divider class="mb-5"></v-divider>
    <apexchart
      width="200"
      height="240"
      :options="options"
      :series="series"
    ></apexchart>
    <v-col class="">
      <h4 style="cursor:pointer" @click="viewMore" class="d-flex justify-end primary--text">
       {{this.$t("view_more")}} >>
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
      all: [],
      Hz: 0,
      NHz: 0,
      options: {
        dataLabels: {
          enabled: false,
        },

        chart: {
          type: "pie",
          toolbar: {
            offsetY: -65,
            show: true,
          },
        },
        labels: ["Non-Hazardous", "Hazardous"],

        legend: {
          position: "top",
          fontSize: "10px",
          show: true,
          itemMargin: {
            vertical: 10,
          },
        },
        colors: ["rgb(0, 227, 150)", "#165DFF"],
        plotOptions: {
          pie: {
            labels: { show: false },
            // donut: {
            //   labels: {
            //     // total: {
            //     //   show: true,
            //     //   formatter: function (w) {
            //     //     let a = w.globals.seriesTotals[0];
            //     //     let b = w.globals.seriesTotals[1];
            //     //     let c = a + b;
            //     //     return new Intl.NumberFormat().format(c) + " " + "LAK";
            //     //   },
            //     // },

            //     // value: {
            //     //   formatter: function (i) {
            //     //     return new Intl.NumberFormat().format(i) + " " + "LAK";
            //     //   },
            //     // },
            //   },
            // },
          },
        },
      },
    };
  },
  methods: {
    getCatalogsAll() {
      this.$apollo
        .query({
          fetchPolicy: "no-cache",
          query: require("~/gql/queries/dashboard/all/catalogsChartAll.gql")
            .catalogsChartAll,
        })
        .then((res) => {
          this.all = res.data.emac_catalogs_aggregate.aggregate.all;

          // this.data[0].amount = this.draftAmount;
        });
    },
    getCatalogsHz() {
      this.$apollo
        .query({
          fetchPolicy: "no-cache",
          query: require("~/gql/queries/dashboard/all/catalogsChartAll.gql")
            .catalogsChartAllHz,
        })
        .then((res) => {
          this.Hz = res.data.emac_catalogs_aggregate.aggregate.Hz;
        });
    },
    getCatalogsNHz() {
      this.$apollo
        .query({
          fetchPolicy: "no-cache",
          query: require("~/gql/queries/dashboard/all/catalogsChartAll.gql")
            .catalogsChartAllNHz,
        })
        .then((res) => {
          this.NHz = res.data.emac_catalogs_aggregate.aggregate.NHz;

          // this.data[0].amount = this.draftAmount;
        });
    },
    viewMore() {
      this.$router.push("/waste_catalog");
    },
  },
  computed: {
    series() {
      return [this.NHz, this.Hz];
    },
  },
  mounted() {
    this.loading = true;
    this.getCatalogsAll();
    this.getCatalogsHz();
    this.getCatalogsNHz();

    setTimeout(() => {
      this.loading = false;
    }, 1000);
  },
};
</script>

<style>
</style>