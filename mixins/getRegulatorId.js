export default {
    data() {
      return {
        dataWR: [],
        cp_regulator_ids: [],
      }
    },
    methods: {
      async getRegulator() {
        this.$apollo
          .query({
            query: require('~/gql/queries/getRegulator').getRegulator,
          })
          .then((data) => {
            // console.log('Data :>> ', data.data.emac_transporters)
            this.dataWR = data.data.emac_regulators
            this.cp_regulator_ids = this.dataWR.map((item) => {
                return {
                    id: item.id,
                    name: item.regulator_name,
                }
              })
              // console.log('this.cp_regulator_ids :>> ', this.cp_regulator_ids)
  
            //   console.log('this.data.length :>> ', this.data.length)
            // console.log('this.checkTypes :>> ', this.checkTypes[0].join(', '));
          })
          .catch((err) => {
            // console.log('err :>> ', err)
          })
      },
    },
    created() {
      this.getRegulator()
    },
  }
  