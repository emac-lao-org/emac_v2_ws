<template>
  <div>
    <title-page :title="title" :width="width" />

    <v-card class="mt-4 mx-6">
      <v-card-title class="py-0 pt-2">
        <v-row>
          <v-col>
            <div class="mt-2">
              <date-picker label="From" @date_emit="date_emit"></date-picker>
            </div>
          </v-col>
          <v-col>
            <div class="mt-2">
              <date-picker label="To" @date_emit="date_emit_to"></date-picker>
            </div>
          </v-col>
          <v-col class="mx-8" cols="1">
            <div>
              <v-btn
                @click="getDataDate"
                color="primary"
                outlined
                class="mt-2"
                height="40"
              >
                <v-icon>mdi-magnify</v-icon>
                Search
              </v-btn>
            </div>
          </v-col>
          <v-col>
            <div>
              <v-btn
                v-show="!show"
                @click="getWasteCat"
                color="red"
                outlined
                class="mt-2"
                height="40"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
          </v-col>

          <!-- <v-col>
            <v-select
              item-text="name"
              item-value="value"
              :items="wg_lists"
              v-model="filterFrom"
              label="From (WG)"
              required
            ></v-select>
          </v-col>
          <v-col>
            <v-select
              item-text="name"
              item-value="value"
              :items="wd_lists"
              v-model="filterTo"
              label="To (WD)"
              required
            ></v-select>
          </v-col> -->
          <v-col>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-col>
          <v-col align-self="center" align="end">
            <v-btn width="200" color="primary" @click="dialogExportType = true">
              <v-icon>mdi-export</v-icon>
              Export
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>

      <v-data-table
        item-key="row_index"
        :loading="loading"
        :headers="headers"
        :items="data"
        :server-items-length="totalCount"
        :options.sync="pagination"
        @update:options="fetchData"
      >
        <template v-slot:[`item.waste_code`]="{ item }">
          {{ formatWasteCode(item.waste_code, item.type) }}
        </template>
        <template v-slot:[`item.manifest_date`]="{ item }">
          {{ formatDate(item.manifest_date) }}
        </template>
        <template v-slot:[`item.weight_disposal`]="{ item }">
          {{ formatNumber(item.weight_disposal) }}
        </template>
        <template v-slot:[`item.wd_stt`]="{ item }">
          <v-chip
            :color="item.wd_stt == 3 ? 'warning' : 'success'"
            text-color="white"
            small
          >
            {{ status_text }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card>

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
          <h3 class="font-weight-bold mb-2">Exporting Report...</h3>
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
import moment from "moment";
import DatePicker from "~/components/datePicker.vue";
import titlePage from "~/components/titlePage.vue";
import wasteCodeMixin from "~/mixins/wasteCode";
export default {
  mixins: [wasteCodeMixin],
  components: {
    titlePage,
    DatePicker,
  },
  data() {
    return {
      show: true,
      fromDate: moment().format("YYYY-MM-DD"),
      toDate: moment().format("YYYY-MM-DD"),
      modelConfig: {
        type: "string",
        mask: "YYYY-MM-DD", // Uses 'iso' if missing
      },
      width: "35%",
      filterFrom: "",
      filterTo: "",
      id: "",
      loading: false,
      editInfo: false,
      data: [],
      totalCount: 0,
      searchTimeout: null,
      dialogExportType: false,
      exportFormat: 'csv',
      dialogExport: false,
      exportProgress: 0,
      exportTotal: 0,
      pagination: {
        page: 1,
        itemsPerPage: 10,
      },
      search: "",
      view: [],
      generator: [],
      wg_lists: [],
      wd_lists: [],
    };
  },
  watch: {
    "pagination.page"(val) {
      if (!this.loading) this.fetchData();
    },
    "pagination.itemsPerPage"(val) {
      this.pagination.page = 1;
      if (!this.loading) this.fetchData();
    },
    search() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.pagination.page = 1;
        this.fetchData();
      }, 500);
    },
  },
  methods: {
    formatDate(date) {
      if (!date) return "-";
      return moment(date).format("DD-MM-YYYY");
    },
    formatNumber(num) {
      if (num === null || num === undefined) return "-";
      return Number(num).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
    date_emit(date) {
      this.fromDate = date;
    },
    date_emit_to(date) {
      this.toDate = date;
    },
    buildWhere() {
      let where = {};
      
      if (!this.show) {
        where._and = [
          { manifest_date: { _gte: this.fromDate } },
          { manifest_date: { _lte: this.toDate } }
        ];
      }
      
      if (this.search) {
        let searchLogic = [
          { manifest_no: { _ilike: `%${this.search}%` } },
          { wg_name: { _ilike: `%${this.search}%` } },
          { wt_name: { _ilike: `%${this.search}%` } },
          { wd_name: { _ilike: `%${this.search}%` } },
          { waste_code: { _ilike: `%${this.search}%` } },
          { waste_name: { _ilike: `%${this.search}%` } }
        ];
        
        if (where._and) {
           where._and.push({ _or: searchLogic });
        } else {
           where._or = searchLogic;
        }
      }
      
      return where;
    },
    async fetchData() {
      this.loading = true;
      const { page, itemsPerPage } = this.pagination;
      const limit = itemsPerPage === -1 ? this.totalCount || 10 : itemsPerPage;
      const offset = (page - 1) * limit;
      const whereCondition = this.buildWhere();

      try {
        const countRes = await this.$apollo.query({
          query: require("~/gql/queries/getManifestMostCreateWaste.gql").getManifestCreateWasteCount,
          variables: { where: whereCondition },
          fetchPolicy: "network-only",
        });
        this.totalCount = countRes.data.get_manifest_waste_code_aggregate.aggregate.count;

        const { data } = await this.$apollo.query({
          query: require("~/gql/queries/getManifestMostCreateWaste.gql").getManifestCreateWaste,
          variables: { limit, offset, where: whereCondition },
          fetchPolicy: "network-only",
        });

        this.data = data.get_manifest_waste_code.map((item, index) => {
          return {
            ...item,
            row_index: offset + index
          };
        });
      } catch (error) {
        console.error("Error fetching report data: ", error);
      } finally {
        this.loading = false;
      }
    },
    getDataDate() {
      this.show = false;
      this.pagination.page = 1;
      this.fetchData();
    },
    getWasteCat() {
      this.show = true;
      this.pagination.page = 1;
      this.fetchData();
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

      if (this.totalCount === 0) return;

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
            query: require("~/gql/queries/getManifestMostCreateWaste.gql").getManifestCreateWaste,
            variables: { limit, offset, where: whereCondition },
            fetchPolicy: "network-only",
          });

          let chunk = data.get_manifest_waste_code;
          for (let item of chunk) {
            allMappedData.push({
              "Manifest No.": item.manifest_no || "-",
              "Manifest Date": this.formatDate(item.manifest_date),
              "Status": "Completed",
              "WG": item.wg_name || "-",
              "WT": item.wt_name || "-",
              "WD": item.wd_name || "-",
              "Waste Code": this.formatWasteCode(item.waste_code || "-", item.type || ""),
              "Waste Name": item.waste_name || "-",
              "Type": item.type || "-",
              "Weight": item.weight_disposal || "0"
            });
            this.exportProgress++;
          }
          offset += limit;
        }

        const ds = new Date();
        const yyyy = ds.getFullYear();
        const mm = String(ds.getMonth() + 1).padStart(2, '0');
        const dd = String(ds.getDate()).padStart(2, '0');
        const fileName = `ManifestReport_${yyyy}-${mm}-${dd}`;

        if (this.exportFormat === 'excel') {
          const XLSX = await import('xlsx');
          const worksheet = XLSX.utils.json_to_sheet(allMappedData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "Manifest Complete Report");
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
        console.error("Export error:", error);
      } finally {
        setTimeout(() => {
          this.dialogExport = false;
        }, 500);
      }
    },
  },

  computed: {
    status_text() {
      return this.$t("completed");
    },
    title() {
      return this.$t("report");
    },
    headers() {
      return [
        {
          text: "Manifest No.",
          align: "start",
          sortable: false,
          value: "manifest_no",
        },
        { text: "Manifest Date", value: "manifest_date" },
        { text: "Status", value: "wd_stt" },
        { text: "WG", value: "wg_name" },
        { text: "WT", value: "wt_name", width: "10%" },
        { text: "WD", value: "wd_name" },
        { text: "Waste Code", value: "waste_code" },
        { text: "Waste Name", value: "waste_name", width: "10%" },
        { text: "Type", value: "type" },
        { text: "Weight", value: "weight_disposal", width: "6%" },
      ];
    },
  },
};
</script>
