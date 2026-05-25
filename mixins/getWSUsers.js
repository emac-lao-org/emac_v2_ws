export default {
  data() {
    return {
      dataUserWs_active: "",
      dataUserWs_suspended: "",
      dataUserWs_delete: "",
      amountWs: 0,
    };
  },
  methods: {
    getWSUser() {
      this.$apollo
        .query({
          query: require("~/gql/queries/users_management/getWSUsers").getWSUsersGlobalCount,
          fetchPolicy: "network-only"
        })
        .then((data) => {
          this.dataUserWs_active = data.data.active.aggregate.count.toString()
          this.dataUserWs_suspended = data.data.suspended.aggregate.count.toString()
          this.dataUserWs_delete = data.data.deleted.aggregate.count.toString()
          this.amountWs = data.data.total.aggregate.count
        });
    },
  },
  created() {
    this.getWSUser();
  },
};
