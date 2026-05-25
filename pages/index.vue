<template>
  <div class="mx-4 my-6">
    <v-row>
      <v-col cols="5">
        <v-card>
          <manifestDonut />
        </v-card>
      </v-col>
      <v-col align="center">
        <v-card>
          <catalogPie />
        </v-card>
      </v-col>
      <v-col cols="5">
        <v-card>
          <CreateWasteLine />
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-card> <AllOrg /> </v-card>
      </v-col>
      <!-- <v-col cols="4">
        <v-card> <WasteCode /> </v-card>
      </v-col> -->
      <v-col cols="6">
        <v-card> <CatalogChart /> </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="2">
        <v-card> <UserChart /> </v-card>
      </v-col>
      <v-col cols="4">
        <v-card> <ManifestApproveChart /> </v-card>
      </v-col>
      <v-col cols="4">
        <v-card> <CatalogApproveChart /> </v-card>
      </v-col>
      <v-col cols="2">
        <v-card> <ExtendChart /> </v-card>
      </v-col>
    </v-row>

    <!-- <center>
    <h1 class="mb-5">{{ $t('draft') }}, {{name}}</h1>
    <h3>Email, {{email}}</h3>
    <p>{{this.$store.state.user}}</p>
    <p>{{data}}</p>
    <v-btn @click="changeLanguage" color="primary">
          lang
        </v-btn>
    </center> -->
    <!-- <mapboxMarker @latlng="getLatlng" /> -->
  </div>
</template>

<script>
import manifestDonut from "@/components/chart/dashboard/manifestDonut.vue";
import catalogPie from "~/components/chart/dashboard/catalogPieChart.vue";
import CreateWasteLine from "~/components/chart/dashboard/createWasteLine.vue";
import AllOrg from "~/components/chart/dashboard/organize/allOrg.vue";
import WasteCode from "~/components/chart/dashboard/wasteCode/wasteCode.vue";
import CatalogChart from "~/components/chart/dashboard/catalog/catalogChart.vue";
import UserChart from "~/components/chart/dashboard/user/userChart.vue";
import ManifestApproveChart from "~/components/chart/dashboard/manifestApprove/manifestApproveChart.vue";
import CatalogApproveChart from "~/components/chart/dashboard/catalogApprove/catalogApproveChart.vue";
import ExtendChart from "~/components/chart/dashboard/extend/extendChart.vue";
export default {
  components: {
    manifestDonut,
    catalogPie,
    CreateWasteLine,
    AllOrg,
    WasteCode,
    CatalogChart,
    UserChart,
    ManifestApproveChart,
    CatalogApproveChart,
    ExtendChart,
  },
  data() {
    return {
      auth: {
        name: "",
        email: "",
      },
      token: "",
      data: [],
      locale: "",
      latlng: [],
      role: "",
    };
  },
  methods: {
    //   getLatlng(value) {
    //     this.latlng = value
    //     console.log('this.latlng:P :>> ', value);
    //  },
    getData() {
      (this.name = this.$nuxt.$fire.auth.currentUser.email.split("@")[0]),
        (this.email = this.$nuxt.$fire.auth.currentUser.email);
    },

    // async getToken() {
    //   const result = await $nuxt.$fire.auth.currentUser
    //     .getIdTokenResult()
    //     .catch((err) => console.log(err))
    //   this.token = result.token
    //   // console.log('this.token :>> ', this.token);
    //   localStorage.setItem('token', this.token)
    //   document.cookie = 'token=' + this.token
    // },
    async getToken() {
      const result = await $nuxt.$fire.auth.currentUser
        .getIdTokenResult()
        .catch((err) => console.log(err));
      this.token = result.token;
      // console.log('this.token :>> ', this.token);
      localStorage.setItem("token", this.token);
      document.cookie = "token=" + this.token;
      // await window.location.reload()
    },
    async getRole() {
      this.role = await this.$nuxt.$fire.auth.currentUser.getIdTokenResult();

      // console.log(value.claims["https://hasura.io/jwt/claims"]["x-hasura-default-role"])
      this.role =
        this.role.claims["https://hasura.io/jwt/claims"][
          "x-hasura-default-role"
        ];
      // console.log(
      //   "🚀 ~ file: index.vue ~ line 72 ~ this.role.then ~  this.role =>",
      //   this.role
      // );
    },
    
    setRole() {
      this.$store.commit("SET_ROLE", this.role);
      // console.log("this.$store.state :>> ", this.$store.state);
    },
    changeLanguage() {
      this.locale = this.locale === "en" ? "la" : "en";
      localStorage.setItem("lang", this.locale);
      // console.log("localStorage.getItem :>> ", localStorage.getItem("lang"));
      const lang = localStorage.getItem("lang");

      this.$i18n.locale = lang;
      // console.log("🚀 ~ file: index.vue ~ line 150 ~ changeLanguage ~  this.$i18n.locale",  this.$i18n.locale)
    },
    checkLanguage() {
      this.locale = localStorage.getItem("lang");
      this.$i18n.locale = this.locale;
    },
  },
  // computed: {
  //   _setRole: {
  //     set(newVal) {
  //       this.$store.commit("SET_ROLE", newVal);
  //     },
  //   },
  // },
  async created() {
    this.getData(), this.getToken();
    this.checkLanguage();
    await this.getRole();
    await this.setRole();
  },
  async mounted() {
    setTimeout(() => {
      this.getToken();
      this.getRole();
      this.setRole();
    }, 1000);
  },
};
</script>

<style>
#app {
  font-family: "Phetsarath OT";
}
</style>