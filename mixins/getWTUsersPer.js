export default {
  data() {
    return {
      dataUserWtPer: [],
      dataUserWtPer_active: '',
      dataUserWtPer_suspended: '',
      dataUserWtPer_delete: '',
      amountWtPer: 0,
    }
  },
  methods: {
    getWTUserPer() {
      this.$apollo
        .query({
          query: require('~/gql/queries/users_management/getWTUsersPer')
            .getWTUsersPer,
          variables: {
            id: this.$route.params.id,
          },
        })
        .then((data) => {
          this.dataUserWtPer = data.data.emac_transporters[0].wt_users

          //   this.status = this.dataUserWtPer.status.toString()

          // console.log('this.data :>> ', this.dataUserWtPer)

          this.dataUserWtPer_active = this.dataUserWtPer.map((item) => {
            return item.verification_status == 1
          })
          

          this.dataUserWtPer_active = this.dataUserWtPer_active.filter(
            (item) => {
              return item == true
            }
          )

          this.dataUserWtPer_suspended = this.dataUserWtPer.map((item) => {
            return item.verification_status == 2
          })
          this.dataUserWtPer_suspended = this.dataUserWtPer_suspended.filter(
            (item) => {
              return item == true
            }
          )

          this.dataUserWtPer_delete = this.dataUserWtPer.map((item) => {
            return item.verification_status == 3
          })
          this.dataUserWtPer_delete = this.dataUserWtPer_delete.filter(
            (item) => {
              return item == true
            }
          )

          this.dataUserWtPer_active =
            this.dataUserWtPer_active.length.toString()
          // console.log(
          //   'this.dataUserWtPer_active :>> ',
          //   this.dataUserWtPer_active
          // )
          this.dataUserWtPer_suspended =
            this.dataUserWtPer_suspended.length.toString()
          // console.log(
          //   'this.dataUserWtPer_suspended :>> ',
          //   this.dataUserWtPer_suspended
          // )
          this.dataUserWtPer_delete =
            this.dataUserWtPer_delete.length.toString()
          // console.log(
          //   'this.dataUserWtPer_delete :>> ',
          //   this.dataUserWtPer_delete
          // )

          this.amountWtPer = this.dataUserWtPer.length
        })
    },
  },
  created() {
    this.getWTUserPer()
  },
}
