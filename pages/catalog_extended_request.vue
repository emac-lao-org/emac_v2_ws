<template>
  <div>
    <requestQuota />
    <v-divider class="mx-4 my-6"></v-divider>
    <requestTime />
  </div>
</template>

<script>
import requestQuota from '~/components/waste_catalog/request/request_quota.vue'
import requestTime from '~/components/waste_catalog/request/request_time.vue'
export default {
  components: { requestQuota, requestTime },

}
</script>

<style>

</style>