<template>
  <div class="ma-4">
    <title-page :title="title" :width="width" />
    <tabheaderapprove />
  </div>
</template>

<script>
import tabheaderapprove from '@/components/manifest/tabHeaderApprove.vue'
import TitlePage from '~/components/titlePage.vue'
export default {
  components: { TitlePage, tabheaderapprove },
  data() {
    return {
      // title: 'Manifest Approval',
      width: '35%',
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
  computed:{
    title(){
      return this.$t('manifest_approval')
    }
  }
}
</script>

<style>
</style>