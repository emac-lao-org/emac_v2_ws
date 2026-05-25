export default {
  data() {
    return {
      pr_code: '',
    }
  },
  methods: {
    async getProvince() {
      await this.$apollo
        .query({
          query: require('~/gql/queries/getProvince').getProvince,
        })
        .then((data) => {
          this.provinces = data.data.emac_provinces
            // console.log('this.emac_provinces :>> ', this.provinces)
          this.pr_code = this.provinces[0].pr_code
          // console.log("🚀 ~ file: getAddress.js ~ line 17 ~ .then ~ this.pr_code", this.pr_code)
        })
        .catch((err) => {
          // console.log('err :>> ', err)
        })
    },
    async getDistricts() {
      if (
        this.province_id === '' ||
        this.province_id === null ||
        this.province_id === undefined
      ) {
        this.districts = []
        return
      }

      await this.$apollo
        .query({
          query: require('~/gql/queries/getDistrict').getDistricts,
          variables: {
            pr_id: this.province_id,
          },
        })
        .then((data) => {
          this.districts = data.data.emac_provinces?.[0]?.districts || []
          //   console.log('this.districts :>> ', this.districts)
        })
        .catch((err) => {
          // console.log('err :>> ', err)
        })
    },
    async getVillages() {
      if (
        this.district_id === '' ||
        this.district_id === null ||
        this.district_id === undefined
      ) {
        this.villages = []
        return
      }

      await this.$apollo
        .query({
          query: require('~/gql/queries/getVillages').getVillages,
          variables: {
            dr_id: this.district_id,
          },
        })
        .then((data) => {
          this.villages = data.data.emac_districts?.[0]?.villages || []
          //   console.log('this.districts :>> ', this.villages)
        })
        .catch((err) => {
          // console.log('err :>> ', err)
        })
    },
  },
  mounted() {
    this.getProvince(), this.getDistricts(), this.getVillages()
  },
}
