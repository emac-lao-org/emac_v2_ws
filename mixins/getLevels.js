export default {
  data() {
    return {
      levels: [],
      levels_opt: [],
    };
  },

  methods: {
    async getLevels() {
      this.$apollo
        .query({
          fetchPolicy: "no-cache",
          query: require("~/gql/queries/getLevels").getLevels,
        })
        .then((data) => {
          // console.log('Data :>> ', data.data.emac_transporters)
          this.levels = data.data.emac_levels;
          // console.log("🚀 ~ file: getLevels.js ~ line 18 ~ .then ~  this.levels",  this.levels)
          this.items_filter_level = this.levels;
          this.items_filter_level.forEach((item) => {
            item.level_name_fill = item.level_name_lo;
          });
          this.items_filter_level.unshift({
            level_name_fill: "All",
            level_name_lo: null,
          });

          // console.log(
          //   "🚀 ~ file: getLevels.js ~ line 19 ~ .then ~   this.items_filter_level",
          //   this.items_filter_level
          // );
          // this.items_filter_level[this.items_filter_level.length] = {
          //   level_name_lo: "All",
          //   level_name: null,
          // };

          // console.log("🚀 ~ file: getLevels.js ~ line 19 ~ .then ~ this.items_filter_level", this.items_filter_level)
        })
        .catch((err) => {
          // console.log("err :>> ", err);
        });
    },
    async getLevels_opt() {
      this.$apollo
        .query({
          fetchPolicy: "no-cache",
          query: require("~/gql/queries/getLevels").getOrganize,
          variables: {
            id: this.level_id,
          },
        })
        .then((data) => {
          // console.log('Data :>> ', data.data.emac_transporters)
          this.levels_opt = [];
          this.levels_opt = data.data.emac_level_operations;
          // console.log("this.levels_opt :>> ", this.levels_opt);
        })
        .catch((err) => {
          // console.log("err :>> ", err);
        });
    },
    async getLevels_opt_all() {
      this.$apollo
        .query({
          fetchPolicy: "no-cache",
          query: require("~/gql/queries/getLevelOpt").getLevelOptAll,
        })
        .then((data) => {
          // console.log('Data :>> ', data.data.emac_transporters)
          this.items_filter_levelOpt = data.data.emac_level_operations;
          this.items_filter_levelOpt.unshift({
            level_name_lo: "All",
            level_name: null,
          });
          // console.log(
          //   "🚀 ~ file: getLevels.js ~ line 53 ~ .then ~ this.items_filter_levelOpt",
          //   this.items_filter_levelOpt
          // );
        })
        .catch((err) => {
          // console.log("err :>> ", err);
        });
    },
  },
  mounted() {
    this.getLevels(), this.getLevels_opt_all();
    
  },
};
