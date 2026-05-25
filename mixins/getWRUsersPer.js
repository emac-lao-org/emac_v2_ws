export default {
  data() {
    return {
      dataUserWrPer: [],
      dataUserWrPer_active: '',
      dataUserWrPer_suspended: '',
      dataUserWrPer_delete: '',
      amountWrPer: 0,
    }
  },
  methods: {
    getWRUserPer() {
      this.$apollo
        .query({
          query: require('~/gql/queries/users_management/getWRUsersPer')
            .getWRUsersPer,
          variables: {
            id: this.$route.params.id,
          },
        })
        .then((data) => {
          this.dataUserWrPer = data.data.emac_regulators[0].wr_users

          //   this.status = this.dataUserWrPer.status.toString()

          console.log('this.data :>> ', this.dataUserWrPer)

          this.dataUserWrPer_active = this.dataUserWrPer.map((item) => {
            return item.verification_status == 1
          })
          

          this.dataUserWrPer_active = this.dataUserWrPer_active.filter(
            (item) => {
              return item == true
            }
          )

          this.dataUserWrPer_suspended = this.dataUserWrPer.map((item) => {
            return item.verification_status == 2
          })
          this.dataUserWrPer_suspended = this.dataUserWrPer_suspended.filter(
            (item) => {
              return item == true
            }
          )

          this.dataUserWrPer_delete = this.dataUserWrPer.map((item) => {
            return item.verification_status == 3
          })
          this.dataUserWrPer_delete = this.dataUserWrPer_delete.filter(
            (item) => {
              return item == true
            }
          )

          this.dataUserWrPer_active =
            this.dataUserWrPer_active.length.toString()
          // console.log(
          //   'this.dataUserWrPer_active :>> ',
          //   this.dataUserWrPer_active
          // )
          this.dataUserWrPer_suspended =
            this.dataUserWrPer_suspended.length.toString()
          // console.log(
          //   'this.dataUserWrPer_suspended :>> ',
          //   this.dataUserWrPer_suspended
          // )
          this.dataUserWrPer_delete =
            this.dataUserWrPer_delete.length.toString()
          // console.log(
          //   'this.dataUserWrPer_delete :>> ',
          //   this.dataUserWrPer_delete
          // )

          this.amountWrPer = this.dataUserWrPer.length
        })
    },
  },
  created() {
    this.getWRUserPer()
  },
}
