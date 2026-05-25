<template>
  <div>
    <v-card-title class="py-0 pt-2">
      <v-row>
        <v-col cols="4">
          <h2 style="border-right: 3px solid #0d47a1">
            {{ text_wg }}
          </h2>
        </v-col>
        <v-spacer></v-spacer>
        <v-col>
          <v-select
            item-text="name_fil"
            item-value="name"
            :items="provinces_filter_type"
            v-model="provinceFilterValue"
            label="Province"
            required
          ></v-select>
        </v-col>
        <v-col>
          <v-select
            item-text="name_fil"
            item-value="name"
            :items="items_filter_type"
            v-model="industFilterValue"
            label="Type"
            required
          ></v-select>
        </v-col>
        <v-col>
          <v-text-field
            v-model="searchWG"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-col>
        <v-col align-self="center" cols="auto" class="d-flex">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon @click="getGenerator" color="primary" class="mr-2" v-bind="attrs" v-on="on">
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </template>
            <span>Reload Data</span>
          </v-tooltip>
          <v-btn @click="dialogExportType = true" color="primary"> Export </v-btn>
        </v-col>
      </v-row>
    </v-card-title>

    <v-data-table
      :loading="loading"
      :headers="headers"
      :items="data"
      :server-items-length="totalCount"
      :options.sync="pagination"
      @update:options="getGenerator"
      class="elevation-1"
    >
      <!-- <template v-slot:[`item.type_operations`]="{ item }">
        {{item.tos}}
      </template> -->
      <template v-slot:[`item.custom_address`]="{ item }">
        {{ item.custom_address }}
      </template>
      <template v-slot:[`item.status`]="{ item }">
        <div v-if="item.status == 1">
          <v-chip small color="primary">{{ stt_active }}</v-chip>
        </div>
        <div v-else-if="item.status == 2">
          <v-chip small color="warning">{{ stt_suspended }}</v-chip>
        </div>
        <div v-else-if="item.status == 3">
          <v-chip small color="error">{{ stt_delete }}</v-chip>
        </div>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon class="mr-2" @click="viewCompany(item)"> mdi-eye</v-icon>
        <v-icon class="mr-2" @click="editItem(item)">
          mdi-pencil-outline
        </v-icon>
        <v-icon @click="updateStatus(item)"> mdi-delete-outline </v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="dialogEditWG" persistent>
      <v-card>
        <div class="mx-6">
          <v-card-title>
            <h2
              style="margin-bottom: -6px"
              class="blue--text text--darken-4 font-weight-bold text-uppercase"
            >
              {{ text_edit }}
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
                    v-model="edit.gen_name"
                    outlined
                    clearable
                    @change="hasAction = true"
                    :label="labelsWG[0]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    v-model="edit.gen_name_lo"
                    outlined
                    clearable
                    @change="hasAction = true"
                    :label="labelsWG[1]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    v-model="edit.enterprise_no"
                    outlined
                    clearable
                    @change="hasAction = true"
                    :label="labelsWG[2]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    v-model="edit.email"
                    outlined
                    clearable
                    @change="hasAction = true"
                    :label="labelsWG[3]"
                    required
                  ></v-text-field>
                </v-col>
                <!-- <v-col cols="4">
                  <v-text-field
                    v-model="edit.emac_id"
                    outlined
                    clearable
                                      @change="hasAction = true"

                    :label="labelsWG[4]"
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
                    v-model="edit.custom_address"
                    outlined
                    clearable
                    @change="hasAction = true"
                    :label="labelsWG[8]"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="4">
                  <v-text-field
                    v-model="edit.tel"
                    outlined
                    clearable
                    @change="hasAction = true"
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
                    v-model="edit.status"
                    item-text="name"
                    item-value="value"
                    :items="statuses"
                    @change="hasAction = true"
                    :label="labelsWG[11]"
                    required
                    outlined
                  ></v-select>
                </v-col>
                <v-col cols="4">
                  <v-select
                    v-model="idusType_id"
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
                    v-model="edit.objectives"
                    label="Description"
                    required
                    @change="hasAction = true"
                    outlined
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-col>
            <!-- <v-col>
              <mapbox-marker @latlng="getLatlng" />
            </v-col> -->
            <v-col>
              <div class="pa-2" outlined tile>
                <div>
                  <iframe
                    :src="
                      '//maps.google.com/maps?q=' +
                      edit.latlng +
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
          <v-card-actions class="mx-4">
            <v-spacer></v-spacer>
            <v-btn outlined color="primary" class="mx-4 my-4" @click="check">
              {{ this.$t("cancel") }}
            </v-btn>
            <v-btn @click="updateWG" color="primary">
              <!-- <v-icon small>mdi-plus</v-icon> -->
              {{ this.$t("update") }}
            </v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog max-width="350px" v-model="dialogExportType">
      <v-card class="pa-4 text-center">
        <v-card-title class="justify-center">Select Export Format</v-card-title>
        <v-card-actions class="justify-center">
          <v-btn color="primary" outlined @click="startExport('csv')">CSV</v-btn>
          <v-btn color="success" outlined @click="startExport('excel')">Excel (.xlsx)</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog class="pa-4" max-width="400px" persistent v-model="dialogExport">
      <v-card class="pa-4">
        <v-card-text class="text-center pt-4">
          <h3 class="font-weight-bold mb-2">Exporting Data...</h3>
          <p>{{ exportProgress }} / {{ exportTotal }} records processed</p>
          <v-progress-linear
            color="primary"
            height="15"
            :value="exportTotal > 0 ? (exportProgress / exportTotal) * 100 : 0"
            striped
            rounded
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import gql from "graphql-tag";
import update_wg_status from "~/gql/mutations/update_wg_status";
import update_wg from "~/gql/mutations/update_wg";
import mapboxMarker from "./mapboxMarker.vue";
import levels from "~/mixins/getLevels";
import Swal from "sweetalert2";
export default {
  components: { mapboxMarker },
  mixins: [levels],
  data() {
    return {
      items_filter_type: [],
      provinces_filter_type: [],
      industFilterValue: null,
      provinceFilterValue: null,
      hasAction: false,
      searchWG: "",
      statuses: this.$store.state.statuses,
      data: [],
      provinces: [],
      districts: [],
      villages: [],
      idusType: "",
      idusType_id: "",
      edit: [],
      province_id: 0,
      district_id: 0,
      village_id: 0,
      types: [],
      id: "",
      latlng: "",
      level_id: "",
      pas_latlng: "",
      loading: false,
      dataFilter: [],
      status_text: "",
      totalCount: 0,
      searchTimeout: null,
      pagination: {
        page: 1,
        itemsPerPage: 10,
      },
      dialogExportType: false,
      dialogExport: false,
      exportProgress: 0,
      exportTotal: 0,
      exportFormat: 'csv',
    };
  },
  watch: {
    "pagination.page"(val) {
      this.getGenerator();
    },
    "pagination.itemsPerPage"(val) {
      this.pagination.page = 1;
      this.getGenerator();
    },
    searchWG() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.pagination.page = 1;
        this.getGenerator();
      }, 500);
    },
    provinceFilterValue() {
      this.pagination.page = 1;
      this.getGenerator();
    },
    industFilterValue() {
      this.pagination.page = 1;
      this.getGenerator();
    }
  },
  methods: {
    getLatlng(value) {
      this.latlng = value;
      this.latlng = [value[1], value[0]];
      this.latlng = this.latlng.join(",");
      // console.log('this.latlng:P :>> ', this.latlng)
    },
    check() {
      if (this.hasAction == true) {
        Swal.fire({
          icon: "warning",
          text: "Form has been changed, Please save changes",
        });
      } else {
        this.toggleDialogWG();
      }
    },
    toggleDialogWG() {
      this.$store.commit("SET_DIALOGEDITWG", !this.$store.state.dialogEditWG);
    },
    editItem(item) {
      this.toggleDialogWG();
      this.edit = item;
      this.level_id = this.edit.level.id;
      this.pas_latlng = this.edit.latlng;
      this.province_id = this.edit.village.district.province.pr_id;
      this.district_id = this.edit.village.district.dr_id;
      this.village_id = this.edit.village.vill_id;
      this.idusType_id = this.edit.industry_type.id;
      // console.log('this.indusType_id :>> ', this.idusType_id)
      // console.log('this.indusTypeEdit :>> ', this.idusType_id)
      // console.log('this.edit.id :>> ', this.edit.id)

      this.getProvince();
      this.getDistricts();
      this.getVillages();
      // console.log('this.edit :>> ', this.edit)
      // this.edit = true
    },
    // deleteItem(item) {
    //   this.updateTypeWG(item);
    // },
    viewCompany(item) {
      // console.log('item :>> ', item)
      this.$router.push("/company_management/WG/" + item.id);
    },
    updateWG() {
      this.$apollo
        .mutate({
          mutation: gql`
            ${update_wg.update_wg}
          `,
          variables: {
            id: this.edit.id,
            email: this.edit.email,
            // emac_id: this.edit.emac_id,
            gen_name: this.edit.gen_name,
            enterprise_no: this.edit.enterprise_no,
            gen_name_lo: this.edit.gen_name_lo,
            custom_address: this.edit.custom_address,
            tel: this.edit.tel,
            status: this.edit.status,
            // vill_id: this.village_id,
            // latlng: this.latlng || this.pas_latlng,
            // level_id: this.level_id,
            industry_type_id: this.idusType_id,
            objectives: this.edit.objectives,
          },
        })
        .then(() => {
          this.dialog = false;
          Swal.fire("Updated!", "User has been updated.", "success").then(
            () => {
              window.location.reload();
            }
          );
        })
        .catch((error) => {
          // console.log(error);
        });
    },

    updateStatus(item) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          this.$apollo
            .mutate({
              mutation: gql`
                ${update_wg_status.update_statusWG}
              `,
              variables: {
                id: item.id,
                status: 3,
              },
            })
            .then(() => {
              Swal.fire("Deleted!", "Your file has been deleted.");
              window.location.reload();
            })
            .catch((error) => {
              // console.log(error);
            });
        } else {
          Swal.fire("Cancelled", "");
        }
      });
    },
    buildWhere() {
      let where = {
        _and: [{ status: { _neq: 4 } }]
      };

      if (this.provinceFilterValue && this.provinceFilterValue !== 'All') {
        where._and.push({ village: { district: { province: { pr_name_lo: { _ilike: `%${this.provinceFilterValue}%` } } } } });
      }

      if (this.industFilterValue && this.industFilterValue !== 'All') {
        where._and.push({ industry_type: { type_name: { _ilike: `%${this.industFilterValue}%` } } });
      }

      if (this.searchWG) {
        where._and.push({
          _or: [
            { gen_name_lo: { _ilike: `%${this.searchWG}%` } },
            { enterprise_no: { _ilike: `%${this.searchWG}%` } },
            { tel: { _ilike: `%${this.searchWG}%` } },
            { custom_address: { _ilike: `%${this.searchWG}%` } },
          ]
        });
      }
      return where;
    },
    async getGenerator() {
      this.loading = true;
      const { page, itemsPerPage } = this.pagination;
      const limit = itemsPerPage === -1 ? this.totalCount || 10 : itemsPerPage;
      const offset = (page - 1) * limit;
      const whereCondition = this.buildWhere();

      try {
        const countRes = await this.$apollo.query({
          query: require("~/gql/queries/getGenerator").getGeneratorNeqCount,
          variables: { where: whereCondition },
          fetchPolicy: "network-only",
        });
        this.totalCount = countRes.data.emac_generators_aggregate.aggregate.count;

        const { data } = await this.$apollo.query({
          query: require("~/gql/queries/getGenerator").getGeneratorNeq,
          variables: { limit, offset, where: whereCondition },
          fetchPolicy: "network-only",
        });

        this.data = data.emac_generators;

        let status_text = this.data.map((item) => {
            if (item.status == 1) { return "Active"; } 
            else if (item.status == 2) { return "Suspened"; } 
            else { return "Deleted"; }
        });

        for (let i = 0; i < this.data.length; i++) {
            this.data[i].indusType = this.data[i].industry_type.type_name;
            this.data[i].indusType_fil = this.data[i].industry_type.type_name.replaceAll(",", " -");
            this.data[i].cus_addr = this.data[i].custom_address ? this.data[i].custom_address.replaceAll(",", " -") : "";
            this.data[i].village_lo = this.data[i].village.vill_name_lo;
            this.data[i].district_lo = this.data[i].village.district.dr_name_lo;
            this.data[i].province_lo = this.data[i].village.district.province.pr_name_lo;
            this.data[i].level_lo = this.data[i]?.level?.level_name_lo || '-';
            this.data[i].status_txt = status_text[i];
        }

        this.dataFilter = this.data;
        this.loading = false;
      } catch (err) {
        console.error(err);
        // this.getToken(); 
      }
    },

    convertToCSV(arr) {
      if (!arr || !arr.length) return "";
      const headers = Object.keys(arr[0]);
      const array = [headers].concat(arr.map(item => headers.map(header => item[header])));
      
      return array
        .map(row => {
          return row
            .map(val => {
              let str = val === null || val === undefined ? "" : String(val);
              str = str.replace(/"/g, '""');
              if (str.search(/("|,|\n)/g) >= 0) {
                str = `"${str}"`;
              }
              return str;
            })
            .join(",");
        })
        .join("\n");
    },

    async startExport(format) {
      this.exportFormat = format;
      this.dialogExportType = false;

      if (this.totalCount === 0) {
        Swal.fire("Warning", "No data to export", "warning");
        return;
      }

      this.dialogExport = true;
      this.exportTotal = this.totalCount;
      this.exportProgress = 0;

      const limit = 1000;
      let offset = 0;
      const whereCondition = this.buildWhere();
      let allMappedData = [];

      try {
        while (offset < this.totalCount) {
          const { data } = await this.$apollo.query({
            query: require("~/gql/queries/getGenerator").getGeneratorNeq,
            variables: { limit, offset, where: whereCondition },
            fetchPolicy: "network-only",
          });

          let chunk = data.emac_generators;
          for (let item of chunk) {
            let status_txt = "Deleted";
            if (item.status == 1) status_txt = "Active";
            else if (item.status == 2) status_txt = "Suspended";

            allMappedData.push({
              "Enterprise Name (Lao)": item.gen_name_lo || "-",
              "Enterprise Name (Eng)": item.gen_name || "-",
              "Enterprise Number": item.enterprise_no || "-",
              "EMCG ID": item.emac_id || "-",
              "Telephone": item.tel || "-",
              "Email": item.email || "-",
              "Industry Type": item.industry_type?.type_name || "-",
              "Organization Level": item.level?.level_name_lo || "-",
              "Province": item.village?.district?.province?.pr_name_lo || "-",
              "District": item.village?.district?.dr_name_lo || "-",
              "Village": item.village?.vill_name_lo || "-",
              "Custom Address": item.custom_address || "-",
              "Status": status_txt
            });
            this.exportProgress++;
          }
          offset += limit;
        }

        const ds = new Date();
        const yyyy = ds.getFullYear();
        const mm = String(ds.getMonth() + 1).padStart(2, '0');
        const dd = String(ds.getDate()).padStart(2, '0');
        const fileName = `Waste_Generator_${yyyy}-${mm}-${dd}`;

        if (this.exportFormat === 'excel') {
          const XLSX = await import('xlsx');
          const worksheet = XLSX.utils.json_to_sheet(allMappedData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "Waste Generators");
          XLSX.writeFile(workbook, `${fileName}.xlsx`);
        } else {
          const csvString = this.convertToCSV(allMappedData);
          const element = document.createElement("a");
          const file = new Blob([csvString], { type: "text/csv;charset=utf-8\uFEFF" });
          element.href = URL.createObjectURL(file);
          element.download = `${fileName}.csv`;
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
        }

      } catch (error) {
        console.error("Export Error: ", error);
        Swal.fire("Error", "There was an error while exporting data.", "error");
      } finally {
        setTimeout(() => {
          this.dialogExport = false;
        }, 500);
      }
    },

    async getProvince() {
      await this.$apollo
        .query({
          query: require("~/gql/queries/getProvince").getProvince,
        })
        .then((data) => {
          this.provinces = data.data.emac_provinces;
          this.provinces_filter_type = this.provinces.map((pr) => {
            return { name: pr.pr_name_lo, name_fil: pr.pr_name_lo };
          });
          this.provinces_filter_type.unshift({ id: 0, name: null, name_fil: "All" });
        })
        .catch((err) => {
          // this.getToken();
        });
    },
    async getDistricts() {
      await this.$apollo
        .query({
          query: require("~/gql/queries/getDistrict").getDistricts,
          variables: {
            pr_id: this.province_id || 1,
          },
        })
        .then((data) => {
          this.districts = data.data.emac_provinces[0].districts;
          // console.log('this.districts :>> ', this.districts)
        })
        .catch((err) => {
          // this.getToken();
        });
    },
    async getVillages() {
      await this.$apollo
        .query({
          query: require("~/gql/queries/getVillages").getVillages,
          variables: {
            dr_id: this.district_id || 101,
          },
        })
        .then((data) => {
          this.villages = data.data.emac_districts[0].villages;
          // console.log('this.villages :>> ', this.villages)
        })
        .catch((err) => {
          // this.getToken();
        });
    },
    async getIndustryType() {
      await this.$apollo
        .query({
          query: require("~/gql/queries/getIndustryType").getIndustryType,
        })
        .then((data) => {
          this.types = data.data.emac_industry_types;
          this.types.forEach((item) => {
            item.type_name_fil = item.type_name;
          });
          this.items_filter_type = this.types.map((ty) => {
            return { name: ty.type_name, name_fil: ty.type_name };
          });
          this.items_filter_type.unshift({ id: 0, name: null, name_fil: "All" });
        })
        .catch(() => {
          window.location.reload();
        });
    },
  },
  mounted() {
    this.getGenerator(), this.getProvince();
    this.getDistricts(), this.getVillages(), this.getIndustryType();
  },
  computed: {
    text_edit() {
      return this.$t("edit");
    },
    stt_active() {
      return this.$t("active");
    },
    stt_suspended() {
      return this.$t("suspended");
    },
    stt_delete() {
      return this.$t("deleted");
    },
    text_wg() {
      return this.$t("waste_generator");
    },
    dialogEditWG: {
      get() {
        return this.$store.state.dialogEditWG;
      },
      set(newVal) {
        this.$store.commit("SET_DIALOGEDITWG", newVal);
      },
    },
    headers() {
      return [
        {
          text: this.$t("enterprise_name"),
          align: "start",

          value: "gen_name_lo",
        },
        {
          text: this.$t("enterprise_number"),

          value: "enterprise_no",
        },
        { text: "EMCG ID", value: "emac_id" },
        // { text: "Address ",  value: "custom_address", width: "10%" },
        { text: this.$t("office_telephone"), value: "tel", width: "100px" },
        {
          text: this.$t("industry_type"),

          value: "indusType",
          width: "250px",
        },
        {
          text: this.$t("level"),

          value: "level.level_name_lo",
          filter: this.levelFilter,
          width: "100px",
        },
        // {
        //   text: this.$t("custom_address"),
        //
        //   value: "custom_address",
        //   filter: this.custom_address,
        //   width: "250px",
        // },
        {
          text: this.$t("province"),

          value: "village.district.province.pr_name_lo",
          width: "200px",
        },
        { text: this.$t("status"), value: "status" },
        {
          text: this.$t("action"),
          align: "center",

          value: "actions",
          width: "150px",
        },
      ];
    },
    labelsWG() {
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
      ];
    },
  },
};
</script>

<style scoped>
#app {
  font-family: "Phetsarath OT";
}
</style>