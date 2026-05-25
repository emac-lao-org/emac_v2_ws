<template>
  <v-card flat class="mx-6 my-6">
    <v-card-title>
      <h2
        class=""
        style="
          border-right: 1px solid #0d47a1;
          padding-right: 12px;
          color: #0d47a1;
        "
      >
        {{ this.$t("waste_generator") }}
      </h2>
      <div v-if="data.status == 1">
        <v-chip class="ml-6" small color="primary">
          {{ this.$t("active") }}</v-chip
        >
      </div>
      <div v-else>
        <v-chip class="ml-6" small color="warning">
          {{ this.$t("suspended") }}</v-chip
        >
      </div>
      <v-spacer></v-spacer>
      <div>
        <v-btn outlined color="primary" @click="back">
          {{ this.$t("back") }}
        </v-btn>
        <v-btn @click="editItem" color="primary"> {{ this.$t("edit") }}</v-btn>
      </div>
    </v-card-title>
    <div class="ml-6" style="color: #5c6bc0">
      <v-row class="mb-2" no-gutters>
        <v-col cols="8">
          <v-row>
            <v-col>
              <h3 class="text-uppercase">
                {{ this.$t("enterprise_infomation") }}
              </h3>
            </v-col>
            <v-spacer></v-spacer>
            <v-col class="font-weight-medium" align="end"
              >EMCG ID: {{ data.emac_id }}</v-col
            >
          </v-row>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="8">
          <div class="pa-2" tile>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  :label="labelsWG[0]"
                  outlined
                  v-model="data.gen_name_lo"
                  readonly
                ></v-text-field>
                <v-text-field
                  :label="labelsWG[2]"
                  readonly
                  outlined
                  v-model="data.enterprise_no"
                ></v-text-field>
                <v-text-field
                  label="District"
                  readonly
                  v-model="district"
                  outlined
                ></v-text-field>
                <v-text-field
                  :label="labelsWG[9]"
                  readonly
                  v-model="data.tel"
                  outlined
                ></v-text-field>
                <v-text-field
                  label="Latitude and Longitude"
                  readonly
                  v-model="data.latlng"
                  outlined
                ></v-text-field>
                <v-text-field
                  :label="labelsWG[8]"
                  readonly
                  v-model="data.custom_address"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  :label="labelsWG[1]"
                  readonly
                  v-model="data.gen_name"
                  outlined
                ></v-text-field>
                <v-text-field
                  label="Village"
                  readonly
                  v-model="village"
                  outlined
                ></v-text-field>
                <v-text-field
                  label="Province"
                  readonly
                  v-model="province"
                  outlined
                ></v-text-field>
                <v-text-field
                  v-model="indusType"
                  label="Industry Type"
                  outlined
                  readonly
                ></v-text-field>
                <v-text-field
                  v-model="level"
                  :label="labelsWG[14]"
                  outlined
                  readonly
                ></v-text-field>
                <v-textarea
                  :label="labelsWG[13]"
                  outlined
                  v-model="data.objectives"
                  readonly
                ></v-textarea>
              </v-col>
            </v-row>
          </div>
        </v-col>
        <v-col>
          <div class="pa-2" outlined tile>
            <div>
              <iframe
                :src="
                  '//maps.google.com/maps?q=' +
                  data.latlng +
                  '&z=17&output=embed'
                "
                width="420"
                height="400"
                style="border: 0"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </v-col>
        <v-col @click="toUser">
          <card-detail
            :title="text_user"
            :amount="userAmount"
            img="https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
          />
        </v-col>
        <v-col @click="toManifest">
          <card-detail
            :title="text_manifest"
            :amount="manifestAmount"
            img="https://cdn-icons-png.flaticon.com/512/2666/2666505.png"
          />
        </v-col>
        <v-col @click="toStorage">
          <card-detail
            :title="text_storage"
            :amount="storageAmount"
            img="https://cdn-icons-png.flaticon.com/512/754/754877.png"
          />
        </v-col>
        <v-col @click="toCatalog">
          <card-detail
            :title="text_catalog"
            :amount="catalogAmount"
            img="https://cdn-icons-png.flaticon.com/512/3486/3486510.png"
          />
        </v-col>
      </v-row>

      <v-dialog v-model="dialogEdit" persistent>
        <v-card>
          <div class="mx-6">
            <v-card-title>
              <h2
                style="margin-bottom: -6px"
                class="
                 
                  blue--text
                  text--darken-4
                  font-weight-bold
                  text-uppercase
                "
              >
                  {{this.$t('edit')}}
              </h2>
              <v-divider
                style="border: 1px solid #0d47a1"
                class="ml-4"
                vertical
              ></v-divider>
            </v-card-title>
            <v-row>
              <v-col cols="7">
                <v-row>
                  <v-col cols="4">
                    <v-text-field
                      v-model="data.gen_name_lo"
                      outlined
                      clearable
                      :label="labelsWG[0]"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                      v-model="data.gen_name"
                      outlined
                      clearable
                      :label="labelsWG[1]"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                      v-model="data.enterprise_no"
                      outlined
                      clearable
                      :label="labelsWG[2]"
                      required
                    ></v-text-field>
                  </v-col>
                  <!-- <v-col cols="4">
                    <v-text-field
                      v-model="data.emac_id"
                      outlined
                      clearable
                      :label="labelsWG[4]"
                      required
                    ></v-text-field>
                  </v-col> -->
                  <v-col cols="4">
                    <v-text-field
                      v-model="data.email"
                      outlined
                      clearable
                      :label="labelsWG[3]"
                      required
                    ></v-text-field>
                  </v-col>
                  <!-- <v-col cols="4">
                    <v-select
                      v-model="province_id"
                      outlined
                      item-text="pr_name_lo"
                      item-value="pr_id"
                      :items="provinces"
                      :label="labelsWG[5]"
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
                      :label="labelsWG[6]"
                      required
                      @click="getDistricts"
                    ></v-select>
                  </v-col>
                  <v-col cols="4">
                    <v-select
                      v-model="village_id"
                      outlined
                      item-text="vill_name_lo"
                      item-value="vill_id"
                      :items="villages"
                      :label="labelsWG[7]"
                      required
                      @click="getVillages"
                    ></v-select>
                  </v-col> -->
                  <v-col cols="4">
                    <v-text-field
                      v-model="data.custom_address"
                      outlined
                      clearable
                      :label="labelsWG[8]"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                      v-model="data.tel"
                      outlined
                      clearable
                      :label="labelsWG[9]"
                      required
                    ></v-text-field>
                  </v-col>
                  <!-- <v-col cols="4">
                    <v-select
                      v-model="level_id"
                      item-text="level_name"
                      item-value="id"
                      :items="levels"
                      label="Organization Level"
                      required
                      outlined
                    ></v-select>
                  </v-col> -->
                  <v-col cols="4">
                    <v-select
                      v-model="data.status"
                      item-text="name"
                      item-value="value"
                      :items="statuses"
                      :label="labelsWG[11]"
                      required
                      outlined
                    ></v-select>
                  </v-col>
                  <v-col cols="4">
                    <v-select
                      v-model="indusType_id"
                      item-text="type_name"
                      item-value="id"
                      :items="types"
                      :label="labelsWG[12]"
                      required
                      outlined
                    ></v-select>
                  </v-col>
                  <v-col cols="9">
                    <v-textarea
                      v-model="data.objectives"
                      outlined
                      :label="labelsWG[13]"
                      required
                    ></v-textarea>
                  </v-col> </v-row
              ></v-col>
              <v-col>
                <div class="pa-2" outlined tile>
                  <div>
                    <iframe
                      :src="
                        '//maps.google.com/maps?q=' +
                        data.latlng +
                        '&z=17&output=embed'
                      "
                      width="420"
                      height="400"
                      style="border: 0"
                      allowfullscreen=""
                      loading="lazy"
                      referrerpolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>
              </v-col>
            </v-row>
            <br />
            <v-card-actions class="mx-4">
              <v-spacer></v-spacer>
              <v-btn
                outlined
                color="primary"
                class="mx-4 my-4"
                @click="toggleDialogEdit"
              >
                {{this.$t('cancel')}}
              </v-btn>
              <v-btn @click="updateWG" color="primary">   {{this.$t('update')}} </v-btn>
            </v-card-actions>
          </div>
        </v-card>
      </v-dialog>
    </div>
  </v-card>
</template>

<script>
import gql from "graphql-tag";
import update_wg from "~/gql/mutations/update_wg";
import cardDetail from "~/components/company_management/cardDetail.vue";
import levels from "~/mixins/getLevels";
// import MapboxMarker from '~/components/company_management/mapboxMarker.vue'

export default {
  components: { cardDetail },
  mixins: [levels],
  name: "view_WG",
  data() {
    return {
      id: this.$route.params.id,
      statuses: this.$store.state.statuses,

      level_id: "",
      level: "",
      data: [],
      province: "",
      district: "",
      village: "",
      province_id: "",
      district_id: "",
      village_id: "",
      provinces: [],
      districts: [],
      villages: [],
      pas_latlng: "",
      indusType: "",
      indusType_id: "",
      types: [],

      userAmount: "",
      manifestAmount: "",
      storageAmount: "",
      catalogAmount: "",
    };
  },
  methods: {
    toUser() {
      this.$router.push("/company_management/WG/USERS/" + this.id);
    },
    toManifest() {
      this.$router.push("/company_management/WG/MANIFESTS/" + this.id);
    },
    toStorage() {
      this.$router.push("/company_management/WG/STORAGES/" + this.id);
    },
    toCatalog() {
      this.$router.push("/company_management/WG/CATALOG/" + this.id);
    },
    // getLatlng(value) {
    //   this.latlng = value
    //   this.latlng = [value[1], value[0]]
    //   this.latlng = this.latlng.join(',')
    //   // console.log('this.latlng:P :>> ', this.latlng)
    // },
    toggleDialogEdit() {
      this.$store.commit("SET_DIALOGEDIT", !this.$store.state.dialogEdit);
    },
    back() {
      this.$router.go(-1);
    },
    editItem() {
      this.toggleDialogEdit();
      this.getProvince();
      this.getDistricts();
      this.getVillages();
      this.getIndustryType();
    },
    updateWG() {
      this.$apollo
        .mutate({
          mutation: gql`
            ${update_wg.update_wg}
          `,
          variables: {
            id: this.data.id,
            email: this.data.email,
            gen_name: this.data.gen_name,
            enterprise_no: this.data.enterprise_no,
            gen_name_lo: this.data.gen_name_lo,
            custom_address: this.data.custom_address,
            tel: this.data.tel,
            status: this.data.status,
            industry_type_id: this.indusType_id,
            objectives: this.data.objectives,
          },
        })
        .then(() => {
          // console.log('data :>> ', data)
          alert("Update Company Success");
          this.toggleDialogEdit();
          window.location.reload();
        })
        .catch((err) => {
          let text = "Can't connect to server \n Please try again";
          if (confirm(text) == true) {
            window.location.reload();
          } else {
            return false;
          }
        });
    },
    getGenerator() {
      this.$apollo
        .query({
          query: require("~/gql/queries/getGenerator").getGeneratorById,
          variables: {
            id: this.id,
          },
        })
        .then((data) => {
          this.data = data.data.emac_generators[0];
          // console.log("this.data :>> ", this.data);
          this.level_id = this.data.level.id;
          this.level = this.data.level.level_name;
          this.province = this.data.village.district.province.pr_name_lo;
          this.district = this.data.village.district.dr_name_lo;
          this.village = this.data.village.vill_name_lo;
          this.pas_latlng = this.data.latlng;
          this.province_id = this.data.village.district.province.pr_id;
          this.district_id = this.data.village.district.dr_id;
          this.village_id = this.data.village.vill_id;
          this.data.status = this.data.status.toString();
          this.indusType = this.data.industry_type.type_name;
          this.indusType_id = this.data.industry_type.id;
          (this.userAmount = this.data.wg_users.length.toString()),
            (this.manifestAmount = this.data.manifests.length.toString()),
            (this.storageAmount = this.data.storages.length.toString()),
            (this.catalogAmount = this.data.catalogs.length.toString());
          // console.log('this.indusType :>> ', this.indusType)

          //   for (let i = 0; i < this.data.length; i++) {
          //     this.data[i].indusType = this.indusType[i]
          //   }

          // console.log('this.indusType :>> ', this.indusType)

          // console.log("this.data :>> ", this.data);
        })
        .catch((err) => {
          // console.log("err :>> ", err);
        });
    },
    async getProvince() {
      await this.$apollo
        .query({
          query: require("~/gql/queries/getProvince").getProvince,
        })
        .then((data) => {
          this.provinces = data.data.emac_provinces;
          //   console.log('this.emac_provinces :>> ', this.provinces)
        })
        .catch((err) => {
          // console.log("err :>> ", err);
        });
    },
    async getDistricts() {
      await this.$apollo
        .query({
          query: require("~/gql/queries/getDistrict").getDistricts,
          variables: {
            pr_id: this.province_id,
          },
        })
        .then((data) => {
          this.districts = data.data.emac_provinces[0].districts;
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
            dr_id: this.district_id,
          },
        })
        .then((data) => {
          this.villages = data.data.emac_districts[0].villages;
          // console.log("this.villages :>> ", this.villages);
        })
        .catch((err) => {
          // console.log("err :>> ", err);
        });
    },
    async getIndustryType() {
      await this.$apollo
        .query({
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
     checkLanguage() {
      const locale = localStorage.getItem("lang");
      this.$i18n.locale = locale;
    },
  },
  mounted() {
    this.getGenerator();
    this.checkLanguage();
  },
  computed: {
    text_user() {
      return this.$t("user");
    },
    text_manifest() {
      return this.$t("manifest");
    },
    text_storage() {
      return this.$t("storage");
    },
    text_catalog() {
      return this.$t("catalog");
    },
    labelsWG(){
      return [
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
        "Latitude and Longitude",
        this.$t("status"),
        this.$t("industry_type"),
        this.$t("objective"),
        this.$t("organization_level"),
        this.$t("user"),


      ]
    },
    dialogEdit: {
      get() {
        return this.$store.state.dialogEdit;
      },
      set(newVal) {
        this.$store.commit("SET_DIALOGEDIT", newVal);
      },
    },
  },
};
</script>

<style>
</style>