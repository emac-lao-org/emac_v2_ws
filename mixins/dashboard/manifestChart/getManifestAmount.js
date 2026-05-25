export default {
  data() {
    return {
      draftAmount: [],
      RequestedAmount: [],
      readyAmount: [],
      processAmount: [],
      completedAmount: [],
      certifieldAmount: [],
      rejectedAmount: [],
      expiredAmount: [],
    };
  },
  methods: {
    getManifestDraft() {
      this.$apollo
        .query({
          query: require("~/gql/queries/dashboard/all/manifestChartAll.gql")
            .manifestChartAllDraft,
          variables: {
            from: this.from,
            to: this.to,
          },
        })
        .then((res) => {
          this.draftAmount = res.data.emac_manifests_aggregate.aggregate.count;
          this.data[0].amount = this.draftAmount;
        });
    },
    getManifestRequested() {
      this.$apollo
        .query({
          query: require("~/gql/queries/dashboard/all/manifestChartAll.gql")
            .manifestChartAllRequested,
          variables: {
            from: this.from,
            to: this.to,
          },
        })
        .then((res) => {
          this.RequestedAmount =
            res.data.emac_manifests_aggregate.aggregate.count;
          this.data[1].amount = this.RequestedAmount;
        });
    },
    getManifestReady() {
      this.$apollo
        .query({
          query: require("~/gql/queries/dashboard/all/manifestChartAll.gql")
            .manifestChartAllReady,
          variables: {
            from: this.from,
            to: this.to,
          },
        })
        .then((res) => {
          this.readyAmount = res.data.emac_manifests_aggregate.aggregate.count;
          this.data[2].amount = this.readyAmount;
        });
    },
    getManifestProcess() {
      this.$apollo
        .query({
          query: require("~/gql/queries/dashboard/all/manifestChartAll.gql")
            .manifestChartAllProcess,
          variables: {
            from: this.from,
            to: this.to,
          },
        })
        .then((res) => {
          this.processAmount =
            res.data.emac_manifests_aggregate.aggregate.count;
          this.data[3].amount = this.processAmount;
        });
    },
    getManifestCompleted() {
      this.$apollo
        .query({
          query: require("~/gql/queries/dashboard/all/manifestChartAll.gql")
            .manifestChartAllCompleted,
          variables: {
            from: this.from,
            to: this.to,
          },
        })
        .then((res) => {
          this.completedAmount =
            res.data.emac_manifests_aggregate.aggregate.count;
          this.data[4].amount = this.completedAmount;
        });
    },
    getManifestCertifield() {
      this.$apollo
        .query({
          query: require("~/gql/queries/dashboard/all/manifestChartAll.gql")
            .manifestChartAllCertifield,
          variables: {
            from: this.from,
            to: this.to,
          },
        })
        .then((res) => {
          this.certifieldAmount =
            res.data.emac_manifests_aggregate.aggregate.count;
          this.data[5].amount = this.certifieldAmount;
        });
    },
    getManifestRejected() {
      this.$apollo
        .query({
          query: require("~/gql/queries/dashboard/all/manifestChartAll.gql")
            .manifestChartAllRejected,
          variables: {
            from: this.from,
            to: this.to,
          },
        })
        .then((res) => {
          this.rejectedAmount =
            res.data.emac_manifests_aggregate.aggregate.count;
          this.data[6].amount = this.rejectedAmount;
        });
    },
    getManifestExpired() {
      this.$apollo
        .query({
          query: require("~/gql/queries/dashboard/all/manifestChartAll.gql")
            .manifestChartAllExpired,
          variables: {
            from: this.from,
            to: this.to,
          },
        })
        .then((res) => {
          this.expiredAmount =
            res.data.emac_manifests_aggregate.aggregate.count;
          this.data[7].amount = this.expiredAmount;
        });
    },
  },
  created() {
    this.getManifestDraft();
    this.getManifestRequested();
    this.getManifestReady();
    this.getManifestProcess();
    this.getManifestCompleted();
    this.getManifestCertifield();
    this.getManifestRejected();
    this.getManifestExpired();
  },
};
