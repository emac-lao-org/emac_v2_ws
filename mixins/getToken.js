export default {
  data() {
    return {
      token: '',
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
    // this.getToken()
  },
}
