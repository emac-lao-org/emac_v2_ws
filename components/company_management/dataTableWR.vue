<template>
  <div>
    <v-card-title class="py-0 pt-2">
      <v-row>
        <v-col cols="3">
          <h2 style="border-right: 3px solid #0d47a1">
            {{ text_wr }}
          </h2>
        </v-col>
        <v-spacer></v-spacer>
        <v-col>
          <v-select
            item-text="level_name_fill"
            item-value="level_name_lo"
            :items="items_filter_level"
            v-model="levelFilterValue"
            label="Level"
            required
          ></v-select>
        </v-col>
        <v-col>
          <v-select
            item-text="level_name_lo"
            item-value="level_name"
            :items="items_filter_levelOpt"
            v-model="levelOptFilterValue"
            label="Organization Level"
            required
          ></v-select>
        </v-col>
        <v-col>
          <v-text-field
            v-model="searchWR"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-col>

        <v-col align-self="center" cols="auto" class="d-flex">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon @click="getRegulator" color="primary" class="mr-2" v-bind="attrs" v-on="on">
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
      @update:options="getRegulator"
      class="elevation-1"
    >
      <!-- <template v-slot:[`item.type_operations`]="{ item }">
        {{item.tos}}
      </template> -->
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
        <v-icon @click="deleteItem(item)"> mdi-delete-outline </v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="dialogEditWR" persistent>
      <v-card>
        <div class="mx-6">
          <v-card-title>
            <h2
              style="margin-bottom: -6px"
              class="blue--text text--darken-4 font-weight-bold text-uppercase"
            >
              {{ this.$t("edit") }}
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
                    v-model="edit.regulator_name"
                    label="Regulator Name (Eng)"
                    outlined
                    clearable
                    @change="hasAction = true"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="edit.regulator_name_lo"
                    label="Regulator Name (Lao)"
                    outlined
                    clearable
                    @change="hasAction = true"
                    required
                  ></v-text-field>
                </v-col>
                <!-- <v-col cols="6">
                  <v-text-field
                    v-model="edit.enterprise_no"
                    outlined
                    clearable
                                        @change="hasAction = true"

                    required
                  ></v-text-field>
                </v-col> -->
                <v-col cols="6">
                  <v-text-field
                    v-model="edit.email"
                    label="Email"
                    outlined
                    clearable
                    @change="hasAction = true"
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
                    required
                    @click="getVillages"
                  ></v-select>
                </v-col> -->
                <v-col cols="6">
                  <v-text-field
                    v-model="edit.custom_address"
                    label="Custom Address"
                    outlined
                    clearable
                    @change="hasAction = true"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="6">
                  <v-text-field
                    v-model="edit.tel"
                    label="Office Tel"
                    outlined
                    clearable
                    @change="hasAction = true"
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
                    v-model="edit.status"
                    item-text="name"
                    item-value="value"
                    :items="statuses"
                    @change="hasAction = true"
                    label="Status"
                    required
                    outlined
                  ></v-select>
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
            <v-btn @click="updateWR" color="primary">
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
import levels from "~/mixins/getLevels";
import update_wr from "~/gql/mutations/update_wr";
import gql from "graphql-tag";
import updateStatus from "~/gql/mutations/update_wr_status";
import Swal from "sweetalert2";

export default {
  components: {},
  mixins: [levels],
  data() {
    return {
      items_filter_levelOpt: [],
      items_filter_level: [],
      levelOptFilterValue: null,
      levelFilterValue: null,
      searchWR: "",
      data: [],
      edit: [],
      provinces: [],
      districts: [],
      villages: [],
      statuses: this.$store.state.statuses,
      province: "",
      district: "",
      village: "",
      level_id: "",
      province_id: 0,
      district_id: 0,
      village_id: 0,
      pas_latlng: "",
      loading: false,
      hasAction: false,
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
      this.getRegulator();
    },
    "pagination.itemsPerPage"(val) {
      this.pagination.page = 1;
      this.getRegulator();
    },
    searchWR() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.pagination.page = 1;
        this.getRegulator();
      }, 500);
    },
    levelFilterValue() {
      this.pagination.page = 1;
      this.getRegulator();
    },
    levelOptFilterValue() {
      this.pagination.page = 1;
      this.getRegulator();
    }
  },
  methods: {
    buildWhere() {
      let where = {
        _and: [{ status: { _neq: 4 } }]
      };

      if (this.levelFilterValue && this.levelFilterValue !== 'All') {
        where._and.push({ level_operation: { level: { level_name_lo: { _eq: this.levelFilterValue } } } });
      }

      if (this.levelOptFilterValue && this.levelOptFilterValue !== 'All') {
        where._and.push({ level_operation: { level_name: { _eq: this.levelOptFilterValue } } });
      }

      if (this.searchWR) {
        where._and.push({
          _or: [
            { regulator_name: { _ilike: `%${this.searchWR}%` } },
            { regulator_name_lo: { _ilike: `%${this.searchWR}%` } },
            { enterprise_no: { _ilike: `%${this.searchWR}%` } },
            { tel: { _ilike: `%${this.searchWR}%` } },
            { custom_address: { _ilike: `%${this.searchWR}%` } },
            { email: { _ilike: `%${this.searchWR}%` } },
            { emac_id: { _ilike: `%${this.searchWR}%` } },
          ]
        });
      }
      return where;
    },
    editItem(item) {
      this.edit = item;
      this.toggleDialogWR();
      this.getProvince();
      this.getDistricts();
      this.getVillages();
    },

    check() {
      if (this.hasAction == true) {
        Swal.fire({
          icon: "warning",
          text: "Form has been changed, Please save changes",
        });
      } else {
        this.toggleDialogWR();
      }
    },

    updateWR() {
      this.$apollo
        .mutate({
          mutation: gql`
            ${update_wr.update_wr}
          `,
          variables: {
            id: this.edit.id,
            email: this.edit.email,
            regulator_name: this.edit.regulator_name,
            regulator_name_lo: this.edit.regulator_name_lo,
            custom_address: this.edit.custom_address,
            tel: this.edit.tel,
            status: this.edit.status,
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

    viewCompany(item) {
      // console.log('item :>> ', item)
      this.$router.push("/company_management/WR/" + item.id);
    },

    deleteItem(item) {
      Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover this imaginary file!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          this.$apollo
            .mutate({
              mutation: gql`
                ${updateStatus.updateStatusWR}
              `,
              variables: {
                id: item.id,
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
          Swal.fire("Cancelled", "Your imaginary file is safe :)", "error");
        }
      });
    },

    async getRegulator() {
      this.loading = true;
      const { page, itemsPerPage } = this.pagination;
      const limit = itemsPerPage === -1 ? this.totalCount || 10 : itemsPerPage;
      const offset = (page - 1) * limit;
      const whereCondition = this.buildWhere();

      try {
        const countRes = await this.$apollo.query({
          query: require("~/gql/queries/getRegulator").getRegulatorNeqCount,
          variables: { where: whereCondition },
          fetchPolicy: "network-only",
        });
        this.totalCount = countRes.data.emac_regulators_aggregate.aggregate.count;

        const { data } = await this.$apollo.query({
          query: require("~/gql/queries/getRegulator").getRegulatorNeq,
          variables: { limit, offset, where: whereCondition },
          fetchPolicy: "network-only",
        });

        this.data = data.emac_regulators;
        for (let i = 0; i < this.data.length; i++) {
          let custom_address = this.data[i].custom_address || "";
          this.data[i].cus_addr = custom_address.replaceAll(",", " -");
          if (this.data[i].level_operation && this.data[i].level_operation.level_name) {
            this.data[i].level_lo = this.data[i].level_operation.level_name;
          }
        }
        this.dataFilter = this.data;
        this.loading = false;
      } catch (error) {
        console.error("Error fetching regulator: ", error);
        this.loading = false;
        window.location.reload();
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
            query: require("~/gql/queries/getRegulator").getRegulatorNeq,
            variables: { limit, offset, where: whereCondition },
            fetchPolicy: "network-only",
          });

          let chunk = data.emac_regulators;
          for (let item of chunk) {
            let status_txt = "Deleted";
            if (item.status == 1) status_txt = "Active";
            else if (item.status == 2) status_txt = "Suspended";

            allMappedData.push({
              "Organization Name (Lao)": item.regulator_name_lo || "-",
              "Organization Name (Eng)": item.regulator_name || "-",
              "Enterprise Number": item.enterprise_no || "-",
              "EMCR ID": item.emac_id || "-",
              "Telephone": item.tel || "-",
              "Email": item.email || "-",
              "Level": item.level_operation?.level?.level_name_lo || "-",
              "Organization Level": item.level_operation?.level_name_lo || "-",
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
        const fileName = `WR_${yyyy}-${mm}-${dd}`;

        if (this.exportFormat === 'excel') {
          const XLSX = await import('xlsx');
          const worksheet = XLSX.utils.json_to_sheet(allMappedData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "Waste Regulators");
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

    toggleDialogWR() {
      this.$store.commit("SET_DIALOGEDITWR", !this.$store.state.dialogEditWR);
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
          // console.log('err :>> ', err)
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
          // console.log('err :>> ', err)
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
          // console.log('err :>> ', err)
        });
    },
    // Removed local filter methods
  },
  created() {
    this.getRegulator();
  },
  computed: {
    stt_active() {
      return this.$t("active");
    },
    stt_suspended() {
      return this.$t("suspended");
    },
    stt_delete() {
      return this.$t("deleted");
    },
    text_wr() {
      return this.$t("waste_regulator");
    },
    dialogEditWR: {
      get() {
        return this.$store.state.dialogEditWR;
      },
      set(newVal) {
        this.$store.commit("SET_DIALOGEDITWR", newVal);
      },
    },
    headers() {
      return [
        {
          text: this.$t("organization_name"),
          align: "start",
         
          value: "regulator_name",
        },
        { text: "EMCR ID", value: "emac_id", width: "10%" },
        {
          text: this.$t("office_telephone"),
         
          value: "tel",
          width: "10%",
        },
        {
          text: this.$t("organization_level"),
         
          value: "level_operation.level.level_name_lo",
        },
        {
          text: this.$t("organization_level_name"),
          value: "level_operation.level_name",
        },
        { text: this.$t("address"), value: "custom_address", width: "10%" },
        { text: this.$t("status"), value: "status", align: "center" },
        {
          text: this.$t("action"),
          align: "center",
         
          value: "actions",
          width: "150px",
        },
      ];
    },
  },
};
</script>

<style scoped>
</style>