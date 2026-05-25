export default {
  data() {
    return {
      dataUserWr_active: '',
      dataUserWr_suspended: '',
      dataUserWr_delete: '',
      amountWr: 0,
    }
  },
  methods: {
    getWRUser() {
      this.$apollo
        .query({
          query: require('~/gql/queries/users_management/getWRUsers').getWRUsersGlobalCount,
          fetchPolicy: "network-only"
        })
        .then((data) => {
          this.dataUserWr_active = data.data.active.aggregate.count.toString()
          this.dataUserWr_suspended = data.data.suspended.aggregate.count.toString()
          this.dataUserWr_delete = data.data.deleted.aggregate.count.toString()
          this.amountWr = data.data.total.aggregate.count
        })
    },
  },
  created() {
    this.getWRUser()
  },
}
