<template>
  <v-card height="390">
    <v-app-bar flat color="white">
      <v-toolbar-title align="start" class="text-h6 primary--text">
        <span class="text-uppercase font-weight-bold"> All user </span>
      </v-toolbar-title>
    </v-app-bar>
    <v-divider></v-divider>
    <div v-for="(i, index) in data" :key="index">
      <v-alert @click="viewMore(i.to)" id="userCard" dense>
        <v-row>
          <v-col cols="4">
            <v-avatar small color="#156DFF">
              <v-icon dark> mdi-account </v-icon>
            </v-avatar>
          </v-col>
          <v-col cols="5" align-self="center">
            <v-row
              ><h5>{{ i.name }}</h5></v-row
            >
            <v-row
              ><h4>{{ i.user }}</h4></v-row
            >
          </v-col>
          <v-col align="end" align-self="center">
            <v-icon> mdi-chevron-right </v-icon>
          </v-col>
        </v-row>
      </v-alert>
    </div>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      data: [
        { name: "Generator", user: "22", to: "/waste_generator" },
        { name: "Transporter", user: "12", to: "/waste_transporter" },
        { name: "Disposal", user: "15", to: "/waste_disposal" },
        { name: "Regulator", user: "21", to: "/waste_regulator" },
      ],
      wgAmount: 0,
      wtAmount: 0,
      wdAmount: 0,
      wrAmount: 0,
    };
  },
  methods: {
    getUser() {
      this.$apollo
        .query({
          fetchPolicy: "no-cache",
          query: require("~/gql/queries/dashboard/all/userChartAll.gql")
            .userChartAll,
        })
        .then((res) => {
          this.wgAmount = res.data.emac_wg_users_aggregate.aggregate.count;
          this.wtAmount = res.data.emac_wt_users_aggregate.aggregate.count;
          this.wdAmount = res.data.emac_wd_users_aggregate.aggregate.count;
          this.wrAmount = res.data.emac_wr_users_aggregate.aggregate.count;

          this.data = [
            { name: this.$t('waste_generator'), user: this.wgAmount, to: "/waste_generator" },
            { name: this.$t('waste_transporter'), user: this.wtAmount, to: "/waste_transporter" },
            { name: this.$t('waste_disposal'), user: this.wdAmount, to: "/waste_disposal" },
            { name: this.$t('waste_regulator'), user: this.wrAmount, to: "/waste_regulator" },
          ];
        });
    },
    viewMore(des) {
      this.$router.push(des);
    },
  },
  mounted() {
    this.getUser();
  },
};
</script>

<style scoped>
#userCard:hover {
  background-color: #e1e1e1;
  transition: 0.4;
}
</style>