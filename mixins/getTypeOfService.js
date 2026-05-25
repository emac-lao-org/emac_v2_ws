export default {
  data() {
    return {}
  },
  methods: {
    async getTypeOfServices() {
      await this.$apollo
        .query({
          query: require('~/gql/queries/getTypeofservices').getTypeofservices,
        })
        .then((data) => {
          // console.log('Data :>> ', data.data.emac_transporters)
          this.items = data.data.emac_type_of_services
          // console.log('this.items :>> ', this.items)
        })
        .catch((err) => {
          // console.log('err :>> ', err)
        })
    },

  },
    mounted() {
    this.getTypeOfServices()
  }
}
