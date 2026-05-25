<template>
  <v-card id="card" :max-width="width" :max-height="height">
    <v-card-text>
      <!-- <p class="text-h4 blue--text text--darken-4 font-weight-bold">
        {{title}}
      </p> -->
      <h1 class="blue--text text--darken-4 font-weight-bold mb-4">
        {{title}}
      </h1>
    </v-card-text>
    <div id="divider" :style="color"></div>
    <v-card-actions>
      <p class="ml-2 text-h3 blue--text text--darken-4">{{amount}}</p>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: 'All Organizaiton',
    },
    color: {
      type: String,
      default: 'blue darken-4',
    },
    width: {
      type: String,
      default: '340',
    },
    height: {
      type: String,
      default: '140',
    },
    amount: {
      type: Number,
      default: 0,
    },
    color_hover:{
      type: String,
      default: "#ffffff"
    }
  },
}
</script>
<style scoped>
#divider {
  width: 80%;
  padding-top: 2px;
  margin-top: -15px;
  background-color: v-bind(color);
}
#card:hover {
  background-color: v-bind(color_hover);
  transition: 0.3s;
}
#card {
  border-right: 40px;
  border-style: solid;
  border-image: linear-gradient(to bottom, #0d47a1, #5c6bc0) 1 100%;
}
</style>