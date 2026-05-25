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
       {{this.$t('waste_transporter')}}
      </h2>
       <div v-if="data.status == 1">
        <v-chip class="ml-6" small color="primary">  {{ this.$t("active") }}</v-chip>
      </div>
      <div v-else>
        <v-chip class="ml-6" small color="warning">  {{ this.$t("suspended") }}</v-chip>
      </div>
      <v-spacer></v-spacer>
      <div>
        <v-btn outlined color="primary" @click="back">  {{this.$t('back')}} </v-btn>
        <v-btn @click="editItem" color="primary"> {{this.$t('edit')}}</v-btn>
      </div>
    </v-card-title>
    <div class="ml-6" style="color: #5c6bc0">
      <v-row class="mb-2" no-gutters>
        <v-col cols="8">
          <v-row>
            <v-col>
              <h3 class="text-uppercase"> {{this.$t('enterprise_infomation')}}</h3>
            </v-col>
            <v-spacer></v-spacer>
            <v-col class="font-weight-medium" align="end"
              >EMCT ID: {{ data.emac_id }}</v-col
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
                  v-model="data.tran_name_lo"
                  readonly
                ></v-text-field>
                <v-text-field
                  :label="labels[2]"
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
                   :label="labels[9]"
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
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  :label="labels[1]"
                  readonly
                  v-model="data.tran_name"
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
                <!-- <v-text-field
                  v-model="title"
                  label="Type of service"
                  outlined
                  readonly
                ></v-text-field> -->
                <!-- <v-text-field
                  v-model="level"
                  label="Organization Level"
                  outlined
                  readonly
                ></v-text-field> -->
                <!-- <v-checkbox
                  dense
                  v-for="i in items"
                  :key="i.text"
                  v-model="selected"
                  :label="i.name"
                  :value="i.id"
                  readonly
                ></v-checkbox> -->
                <v-row>
                  <v-col
                    ><h3 class="mb-2">{{this.$t('type_of_service')}}</h3>
                    <v-radio-group v-model="selected" mandatory>
                      <v-radio
                        dense
                        disabled
                        v-for="i in types"
                        :key="i.text"
                        :label="i.name"
                        :value="i.id"
                      ></v-radio>
                    </v-radio-group>
                  </v-col>
                </v-row>
              </v-col>
              <v-col @click="toUser">
                <card-detail
                  :title="text_user"
                  :amount="userAmount"
                  img="https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
                />
              </v-col>
              <v-col @click="toVehicle">
                <card-detail
                  :title="text_vehicle"
                  :amount="vehicleAmount"
                  img="https://cdn-icons-png.flaticon.com/512/3256/3256274.png"
                />
              </v-col>
              <v-col @click="toDriver">
                <card-detail
                  :title="text_driver"
                  :amount="driverAmount"
                  img="https://cdn-icons-png.flaticon.com/512/2684/2684225.png"
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
                    v-model="data.tran_name"
                    outlined
                    clearable
                    :label="labels[0]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="data.tran_name_lo"
                    outlined
                    clearable
                    :label="labels[1]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="data.enterprise_no"
                    outlined
                    clearable
                    :label="labels[2]"
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
                  <v-text-field
                    v-model="data.emac_id"
                    outlined
                    clearable
                    :label="labels[4]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-select
                    v-model="province_id"
                    outlined
                    item-text="pr_name_lo"
                    item-value="pr_id"
                    :items="provinces"
                    :label="labels[5]"
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
                    :label="labels[6]"
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
                    :label="labels[7]"
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
                <!-- <v-col cols="6">
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
                <v-col cols="6">
                  <v-select
                    v-model="data.status"
                    item-text="name"
                    item-value="value"
                    :items="statuses"
                    label="Status"
                    required
                    outlined
                  ></v-select>
                </v-col>
                <!-- <v-col>
                  <h3 class="mb-2">Type of services:</h3>
                  <v-radio-group v-model="selected" mandatory>
                    <v-radio
                      dense
                      disabled
                      v-for="(item, index) in types"
                      :key="index"
                      :label="item.name"
                      :value="item.id"
                    ></v-radio>
                  </v-radio-group>
                </v-col> -->
              </v-row>
            </v-col>
            <!-- <v-col>
              <MapboxMarker @latlng="getLatlng" />
            </v-col> -->
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
            <v-btn @click="updateWT" color="primary"> {{this.$t('update')}} </v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import gql from 'graphql-tag'
// import delete_wt_type_op from '~/gql/mutations/delete_wt_type_op'
// import insertType from '~/gql/mutations/insert_wt_type_op'
import update_wt from '~/gql/mutations/update_wt'
import cardDetail from '~/components/company_management/cardDetail.vue'
// import MapboxMarker from '~/components/company_management/mapboxMarker.vue'
import levels from '~/mixins/getLevels'
import loading from '~/components/loading.vue'
 const Swal = require('sweetalert2')

export default {
  components: { cardDetail,loading },
  mixins: [levels],
  data() {
    return {
      data: [],
      title: [],
      checkTypes: [],
      level: '',
      province: '',
      district: '',
      village: '',
      province_id: '',
      district_id: '',
      village_id: '',
      level_id: '',
      items: [],
      selected: [],
      provinces: [],
      districts: [],
      villages: [],
      filterType: [],
      types: [],
          statuses: this.$store.state.statuses,
      edit: [],
      pas_latlng: '',
      userAmount: '',
      driverAmount: '',
      vehicleAmount: '',
    }
  },

  async asyncData({ params }) {
    const id = params.id
    return { id }
  },

  methods: {
    toUser() {
      this.$router.push('/company_management/WT/USERS/' + this.id)
    },
    toVehicle() {
      this.$router.push('/company_management/WT/VEHICLES/' + this.id)
    },
    toDriver() {
      this.$router.push('/company_management/WT/DRIVERS/' + this.id)
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
    async getTransporters() {
      this.$apollo
        .query({
          query: require('~/gql/queries/getTransportersById')
            .getTransportersById,
          variables: {
            id: this.id,
          },
        })
        .then((data) => {
          this.data = data.data.emac_transporters
          this.data = this.data[0]

          this.data.status = this.data.status.toString()

          // console.log('this.data :>> ', this.data)

          this.userAmount = this.data.wt_users.length.toString()
          this.driverAmount = this.data.drivers.length.toString()
          this.vehicleAmount = this.data.vehicles.length.toString()

          // this.selected = this.data.type_operations.map((item) => {
          //   return item.type_id
          // })
          this.selected = this.data.type_operations[0].type_id

          console.log('this.selected :>> ', this.selected)

          this.province = this.data.village.district.province.pr_name_lo

          this.district = this.data.village.district.dr_name_lo

          this.village = this.data.village.vill_name_lo

          this.province_id = this.data.village.district.province.pr_id

          this.district_id = this.data.village.dr_id

          this.village_id = this.data.village.vill_id
        })
        .catch((err) => {
          // console.log('err :>> ', err)
        })
    },
    async getTypeOfServices() {
      await this.$apollo
        .query({
          query: require('~/gql/queries/getTypeofservices').getTypeofservices,
        })
        .then((data) => {
          // console.log('Data :>> ', data.data.emac_transporters)
          this.types = data.data.emac_type_of_services
          // console.log('this.types :>> ', this.types)
        })
        .catch((err) => {
          // console.log('err :>> ', err)
        })
    },
    toggleDialogEdit() {
      this.$store.commit('SET_DIALOGEDIT', !this.$store.state.dialogEdit)
    },
    editItem() {
      this.toggleDialogEdit()
      this.getProvince()
      this.getDistricts()
      this.getVillages()
      this.getTypeOfServices()
    },
    async updateWT() {
      await this.$apollo
        .mutate({
          mutation: gql`
            ${update_wt.update_wt}
          `,
          variables: {
            id: this.data.id,
            email: this.data.email,
            tran_name: this.data.tran_name,
            enterprise_no: this.data.enterprise_no,
            tran_name_lo: this.data.tran_name_lo,
            custom_address: this.data.custom_address,
            tel: this.data.tel,
            status: this.data.status,
          },
        })
        .then(() => {
          // console.log('data :>> ', data)
          alert('Update Organizaiton Success')
          this.toggleDialogEdit()
          window.location.reload()
        })
        .catch((err) => {
         let text = "Can't connect to server \n Please try again";
          if (confirm(text) == true) {
            window.location.reload();
          } else {
            return false;
          }
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
            pr_id: this.data.village.district.pr_id,
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
            dr_id: this.data.village.dr_id,
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
    this.getTransporters()
    this.getTypeOfServices()
  },
  computed: {
     text_user() {
      return this.$t("user");
    },
     text_driver() {
      return this.$t("driver");
    },
     text_vehicle() {
      return this.$t("vehicle");
    },
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
      ]
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