export default {
    methods: {
        async getTypeOfDisposalServices() {
            await this.$apollo
                .query({
                    query: require('~/gql/queries/getType_of_disposal_services').getType_of_disposal_services,
                })
                .then((data) => {
                    // console.log('Data :>> ', data.data.emac_transporters)
                    this.tods = data.data.emac_type_of_disposal_services
                    // console.log("🚀 ~ file: getTypeOfDisposalServices.js ~ line 11 ~ .then ~  this.tods",  this.tods)
                })
                .catch((err) => {
                    // console.log('err :>> ', err)
                })
        }
    },
    mounted() {
        this.getTypeOfDisposalServices()
    },
}
