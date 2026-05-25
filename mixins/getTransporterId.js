export default {
    data() {
      return {
        dataWT: [],
        cp_tran_ids: "",
      }
    },
    methods: {
      async getTransporters() {
        this.$apollo
          .query({
            query: require('~/gql/queries/getTransporter').getTransporters,
          })
          .then((data) => {
            // console.log('Data :>> ', data.data.emac_transporters)
            this.dataWT = data.data.emac_transporters
            this.cp_tran_ids = this.dataWT.map((item) => {
                return {
                    id: item.id,
                    name: item.tran_name,
                }
              })
              // console.log('this.cp_tran_ids :>> ', this.cp_tran_ids)
            
          //   console.log('this.data.length :>> ', this.data.length)
            // console.log('this.checkTypes :>> ', this.checkTypes[0].join(', '));
          })
          .catch((err) => {
            // console.log('err :>> ', err)
          })
      },
    },
    created() {
      this.getTransporters()
    },
  }
  