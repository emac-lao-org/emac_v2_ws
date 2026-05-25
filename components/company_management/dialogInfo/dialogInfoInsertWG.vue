<template>
  <v-form v-model="valid">
    <v-row>
      <v-col cols="7">
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="gen_name_lo"
              outlined
              :rules="[
                (v) => !!v || 'Name is required',
                (v) => v.length <= 100 || 'Name must be less than 50 characters',
              ]"
              :label="labelsWG[0]"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="gen_name"
              outlined
              :rules="[
                (v) => !!v || 'Name is required',
                (v) => v.length <= 100 || 'Name must be less than 50 characters',
              ]"
              :label="labelsWG[1]"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="enterprise_no"
              outlined
              :rules="[
                (v) => !!v || 'Enterprise no is required',
                (v) =>
                  v.length <= 10 ||
                  'Enterprise no must be less than 10 characters',
              ]"
              :label="labelsWG[2]"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="emac_id"
              outlined
              disabled
              :rules="[(v) => !!v || 'EMAC ID is required']"
              :label="labelsWG[3]"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="email"
              outlined
              :rules="[
                (v) => !!v || 'Email is required',
                (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
              ]"
              :label="labelsWG[4]"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-select
              v-model="level_id"
              outlined
              item-text="level_name"
              item-value="id"
              :items="levels"
              :rules="[(v) => !!v || 'Level is required']"
              label="Organization Level"
              @click="getSpecialPr"
              required
            ></v-select>
          </v-col>

          <v-col
            v-if="this.level_id !== 'c2467ae0-bb2f-485e-b9d6-7d87228b6392'"
            cols="4"
            @change="province = []"
          >
            <v-select
              v-model="province"
              outlined
              item-text="pr_name_lo"
              item-value="pr_id"
              :items="provincesSpecial"
              label="Special Zone"
              :rules="[(v) => !!v || 'Special zone is required']"
              @click="getPrCode"
              @change="vill_id_for_spz"
              required
            ></v-select>
          </v-col>

          <v-col
            v-if="this.level_id == 'c2467ae0-bb2f-485e-b9d6-7d87228b6392'"
            cols="4"
          >
            <v-select
              v-model="province"
              outlined
              item-text="pr_name_lo"
              item-value="pr_id"
              :items="provinces"
              :rules="[(v) => !!v || 'Province is required']"
              :label="labelsWG[5]"
              @change="(districts = []), (villages = [])"
              @click="getPrCode"
              required
            ></v-select>
          </v-col>

          <v-col
            v-if="this.level_id == 'c2467ae0-bb2f-485e-b9d6-7d87228b6392'"
            cols="4"
          >
            <v-select
              v-model="district"
              outlined
              item-text="dr_name_lo"
              item-value="dr_id"
              :items="districts"
              :rules="[(v) => !!v || 'District is required']"
              :label="labelsWG[6]"
              @change="villages = []"
              required
              @click="getDistricts"
            ></v-select>
          </v-col>
          <v-col
            v-if="this.level_id == 'c2467ae0-bb2f-485e-b9d6-7d87228b6392'"
            cols="4"
          >
            <v-select
              v-model="village"
              outlined
              item-text="vill_name_lo"
              item-value="vill_id"
              :items="villages"
              :rules="[(v) => !!v || 'Village is required']"
              :label="labelsWG[7]"
              required
              @click="getVillages"
            ></v-select>
          </v-col>

          <v-col
            v-if="this.level_id == 'c2467ae0-bb2f-485e-b9d6-7d87228b6392'"
            cols="4"
          >
            <v-text-field
              v-model="custom_address"
              outlined
              :rules="[
                (v) => !!v || 'Address is required',
                (v) =>
                  v.length <= 100 || 'Address must be less than 100 characters',
              ]"
              :label="labelsWG[8]"
              required
              @click="getPrCode"
            ></v-text-field>
          </v-col>
          <v-col
            v-if="this.level_id != 'c2467ae0-bb2f-485e-b9d6-7d87228b6392'"
            cols="4"
          >
            <v-text-field
              v-model="custom_address"
              outlined
              :rules="[
                (v) => !!v || 'Address is required',
                (v) =>
                  v.length <= 100 || 'Address must be less than 100 characters',
              ]"
              :label="labelsWG[8]"
              required
              @click="getPrCode"
              @change="vill_id_for_spz"
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="tel"
              outlined
              :rules="[
                (v) =>
                  parseInt(v) == v || 'The phone must be an number',
                (v) =>
                  (String(v).length >= 8 && String(v).length <= 12) ||
                  'The phone must be 8 to 12 digits',
                (v) =>
                  v.toString().startsWith('0') || 'The phone must start with 0',
                (v) => !!v || 'The phone is required',
              ]"
              :label="labelsWG[9]"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-select
              v-model="type"
              outlined
              item-text="type_name"
              item-value="id"
              :items="types"
              :rules="[(v) => !!v || 'Type is required']"
              :label="labelsWG[10]"
              required
            ></v-select>
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="description"
              outlined
              :rules="[
                (v) => !!v || 'Description is required',
                (v) =>
                  v.length <= 100 ||
                  'Description must be less than 100 characters',
              ]"
              :label="labelsWG[11]"
            ></v-textarea>
          </v-col> </v-row
      ></v-col>
      <v-col>
        <mapbox-marker @latlng="getLatlng" />
      </v-col>
    </v-row>
    <v-card-actions class="mx-4">
      <!-- {{valid}}   {{ checkValid }} -->
      <v-spacer></v-spacer>
      <v-btn color="primary" :disabled="checkValidGen" @click="testGenID"
        >Generate ID</v-btn
      >
      <v-btn @click="toggleDialog" outlined color="primary" class="mx-4 my-4">
        {{ text_btn_cancel }}
      </v-btn>
      <v-btn @click="insertGenerator" :disabled="checkValid" color="primary">
        <v-icon small>mdi-plus</v-icon>
        {{ text_btn_create }}
      </v-btn>
    </v-card-actions>
  </v-form>
</template>
<script>
import gql from "graphql-tag";
import insert_generator from "~/gql/mutations/insert_generator.gql";
import MapboxMarker from "../mapboxMarker.vue";
const Swal = require("sweetalert2");

const WG_SPECIAL_ZONE_DISTRICT_CODES = {
  "ເຂດພັດທະນາກວມລວມໄຊເຊດຖາ": "03",
  "ເຂດເສດຖະກິດບຶງທາດຫຼວງ": "03",
  "ເຂດອຸດສາຫະກຳແລະການຄ້າວຽງຈັນ": "06",
  "ເຂດເສດຖະກິດສະເພາະດົງໂພສີ": "07",
  "ເຂດເສດຖະກິດສະເພາະລອງແທ່ງວຽງຈັນ": "07",
  "ເຂດເສດຖະກິດສະເພາະບໍ່ເຕັນແດນງາມ": "01",
  "ເຂດເສດຖະກິດພິເສດສາມຫຼ່ຽມທອງຄຳ": "02",
  "ເຂດເສດຖະກິດພິເສດຫຼວງພະບາງ": "01",
  "ເຂດເສດຖະກິດສະເພາະທ່າແຂກ": "01",
  "ເຂດເສດຖະກິດສະເພາະພູຂຽວ": "01",
  "ເຂດເສດຖະກິດພິເສດແຂວງສະຫວັນນະເຂດຈຸດA": "01",
  "ເຂດເສດຖະກິດພິເສດແຂວງສະຫວັນນະເຂດຈຸດC": "01",
  "ເຂດເສດຖະກິດພິເສດແຂວງສະຫວັນນະເຂດຈຸດD": "01",
  "ເຂດເສດຖະກິດພິເສດແຂວງສະຫວັນນະເຂດຈຸດB": "02",
  "ເຂດເສດຖະກິດພິເສດແຂວງສະຫວັນນະເຂດຈຸດB1": "02",
  "ເຂດເສດຖະກິດພິເສດແຂວງສະຫວັນນະເຂດຈຸດE": "05",
  "ເຂດເສດຖະກິດພິເສດແລະສະເພາະຈຳປາສັກ": "01",
  "ເຂດເສດຖະກິດພິເສດມະຫານະທີສີພັນດອນ": "10",
};

export default {
  components: {
    MapboxMarker,
  },
  data() {
    return {
      valid: true,
      labelsWG: [
        this.$t("enterprise_namelao"),
        this.$t("enterprise_nameeng"),
        this.$t("enterprise_number"),
        "EMCG ID",
        this.$t("email"),
        "Province",
        "District",
        "Village",
        this.$t("custom_address"),
        this.$t("office_telephone"),
        this.$t("industry_type"),
        this.$t("objective"),
      ],
      levels: [
        {
          id: "c2467ae0-bb2f-485e-b9d6-7d87228b6392",
          level_name: "ນອກເຂດເສດຖະກິດພິເສດ",
        },
        {
          id: "3c80ef33-d273-47f7-924a-9cea6e97c5af",
          level_name: "ໃນເຂດເສດຖະກິດພິເສດ",
        },
      ],
      incresase_c: 0,
      villages: [],
      districts: [],
      provinces: [],
      provincesSpecial: [],
      items: [],
      gen_name: "",
      gen_name_lo: "",
      enterprise_no: "",
      emac_id: "",
      email: "",
      province: 1,
      district: 101,
      village: 10101,
      custom_address: "",
      tel: "",
      latlng: "",
      description: "",
      type: "",
      types: [],
      status: "",
      level_id: "c2467ae0-bb2f-485e-b9d6-7d87228b6392",
      levels_opt_id: "",
      date: "",
      org: "",
      pr_code: "",
      incresase: "",
      org_type: 1,
      last2digits: "",
      generate_id: false,
      text: {},
      village_spz: 0,
      //dataWG: [],
      dataTotal: 0,
      dataTotalCurrent: 0,
      lastCodes: [],
      lastCode: "",
    };
  },
  methods: {
    // getGenerator() {
    //   this.$apollo
    //     .query({
    //       query: require("~/gql/queries/getGenerator").getGeneratorNeq,
    //       variables: {
    //         status: 4,
    //       },
    //     })
    //     .then((data) => {
    //       this.dataWG = data.data.emac_generators;
    //       this.dataTotal = this.dataWG.length;
    //       // console.log("this.dataTotal :>> ", this.dataTotal);
    //       // console.log('this.indusType :>> ', this.indusType)
    //       // console.log('this.data :>> ', this.data)
    //     })
    //     .catch((err) => {
    //       // console.log("err :>> ", err);
    //     });
    // },
    getAllG() {
      const y = new Date().getFullYear();
      this.$apollo
        .query({
          query: require("~/gql/queries/getAllCP").getAllG,
          variables: {
            from: `${y}-01-01T00:00:00.000000+00:00`,
            to: `${y}-12-31T23:59:59.000000+00:00`,
            status: 4,
          },
        })
        .then((data) => {
          this.dataTotalCurrent = data.data.emac_generators_aggregate.aggregate.count;
         
        })
        .catch((err) => {
          console.log("err :>> ", err);
        });
    },
    toggleDialog() {
      this.generate_id = false;
      this.$store.commit("SET_DIALOG", !this.$store.state.dialog);
    },
    getLatlng(value) {
      this.latlng = value;
      this.latlng = [value[1], value[0]];
      this.latlng = this.latlng.join(",");
      // console.log("this.latlng:P :>> ", this.latlng);
    },
    async getProvince() {
      await this.$apollo
        .query({
          query: require("~/gql/queries/getProvince").getProvince,
        })
        .then((data) => {
          this.provinces = data.data.emac_provinces;
          // console.log("this.emac_provinces :>> ", this.provinces);
        })
        .catch(() => {
          window.location.reload();
        });
    },
    async getDistricts() {
      await this.$apollo
        .query({
          query: require("~/gql/queries/getDistrict").getDistricts,
          variables: {
            pr_id: this.province,
          },
        })
        .then((data) => {
          this.districts = data.data.emac_provinces[0].districts;

          this.getPrCode();
          // console.log("this.districts :>> ", this.districts);
        })
        .catch((err) => {
          // console.log("err :>> ", err);
        });
    },
    async getVillages() {
      await this.$apollo
        .query({
          query: require("~/gql/queries/getVillages").getVillages,
          variables: {
            dr_id: this.district,
          },
        })
        .then((data) => {
          this.villages = data.data.emac_districts[0].villages;

          // console.log("this.villages :>> ", this.villages);
          // console.log("this.village :>> ", this.village);
        })
        .catch((err) => {
          // console.log("err :>> ", err);
        });
    },
    async getIndustryType() {
      await this.$apollo
        .query({
          //no cache
          fetchPolicy: "no-cache",
          query: require("~/gql/queries/getIndustryType").getIndustryType,
        })
        .then((data) => {
          this.types = data.data.emac_industry_types;
          // console.log("this.emac_industry_types :>> ", this.types);
        })
        .catch((err) => {
          // console.log("err :>> ", err);
        });
    },
    insertGenerator() {
      if (this.level_id == "c2467ae0-bb2f-485e-b9d6-7d87228b6392") {
        this.$apollo
          .mutate({
            mutation: gql`
              ${insert_generator.insert_generator}
            `,
            variables: {
              gen_name: this.gen_name,
              gen_name_lo: this.gen_name_lo,
              email: this.email,
              emac_id: this.emac_id,
              custom_address: this.custom_address,
              enterprise_no: this.enterprise_no,
              industry_type_id: this.type,
              vill_id: this.village,
              tel: this.tel.toString(),
              latlng: this.latlng,
              level_id: this.level_id,
              status: 1,
              objectives: this.description,
            },
          })
          .then(() => {
            this.dialog = false;
            Swal.fire(
              "success",
              "Create Organizaiton Success!.",
              "success"
            ).then(() => {
              window.location.reload();
            });
          })
          .catch((error) => {
            // console.log(error);
          });
      } else {
        this.$apollo
          .mutate({
            mutation: gql`
              ${insert_generator.insert_generator}
            `,
            variables: {
              gen_name: this.gen_name,
              gen_name_lo: this.gen_name_lo,
              email: this.email,
              emac_id: this.emac_id,
              custom_address: this.custom_address,
              enterprise_no: this.enterprise_no,
              industry_type_id: this.type,
              vill_id: this.village_spz,
              tel: this.tel.toString(),
              latlng: this.latlng,
              level_id: this.level_id,
              status: 1,
              objectives: this.description,
            },
          })
          .then(() => {
            this.dialog = false;
            Swal.fire(
              "success",
              "Create Organizaiton Success!.",
              "success"
            ).then(() => {
              window.location.reload();
            });
          })
          .catch((error) => {
            // console.log(error);
          });
      }
    },
    async getPrCode() {
      for (let i = 0; i < 1; i++) {
        await this.$apollo
          .query({
            query: require("~/gql/queries/getProvince").getPr_code,
            variables: {
              id: this.province,
            },
          })
          .then((data) => {
            this.pr_code = data.data.emac_provinces[0].pr_code;
            // console.log("this.emac_provinces :>> ", this.provinces);
            this.date = new Date();
            this.last2digits = this.date.getFullYear().toString().slice(-2);
          })
          .then(() => {
            this.$apollo
              .query({
                query: require("~/gql/queries/getLastCode").getLastCode,
                variables: {
                  id: this.province,
                },
              })
              .then((data) => {
                this.lastCodes = data.data.emac_provinces[0].last_code;
                // console.log("this.lastCodes :>> ", this.lastCodes);
              });
          });
      }
    },
    async getSpecialPr() {
      await this.$apollo
        .query({
          query: require("~/gql/queries/getProvince").getSpecialPr,
        })
        .then((data) => {
          this.provincesSpecial = data.data.emac_provinces;
          // console.log("this.provincesSpecial :>> ", this.provincesSpecial);
        })
        .catch((err) => {
          // console.log("err :>> ", err);
        });
    },
    normalizeWGZoneName(value) {
      return (value || "")
        .toString()
        .replace(/[\s-]/g, "")
        .replace(/[()]/g, "")
        .replace(/\./g, "")
        .trim();
    },
    padTwoDigits(value) {
      return String(value).padStart(2, "0");
    },
    getSelectedSpecialProvince() {
      return this.provincesSpecial.find((item) => item.pr_id === this.province);
    },
    getWGProvinceSegment() {
      if (this.level_id == "c2467ae0-bb2f-485e-b9d6-7d87228b6392") {
        if (!this.province && this.province !== 0) {
          Swal.fire("error", "Province is required before generating EMAC ID.", "error");
          return null;
        }
        return this.padTwoDigits(this.province);
      }

      const selectedSpecialProvince = this.getSelectedSpecialProvince();
      if (!selectedSpecialProvince?.pr_code) {
        Swal.fire("error", "Special zone province code is missing.", "error");
        return null;
      }

      const baseProvince = this.provinces.find(
        (item) => item.pr_code === selectedSpecialProvince.pr_code
      );

      if (!baseProvince?.pr_id && baseProvince?.pr_id !== 0) {
        Swal.fire(
          "error",
          "Unable to derive base province for the selected special zone.",
          "error"
        );
        return null;
      }

      return this.padTwoDigits(baseProvince.pr_id);
    },
    getWGDistrictSegment() {
      if (this.level_id == "c2467ae0-bb2f-485e-b9d6-7d87228b6392") {
        if (!this.district && this.district !== 0) {
          Swal.fire("error", "District is required before generating EMAC ID.", "error");
          return null;
        }

        return String(this.district).slice(-2).padStart(2, "0");
      }

      const selectedSpecialProvince = this.getSelectedSpecialProvince();
      const normalizedName = this.normalizeWGZoneName(
        selectedSpecialProvince?.pr_name_lo || selectedSpecialProvince?.pr_name
      );
      const districtCode = WG_SPECIAL_ZONE_DISTRICT_CODES[normalizedName];

      if (!districtCode) {
        Swal.fire(
          "error",
          "Unable to derive district code for the selected special zone. Please verify zone mapping.",
          "error"
        );
        return null;
      }

      return districtCode;
    },
    getWGZoneSegment() {
      if (this.level_id == "c2467ae0-bb2f-485e-b9d6-7d87228b6392") {
        return "0";
      }

      const selectedSpecialProvince = this.getSelectedSpecialProvince();
      const zoneCode = selectedSpecialProvince?.last_code;

      if (zoneCode === null || zoneCode === undefined || zoneCode === "") {
        Swal.fire(
          "error",
          "Selected special zone does not have a valid zone code (last_code).",
          "error"
        );
        return null;
      }

      return String(zoneCode);
    },
    async testGenID() {
      this.incresase = this.dataTotalCurrent + 1;
      if (this.incresase > 99) {
        Swal.fire(
          "error",
          "WG running number exceeds 99. Please update EMAC ID rules before creating more WG records this year.",
          "error"
        );
        this.generate_id = false;
        this.emac_id = "";
        return;
      }

      this.date = new Date();
      this.last2digits = this.date.getFullYear().toString().slice(-2);
      this.org = "G";

      const runningSegment = this.padTwoDigits(this.incresase);
      const provinceSegment = this.getWGProvinceSegment();
      const districtSegment = this.getWGDistrictSegment();
      const zoneSegment = this.getWGZoneSegment();

      if (!provinceSegment || !districtSegment || zoneSegment === null) {
        this.generate_id = false;
        this.emac_id = "";
        return;
      }

      this.emac_id = `EMC${this.org}${this.last2digits}${runningSegment}${provinceSegment}${districtSegment}${zoneSegment}`;

      this.generate_id = true;
    },
    vill_id_for_spz() {
      this.village_spz = this.province;
      this.village_spz = this.village_spz + "01001";
      this.village_spz = parseInt(this.village_spz);
      // console.log("this.village_spz :>> ", this.village_spz);
    },
  },
  computed: {
    text_btn_cancel() {
      return this.$t("cancel");
    },
    text_btn_create() {
      return this.$t("create");
    },
    checkValidGen() {
      if (this.valid == false && this.latlng.toString().length == 0) {
        return true;
      } else if (this.valid == true && this.latlng.toString().length == 0) {
        return true;
      } else {
        return false;
      }
    },
    checkValid() {
      if (this.valid == false && this.latlng.toString().length == 0) {
        return true;
      } else if (this.valid == true && this.latlng.toString().length == 0) {
        return true;
      } else if (this.valid == false && this.latlng.toString().length > 0) {
        return true;
      } else {
        return false;
      }
    },
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
    //this.getGenerator();
    this.getProvince(),
      this.getDistricts(),
      this.getVillages(),
      this.getIndustryType();
    this.getAllG();
  },
};
</script>
