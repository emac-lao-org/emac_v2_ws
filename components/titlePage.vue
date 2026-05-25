<template>
  <h2
    id="title"
    class="blue--text text--darken-4 font-weight-bold text-uppercase ma-4"
  >
    {{ title }}
  </h2>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: "100%",
    },
    title: {
      type: String,
      default: "",
    },
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
#title {
  width: v-bind(width);
  border-right: 4px solid #0d47a1;
}
</style>