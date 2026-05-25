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
        {{ this.$t("waste_disposal") }}
      </h2>
      <div v-if="data.status == 1">
        <v-chip class="ml-6" small color="primary">  {{ this.$t("active") }}</v-chip>
      </div>
      <div v-else>
        <v-chip class="ml-6" small color="warning">  {{ this.$t("suspended") }}</v-chip>
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
              >EMCD ID: {{ data.emac_id }}</v-col
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
                  :label="labels[0]"
                  outlined
                  v-model="data.dis_name_lo"
                  readonly
                ></v-text-field>
                <v-text-field
                  label="EMCD ID"
                  readonly
                  outlined
                  v-model="data.emac_id"
                ></v-text-field>
                <v-text-field
                  :label=labels[4]
                  readonly
                  outlined
                  v-model="data.license_no"
                ></v-text-field>
                <v-text-field
                  label="District"
                  readonly
                  v-model="district"
                  outlined
                ></v-text-field>
                <v-text-field
                  :label="labels[9]"
                  readonly
                  v-model="data.tel"
                  outlined
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  :label="labels[1]"
                  readonly
                  v-model="data.dis_name"
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
                  v-model="data.latlng"
                  outlined
                  readonly
                  label="Latitude and Longitude"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="data.enterprise_no"
                  outlined
                  readonly
                  label="Enterprise No"
                  required
                ></v-text-field>
              </v-col>
              <v-row>
                <v-col
                  ><h3 class="mb-2">{{ this.$t("type_of_service") }}:</h3>
                  <v-radio-group v-model="selected" mandatory>
                    <v-radio
                      dense
                      disabled
                      v-for="i in items"
                      :key="i.text"
                      :label="i.name"
                      :value="i.id"
                    ></v-radio>
                  </v-radio-group>
                </v-col>
                <v-col>
                  <h3 class="mb-2">
                    {{ this.$t("type_of_disposal_service") }}:
                  </h3>

                  <v-radio-group v-model="selectedTod" mandatory>
                    <v-radio
                      dense
                      disabled
                      v-for="i in tods"
                      :key="i.text"
                      :label="i.name"
                      :value="i.id"
                    ></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
              <v-row>
                <v-col @click="toUser">
                  <card-detail
                    :title="labels[13]"
                    :amount="userAmount"
                    img="https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
                  />
                </v-col>
                <v-col @click="toFacilities">
                  <card-detail
                    :title="labels[14]"
                    width="400"
                    :amount="facilitiesAmount"
                    img="https://cdn-icons-png.flaticon.com/512/2238/2238338.png"
                  />
                </v-col>
              </v-row>
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
      </v-row>
    </div>

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
                <v-col cols="3">
                  <v-text-field
                    v-model="data.dis_name_lo"
                    outlined
                    clearable
                    :label="labels[0]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    v-model="data.dis_name"
                    outlined
                    clearable
                    :label="labels[1]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    v-model="data.email"
                    outlined
                    clearable
                    :label="labels[2]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    v-model="data.license_no"
                    outlined
                    clearable
                    :label="labels[4]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    v-model="data.custom_address"
                    outlined
                    clearable
                    :label="labels[8]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    v-model="data.tel"
                    outlined
                    clearable
                    :label="labels[10]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-select
                    v-model="data.status"
                    item-text="name"
                    item-value="value"
                    :items="statuses"
                    :label="labels[12]"
                    required
                    outlined
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  ><h3 class="mb-2"> {{ this.$t("type_of_service") }}:</h3>
                  <v-radio-group v-model="selected" mandatory>
                    <v-radio
                      dense
                      disabled
                      v-for="i in items"
                      :key="i.text"
                      :label="i.name"
                      :value="i.id"
                    ></v-radio>
                  </v-radio-group>
                </v-col>
                <v-col>
                  <h3 class="mb-2"> {{ this.$t("type_of_disposal_service") }}:</h3>

                  <v-radio-group v-model="selectedTod" mandatory>
                    <v-radio
                      dense
                      disabled
                      v-for="i in tods"
                      :key="i.text"
                      :label="i.name"
                      :value="i.id"
                    ></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
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
             {{ this.$t("cancel") }}
            </v-btn>
            <v-btn @click="updateWD" color="primary">  {{ this.$t("update") }} </v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import gql from "graphql-tag";
import update_wd from "~/gql/mutations/update_wd";
import cardDetail from "~/components/company_management/cardDetail.vue";
import getTypeOfServices from "~/mixins/getTypeOfService";
import getDisposalById from "~/mixins/getDisposalById";
import getTypeOfDisposalService from "~/mixins/getTypeOfDisposalServices";
import levels from "~/mixins/getLevels";

export default {
  mixins: [
    getTypeOfServices,
    getDisposalById,
    getTypeOfDisposalService,
    levels,
  ],
  components: { cardDetail },
  data() {
    return {
      data: [],
      checkTypes: [],
      id: this.$route.params.id,
      province: "",
      district: "",
      village: "",
      level_id: "",
      province_id: 0,
      district_id: 0,
      village_id: 0,
      items: [],
      selected: [],
      provinces: [],
      districts: [],
      villages: [],
      filterType: [],
      types: [],
      tod: [],
      tod_id: [],
      tods: [],
      type_id1: "",
      level: "",
      latlng: "",
      selectedTod: [],
      statuses: this.$store.state.statuses,

      edit: [],
      userAmount: "",
      facilitiesAmount: "",
    };
  },

  // async asyncData({ params }) {
  //   const id = params.id
  //   return { id }
  // },

  methods: {
    toUser() {
      this.$router.push("/company_management/WD/USERS/" + this.id);
    },
    toFacilities() {
      this.$router.push("/company_management/WD/FACILITIES/" + this.id);
    },
    back() {
      this.$router.go(-1);
    },
    async getDisposal() {
      this.$apollo
        .query({
          query: require("~/gql/queries/getDisposalById").getDisposalById,
          variables: {
            id: this.id,
          },
        })
        .then((data) => {
          this.data = data.data.emac_disposals;
          this.data = this.data[0];

          this.data.status = this.data.status.toString();

          this.userAmount = this.data.wd_users.length.toString();
          this.facilitiesAmount =
            this.data.disposal_facilities.length.toString();

          // console.log('this.facilitireAmount :>> ', this.facilitiesAmount);

          // console.log('this.data :>> ', this.data)
          // this.level_id = this.data.level.id
          // this.pas_latlng = this.data.latlng

          // this.level = this.data.levelByLevel.level_name
          this.checkTypes = this.data.disposal_type_operations.map((item) => {
            return item.type_of_service.name;
          });

          // console.log('this.checkTypes :>> ', this.checkTypes)

          // this.items = this.data.disposal_type_operations.map((item) => {
          //   return {
          //     id: item.type.id,
          //     name: item.type.name,
          //   }
          // })

          // this.tod = this.data.disposal_type_service_operations.map((item) => {
          //   return item.type_of_disposal_service.name
          // })

          // console.log('this.tod :>> ', this.tod);

          // this.tod_id = this.data.disposal_type_service_operations.map(
          //   (item) => {
          //     return item.type_id
          //   }
          // )
          // console.log('this.tod :>> ', this.tod_id)

          // console.log('this.items :>> ', this.items)

          this.selected = this.data.disposal_type_operations.map((item) => {
            return item.type_of_service.id;
          });

          this.selectedTod = this.data.disposal_type_service_operations.map(
            (item) => {
              return item.type_id;
            }
          );
          this.selected = this.selected[0];

          this.selectedTod = this.selectedTod[0];

          this.province = this.data.village.district.province.pr_name_lo;
          // console.log('this.province :>> ', this.province);
          this.district = this.data.village.district.dr_name_lo;
          this.village = this.data.village.vill_name_lo;

          this.province_id = this.data.village.district.province.pr_id;
          this.district_id = this.data.village.district.dr_id;
          this.village_id = this.data.village.vill_id;
        })
        .catch((err) => {
          // console.log("err :>> ", err);
          //  let text = "Can't connect to server \n Please try again";
          //   if (confirm(text) == true) {
          //     window.location.reload();
          //   } else {
          //     return false;
          //   }
        });
    },
    toggleDialogEdit() {
      this.$store.commit("SET_DIALOGEDIT", !this.$store.state.dialogEdit);
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
          //   console.log('this.districts :>> ', this.districts)
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
          //   console.log('this.districts :>> ', this.villages)
        })
        .catch((err) => {
          // console.log("err :>> ", err);
        });
    },
    editItem() {
      this.toggleDialogEdit();
      this.getProvince();
      this.getDistricts();
      this.getVillages();
      this.getTypeOfServices();
    },
    async updateWD() {
      await this.insertDisposal();
    },
    insertDisposal() {
      this.$apollo
        .mutate({
          mutation: gql`
            ${update_wd.update_wd}
          `,
          variables: {
            id: this.data.id,
            dis_name: this.data.dis_name,
            custom_address: this.data.custom_address,
            dis_name_lo: this.data.dis_name_lo,
            email: this.data.email,
            license_no: this.data.license_no,
            status: this.data.status,
            tel: this.data.tel,
          },
        })
        .then(() => {
          alert("Updated success");
          window.location.reload();
        });
    },
       checkLanguage() {
      const locale = localStorage.getItem("lang");
      this.$i18n.locale = locale;
    },
  },
  mounted() {
    this.getDisposal();
    this.checkLanguage();
  },
  computed: {
    labels() {
      return [
        this.$t("enterprise_namelao"),
        this.$t("enterprise_nameeng"),
        this.$t("email"),
        "EMCD ID",
        this.$t("license_no"),
        "Province",
        "District",
        "Village",
        this.$t("custom_address"),
        this.$t("office_telephone"),
        "Office Tel",
        "Latitude and Longitude",
        this.$t("status"),
        this.$t("user"),
        this.$t("treatment_plant"),
      ];
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