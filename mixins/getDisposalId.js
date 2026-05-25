const Swal = require('sweetalert2')

export default {
  data() {
    return {
      dataWD: [],
      cp_dis_ids: [],
    }
  },
  methods: {
    async getDisposal() {
      this.$apollo
        .query({
          query: require('~/gql/queries/getDisposal').getDisposals,
        })
        .then((data) => {
          // console.log('Data :>> ', data.data.emac_transporters)
          this.dataWD = data.data.emac_disposals
          this.cp_dis_ids = this.dataWD.map((item) => {
            return {
              id: item.id,
              name: item.dis_name,
            }
          })
          // console.log('this.cp_dis_ids :>> ', this.cp_dis_ids)

          //   console.log('this.data.length :>> ', this.data.length)
          // console.log('this.checkTypes :>> ', this.checkTypes[0].join(', '));
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
