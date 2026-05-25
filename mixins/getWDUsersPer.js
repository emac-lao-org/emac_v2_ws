export default {
  data() {
    return {
      dataUserWdPer: [],
      dataUserWdPer_active: '',
      dataUserWdPer_suspended: '',
      dataUserWdPer_delete: '',
      amountWdPer: 0,
    }
  },
  methods: {
    getWDUserPer() {
      this.$apollo
        .query({
          query: require('~/gql/queries/users_management/getWDUsersPer')
            .getWDUsersPer,
          variables: {
            id: this.$route.params.id,
          },
        })
        .then((data) => {
          this.dataUserWdPer = data.data.emac_disposals[0].wd_users

          //   this.status = this.dataUserWdPer.status.toString()

          // console.log('this.data :>> ', this.dataUserWdPer)

          this.dataUserWdPer_active = this.dataUserWdPer.map((item) => {
            return item.verification_status == 1
          })
          

          this.dataUserWdPer_active = this.dataUserWdPer_active.filter(
            (item) => {
              return item == true
            }
          )

          this.dataUserWdPer_suspended = this.dataUserWdPer.map((item) => {
            return item.verification_status == 2
          })
          this.dataUserWdPer_suspended = this.dataUserWdPer_suspended.filter(
            (item) => {
              return item == true
            }
          )

          this.dataUserWdPer_delete = this.dataUserWdPer.map((item) => {
            return item.verification_status == 3
          })
          this.dataUserWdPer_delete = this.dataUserWdPer_delete.filter(
            (item) => {
              return item == true
            }
          )

          this.dataUserWdPer_active =
            this.dataUserWdPer_active.length.toString()
          // console.log(
          //   'this.dataUserWdPer_active :>> ',
          //   this.dataUserWdPer_active
          // )
          this.dataUserWdPer_suspended =
            this.dataUserWdPer_suspended.length.toString()
          // console.log(
          //   'this.dataUserWdPer_suspended :>> ',
          //   this.dataUserWdPer_suspended
          // )
          this.dataUserWdPer_delete =
            this.dataUserWdPer_delete.length.toString()
          // console.log(
          //   'this.dataUserWdPer_delete :>> ',
          //   this.dataUserWdPer_delete
          // )

          this.amountWdPer = this.dataUserWdPer.length
        })
    },
  },
  created() {
    this.getWDUserPer()
  },
}
