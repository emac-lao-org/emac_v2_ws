<template>
  <v-progress-circular
    class="centered"
    :size="100"
    :width="10"
    color="primary"
    indeterminate
  ></v-progress-circular>
</template>

<script>
export default {}
</script>

<style scoped>
.centered {
  position: fixed;
  top: 50%;
  left: 50%;
  /* bring your own prefixes */
  transform: translate(-50%, -50%);
}
</style>