export default {
  data() {
    return {
      dataUserWg_active: '',
      dataUserWg_suspended: '',
      dataUserWg_delete: '',
      amountWg: 0,
    }
  },
  methods: {
    getWGUser() {
      this.$apollo
        .query({
          query: require('~/gql/queries/users_management/getWGUsers').getWGUsersGlobalCount,
          fetchPolicy: "network-only"
        })
        .then((data) => {
          this.dataUserWg_active = data.data.active.aggregate.count.toString()
          this.dataUserWg_suspended = data.data.suspended.aggregate.count.toString()
          this.dataUserWg_delete = data.data.deleted.aggregate.count.toString()
          this.amountWg = data.data.total.aggregate.count
        })
    },
  },
  created() {
    this.getWGUser()
  },
}
