export default {
  data() {
    return {
      dataUserWgPer: [],
      dataUserWgPer_active: '',
      dataUserWgPer_suspended: '',
      dataUserWgPer_delete: '',
      amountWgPer: 0,
    }
  },
  methods: {
    getWGUserPer() {
      this.$apollo
        .query({
          query: require('~/gql/queries/users_management/getWGUsersPer')
            .getWGUsersPer,
          variables: {
            id: this.$route.params.id,
          },
        })
        .then((data) => {
          this.dataUserWgPer = data.data.emac_generators[0].wg_users
console.log('this.dataUserWgPer :>> ', this.dataUserWgPer);
          //   this.status = this.dataUserWgPer.status.toString()

          //   console.log('this.data :>> ', this.dataUserWgPer)

          this.dataUserWgPer_active = this.dataUserWgPer.map((item) => {
            return item.verification_status == 1
          })
          this.dataUserWgPer_active = this.dataUserWgPer_active.filter(
            (item) => {
              return item == true
            }
          )

          this.dataUserWgPer_suspended = this.dataUserWgPer.map((item) => {
            return item.verification_status == 2
          })
          this.dataUserWgPer_suspended = this.dataUserWgPer_suspended.filter(
            (item) => {
              return item == true
            }
          )

          this.dataUserWgPer_delete = this.dataUserWgPer.map((item) => {
            return item.verification_status == 3
          })
          this.dataUserWgPer_delete = this.dataUserWgPer_delete.filter(
            (item) => {
              return item == true
            }
          )

          this.dataUserWgPer_active =
            this.dataUserWgPer_active.length.toString()
          // console.log(
          //   'this.dataUserWgPer_active :>> ',
          //   this.dataUserWgPer_active
          // )
          this.dataUserWgPer_suspended =
            this.dataUserWgPer_suspended.length.toString()
          // console.log(
          //   'this.dataUserWgPer_suspended :>> ',
          //   this.dataUserWgPer_suspended
          // )
          this.dataUserWgPer_delete =
            this.dataUserWgPer_delete.length.toString()
          // console.log(
          //   'this.dataUserWgPer_delete :>> ',
          //   this.dataUserWgPer_delete
          // )

          this.amountWgPer = this.dataUserWgPer.length
        })
    },
  },
  created() {
    this.getWGUserPer()
  },
}
