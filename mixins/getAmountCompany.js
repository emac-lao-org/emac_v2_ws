export default {
  data() {
    return {
      amount: 0,
      wt: 0,
      wd: 0,
      wg: 0,
      wr: 0,
    }
  },
  methods: {
    async amountCompany() {
      await this.$apollo
        .query({
          query: require('~/gql/queries/amountCompany').amount,
        })
        .then((t) => {
          this.wt = t.data.emac_transporters.length
          // console.log("🚀 ~ file: getAmountCompany.js ~ line 19 ~ .then ~ this.wt", this.wt)
          
          this.wd = t.data.emac_disposals.length
          this.wg = t.data.emac_generators.length
          this.wr = t.data.emac_regulators.length
          this.amount = this.wt + this.wd + this.wg + this.wr
          // console.log('this.amount :>> ', this.amount)
        })
    },
  },
  created() {
    this.amountCompany()
  },
}
