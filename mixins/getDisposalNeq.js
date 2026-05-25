export default {
  data() {
    return {
      dataWD: [],
      totalWD: "",
      totalWDcurrent: "",
    };
  },
  methods: {
    async getDisposal() {
      this.$apollo
        .query({
          query: require("~/gql/queries/getDisposal").getDisposalsNeqCount,
          variables: { where: { status: { _neq: 4 } } },
          fetchPolicy: "network-only"
        })
        .then((data) => {
          this.totalWD = data.data.emac_disposals_aggregate.aggregate.count.toString();
        })
        .catch((err) => {
          console.log('err :>> ', err)
        });
    },
    getAllD() {
      const y = new Date().getFullYear();
      this.$apollo
        .query({
          query: require("~/gql/queries/getAllCP").getAllD,
          variables: {
            from: `${y}-01-01T00:00:00.000000+00:00`,
            to: `${y}-12-31T23:59:59.000000+00:00`,
            status: 4,
          },
        })
        .then((data) => {
          this.totalWDcurrent =
            data.data.emac_disposals_aggregate.aggregate.count;
          // console.log("this.totalWDcurrent :>> ", this.totalWDcurrent);
        })
        .catch((err) => {
          console.log("err :>> ", err);
        });
    },
  },
  mounted() {
    this.getDisposal();
    this.getAllD();
  },
};
