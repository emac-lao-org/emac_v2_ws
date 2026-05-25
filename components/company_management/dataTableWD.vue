<template>
  <div>
  
    <v-card-title class="py-0 pt-2">
      <v-row>
        <v-col cols="4">
          <h2 style="border-right: 3px solid #0d47a1">
            {{ text_wd }}
          </h2>
        </v-col>
        <v-spacer></v-spacer>
        <v-col> 
          <v-select
            item-text="name"
            item-value="value"
            :items="items_filter_type"
            v-model="typeFilterValue"
            label="Type of service"
            required
          ></v-select>
        </v-col>
        <v-col>
          <v-select
            item-text="name_eng"
            item-value="name"
            :items="items_filter_type_of_dis"
            v-model="typeOfDisFilterValue"
            label="Type of disposal"
            required
          ></v-select>
        </v-col>
        <v-col>
          <v-text-field
            v-model="searchWT"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-col>
        <v-col align-self="center" cols="auto" class="d-flex">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon @click="getDisposal" color="primary" class="mr-2" v-bind="attrs" v-on="on">
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
      @update:options="getDisposal"
      class="elevation-1"
    >
      <template v-slot:[`item.tod`]="{ item }">
        <dir v-if="item.tod.length == 1">
          {{ item.tod[0] }}
        </dir>
        <dir v-else-if="item.tod.length == 2">
          {{ item.tod[0] }}<br />
          {{ item.tod[1] }}
        </dir>
        <div v-else>
          {{ item.tod[0] }}<br />
          {{ item.tod[1] }}<br />
          {{ item.tod[2] }}
        </div>
      </template>

      <template v-slot:[`item.disposal_type_operations`]="{ item }">
        {{ item.tos }}
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
        <v-icon @click="deleteItem(item)"> mdi-delete-outline </v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="dialogEditWD" persistent>
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
                    v-model="edit.dis_name_lo"
                    outlined
                    clearable
                    @change="hasAction = true"
                    :label="labelsWD[0]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="edit.dis_name"
                    outlined
                    clearable
                    @change="hasAction = true"
                    :label="labelsWD[1]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="edit.email"
                    outlined
                    clearable
                    @change="hasAction = true"
                    :label="labelsWD[2]"
                    required
                  ></v-text-field>
                </v-col>
                <!-- <v-col cols="6">
                  <v-text-field
                    v-model="edit.emac_id"
                    outlined
                    clearable
                                        @change="hasAction = true"

                    :label="labelsWD[3]"
                    required
                  ></v-text-field>
                </v-col> -->
                <v-col cols="6">
                  <v-text-field
                    v-model="edit.license_no"
                    outlined
                    clearable
                    @change="hasAction = true"
                    :label="labelsWD[4]"
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
                    :label="labelsWD[5]"
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
                    :label="labelsWD[6]"
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
                    :label="labelsWD[7]"
                    required
                    @click="getVillages"
                  ></v-select>
                </v-col> -->
                <v-col cols="6">
                  <v-text-field
                    v-model="edit.custom_address"
                    outlined
                    clearable
                    @change="hasAction = true"
                    :label="labelsWD[8]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="edit.tel"
                    outlined
                    clearable
                    @change="hasAction = true"
                    :label="labelsWD[10]"
                    required
                  ></v-text-field>
                </v-col>
                <!-- <v-col cols="6">
                  <v-select
                    v-model="level_id"
                    outlined
                    item-text="level_name"
                    item-value="id"
                    :items="levels"
                    label="Oraganization Level"
                    required
                  ></v-select>
                </v-col> -->
                <v-col cols="6">
                  <v-select
                    v-model="edit.status"
                    item-text="name"
                    item-value="value"
                    :items="statuses"
                    :label="labelsWD[12]"
                    @change="hasAction = true"
                    required
                    outlined
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <!-- <v-col
                  ><h3 class="mb-2">Waste allowed to be serviced:</h3>
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
                  <h3 class="mb-2">Type of services:</h3>

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
                </v-col> -->
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
            <v-btn @click="insertDisposal" color="primary">
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
import getTypeOfServices from "~/mixins/getTypeOfService";
// import getTypeOfDisposalService from "~/mixins/getTypeOfDisposalServices";
import update_wd from "~/gql/mutations/update_wd";
import update_wd_type from "~/gql/mutations/update_wd_status";
import mapboxMarker from "./mapboxMarker.vue";
import levels from "~/mixins/getLevels";
import Swal from "sweetalert2";

export default {
  components: { mapboxMarker },
  mixins: [getTypeOfServices, levels],
  data() {
    return {
      hasAction: false,
      typeFilterValue: null,
      typeOfDisFilterValue: null,
      latlng: "",
      levels: [],
      level_id: "",
      searchWT: "",
      items_filter_type_of_dis: [
        {
          name: null,
          name_eng: "All",
        },
        {
          name: "Sorting and Landfill",
          name_eng: "Sorting and Landfill",
        },
        {
          name: "Incineration and Combustion",
          name_eng: "Incineration and Combustion",
        },
        {
          name: "Treatment, Recovery and Landfill",
          name_eng: "Treatment, Recovery and Landfill",
        },
        {
          name: "Treatment, Recovery and Destroy",
          name_eng: "Treatment, Recovery and Destroy",
        },
      ],

      items_filter_type: [
        { value: null, name: "All" },
        { value: "Hz", name: "HZ" },
        { value: "NHz", name: "NHZ" },
      ],
      statuses: this.$store.state.statuses,
      data: [],
      dataHz: [],
      types: [],
      TypeOfDisposal: [],
      edit: [],
      selected: "",
      selectedTod: "",
      provinces: [],
      districts: [],
      villages: [],
      province_id: 0,
      district_id: 0,
      village_id: 0,
      pas_latlng: "",
      tods: [],
      items: [],
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
      this.getDisposal();
    },
    "pagination.itemsPerPage"(val) {
      this.pagination.page = 1;
      this.getDisposal();
    },
    searchWT() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.pagination.page = 1;
        this.getDisposal();
      }, 500);
    },
    typeFilterValue() {
      this.pagination.page = 1;
      this.getDisposal();
    },
    typeOfDisFilterValue() {
      this.pagination.page = 1;
      this.getDisposal();
    }
  },
  methods: {
    buildWhere() {
      let where = {
        _and: [{ status: { _neq: 4 } }]
      };

      if (this.typeFilterValue && this.typeFilterValue !== 'All') {
        where._and.push({ disposal_type_operations: { type_of_service: { name_short: { _eq: this.typeFilterValue } } } });
      }

      if (this.typeOfDisFilterValue && this.typeOfDisFilterValue !== 'All') {
        where._and.push({ disposal_type_service_operations: { type_of_disposal_service: { name_eng: { _eq: this.typeOfDisFilterValue } } } });
      }

      if (this.searchWT) {
        where._and.push({
          _or: [
            { dis_name: { _ilike: `%${this.searchWT}%` } },
            { dis_name_lo: { _ilike: `%${this.searchWT}%` } },
            { enterprise_no: { _ilike: `%${this.searchWT}%` } },
            { tel: { _ilike: `%${this.searchWT}%` } },
            { custom_address: { _ilike: `%${this.searchWT}%` } },
            { email: { _ilike: `%${this.searchWT}%` } },
            { license_no: { _ilike: `%${this.searchWT}%` } },
            { emac_id: { _ilike: `%${this.searchWT}%` } },
          ]
        });
      }
      return where;
    },
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
        this.toggleDialogEditWD();
      }
    },
    toggleDialogEditWD() {
      this.$store.commit("SET_DIALOGEDITWD", !this.$store.state.dialogEditWD);
    },
    viewCompany(item) {
      // console.log('item :>> ', item)
      this.$router.push("/company_management/WD/" + item.id);
    },
    editItem(item) {
      this.toggleDialogEditWD();
      this.edit = item;
      this.edit.status = this.edit.status.toString();
      // this.level_id = this.edit.level.id
      this.pas_latlng = this.data.latlng;
      this.province_id = this.edit.village.district.province.pr_id;
      this.district_id = this.edit.village.district.dr_id;
      this.village_id = this.edit.village.vill_id;

      // console.log('this.selected :>> ', this.edit.selected)

      this.selected = this.edit.disposal_type_operations.map((item) => {
        return item.type_of_service.id;
      });
      this.selected = this.selected[0];

      this.selectedTod = this.edit.disposal_type_service_operations.map(
        (item) => {
          return item.type_id;
        }
      );
      this.selectedTod = this.selectedTod[0];
      // console.log('this.selectedTod :>> ', this.selectedTod)
      // console.log('this.selected :>> ', this.selected)

      this.getVillages(), this.getProvince(), this.getDistricts();
      // console.log('this.data :>> ', this.edit)
    },
    deleteItem(item) {
      this.updateTypeWD(item);
    },
    async getTypeOfDisServices() {
      this.types = this.data.map((item) => {
        return item.disposal_type_operations.map((item) => {
          return item.type_of_service.name_short;
        });
      });

      for (let i = 0; i < this.data.length; i++) {
        this.data[i].tos = this.types[i].join(", ");
        // this.data[i].tos = this.data[i]
      }

      this.TypeOfDisposal = this.data.map((item) => {
        return item.disposal_type_service_operations.map((t) => {
          return this.$i18n.locale === 'la' 
            ? t.type_of_disposal_service.name 
            : t.type_of_disposal_service.name_eng;
        });
      });

      this.status_text = this.data.map((item) => {
        if (item.status == 1) {
          return "Active";
        } else if (item.status == 2) {
          return "Suspened";
        } else {
          return "Deleted";
        }
      });

      for (let i = 0; i < this.data.length; i++) {
        this.data[i].tod = this.TypeOfDisposal[i];
        this.data[i].email = this.data[i].email.replaceAll(",", "");
        this.data[i].tod_text = this.TypeOfDisposal[i]
          .join("")
          .replaceAll(",", " -");
        this.data[i].village_lo = this.data[i].village.vill_name_lo;
        this.data[i].district_lo = this.data[i].village.district.dr_name_lo;
        this.data[i].status_txt = this.status_text[i];
        this.data[i].province_lo =
          this.data[i].village.district.province.pr_name_lo;
        this.data[i].level_lo = this.data[i].levelByLevel.level_name_lo;
      }

      // console.log('this.TypeOfDisposal :>> ', this.TypeOfDisposal)
    },
    async getDisposal() {
      this.loading = true;
      const { page, itemsPerPage } = this.pagination;
      const limit = itemsPerPage === -1 ? this.totalCount || 10 : itemsPerPage;
      const offset = (page - 1) * limit;
      const whereCondition = this.buildWhere();

      try {
        const countRes = await this.$apollo.query({
          query: require("~/gql/queries/getDisposal").getDisposalsNeqCount,
          variables: { where: whereCondition },
          fetchPolicy: "network-only",
        });
        this.totalCount = countRes.data.emac_disposals_aggregate.aggregate.count;

        const { data } = await this.$apollo.query({
          query: require("~/gql/queries/getDisposal").getDisposalsNeq,
          variables: { limit, offset, where: whereCondition },
          fetchPolicy: "network-only",
        });

        this.data = data.emac_disposals;
        this.getTypeOfDisServices(); // Keep internal formatter running for local view structure
        this.dataFilter = this.data;
        this.dataHz = this.data.filter((item) => {
          return item.tos.includes("Hz") || item.tos.includes("hz");
        });

        this.loading = false;
      } catch (error) {
        console.error("Error fetching disposal: ", error);
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
            query: require("~/gql/queries/getDisposal").getDisposalsNeq,
            variables: { limit, offset, where: whereCondition },
            fetchPolicy: "network-only",
          });

          let chunk = data.emac_disposals;
          for (let item of chunk) {
            let status_txt = "Deleted";
            if (item.status == 1) status_txt = "Active";
            else if (item.status == 2) status_txt = "Suspended";

            let tosArray = item.disposal_type_operations.map(t => t.type_of_service.name_short);
            let todArray = item.disposal_type_service_operations.map(t => 
              this.$i18n.locale === 'la' ? t.type_of_disposal_service.name : t.type_of_disposal_service.name_eng
            );

            allMappedData.push({
              "Enterprise Name (Lao)": item.dis_name_lo || "-",
              "Enterprise Name (Eng)": item.dis_name || "-",
              "Enterprise Number": item.enterprise_no || "-",
              "EMCD ID": item.emac_id || "-",
              "License No": item.license_no || "-",
              "Telephone": item.tel || "-",
              "Email": item.email || "-",
              "Type of service": tosArray.join(", ") || "-",
              "Type of disposal": todArray.join(" - ") || "-",
              "Level": item.levelByLevel?.level_name_lo || "-",
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
        const fileName = `WD_${yyyy}-${mm}-${dd}`;

        if (this.exportFormat === 'excel') {
          const XLSX = await import('xlsx');
          const worksheet = XLSX.utils.json_to_sheet(allMappedData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "Waste Disposals");
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
            pr_id: this.province_id,
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
            dr_id: this.district_id,
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
    insertDisposal() {
      this.$apollo
        .mutate({
          mutation: gql`
            ${update_wd.update_wd}
          `,
          variables: {
            id: this.edit.id,
            dis_name: this.edit.dis_name,
            custom_address: this.edit.custom_address,
            dis_name_lo: this.edit.dis_name_lo,
            email: this.edit.email,
            license_no: this.edit.license_no,
            status: this.edit.status,
            tel: this.edit.tel,
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
    updateTypeWD(item) {
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
                ${update_wd_type.update_statusWD}
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
          Swal.fire("Cancelled", "Your imaginary file is safe :)", "error");
        }
      });
    },
    // Removed local filter methods
    // async getTypeOfDisposal() {
    //   await this.$apollo
    //     .query({
    //       query: require("~/gql/queries/getType_of_disposal_services")
    //         .getType_of_disposal_services,
    //     })
    //     .then((data) => {
    //       console.log('Data :>> ', data.data.emac_type_of_disposal_services)

    //     })
    //     .catch((err) => {
    //       console.log("err :>> ", err);
    //     });
    // },
  },
  mounted() {
    this.getDisposal();
    // this.getTypeOfDisposal();
    // console.log('this.$store.state :>> ', this.$store.state);
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
    text_wd() {
      return this.$t("waste_disposal");
    },
    dialogEditWD: {
      get() {
        return this.$store.state.dialogEditWD;
      },
      set(newVal) {
        this.$store.commit("SET_DIALOGEDITWD", newVal);
      },
    },
    headers() {
      return [
        {
          text: this.$t("enterprise_name"),
          align: "start",

          value: "dis_name",
        },
        { text: this.$t("enterprise_no"), value: "enterprise_no" },
        { text: this.$t("license_no"), value: "license_no" },
        { text: "EMCD ID", value: "emac_id" },
        {
          text: this.$t("address"),

          value: "custom_address",
          width: "10%",
        },
        { text: this.$t("office_telephone"), value: "tel" },
        {
          text: this.$t("type_of_disposal_service"),

          value: "tod",
        },
        {
          text: this.$t("type_of_service"),

          value: "tos",
        },
        {
          text: this.$t("status"),
          align: "center",

          value: "status",
        },
        {
          text: this.$t("action"),
          align: "center",

          value: "actions",
          width: "150px",
        },
      ];
    },
    labelsWD() {
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
      ];
    },
  },
};
</script>

<style scoped>
</style>