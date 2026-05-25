<template>
  <div class="my-4 mx-6">
    <v-row >
      <v-col align="center" align-self="center">
    <donutChart />
      </v-col>
      <v-col align="center" align-self="center">
        <ColumChart />
      </v-col>
    </v-row>
    <div class="mt-2">
    <TableTopup />
    </div>
  </div>
</template>

<script>
import ColumChart from '~/components/chart/columChart.vue';
import donutChart from '~/components/chart/donutChart.vue';
import TableTopup from '~/components/topup/tableTopup.vue';
export default {
  components: { donutChart , ColumChart, TableTopup},
  data() {
    
    return {
      options: {
        labels: ["Availiable credit", "Already charged"],
        chart: {
          type: "donut",
        },

        colors: ["#3D5AFE","#FF9100"],
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                name: {},
                value: {},
              },
            },
          },
        },
      },
      series: [800, 200],
    };
  },
};
</script>

<style scoped>
</style>