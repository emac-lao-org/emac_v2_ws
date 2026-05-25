<template>
  <v-card height="430px">
    <v-app-bar flat color="white">
      <v-toolbar-title class="text-h6 primary--text">
        <span class="font-weight-bold text-uppercase"> Create waste </span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-col align-self="start" cols="8">
        <v-tabs v-model="tab">
          <v-tab class="overline" v-for="item in items" :key="item.tab">
            <b> {{ item.tab }}</b>
          </v-tab>
        </v-tabs>
      </v-col>
    </v-app-bar>
    <v-divider></v-divider>
    <v-tabs-items v-model="tab">
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
  </v-card>
</template>

<script>
import three_months from "./wasteLine/3monthsLine.vue";
import six_months from "./wasteLine/6monthsLine.vue";
import nine_months from "./wasteLine/9monthsLine.vue";
import year from "./wasteLine/year.vue";
import Custom from "./wasteLine/custom.vue";
export default {
  components: { three_months, six_months, nine_months, year, Custom },
  data() {
    return {
      tab: null,
      items: [
        { tab: `${this.$t("3_month")}`, value: 3, content: "Tab 3 Content" },
        { tab: `${this.$t("6_month")}`, value: 6, content: "Tab 4 Content" },
        { tab: `${this.$t("9_month")}`, value: 9, content: "Tab 5 Content" },
        { tab: `${this.$t("12_month")}`, value: 12, content: "Tab 6 Content" },
        { tab: "Custom",value: "picker", content: "Tab 6 Content" },
      ],
    };
  },
};
</script>
<style scoped>
b {
  font-family: "Phetsarath OT";
}
</style>