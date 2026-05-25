<template>
  <v-card height="auto">
    <v-app-bar flat color="white">
      <v-toolbar-title class="text-h6 primary--text">
        <span class="text-uppercase font-weight-bold"> {{this.$t("all_manifest")}} </span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-col align="end" align-self="start" cols="8">
        <v-tabs v-model="tab">
          <v-tab class="overline" v-for="item in items" :key="item.tab">
            <b>
              {{ item.tab }}
            </b>
          </v-tab>
        </v-tabs>
      </v-col>
    </v-app-bar>
    <v-divider></v-divider>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-card flat>
          <all />
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <month />
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <three_months />
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <six_months />
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <nine_months />
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <year />
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <Custom />
        </v-card>
      </v-tab-item>
    </v-tabs-items>
    <v-col>
      <h4
        style="cursor: pointer"
        @click="viewMore"
        class="d-flex justify-end mr-4 primary--text"
      >
       {{this.$t("view_more")}} >>
      </h4>
    </v-col>
  </v-card>
</template>

<script>
import all from "./manifestDonut/all.vue";
import month from "./manifestDonut/month.vue";
import three_months from "./manifestDonut/3months.vue";
import six_months from "./manifestDonut/6months.vue";
import nine_months from "./manifestDonut/9months.vue";
import year from "./manifestDonut/year.vue";
import Year from "./manifestDonut/year.vue";
import Custom from "./manifestDonut/custom.vue";
export default {
  components: {
    all,
    Year,
    month,
    three_months,
    six_months,
    nine_months,
    year,
    Custom,
  },
  data() {
    return {
      tab: null,
      items: [
        { tab: `${this.$t("all")}`, value: 0, content: "" },
        { tab: `${this.$t("month")}`, value: 1, content: "Tab 2 Content" },
        { tab: `${this.$t("3_month")}`, value: 3, content: "Tab 3 Content" },
        { tab: `${this.$t("6_month")}`, value: 6, content: "Tab 4 Content" },
        { tab: `${this.$t("9_month")}`, value: 9, content: "Tab 5 Content" },
        { tab: `${this.$t("12_month")}`, value: 12, content: "Tab 6 Content" },
        { tab: `${this.$t("custom")}`, value: "picker", content: "" },
      ],
    };
  },
  methods: {
    viewMore() {
      this.$router.push("/manifest/manifest_tracking");
    },
  },
};
</script>

<style scoped>
b {
  font-family: "Phetsarath OT";
}
</style>