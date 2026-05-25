<template>
  <v-app>
    <v-main id="bg">
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
};
</script>
<style scoped>
#bg{
  background-image: url('~/assets/image/bg.png') ;
  background-repeat: no-repeat;
  background-size: cover;

}
</style>