export default {
  data() {
    return {
      dataUserWt_active: '',
      dataUserWt_suspended: '',
      dataUserWt_delete: '',
      amountWt: 0,
    }
  },
  methods: {
    getWTUser() {
      this.$apollo
        .query({
          query: require('~/gql/queries/users_management/getWTUsers').getWTUsersGlobalCount,
          fetchPolicy: "network-only"
        })
        .then((data) => {
          this.dataUserWt_active = data.data.active.aggregate.count.toString()
          this.dataUserWt_suspended = data.data.suspended.aggregate.count.toString()
          this.dataUserWt_delete = data.data.deleted.aggregate.count.toString()
          this.amountWt = data.data.total.aggregate.count
        })
    },
  },
  created() {
    this.getWTUser()
  },
}
