export default {
  methods: {
    async getCustomAddress() {
      this.$apollo
        .query({
          query: require('~/gql/queries/manifest/getCustomAddress')
            .getCustomAddress,
          variables: {
            id: this.vill_id,
          },
        })
        .then((data) => {
          // console.log('Data :>> ', data.data.emac_transporters)
          this.address = data.data.emac_villages[0]
          // console.log('this.address :>> ', this.address)
        })
        .catch((err) => {
          // console.log('err :>> ', err)
        })
    },
  },
  mounted() {
    // console.log('this.vill_id :>> ', this.vill_id);
  },
}
