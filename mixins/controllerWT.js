
import insertTran from "~/gql/mutations/insert_emac_transporters";
import gql from "graphql-tag";
const Swal = require("sweetalert2");

export default {
  data() {
    return {
      // dialog: false,
      id: "",
      cNameLao: "",
      cNameEng: "",
      eNumber: "",
      email: "",
      emac_id: "",
      village: 10101,
      district: 101,
      province: 1,
      custom_address: "",
      offTel: "",
      latlng: "",
      status: 1,
      level: "",
      data: [],
      provinces: [],
      districts: [],
      villages: [],
      items: [],
      labels: [
        this.$t("enterprise_namelao"),
        this.$t("enterprise_nameeng"),
         this.$t("enterprise_number"),
         this.$t("email"),
        "EMCT ID",
        "Province",
        "District",
        "Village",
        this.$t("custom_address"),
         this.$t("office_telephone"),
        "Latitude and Longitude",
      ],
      selected: "7372727f-c0f0-4bae-81f3-47bad3f1012d",
      statuses: this.$store.state.statuses,
      pr_code: "",
    };
  },
  methods: {
    toggleDialog() {
      this.$store.commit("SET_DIALOG", !this.$store.state.dialog);
    },
    getLatlng(value) {
      this.latlng = value;
      this.latlng = [value[1], value[0]];
      this.latlng = this.latlng.join(",");
      // console.log('this.latlng:P :>> ', this.latlng);
    },
    async insertTran() {
      if (!this.generate_id || !this.emac_id) {
        Swal.fire(
          "error",
          "Please generate a valid EMAC ID before creating WT.",
          "error"
        );
        return;
      }

      await this.$apollo
        .mutate({
          mutation: gql`
            ${insertTran.insert_emac_transporters}
          `,
          variables: {
            email: this.email,
            emac_id: this.emac_id,
            tran_name: this.cNameEng,
            enterprise_no: this.eNumber,
            tran_name_lo: this.cNameLao,
            custom_address: this.custom_address,
            tel: this.offTel.toString(),
            status: 1,
            vill_id: this.village,
            latlng: this.latlng,
            type_id: this.selected,
          },
        })
        .then(() => {
          this.dialog = false;
          Swal.fire("success", "Create Company Success!.", "success").then(
            () => {
              window.location.reload();
            }
          );
        })
        .catch((error) => {
          // console.log(error);
        });
    },
    async getTypeOfServices() {
      await this.$apollo
        .query({
          query: require("~/gql/queries/getTypeofservices").getTypeofservices,
        })
        .then((data) => {
          // console.log('Data :>> ', data.data.emac_transporters)
          this.items = data.data.emac_type_of_services;
          // console.log('this.items :>> ', this.items)
        })
        .catch((err) => {
          // console.log("err :>> ", err);
        });
    },
    async getProvince() {
      for (let i = 0; i < 1; i++) {
        await this.$apollo
          .query({
            query: require("~/gql/queries/getProvince").getProvince,
          })
          .then((data) => {
            this.provinces = data.data.emac_provinces;
            // console.log('this.emac_provinces :>> ', this.provinces)
            this.getPrCode();
          })
          .catch((err) => {
            // console.log("err :>> ", err);
          });
      }
    },
    async getDistricts() {
      if (
        this.province === "" ||
        this.province === null ||
        this.province === undefined
      ) {
        this.districts = [];
        return;
      }

      await this.$apollo
        .query({
          query: require("~/gql/queries/getDistrict").getDistricts,
          variables: {
            pr_id: this.province,
          },
        })
        .then((data) => {
          this.districts = data.data.emac_provinces?.[0]?.districts || [];
          //   console.log('this.districts :>> ', this.districts)
          this.getPrCode();
        })
        .catch((err) => {
          // console.log("err :>> ", err);
        });
    },
    async getVillages() {
      if (
        this.district === "" ||
        this.district === null ||
        this.district === undefined
      ) {
        this.villages = [];
        return;
      }

      await this.$apollo
        .query({
          query: require("~/gql/queries/getVillages").getVillages,
          variables: {
            dr_id: this.district,
          },
        })
        .then((data) => {
          this.villages = data.data.emac_districts?.[0]?.villages || [];
          //   console.log('this.districts :>> ', this.villages)
        })
        .catch((err) => {
          // console.log("err :>> ", err);
        });
    },
    async getPrCode() {
      if (
        this.province === "" ||
        this.province === null ||
        this.province === undefined
      ) {
        this.pr_code = "";
        return;
      }

      for (let i = 0; i < 1; i++) {
        await this.$apollo
          .query({
            query: require("~/gql/queries/getProvince").getPr_code,
            variables: {
              id: this.province,
            },
          })
          .then((data) => {
            this.pr_code = data.data.emac_provinces?.[0]?.pr_code || "";
            // console.log(
            //   "🚀 ~ file: controllerWT.js ~ line 158 ~ .then ~ this.pr_code",
            //   this.pr_code
            // );
            // this.getProvince()

            // console.log("÷this.emac_provinces :>> ", this.provinces);
          });
      }
    },
  },
  computed: {
    dialog: {
      get() {
        return this.$store.state.dialog;
      },
      set(newVal) {
        this.$store.commit("SET_DIALOG", newVal);
      },
    },
  },
  mounted() {
    this.getTypeOfServices(),
      this.getProvince(),
      this.getDistricts(),
      this.getVillages();
  },
};
