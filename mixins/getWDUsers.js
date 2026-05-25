export default {
  data() {
    return {
      dataUserWd_active: '',
      dataUserWd_suspended: '',
      dataUserWd_delete: '',
      amountWd: 0,
    }
  },
  methods: {
    getWDUser() {
      this.$apollo
        .query({
          query: require('~/gql/queries/users_management/getWDUsers').getWDUsersGlobalCount,
          fetchPolicy: "network-only"
        })
        .then((data) => {
          this.dataUserWd_active = data.data.active.aggregate.count.toString()
          this.dataUserWd_suspended = data.data.suspended.aggregate.count.toString()
          this.dataUserWd_delete = data.data.deleted.aggregate.count.toString()
          this.amountWd = data.data.total.aggregate.count
        })
    },
  },
  created() {
    this.getWDUser()
  },
}
