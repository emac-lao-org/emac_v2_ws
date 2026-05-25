export default {
  data() {
    return {
      data: [],
      loading: false,
      totalQuota: 0,
      amountWasteAll: 0,
      amountWasteActive: 0,
      amountWasteSuspended: 0,
      amountWasteDeleted: 0,
      amountWasteExpired: 0,
      amountWasteRejected: 0,
    }
  },
  methods: {
    async getWasteCat() {
      this.loading = true
      this.$apollo
        .query({
          query: require('~/gql/queries/waste_catalog/getWasteCatalog')
            .getWasteCatalog,
        })
        .then((data) => {
          this.data = data.data.emac_catalogs
          // console.log(
          //   '🚀 ~ file: tableWatesCatalog.vue ~ line 213 ~ getWasteCat ~ this.data',
          //   this.data
          // )
          this.amountWasteAll = this.data.length

          this.amountWasteActive = this.data
            .filter((item) => item.status === 1)
            .length.toString()
          //   console.log("🚀 ~ file: getWasteCat.js ~ line 31 ~ getWasteCat ~ this.amountWasteActive", this.amountWasteActive)

          this.amountWasteSuspended = this.data
            .filter((item) => item.status === 2)
            .length.toString()

          this.amountWasteExpired = this.data
            .filter((item) => item.status === 3)
            .length.toString()

          this.amountWasteDeleted = this.data
            .filter((item) => item.status === 4)
            .length.toString()
          //   console.log("🚀 ~ file: getWasteCat.js ~ line 36 ~ getWasteCat ~ this.amountWasteSuspended", this.amountWasteSuspended)

          this.amountWasteRejected = this.data
            .filter((item) => item.status === 5)
            .length.toString()
          //   console.log('typeof(this.amountWasteDeleted) :>> ', typeof(this.amountWasteDeleted));
          //   console.log("🚀 ~ file: getWasteCat.js ~ line 41 ~ getWasteCat ~ this.amountWasteDeleted", this.amountWasteDeleted)

          this.totalQuota = this.data.map(
            (item) => item.catalog_operations_aggregate.aggregate.sum
          )
          this.totalQuota = this.totalQuota.map((item) => item.quota_amount)

          for (let i = 0; i < this.data.length; i++) {
            this.data[i].totalQuota = this.totalQuota[i]
          }
          this.loading = false
        })
        .catch((err) => {
          // console.log('err :>> ', err);
          // window.location.reload()
        })
    },
  },
  mounted() {
    this.getWasteCat()
  },
}
