<template>
  <div>
    <v-row>
      <v-col>
        <apexchart
          width="400"
          height="400"
          :options="options"
          :series="series"
        ></apexchart>
      </v-col>
      <v-col align-self="center" align="start">
        <div v-if="this.total < 0">
          <h2 class="error--text">
            {{ new Intl.NumberFormat().format(this.total) }} LAK
          </h2>
        </div>
        <div v-else>
          <h2 class="primary--text">
            {{ new Intl.NumberFormat().format(this.total) }} LAK
          </h2>
        </div>


        <h3 class="orange--text">
          {{ new Intl.NumberFormat().format(this.usedAmount) }} LAK
        </h3>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [],
      credit: 0,
      debit: 0,
      total: 0,
      usedAmount: 0,
      options: {
        tooltip: {
          y: {
            formatter: function (i) {
              return new Intl.NumberFormat().format(i) + " " + "LAK";
            },
          },
        },
        labels: ["Availiable credit", "Already charged"],
        chart: {
          type: "donut",
        },
        legend: {
          position: "bottom",
        },
        colors: ["#3D5AFE", "#FF9100"],
        plotOptions: {
          pie: {
            donut: {
              labels: {
                total: {
                  show: true,
                  formatter: function (w) {
                    let a = w.globals.seriesTotals[0];
                    let b = w.globals.seriesTotals[1];
                    let c = a + b;
                    return new Intl.NumberFormat().format(c) + " " + "LAK";
                  },
                },
                show: true,
                value: {
                  formatter: function (i) {
                    return new Intl.NumberFormat().format(i) + " " + "LAK";
                  },
                },
              },
            },
          },
        },
      },
    };
  },
  methods: {
    async getData() {
      await this.$apollo
        .query({
          fetchPolicy: "no-cache",
          query: require("~/gql/queries/topup/emac_transactions.gql"),
        })
        .then((data) => {
          this.data = data.data.emac_transactions_aggregate.aggregate.sum;

          this.credit = this.data.credit_amount;
          this.debit = this.data.debit_amount;
          this.total = this.credit - this.debit;
          this.usedAmount = this.debit;

          // console.log("this.data :>> ", this.data);
        });
    },
    convert() {
      this.total = this.total - this.usedAmount;
    },
  },
  computed: {
    series() {
      return [this.total, this.usedAmount];
    },
  },
  created() {
    this.convert();
    this.getData();
  },
};
</script>

<style scoped>
#total {
  color: #0d47a1;
}
#used {
  color: #ff9100;
}
</style>