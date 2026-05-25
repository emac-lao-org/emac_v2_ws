<template>
  <div class="ma-4">
    <title-page :title="title" :width="width" />
    <tab-header page="Tracking" />
  </div>
</template>

<script>
import TabHeader from '~/components/manifest/tabHeader.vue'
import TitlePage from '~/components/titlePage.vue'
export default {
  components: { TitlePage, TabHeader },
  data() {
    return {
      width: '35%',
    }
  },
  computed:{
    title(){
      return this.$t('manifest_tracking')
    }
  },
  methods: {
        async getToken() {
      const result = await $nuxt.$fire.auth.currentUser
        .getIdTokenResult()
        .catch((err) => console.log(err))
      this.token = result.token
      // console.log('this.token :>> ', this.token);
      localStorage.setItem('token', this.token)
      document.cookie = 'token=' + this.token
      // await window.location.reload()
    },
  },
  created() {
    this.getToken()
  },
}
</script>

<style>
</style>