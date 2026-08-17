<template>
  <v-card height="390">
    <v-app-bar height="90" flat color="white">
      <v-toolbar-title id="title" align="start" class="text-h6 primary--text">
        <span class="text-uppercase font-weight-bold">
          Extension <br />
          Approval
        </span>
      </v-toolbar-title>
    </v-app-bar>
    <v-divider></v-divider>
    <div v-for="(i, index) in data" :key="index">
      <v-alert @click="viewMore(i.to)" id="userCard" dense>
        <v-row>
          <v-col cols="2">
            <v-icon>{{ i.icon }} </v-icon>
          </v-col>
          <v-col>
            <h4>{{ i.name }}</h4>
          </v-col>
        </v-row>
        <v-row>
            <v-row>
              <v-col align="center">
                <h4>Request</h4>
                <h4 class="my-2 ml-auto primary--text">{{ i.amount }}</h4>
              </v-col>
              <v-col class="pl-14" align="center">
                <h4>Action</h4>
                <v-icon
                  @click="viewMore(i.to)"
                  class="my-2 ml-auto primary--text"
                >
                  mdi-shape-square-rounded-plus</v-icon
                >
              </v-col>
            </v-row>
        </v-row>
      </v-alert>
    </div>
  </v-card>
</template>

<script>
import Swal from "sweetalert2";
export default {
  data() {
    return {
      data: [
        {
          icon: "mdi-train-car-centerbeam-full",
          name: "Quota extension",
          amount: this.amountQ,
          to: "/catalog_extended_request",
        },
        {
          icon: "mdi-timelapse",
          name: "Time extension",
          amount: this.amountT,
          to: "/catalog_extended_request",
        },
      ],
      amountT: [],
      amountQ: [],
    };
  },
  methods: {
    viewMore(des) {
      this.$router.push(des);
    },
    async getWasteCat() {
      this.$apollo
        .query({
          fetchPolicy: "no-cache",
          query: require("~/gql/queries/waste_categories/wasteCatagoriesExtend")
            .wasteCatagoriesTimeExtend,
          variables: {
            status: 3,
          },
        })
        .then((data) => {
          this.amountT = data.data.emac_catalog_operations.length;
          // console.log(
          //   "🚀 ~ file: request_quota.vue ~ line 255 ~ .then ~ this.data",
          //   this.amountT
          // );
        });
    },
    async getWasteCatQuota() {
      this.$apollo
        .query({
          fetchPolicy: "no-cache",
          query: require("~/gql/queries/waste_categories/wasteCatagoriesExtend")
            .wasteCatagoriesTimeQuotaExtend,
          variables: {
            status: 5,
          },
        })
        .then((data) => {

          this.amountQ = data.data.emac_catalog_operations.length;
          // console.log("🚀 ~ file: extendChart.vue ~ line 102 ~ .then ~  this.amountQ",  this.amountQ)
        

        }).then(()=>{

          this.data = [
            {
              icon: "mdi-train-car-centerbeam-full",
              name: "Quota extension",
              amount: this.amountQ,
              to: "/catalog_extended_request",
            },
            {
              icon: "mdi-timelapse",
              name: "Time extension",
              amount: this.amountT,
              to: "/catalog_extended_request",
            },
          ];


        })
        .catch((err) => {
          Swal.fire({
            icon: "success",
            title: "Welcome to EMAC",
            text: "Please refresh the page",
            confirmButtonColor: "#56CB4A",
          }).then(() => {
            window.location.reload();
          });
        });
    },
  },
  created() {
    this.getWasteCat();
    this.getWasteCatQuota();
  },
};
</script>

<style scoped>
/* #userCard:hover {
  background-color: #e1e1e1;
  transition: 0.4;
} */
</style>