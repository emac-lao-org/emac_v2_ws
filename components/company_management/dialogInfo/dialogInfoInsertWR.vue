<template>
  <v-form v-model="valid">
    <div>
      <v-row>
        <v-col cols="7">
          <v-row>
            <v-col cols="4">
              <v-text-field
                v-model="regulator_name_lo"
                outlined
                :rules="[
                  (v) => !!v || 'Name is required',
                  (v) =>
                    v.length <= 100 || 'Name must be less than 50 characters',
                ]"
                :label="labels[0]"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="regulator_name"
                outlined
                :rules="[
                  (v) => !!v || 'Name is required',
                  (v) =>
                    v.length <= 100 || 'Name must be less than 50 characters',
                ]"
                :label="labels[1]"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="emac_id"
                outlined
                :rules="[(v) => !!v || 'EMAC ID is required']"
                :label="labels[13]"
                required
                disabled
              ></v-text-field>
            </v-col>
            <!-- <v-col cols="4">
            <v-text-field
              v-model="enterprise_no"
              outlined
              :label="labels[2]"
              required
            ></v-text-field>
          </v-col> -->
            <v-col cols="4">
              <v-text-field
                v-model="email"
                outlined
                :rules="[
                  (v) => !!v || 'Email is required',
                  (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
                ]"
                :label="labels[3]"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-select
                v-model="level"
                item-text="display_name"
                item-value="id"
                :items="wrLevelOptions"
                :label="labels[11]"
                :rules="[(v) => !!v || 'Level is required']"
                required
                outlined
                @change="handleLevelChange"
              ></v-select>
            </v-col>
            <v-col cols="4">
              <v-select
                v-model="level_opt_id"
                item-text="display_name"
                item-value="id"
                :items="wrLevelOperationOptions"
                :label="levelOperationLabel"
                :rules="[(v) => !!v || 'Level operation is required']"
                required
                outlined
                :disabled="isSpecialZoneOperationLocked"
                @change="resetGeneratedId"
              ></v-select>
            </v-col>
            <v-col cols="4">
              <div v-if="usesSpecialZoneFlow">
                <v-select
                  v-model="province"
                  outlined
                  item-text="pr_name_lo"
                  item-value="pr_id"
                  :items="provincesSpecial"
                  label="Special Zone"
                  required
                  :rules="[(v) => !!v || 'Special zone is required']"
                  @click="getSpecialPr"
                  @change="handleSpecialZoneChange"
                ></v-select>
              </div>
              <div v-else-if="usesNormalLocationFlow">
                <v-select
                  v-model="province"
                  outlined
                  item-text="pr_name_lo"
                  item-value="pr_id"
                  :items="provinces"
                  :rules="[(v) => !!v || 'Province is required']"
                  :label="labels[4]"
                  required
                  @click="getProvince"
                  @change="handleProvinceChange"
                ></v-select>
              </div>
              <div v-else-if="showLegacyLevelWarning">
                <v-text-field
                  outlined
                  disabled
                  label="Level Status"
                  value="This legacy level is not supported by the new WR EMAC ID format."
                ></v-text-field>
              </div>
            </v-col>

            <v-col v-if="usesNormalLocationFlow" cols="4">
              <v-select
                v-model="district"
                outlined
                item-text="dr_name_lo"
                item-value="dr_id"
                :items="districts"
                :label="labels[5]"
                required
                :rules="[(v) => !!v || 'District is required']"
                @click="getDistricts"
                @change="handleDistrictChange"
              ></v-select>
            </v-col>

            <v-col v-if="usesNormalLocationFlow" cols="4">
              <v-select
                v-model="village"
                outlined
                item-text="vill_name_lo"
                item-value="vill_id"
                :items="villages"
                :rules="[(v) => !!v || 'Village is required']"
                :label="labels[6]"
                required
                @click="getVillages"
              ></v-select>
            </v-col>
            <v-col v-if="usesNormalLocationFlow" cols="4">
              <v-text-field
                v-model="custom_address"
                outlined
                :rules="[
                  (v) => !!v || 'Address is required',
                  (v) =>
                    v.length <= 100 ||
                    'Address must be less than 100 characters',
                ]"
                :label="labels[7]"
                required
              ></v-text-field>
            </v-col>

            <v-col v-else-if="usesSpecialZoneFlow" cols="4">
              <v-text-field
                v-model="custom_address"
                outlined
                :rules="[
                  (v) => !!v || 'Address is required',
                  (v) =>
                    v.length <= 100 ||
                    'Address must be less than 100 characters',
                ]"
                :label="labels[7]"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" v-if="scopeHint">
              <v-alert dense outlined color="primary" class="mb-2">
                {{ scopeHint }}
              </v-alert>
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
                    v.toString().startsWith('0') ||
                    'The phone must start with 0',
                  (v) => !!v || 'The phone is required',
                ]"
                :label="labels[8]"
                required
              ></v-text-field>
            </v-col> </v-row
        ></v-col>
        <v-col>
          <mapbox-marker @latlng="getLatlng" />
        </v-col>
      </v-row>
      <br />
      <v-card-actions class="mx-4">
        <v-spacer></v-spacer>
        <v-btn
          :disabled="checkValidGen"
          color="primary"
          class="mx-4 my-4"
          @click="testGenID"
        >
          Generate ID
        </v-btn>
        <v-btn outlined color="primary" class="mx-4 my-4" @click="toggleDialog">
        {{text_btn_cancel}}
        </v-btn>
        <v-btn :disabled="checkValid" @click="insert_regulator" color="primary">
          <v-icon small>mdi-plus</v-icon>
        {{text_btn_create}}
        </v-btn>
      </v-card-actions>
    </div>
  </v-form>
</template>

<script>
import levels from "~/mixins/getLevels";
import mapboxMarker from "../mapboxMarker.vue";
import insert_regulator from "~/gql/mutations/insert_regulator.gql";
import gql from "graphql-tag";
import amountWR from "~/mixins/getWRUsers";
const Swal = require("sweetalert2");

const WR_PROVINCE_LEVEL_ID = "c2467ae0-bb2f-485e-b9d6-7d87228b6392";
const WR_SPECIAL_ZONE_LEVEL_ID = "3c80ef33-d273-47f7-924a-9cea6e97c5af";
const WR_LEGACY_MPI_LEVEL_ID = "22543168-49fa-4aaf-bd7a-cf04747e490c";
const WR_DISTRICT_NORMAL_LEVEL_ID = "wr-district-normal";

const WR_SPECIAL_ZONE_DISTRICT_CODES = {
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
  components: { mapboxMarker },
  mixins: [levels, amountWR],
  data() {
    return {
      valid: true,
      labels: [
       this.$t("enterprise_namelao"),
        this.$t("enterprise_nameeng"),
        "Enterprise No",
       this.$t("email"),
        "Province",
        "District",
        "Village",
        this.$t("custom_address"),
         this.$t("office_telephone"),
        "Latitude and Longitude",
        "Status",
         this.$t("organization_level"),
         this.$t("organization_level_name"),
        "EMAC ID",
      ],
      regulator_name_lo: "",
      regulator_name: "",
      enterprise_no: "",
      emac_id: "",
      email: "",
      province: 1,
      district: 101,
      village: 10101,
      custom_address: "",
      tel: "",
      latlng: "",
      status: "",
      level: "b367f9f4-f84e-4a0e-8cd2-f8e911f56476",
      level_opt_id: "",
      provinces: [],
      districts: [],
      villages: [],
      levels: [],
      // statuses: [
      //   {
      //     name: 'Active',
      //     value: '0',
      //   },
      //   {
      //     name: 'Suspened',
      //     value: '1',
      //   },
      //   {
      //     name: 'Deleted',
      //     value: '2',
      //   },
      // ],
      emac_level_operations: [],
      provincesSpecial: [],
      village_spz: "",
      incresase: 0,
      incresase_c: 0,
      org_type: 1,
      lastCodes: [],
      last2digits: "",
      date: "",
      pr_code: "",
      generate_id: false,
      dataWR: [],
      totalWR: 0,
      totalWRCurrent: 0,

    };
  },
  methods: {
    resetGeneratedId() {
      this.generate_id = false;
      this.emac_id = "";
    },
    async handleLevelChange() {
      this.level_opt_id = "";
      this.province = "";
      this.district = "";
      this.village = "";
      this.emac_level_operations = [];
      this.resetGeneratedId();
      if (this.level) {
        await this.getLevelOpt();
      }
    },
    handleProvinceChange() {
      this.district = "";
      this.village = "";
      this.resetGeneratedId();
    },
    handleDistrictChange() {
      this.village = "";
      this.resetGeneratedId();
    },
    async handleSpecialZoneChange() {
      this.district = "";
      this.village = "";
      await this.resolveSpecialZoneLocation();
      this.resetGeneratedId();
    },
    normalizeWRZoneName(value) {
      return (value || "")
        .toString()
        .replace(/[\s-]/g, "")
        .replace(/[()]/g, "")
        .replace(/\./g, "")
        .trim();
    },
    getStringValue(value) {
      if (typeof value === "string") {
        return value.trim();
      }

      if (typeof value === "number") {
        return String(value);
      }

      if (value && typeof value === "object") {
        const preferredKeys = [
          "level_name_lo",
          "level_name",
          "pr_name_lo",
          "pr_name",
          "dr_name_lo",
          "dr_name",
          "name",
          "label",
          "text",
          "title",
        ];

        for (const key of preferredKeys) {
          if (typeof value[key] === "string" && value[key].trim()) {
            return value[key].trim();
          }
        }
      }

      return "";
    },
    getWRLevelDisplayName(item) {
      if (!item) {
        return "";
      }

      if (item.id === WR_DISTRICT_NORMAL_LEVEL_ID) {
        return "District";
      }

      if (item.id === WR_SPECIAL_ZONE_LEVEL_ID) {
        return "District / Special Zone";
      }

      const label =
        this.getStringValue(item.display_name) ||
        this.getStringValue(item.level_name_lo) ||
        this.getStringValue(item.level_name);

      if (label) {
        return label;
      }

      if (item.level_order === 1) {
        return "Ministry";
      }

      if (item.level_order === 2) {
        return "Province";
      }

      if (item.level_order === 3) {
        return "District";
      }

      return "WR Level";
    },
    getWRLevelOperationDisplayName(item, suffix) {
      const baseLabel =
        this.getStringValue(item?.display_name) ||
        this.getStringValue(item?.level_name_lo) ||
        this.getStringValue(item?.level_name) ||
        "Level Operation";

      return suffix ? `${baseLabel} ${suffix}` : baseLabel;
    },
    padTwoDigits(value) {
      return String(value).padStart(2, "0");
    },
    getSelectedLevel() {
      return this.wrLevelOptions.find((item) => item.id === this.level);
    },
    getSelectedLevelOperation() {
      return this.emac_level_operations.find(
        (item) => item.id === this.level_opt_id
      );
    },
    getSelectedSpecialProvince() {
      return this.provincesSpecial.find((item) => item.pr_id === this.province);
    },
    isLegacyUnsupportedLevel() {
      return this.level == WR_LEGACY_MPI_LEVEL_ID;
    },
    isDistrictNormalLevel() {
      return this.level == WR_DISTRICT_NORMAL_LEVEL_ID;
    },
    getSpecialZoneDistrictCode(selectedSpecialProvince) {
      const normalizedName = this.normalizeWRZoneName(
        selectedSpecialProvince?.pr_name_lo || selectedSpecialProvince?.pr_name
      );

      return WR_SPECIAL_ZONE_DISTRICT_CODES[normalizedName];
    },
    getSpecialZoneBaseProvince(selectedSpecialProvince) {
      if (!selectedSpecialProvince?.pr_code) {
        return null;
      }

      return this.provinces.find(
        (item) => item.pr_code === selectedSpecialProvince.pr_code
      );
    },
    async resolveSpecialZoneLocation() {
      const selectedSpecialProvince = this.getSelectedSpecialProvince();

      if (!selectedSpecialProvince) {
        return null;
      }

      const baseProvince = this.getSpecialZoneBaseProvince(selectedSpecialProvince);

      if (!baseProvince?.pr_id && baseProvince?.pr_id !== 0) {
        Swal.fire(
          "error",
          "Unable to derive base province for the selected special zone.",
          "error"
        );
        return null;
      }

      const districtCode = this.getSpecialZoneDistrictCode(selectedSpecialProvince);

      if (!districtCode) {
        Swal.fire(
          "error",
          "Unable to derive district code for the selected special zone. Please verify zone mapping.",
          "error"
        );
        return null;
      }

      const districtResponse = await this.$apollo.query({
        query: require("~/gql/queries/getDistrict").getDistricts,
        variables: {
          pr_id: baseProvince.pr_id,
        },
        fetchPolicy: "no-cache",
      });

      const availableDistricts =
        districtResponse?.data?.emac_provinces?.[0]?.districts || [];
      const matchedDistrict = availableDistricts.find(
        (item) => String(item.dr_id).slice(-2).padStart(2, "0") === districtCode
      );

      if (!matchedDistrict?.dr_id && matchedDistrict?.dr_id !== 0) {
        Swal.fire(
          "error",
          "Unable to match the selected special zone to a district record.",
          "error"
        );
        return null;
      }

      const villageResponse = await this.$apollo.query({
        query: require("~/gql/queries/getVillages").getVillages,
        variables: {
          dr_id: matchedDistrict.dr_id,
        },
        fetchPolicy: "no-cache",
      });

      const availableVillages =
        villageResponse?.data?.emac_districts?.[0]?.villages || [];
      const firstVillage = availableVillages[0];

      if (!firstVillage?.vill_id && firstVillage?.vill_id !== 0) {
        Swal.fire(
          "error",
          "Unable to derive a village record for the selected special zone.",
          "error"
        );
        return null;
      }

      this.district = matchedDistrict.dr_id;
      this.village = firstVillage.vill_id;
      this.village_spz = firstVillage.vill_id;

      return {
        baseProvince,
        matchedDistrict,
        firstVillage,
      };
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

      await this.$apollo
        .query({
          query: require("~/gql/queries/getProvince").getPr_code,
          variables: {
            id: this.province,
          },
        })
        .then((data) => {
          this.pr_code = data.data.emac_provinces[0].pr_code;
        
        });
    },
    getWRRunningSegment() {
      this.incresase = parseInt(this.totalWRCurrent) + 1;

      if (this.incresase > 99) {
        Swal.fire(
          "error",
          "WR running number exceeds 99. Please update EMAC ID rules before creating more WR records this year.",
          "error"
        );
        return null;
      }

      return this.padTwoDigits(this.incresase);
    },
    getWRTailSegment() {
      const selectedLevel = this.getSelectedLevel();
      const selectedOperation = this.getSelectedLevelOperation();

      if (this.level == WR_SPECIAL_ZONE_LEVEL_ID) {
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
      }

      if (selectedLevel?.level_order === 1 || selectedLevel?.level_order === 2) {
        if (
          selectedOperation?.level_order === null ||
          selectedOperation?.level_order === undefined
        ) {
          Swal.fire(
            "error",
            "Selected level operation does not have a valid level order.",
            "error"
          );
          return null;
        }

        return String(selectedOperation.level_order);
      }

      return "0";
    },
    getWRProvinceSegment() {
      const selectedLevel = this.getSelectedLevel();

      if (!selectedLevel) {
        Swal.fire("error", "Level is required before generating EMAC ID.", "error");
        return null;
      }

      if (this.isLegacyUnsupportedLevel()) {
        Swal.fire(
          "error",
          "This legacy WR level is no longer supported by the new EMAC ID format.",
          "error"
        );
        return null;
      }

      if (selectedLevel.level_order === 1) {
        return "00";
      }

      if (this.level == WR_SPECIAL_ZONE_LEVEL_ID) {
        const selectedSpecialProvince = this.getSelectedSpecialProvince();
        const baseProvince = this.getSpecialZoneBaseProvince(selectedSpecialProvince);

        if (!baseProvince?.pr_id && baseProvince?.pr_id !== 0) {
          Swal.fire(
            "error",
            "Unable to derive base province for the selected special zone.",
            "error"
          );
          return null;
        }

        return this.padTwoDigits(baseProvince.pr_id);
      }

      if (!this.province && this.province !== 0) {
        Swal.fire("error", "Province is required before generating EMAC ID.", "error");
        return null;
      }

      return this.padTwoDigits(this.province);
    },
    getWRDistrictSegment() {
      const selectedLevel = this.getSelectedLevel();

      if (!selectedLevel) {
        Swal.fire("error", "Level is required before generating EMAC ID.", "error");
        return null;
      }

      if (this.isLegacyUnsupportedLevel()) {
        return null;
      }

      if (selectedLevel.level_order === 1 || selectedLevel.level_order === 2) {
        return "00";
      }

      if (this.level == WR_SPECIAL_ZONE_LEVEL_ID) {
        const selectedSpecialProvince = this.getSelectedSpecialProvince();
        const districtCode = this.getSpecialZoneDistrictCode(selectedSpecialProvince);

        if (!districtCode) {
          Swal.fire(
            "error",
            "Unable to derive district code for the selected special zone. Please verify zone mapping.",
            "error"
          );
          return null;
        }

        return districtCode;
      }

      if (!this.district && this.district !== 0) {
        Swal.fire("error", "District is required before generating EMAC ID.", "error");
        return null;
      }

      return String(this.district).slice(-2).padStart(2, "0");
    },
    async testGenID() {
      if (this.isLegacyUnsupportedLevel()) {
        Swal.fire(
          "error",
          "This legacy WR level is no longer supported by the new EMAC ID format.",
          "error"
        );
        this.generate_id = false;
        this.emac_id = "";
        return;
      }

      this.org = "R";
      this.date = new Date();
      this.last2digits = this.date.getFullYear().toString().slice(-2);

      if (!this.level_opt_id) {
        Swal.fire(
          "error",
          "Level operation is required before generating EMAC ID.",
          "error"
        );
        this.generate_id = false;
        this.emac_id = "";
        return;
      }

      const runningSegment = this.getWRRunningSegment();
      const provinceSegment = this.getWRProvinceSegment();
      const districtSegment = this.getWRDistrictSegment();
      const tailSegment = this.getWRTailSegment();

      if (
        !runningSegment ||
        !provinceSegment ||
        !districtSegment ||
        tailSegment === null
      ) {
        this.generate_id = false;
        this.emac_id = "";
        return;
      }

      this.emac_id = `EMC${this.org}${this.last2digits}${runningSegment}${provinceSegment}${districtSegment}${tailSegment}`;

      this.generate_id = true;
    },
    toggleDialog() {
      this.$store.commit("SET_DIALOG", !this.$store.state.dialog);
    },
    getLatlng(value) {
      this.latlng = value;
      this.latlng = [value[1], value[0]];
      this.latlng = this.latlng.join(",");
      // console.log('this.latlng:P :>> ', this.latlng);
    },
    async getProvince() {
      await this.$apollo
        .query({
          query: require("~/gql/queries/getProvince").getProvince,
        })
        .then((data) => {
          this.provinces = data.data.emac_provinces;
          // console.log("this.emac_provinces :>> ", this.provinces);
          this.getPrCode();
        })
        .catch((err) => {
          // console.log("err :>> ", err);
        });
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
          // console.log("this.districts :>> ", this.districts);
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
          // console.log("this.villages :>> ", this.villages);
        })
        .catch((err) => {
          // console.log("err :>> ", err);
        });
    },

    async getLevelOpt() {
      const levelId =
        this.level === WR_DISTRICT_NORMAL_LEVEL_ID
          ? WR_PROVINCE_LEVEL_ID
          : this.level;

      await this.$apollo
        .query({
          query: require("~/gql/queries/getLevelOpt").getLevelOpt,
          variables: {
            id: levelId,
          },
        })
        .then((data) => {
          this.emac_level_operations = data.data.emac_level_operations;
          if (
            this.isSpecialZoneLevel &&
            this.emac_level_operations.length === 1 &&
            !this.level_opt_id
          ) {
            this.level_opt_id = this.emac_level_operations[0].id;
          }
          // console.log(
          //   "this.emac_level_operations :>> ",
          //   this.emac_level_operations
          // );
        })
        .catch((err) => {
          // console.log("err :>> ", err);
        });
    },
    vill_id_for_spz() {
      return this.resolveSpecialZoneLocation();
    },
    async getRegulatoramount() {
      await this.$apollo
        .query({
          query: require("~/gql/queries/getRegulator").getRegulatorNeq,
          variables: {
            status: 4,
          },
        })
        .then((data) => {
          this.dataWR = data.data.emac_regulators;
          this.totalWR = this.dataWR.length.toString();

          // console.log('this.data :>> ', this.dataWR)
        })
        .catch((err) => {
          // console.log("err :>> ", err);
        });
    },

     getAllR() {
      const y = new Date().getFullYear();
      this.$apollo
        .query({
          query: require("~/gql/queries/getAllCP").getAllR,
          variables: {
            from: `${y}-01-01T00:00:00.000000+00:00`,
            to: `${y}-12-31T23:59:59.000000+00:00`,
            status: 4,
          },
        })
        .then((data) => {
          this.totalWRCurrent =
            data.data.emac_regulators_aggregate.aggregate.count;
          // console.log("this.totalWTCurrent :>> ", this.totalWTCurrent);
        })
        .catch((err) => {
          console.log("err :>> ", err);
        });
    },


    async insert_regulator() {
      if (!this.generate_id || !this.emac_id) {
        Swal.fire(
          "error",
          "Please generate a valid EMAC ID before creating WR.",
          "error"
        );
        return;
      }

      if (
        this.level == WR_SPECIAL_ZONE_LEVEL_ID ||
        this.level == WR_LEGACY_MPI_LEVEL_ID
      ) {
        await this.$apollo
          .mutate({
            mutation: gql`
              ${insert_regulator.insert_regulator}
            `,
            variables: {
              custom_address: this.custom_address,
              email: this.email,
              latlng: this.latlng,
              level_opt_id: this.level_opt_id,
              regulator_name: this.regulator_name,
              status: 1,
              regulator_name_lo: this.regulator_name_lo,
              tel: this.tel.toString(),
              vill_id: this.village,
              emac_id: this.emac_id,
            },
          })
          .then(() => {
            this.dialog = false;
            Swal.fire("success", "Create Organizaiton Success!.", "success").then(
              () => {
                window.location.reload();
              }
            );
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        await this.$apollo
          .mutate({
            mutation: gql`
              ${insert_regulator.insert_regulator}
            `,
            variables: {
              custom_address: this.custom_address,
              email: this.email,
              latlng: this.latlng,
              level_opt_id: this.level_opt_id,
              regulator_name: this.regulator_name,
              status: 1,
              regulator_name_lo: this.regulator_name_lo,
              tel: this.tel,
              vill_id: this.village,
              emac_id: this.emac_id,
            },
          })
          .then(() => {
            this.dialog = false;
            Swal.fire("success", "Create Organizaiton Success!.", "success").then(
              () => {
                window.location.reload();
              }
            );
          })
          .catch((error) => {
            console.log(error);
          });
      }
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
    isMinistryLevel() {
      return this.getSelectedLevel()?.level_order === 1;
    },
    isProvinceLevel() {
      return this.getSelectedLevel()?.level_order === 2;
    },
    isSpecialZoneLevel() {
      return this.level == WR_SPECIAL_ZONE_LEVEL_ID;
    },
    usesSpecialZoneFlow() {
      return this.isSpecialZoneLevel;
    },
    usesNormalLocationFlow() {
      return !this.usesSpecialZoneFlow && !this.showLegacyLevelWarning;
    },
    showLegacyLevelWarning() {
      return this.isLegacyUnsupportedLevel();
    },
    wrLevelOptions() {
      const baseOptions = this.levels
        .filter(
          (item) => item && item.id && item.id !== WR_LEGACY_MPI_LEVEL_ID
        )
        .map((item) => {
          return {
            ...item,
            display_name: this.getWRLevelDisplayName(item),
          };
        });

      const insertIndex = baseOptions.findIndex(
        (item) => item.id === WR_SPECIAL_ZONE_LEVEL_ID
      );
      const districtNormalOption = {
        id: WR_DISTRICT_NORMAL_LEVEL_ID,
        level_name: "District",
        level_name_lo: "ຂັ້ນຫ້ອງການ",
        level_order: 3,
        display_name: "District",
      };

      if (insertIndex === -1) {
        return [...baseOptions, districtNormalOption];
      }

      return [
        ...baseOptions.slice(0, insertIndex),
        districtNormalOption,
        ...baseOptions.slice(insertIndex),
      ];
    },
    wrLevelOperationOptions() {
      return this.emac_level_operations.map((item) => {
        if (this.isSpecialZoneLevel) {
          return {
            ...item,
            display_name: this.getWRLevelOperationDisplayName(
              item,
              "(record only, tail from special zone last_code)"
            ),
          };
        }

        if (this.isMinistryLevel || this.isProvinceLevel) {
          return {
            ...item,
            display_name: this.getWRLevelOperationDisplayName(
              item,
              `(tail ${item.level_order})`
            ),
          };
        }

        if (this.isDistrictNormalLevel()) {
          return {
            ...item,
            display_name: this.getWRLevelOperationDisplayName(item, "(tail 0)"),
          };
        }

        return {
          ...item,
          display_name: this.getWRLevelOperationDisplayName(item),
        };
      });
    },
    levelOperationLabel() {
      if (this.isSpecialZoneLevel) {
        return "Level Operation (record only for special zone flow)";
      }

      if (this.isDistrictNormalLevel()) {
        return "Level Operation (stored for district unit, tail = 0)";
      }

      if (this.isMinistryLevel || this.isProvinceLevel) {
        return "Level Operation (tail code)";
      }

      return this.$t("organization_level_name");
    },
    scopeHint() {
      if (this.showLegacyLevelWarning) {
        return "This legacy WR level is no longer supported by the new WR EMAC ID format.";
      }

      if (this.isMinistryLevel) {
        return "WR EMAC ID will use Province = 00 and District = 00. Selected location is stored for regulator record only.";
      }

      if (this.isProvinceLevel) {
        return "WR EMAC ID will use selected Province + District = 00. Selected district/village remain record location only.";
      }

      if (this.isSpecialZoneLevel) {
        return "WR EMAC ID will use the base province, mapped district, and special-zone last_code. Level operation is stored on the regulator record, but the EMAC ID tail comes from the zone code.";
      }

      if (this.isDistrictNormalLevel()) {
        return "WR EMAC ID will use selected Province + selected District + tail = 0 for normal district flow.";
      }

      return "";
    },
    isSpecialZoneOperationLocked() {
      return this.isSpecialZoneLevel && this.emac_level_operations.length === 1;
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
    this.getProvince();
    this.getDistricts();
    this.getVillages();
    this.getRegulatoramount();
    this.getAllR();
    this.getLevelOpt();
  },
};
</script>
