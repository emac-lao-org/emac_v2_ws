export default {
  data() {
    return {
      dataWG: [],
      cp_gen_ids: [],
    }
  },
  methods: {
    getGenerator() {
      this.$apollo
        .query({
          query: require('~/gql/queries/getGenerator').getGenerator,
        })
        .then((data) => {
          this.dataWG = data.data.emac_generators

          this.cp_gen_ids = this.dataWG.map((item) => {
            return {
              id: item.id,
              name: item.gen_name,
            }
          })

          // console.log('this.cp_gen_ids :>> ', this.cp_gen_ids)

          // console.log('this.indusType :>> ', this.indusType)

          // console.log('this.data :>> ', this.data)
        })
        .catch((err) => {
          // console.log('err :>> ', err)
        })
    },
  },
  created() {
    this.getGenerator()
  },
}
