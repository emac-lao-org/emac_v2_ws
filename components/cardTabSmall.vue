<template>
  <v-card id="card" :max-width="width" :max-height="height">
    <v-card-text>
      <h1
        id="title"
        class="indigo--text text--lighten-1 font-weight-bold mb-4"
      >
        {{ title }}
      </h1>
    </v-card-text>
    <div id="divider" :style="color"></div>
    <v-card-actions>
      <p class="ml-2 text-h4 indigo--text text--lighten-1">{{ total }}</p>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  props: {
    color_a: {
      type: String,
      default: "#0d47a1",
    },
    color_b: {
      type: String,
      default: "#5c6bc0",
    },
    color: {
      type: String,
      default: "blue darken-4",
    },
    width: {
      type: String,
    },
    height: {
      type: String,
    },
    title: {
      type: String,
    },
    total: {
      type: [String, Number],
    },
    color_hover: {
      type: String,
      default: "#ffffff",
    },
  },
  data() {
    return {};
  },
  methods: {
        checkLanguage() {
      const locale = localStorage.getItem("lang");
      this.$i18n.locale = locale;
    },
  },
  mounted() {
    this.checkLanguage();
  },
};
</script>
<style scoped>
#divider {
  width: 80%;
  padding-top: 1px;
  margin-top: -20px;
  opacity: 0.6;
  background-color: v-bind(color);
}
#title {
  font-size: 16px;
  margin-top: -10px;
}
#card:hover {
  background-color: v-bind(color_hover);
  transition: 0.3s;
}
#card {
  border-right: 30px;
  border-style: solid;
  border-image: linear-gradient(to bottom, v-bind(color_a), v-bind(color_b)) 1
    100%;
}
</style>