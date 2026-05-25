<template>
  <v-form v-model="valid">
    <div>
      <v-row>
        <v-col cols="7">
          <v-row>
            <v-col cols="4">
              <v-text-field
                v-model="cNameLao"
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
                v-model="cNameEng"
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
                v-model="eNumber"
                outlined
                :rules="[
                  (v) => !!v || 'Enterprise no is required',
                  (v) =>
                    v.length <= 10 ||
                    'Enterprise no must be less than 10 characters',
                ]"
                :label="labels[2]"
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
                :label="labels[3]"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="emac_id"
                outlined
                readonly
                disabled
                :rules="[(v) => !!v || 'EMAC ID is required']"
                :label="labels[4]"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-select
                v-model="province"
                outlined
                :rules="[(v) => !!v || 'Province is required']"
                item-text="pr_name_lo"
                item-value="pr_id"
                :items="provinces"
                :label="labels[5]"
                @click="getProvince"
                @change="handleProvinceChange"
                required
              ></v-select>
            </v-col>

            <v-col cols="4">
              <v-select
                v-model="district"
                outlined
                :rules="[(v) => !!v || 'District is required']"
                item-text="dr_name_lo"
                item-value="dr_id"
                :items="districts"
                :label="labels[6]"
                required
                @click="getDistricts"
                @change="handleDistrictChange"
              ></v-select>
            </v-col>

            <v-col cols="4">
              <v-select
                v-model="village"
                outlined
                :rules="[(v) => !!v || 'Village is required']"
                item-text="vill_name_lo"
                item-value="vill_id"
                :items="villages"
                :label="labels[7]"
                required
                @click="getVillages"
              ></v-select>
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="custom_address"
                outlined
                :rules="[
                  (v) => !!v || 'Address is required',
                  (v) =>
                    v.length <= 100 ||
                    'Address must be less than 100 characters',
                ]"
                :label="labels[8]"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="4">
              <v-text-field
                v-model="offTel"
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
                :label="labels[9]"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="8">
              <h3 class="mb-2">{{this.$t('type_of_service')}}:</h3>
              <v-radio-group v-model="selected" mandatory @change="resetGeneratedId">
                <v-radio
                  dense
                  :rules="[(v) => !!v || 'Type is required']"
                  v-for="i in items"
                  :key="i.text"
                  :label="i.name"
                  :value="i.id"
                ></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
          <v-row> </v-row
        ></v-col>
        <v-col>
          <mapboxMarker @latlng="getLatlng" />
        </v-col>
      </v-row>

      <br />
      <v-card-actions class="mx-4">
        <v-spacer></v-spacer>
        <!-- {{emac_id}} -->
        <v-btn
          color="primary"
          :disabled="checkValidGen"
          class="mx-4 my-4"
          @click="testGenID"
        >
          Generate ID
        </v-btn>
        <v-btn
          outlined
          color="primary"
          class="mx-4 my-4"
          @click="dialog = false"
        >
          {{text_btn_cancel}}
        </v-btn>
        <v-btn :disabled="checkValid" color="primary" @click="insertTran">
          <v-icon small>mdi-plus</v-icon>
          {{text_btn_create}}
        </v-btn>
      </v-card-actions>
    </div>
  </v-form>
</template>

<script>
import controllerWT from "~/mixins/controllerWT";
import mapboxMarker from "../mapboxMarker.vue";
import getTran from "~/mixins/getTransportersNeq";
const Swal = require("sweetalert2");
export default {
  components: { mapboxMarker },
  mixins: [controllerWT, getTran],
  data() {
    return {
      valid: true,
      incresase: 0,
      org_type: 1,
      lastCodes: [],
      last2digits: "",
      date: "",
      generate_id: false,
    };
  },
  methods: {
    resetGeneratedId() {
      this.generate_id = false;
      this.emac_id = "";
    },
    handleProvinceChange() {
      this.district = "";
      this.village = "";
      this.resetGeneratedId();
      this.getPrCode();
    },
    handleDistrictChange() {
      this.village = "";
      this.resetGeneratedId();
    },
    padTwoDigits(value) {
      return String(value).padStart(2, "0");
    },
    getWTRunningSegment() {
      this.incresase = parseInt(this.totalWTCurrent || 0) + 1;

      if (this.incresase > 99) {
        Swal.fire(
          "error",
          "WT running number exceeds 99. Please update EMAC ID rules before creating more WT records this year.",
          "error"
        );
        return null;
      }

      return this.padTwoDigits(this.incresase);
    },
    getWTProvinceSegment() {
      if (this.province === "" || this.province === null || this.province === undefined) {
        Swal.fire("error", "Province is required before generating EMAC ID.", "error");
        return null;
      }

      return this.padTwoDigits(this.province);
    },
    getWTDistrictSegment() {
      if (this.district === "" || this.district === null || this.district === undefined) {
        Swal.fire("error", "District is required before generating EMAC ID.", "error");
        return null;
      }

      return String(this.district).slice(-2).padStart(2, "0");
    },
    getWTTailSegment() {
      return this.selected == "7372727f-c0f0-4bae-81f3-47bad3f1012d" ? "1" : "2";
    },
    async testGenID() {
      this.org = "T";
      this.date = new Date();
      this.last2digits = this.date.getFullYear().toString().slice(-2);

      const runningSegment = this.getWTRunningSegment();
      const provinceSegment = this.getWTProvinceSegment();
      const districtSegment = this.getWTDistrictSegment();
      const tailSegment = this.getWTTailSegment();

      if (!runningSegment || !provinceSegment || !districtSegment || !tailSegment) {
        this.generate_id = false;
        this.emac_id = "";
        return;
      }

      this.emac_id = `EMC${this.org}${this.last2digits}${runningSegment}${provinceSegment}${districtSegment}${tailSegment}`;

      this.generate_id = true;
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
  },
};
</script>
