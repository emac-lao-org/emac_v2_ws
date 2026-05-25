export default {
    methods: {
      async getDisposal() {
        this.$apollo
          .query({
            query: require('~/gql/queries/getDisposal').getDisposals,
            vaiables: {
                id: this.$route.params.id,
            }
          })
          .then((data) => {
            // console.log('Data :>> ', data.data.emac_transporters)
            this.data = data.data.emac_disposals
            // console.log('this.data :>> ', this.data)
          })
          .catch((err) => {
            // console.log('err :>> ', err)
          })
      },
    },
    mounted() {
      this.getDisposal()
    },
  }
  