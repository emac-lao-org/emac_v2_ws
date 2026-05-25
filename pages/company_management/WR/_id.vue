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
       {{this.$t('waste_regulator')}}
      </h2>
      <div v-if="data.status == 1">
        <v-chip class="ml-6" small color="primary">  {{ this.$t("active") }}</v-chip>
      </div>
      <div v-else>
        <v-chip class="ml-6" small color="warning">  {{ this.$t("suspended") }}</v-chip>
      </div>

      <v-spacer></v-spacer>
      <div>
        <v-btn outlined color="primary" @click="back">  {{ this.$t("back") }} </v-btn>
        <v-btn @click="editItem" color="primary"> {{ this.$t("edit") }}</v-btn>
      </div>
    </v-card-title>
    <div class="ml-6" style="color: #5c6bc0">
      <v-row class="mb-2" no-gutters>
        <v-col cols="8">
          <v-row>
            <v-col>
              <h3 class="text-uppercase"> {{ this.$t("enterprise_infomation") }}</h3>
            </v-col>
            <v-spacer></v-spacer>
            <v-col class="font-weight-medium" align="end"
              >EMCR ID: {{ data.emac_id }}</v-col
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
                  v-model="data.regulator_name_lo"
                  readonly
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
                <v-text-field
                  label="Latitude & Longitude"
                  readonly
                  v-model="data.latlng"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                   :label="labels[1]"
                  readonly
                  v-model="data.regulator_name"
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
                  v-model="level"
                   :label="labels[11]"
                  outlined
                  readonly
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col @click="toUser">
                <card-detail
                  :title="text_user"
                  :amount="userAmount"
                  img="https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
                />
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
                <v-col cols="6">
                  <v-text-field
                    v-model="data.regulator_name_lo"
                    outlined
                    clearable
                     :label="labels[0]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="data.regulator_name"
                    outlined
                    clearable
                    :label="labels[1]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="data.email"
                    outlined
                    clearable
                    :label="labels[3]"
                    required
                  ></v-text-field>
                </v-col>
                <!-- <v-col cols="6">
                  <v-select
                    v-model="province_id"
                    outlined
                    item-text="pr_name_lo"
                    item-value="pr_id"
                    :items="provinces"
                    label="Province"
                    required
                  ></v-select>
                </v-col>
                <v-col cols="6">
                  <v-select
                    v-model="district_id"
                    outlined
                    item-text="dr_name_lo"
                    item-value="dr_id"
                    :items="districts"
                    label="District"
                    required
                    @click="getDistricts"
                  ></v-select>
                </v-col>
                <v-col cols="6">
                  <v-select
                    v-model="village_id"
                    outlined
                    item-text="vill_name_lo"
                    item-value="vill_id"
                    :items="villages"
                    label="Village"
                    required
                    @click="getVillages"
                  ></v-select>
                </v-col> -->
                <v-col cols="6">
                  <v-text-field
                    v-model="data.custom_address"
                    outlined
                    clearable
                     :label="labels[8]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="data.tel"
                    outlined
                    clearable
                    :label="labels[9]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
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
              {{this.$t('cancel')}}
            </v-btn>
            <v-btn @click="updateWR" color="primary">  {{this.$t('update')}} </v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import levels from '~/mixins/getLevels'
import MapboxMarker from '~/components/company_management/mapboxMarker.vue'
import update_wr from '~/gql/mutations/update_wr'
import cardDetail from '~/components/company_management/cardDetail.vue'
import gql from 'graphql-tag'
const Swal = require('sweetalert2')

export default {

  mixins: [levels],
  components: {
    MapboxMarker,
    cardDetail
  },
  data() {
    return {
      id: this.$route.params.id,
      data: [],
      provinces: [],
      districts: [],
      villages: [],
      province: '',
      district: '',
      village: '',
      province_id: '',
      district_id: '',
      village_id: '',
      level: '',
      level_id: '',
      latlng: '',
      statuses: this.$store.state.statuses,
      userAmount: '',
    }
  },
  methods: {
    toUser() {
      this.$router.push('/company_management/WR/USERS/' + this.id)
    },
    editItem() {
      this.toggleDialogEdit()
      this.getProvince()
      this.getDistricts()
      this.getVillages()
    },
    getLatlng(value) {
      this.latlng = value
      this.latlng = [value[1], value[0]]
      this.latlng = this.latlng.join(',')
      // console.log('this.latlng:P :>> ', this.latlng)
    },
    back() {
      this.$router.go(-1)
    },
    updateWR() {
      this.$apollo
        .mutate({
          mutation: gql`
            ${update_wr.update_wr}
          `,
          variables: {
            id: this.data.id,
            email: this.data.email,
            regulator_name: this.data.regulator_name,
            regulator_name_lo: this.data.regulator_name_lo,
            custom_address: this.data.custom_address,
            tel: this.data.tel,
            status: this.data.status,
          },
        })
        .then(() => {
          alert('Update Organizaiton Success')
          this.toggleDialogEdit()
          window.location.reload()
        })
        .catch((error) => {
          let text = "Can't connect to server \n Please try again";
          if (confirm(text) == true) {
            window.location.reload();
          } else {
            return false;
          }
        })
    },
    toggleDialogEdit() {
      this.$store.commit('SET_DIALOGEDIT', !this.$store.state.dialogEdit)
    },
    async getRegulator() {
      await this.$apollo
        .query({
          query: require('~/gql/queries/getRegulator').getRegulatorById,
          variables: {
            id: this.id,
          },
        })
        .then((data) => {
          this.data = data.data.emac_regulators[0]

          this.pas_latlng = this.data.latlng

          this.level_id = this.data.level_operation.id
          this.level = this.data.level_operation.level_name
          this.userAmount = this.data.wr_users.length.toString()
          this.province = this.data.village.district.province.pr_name_lo
          this.district = this.data.village.district.dr_name_lo
          this.village = this.data.village.vill_name_lo
          this.province_id = this.data.village.district.province.pr_id
          this.district_id = this.data.village.district.dr_id
          this.village_id = this.data.village.vill_id

          // console.log('this.data :>> ', this.data)
        })
        .catch((err) => {
          // console.log('err :>> ', err)
        })
    },

    async getProvince() {
      await this.$apollo
        .query({
          query: require('~/gql/queries/getProvince').getProvince,
        })
        .then((data) => {
          this.provinces = data.data.emac_provinces
          //   console.log('this.emac_provinces :>> ', this.provinces)
        })
        .catch((err) => {
          // console.log('err :>> ', err)
        })
    },
    async getDistricts() {
      await this.$apollo
        .query({
          query: require('~/gql/queries/getDistrict').getDistricts,
          variables: {
            pr_id: this.province_id,
          },
        })
        .then((data) => {
          this.districts = data.data.emac_provinces[0].districts
          // console.log('this.districts :>> ', this.districts)
        })
        .catch((err) => {
          // console.log('err :>> ', err)
        })
    },
    async getVillages() {
      await this.$apollo
        .query({
          query: require('~/gql/queries/getVillages').getVillages,
          variables: {
            dr_id: this.district_id,
          },
        })
        .then((data) => {
          this.villages = data.data.emac_districts[0].villages
          // console.log('this.villages :>> ', this.villages)
        })
        .catch((err) => {
          // console.log('err :>> ', err)
        })
    },
  },
  mounted() {
    this.getRegulator()
  },
  computed: {
    labels(){
      return [
        this.$t("enterprise_namelao"),
        this.$t("enterprise_nameeng"),
        this.$t("enterprise_number"),
        this.$t("email"),
        'EMCT ID',
        'Province',
        'District',
        'Village',
        this.$t("custom_address"),
        this.$t("office_telephone"),
        'Latitude and Longitude',
        this.$t("organization_level"),
        this.$t("status"),
      ]
    },
    text_user(){
      return this.$t('user')
    },
    dialogEdit: {
      get() {
        return this.$store.state.dialogEdit
      },
      set(newVal) {
        this.$store.commit('SET_DIALOGEDIT', newVal)
      },
    },
  },
}
</script>