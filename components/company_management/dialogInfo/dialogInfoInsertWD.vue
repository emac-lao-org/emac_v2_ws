<template>
  <v-form v-model="valid">
    <div>
      <v-row>
        <v-col cols="7">
          <v-row>
            <v-col cols="4">
              <v-text-field
                v-model="dis_name_lo"
                outlined
                :rules="[
                  (v) => !!v || 'Name is required',
                  (v) =>
                    v.length <= 100 || 'Name must be less than 50 characters',
                ]"
                :label="labelsWD[0]"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="dis_name"
                outlined
                :rules="[
                  (v) => !!v || 'Name is required',
                  (v) =>
                    v.length <= 100 || 'Name must be less than 50 characters',
                ]"
                :label="labelsWD[1]"
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
                :label="labelsWD[2]"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="emac_id"
                outlined
                disabled
                :rules="[(v) => !!v || 'EMAC ID is required']"
                :label="labelsWD[3]"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="license_no"
                outlined
                :rules="[(v) => !!v || 'License No is required']"
                :label="labelsWD[4]"
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
              :label="labelsWD[13]"
              required
            ></v-text-field>
          </v-col>
            <v-col cols="4">
              <v-select
                v-model="province_id"
                outlined
                item-text="pr_name_lo"
                item-value="pr_id"
                :items="provinces"
                :label="labelsWD[5]"
                :rules="[(v) => !!v || 'Province is required']"
                @change="handleProvinceChange"
                required
              ></v-select>
            </v-col>

            <v-col cols="4">
              <v-select
                v-model="district_id"
                outlined
                item-text="dr_name_lo"
                item-value="dr_id"
                :items="districts"
                :label="labelsWD[6]"
                :rules="[(v) => !!v || 'District is required']"
                required
                @click="getDistricts"
                @change="handleDistrictChange"
              ></v-select>
            </v-col>

            <v-col cols="4">
              <v-select
                v-model="village_id"
                outlined
                item-text="vill_name_lo"
                item-value="vill_id"
                :items="villages"
                :label="labelsWD[7]"
                :rules="[(v) => !!v || 'Village is required']"
                required
                @click="getVillages"
              ></v-select>
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="custom_address"
                outlined
                :rules="[(v) => !!v || 'Address is required']"
                :label="labelsWD[8]"
                required
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
                    v.toString().startsWith('0') ||
                    'The phone must start with 0',
                  (v) => !!v || 'The phone is required',
                ]"
                :label="labelsWD[10]"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="4"> </v-col>

            <v-col><h3 class="mb-2">{{ this.$t("type_of_service") }}:</h3>
              <v-radio-group v-model="selected" mandatory>
                <v-radio
                  dense
                  v-for="i in items"
                  :key="i.text"
                  :label="i.name_for_dis"
                  :value="i.id"
                ></v-radio>
              </v-radio-group>
            </v-col>
            <v-col>
              <h3 class="mb-2">{{ this.$t("type_of_disposal_service") }}:</h3>
              <v-radio-group v-model="selectedTod" mandatory @change="resetGeneratedId">
                <v-radio
                  dense
                  v-for="i in tods"
                  :key="i.text"
                  :label="i.name"
                  :value="i.id"
                ></v-radio>
              </v-radio-group>
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
          color="primary"
          :disabled="checkValidGen"
          class="mx-4 my-4"
          @click="testGenID"
        >
          Generate ID
        </v-btn>
        <v-btn @click="toggleDialog" outlined color="primary" class="mx-4 my-4">
          {{ text_btn_cancel }}
        </v-btn>
        <v-btn :disabled="checkValid" @click="insertTran" color="primary">
          <v-icon small>mdi-plus</v-icon>
          {{ text_btn_create }}
        </v-btn>
      </v-card-actions>
    </div>
  </v-form>
</template>

<script>
import getAddress from "~/mixins/getAddress";
import getTypeOfServices from "~/mixins/getTypeOfService";
import getDisposal from "~/mixins/getDisposal";
import insertDisposal from "~/gql/mutations/insertDisposal.gql";
import getTypeOfDisposalService from "~/mixins/getTypeOfDisposalServices";
import gql from "graphql-tag";
import levels from "~/mixins/getLevels";
import getAllwd from "~/mixins/getDisposalNeq";
import mapboxMarker from "../mapboxMarker.vue";
const Swal = require("sweetalert2");
export default {
  components: { mapboxMarker },
  mixins: [
    getAddress,
    getTypeOfServices,
    getDisposal,
    getTypeOfDisposalService,
    levels,
    getAllwd,
  ],
  data() {
    return {
      pr_code: "",
      valid: true,
      incresase: 0,
      incresase_c: 0,
      org_type: 1,
      lastCodes: [],
      last2digits: "",
      date: "",
      data: [],
      level_id: "",
      province_id: 1,
      district_id: 101,
      village_id: 10101,
      statuses: this.$store.state.sr,
      enterprise_no: "",
      provinces: [],
      districts: [],
      villages: [],
      items: [],
      selected: "7372727f-c0f0-4bae-81f3-47bad3f1012d",
      selectedTod: "e1245a62-704f-4f31-b5ab-db7b7c6e70e6",
      dis_name: "",
      dis_name_lo: "",
      emac_id: "",
      email: "",
      dis_id: "",
      latlng: "",
      license_no: "",
      custom_address: "",
      tel: "",
      status: 1,
      custom_address: "",
      vill_id: 0,
      disposal_type_operations: [],
      labelsWD: [
        this.$t("enterprise_namelao"),
        this.$t("enterprise_nameeng"),
        this.$t("email"),
        "EMCD ID",
        this.$t("license_no"),
        "Province",
        "District",
        "Village",
        this.$t("custom_address"),
        "Phone",
        this.$t("office_telephone"),
        "Latitude and Longitude",
        "Status",
        this.$t("enterprise_number"),
      ],
      tods: [],
      generate_id: false,
    };
  },
  methods: {
    resetGeneratedId() {
      this.generate_id = false;
      this.emac_id = "";
    },
    handleProvinceChange() {
      this.district_id = "";
      this.village_id = "";
      this.resetGeneratedId();
    },
    handleDistrictChange() {
      this.village_id = "";
      this.resetGeneratedId();
      this.getPrCode();
    },
    padTwoDigits(value) {
      return String(value).padStart(2, "0");
    },
    getWDRunningSegment() {
      this.incresase = parseInt(this.totalWDcurrent || 0) + 1;

      if (this.incresase > 99) {
        Swal.fire(
          "error",
          "WD running number exceeds 99. Please update EMAC ID rules before creating more WD records this year.",
          "error"
        );
        return null;
      }

      return this.padTwoDigits(this.incresase);
    },
    getWDProvinceSegment() {
      if (
        this.province_id === "" ||
        this.province_id === null ||
        this.province_id === undefined
      ) {
        Swal.fire("error", "Province is required before generating EMAC ID.", "error");
        return null;
      }

      return this.padTwoDigits(this.province_id);
    },
    getWDDistrictSegment() {
      if (
        this.district_id === "" ||
        this.district_id === null ||
        this.district_id === undefined
      ) {
        Swal.fire("error", "District is required before generating EMAC ID.", "error");
        return null;
      }

      return String(this.district_id).slice(-2).padStart(2, "0");
    },
    getWDTailSegment() {
      switch (this.selectedTod) {
        case "e1245a62-704f-4f31-b5ab-db7b7c6e70e6":
          return "1";
        case "e2f670f7-6163-4529-904b-825dec59b843":
          return "2";
        case "9136992b-3375-4347-9b5e-2277770c75a0":
          return "3";
        case "823b6a19-fe7f-4a72-be4a-254700412d64":
          return "4";
        default:
          return null;
      }
    },
    async testGenID() {
      this.org = "D";
      this.date = new Date();
      this.last2digits = this.date.getFullYear().toString().slice(-2);

      const runningSegment = this.getWDRunningSegment();
      const provinceSegment = this.getWDProvinceSegment();
      const districtSegment = this.getWDDistrictSegment();
      const tailSegment = this.getWDTailSegment();

      if (!runningSegment || !provinceSegment || !districtSegment || !tailSegment) {
        this.generate_id = false;
        this.emac_id = "";
        return;
      }

      this.emac_id = `EMC${this.org}${this.last2digits}${runningSegment}${provinceSegment}${districtSegment}${tailSegment}`;

      this.generate_id = true;
    },
    getLatlng(value) {
      this.latlng = value;
      this.latlng = [value[1], value[0]];
      this.latlng = this.latlng.join(",");
      // console.log('this.latlng:P :>> ', this.latlng)
    },
    toggleDialog() {
      this.$store.commit("SET_DIALOG", !this.$store.state.dialog);
    },
    async getPrCode() {
      if (
        this.province_id === "" ||
        this.province_id === null ||
        this.province_id === undefined
      ) {
        this.pr_code = "";
        return;
      }

      await this.$apollo
        .query({
          query: require("~/gql/queries/getProvince").getPr_code,
          variables: {
            id: this.province_id,
          },
        })
        .then((data) => {
          this.pr_code = data.data.emac_provinces?.[0]?.pr_code || "";
          // console.log("🚀 ~ file: controllerWT.js ~ line 158 ~ .then ~ this.pr_code", this.pr_code)
          // console.log("÷this.emac_provinces :>> ", this.province);
        });
    },
    async insertTran() {
      if (!this.generate_id || !this.emac_id) {
        Swal.fire(
          "error",
          "Please generate a valid EMAC ID before creating WD.",
          "error"
        );
        return;
      }

      await this.$apollo
        .mutate({
          mutation: gql`
            ${insertDisposal.insertDisposal}
          `,
          variables: {
            dis_name: this.dis_name,
            custom_address: this.custom_address,
            dis_name_lo: this.dis_name_lo,
            emac_id: this.emac_id,
            email: this.email,
            latlng: this.latlng,
            license_no: this.license_no,
            enterprise_no: this.enterprise_no,
            status: 1,
            tel: this.tel.toString(),
            vill_id: this.village_id,
            type_id: this.selected,
            type_id1: this.selectedTod,
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
      if (!this.generate_id) {
        return true;
      } else if (this.valid == false && this.latlng.toString().length == 0) {
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
    this.getPrCode();
  },
};
</script>
