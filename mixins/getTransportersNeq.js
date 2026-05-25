export default {
  data() {
    return {
      dataWT: [],
      totalWT: "",
      totalWTCurrent: "",

    }
  },
  methods: {
    async getTransporters() {
      this.$apollo
        .query({
          query: require('~/gql/queries/getTransporter').getTransportersNeqCount,
          variables: { where: { status: { _neq: 4 } } },
          fetchPolicy: "network-only"
        })
        .then((data) => {
          this.totalWT = data.data.emac_transporters_aggregate.aggregate.count.toString()
        })
        .catch((err) => {
          console.error(err);
        })
    },
    getAllT() {
      const y = new Date().getFullYear();
      this.$apollo
        .query({
          query: require("~/gql/queries/getAllCP").getAllT,
          variables: {
            from: `${y}-01-01T00:00:00.000000+00:00`,
            to: `${y}-12-31T23:59:59.000000+00:00`,
            status: 4,
          },
        })
        .then((data) => {
          this.totalWTCurrent =
            data.data.emac_transporters_aggregate.aggregate.count;
          // console.log("this.totalWTCurrent :>> ", this.totalWTCurrent);
        })
        .catch((err) => {
          console.log("err :>> ", err);
        });
    },
  },
  mounted() {
    this.getTransporters()
    this.getAllT()
  },
}
