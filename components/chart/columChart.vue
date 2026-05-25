<template>
  <div>
    <div align="start">
      <h5>Amount of credits / year ({{this.year}})</h5>
      <h3>{{ new Intl.NumberFormat().format(this.amount) }} {{this.$t('lak')}}</h3>
    </div>
    <apexchart
      height="300"
      width="600"
      :options="options"
      :series="series"
    ></apexchart>
  </div>
</template>

<script>
export default {
  data() {
    return {
      year: new Date().getFullYear(),
      amount: 0,
      amountPerYear: [],
      data: [],
      jan: 0,
      feb: 0,
      mar: 0,
      apr: 0,
      may: 0,
      jun: 0,
      jul: 0,
      aug: 0,
      sep: 0,
      oct: 0,
      nov: 0,
      dec: 0,
      lastDay: [],
      options: {
        chart: {
          type: "bar",
        },
        plotOptions: {
          bar: {
            columnWidth: "90%",
          },
        },
        colors: ["#3D5AFE"],
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: true,
          showForSingleSeries: true,
          customLegendItems: ["Credits"],
          markers: {
          
            fillColors: ["#3D5AFE"],
          },
        },
        xaxis: {
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
        },
        yaxis: {
          labels: {
            formatter: function (i) {
              return new Intl.NumberFormat().format(i) + " " + "LAK";
            },
          },
        },
      },
    };
  },
  methods: {
    getAmountPerYear() {
      this.$apollo
        .query({
          fetchPolicy: "no-cache",
          query: require("~/gql/queries/topup/emac_transactions.gql"),
        })
        .then((data) => {
          this.amountPerYear =
            data.data.emac_transactions_aggregate.aggregate.sum;
          this.amount = this.amountPerYear.credit_amount;
          // console.log(
          //   "🚀 ~ file: columChart.vue ~ line 89 ~ getAmountPerYear ~ this.amountPerYear",
          //   this.amountPerYear
          // );
        });
    },
    daysInMonth(month, year) {
      return new Date(year, month, 0).getDate();
    },
    async getCreditMonth(m, ld) {
      const y = new Date().getFullYear();
      await this.$apollo
        .query({
          fetchPolicy: "no-cache",
          query: require("~/gql/queries/topup/analyCredit.gql"),
          variables: {
            from: `${y}-${m}-01T00:00:00.000000+00:00`,
            to: `${y}-${m}-${ld}T23:59:59.000000+00:00`,
          },
        })
        .then((data) => {
          this.data[parseInt(m)] =
            data.data.emac_transactions_aggregate.aggregate.sum.credit_amount;
          this.jan = this.data[1];
          this.feb = this.data[2];
          this.mar = this.data[3];
          this.apr = this.data[4];
          this.may = this.data[5];
          this.jun = this.data[6];
          this.jul = this.data[7];
          this.aug = this.data[8];
          this.sep = this.data[9];
          this.oct = this.data[10];
          this.nov = this.data[11];
          this.dec = this.data[12];
        });
        // console.log('this.data :>> ', this.data);
    },
    async getData() {
      const month = [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
      ];
      for (let x = 1; x <= month.length; x++) {
        this.lastDay[x] = this.daysInMonth(x, 2022).toString();
      }
      for (let i = 0; i < month.length; i++) {
        setTimeout(() => {
          this.getCreditMonth(month[i], this.lastDay[i + 1]);
        }, 500);
      }

      // console.log("this.data :>> ", this.data);
    },
  },
  computed: {
    series() {
      return [
        {
          name: "Credits",
          data: [
            this.jan,
            this.feb,
            this.mar,
            this.apr,
            this.may,
            this.jun,
            this.jul,
            this.aug,
            this.sep,
            this.oct,
            this.nov,
            this.dec,
          ],
        },
      ];
    },
  },
  mounted() {
    this.getData();
    this.getAmountPerYear();
  },
  created() {},
};
</script>



<style>
</style>