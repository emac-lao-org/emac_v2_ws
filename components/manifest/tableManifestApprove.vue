<template>
  <v-card>
    <v-card-title class="py-0 pt-2">
      <v-row>
        <v-col cols="3">
          <p class="display-1" style="border-right: 3px solid #0d47a1">
            Manifest
          </p>
        </v-col>
        <v-spacer></v-spacer>
        <v-col>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-col>
        <v-col align-self="center" cols="auto" class="d-flex">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon @click="getManifest" color="primary" class="mr-2" v-bind="attrs" v-on="on">
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
      :headers="headers"
      :items="data"
      :search="search"
      :server-items-length="totalCount"
      :page.sync="pagination.page"
      :itemsPerPage.sync="pagination.itemsPerPage"
    >
      <template v-slot:[`item.no`]="{ index }">
        {{ (pagination.page - 1) * pagination.itemsPerPage + index + 1 }}
      </template>
      <template v-slot:[`item.manifest_date`]="{ item }">
        {{ formatDate(item.manifest_date) }}
      </template>
      <template v-slot:[`item.transporter`]="{ item }">
        <div v-if="item.transporter.length == 1">
          {{ item.transporter[0] }}
        </div>
        <div v-else-if="item.transporter.length == 2">
          {{ item.transporter[0] }}
          <br />
          {{ item.transporter[1] }}
        </div>
        <div v-else>
          {{ item.transporter[0] }}
          <br />
          {{ item.transporter[1] }}
          <br />
          {{ item.transporter[2] }}
        </div>
      </template>
      <template v-slot:[`item.wg_stt`]="{ item }">
        <div v-if="item.wg_stt == 0">
          <v-chip small> {{ draft}} </v-chip>
        </div>
      </template>
      <template v-slot:[`item.quantity`]="{ item }">
        <div v-if="item.quantity.d == 0">{{ (item.quantity.g*1).toLocaleString('en-US') }} KG</div>
        <div v-else>{{ (item.quantity.d*1).toLocaleString('en-US') }} KG</div>
      </template>
      <template v-slot:[`item.generator.level.level_name_lo`]="{ item }">
        <div v-if="item.generator.level.id == '3c80ef33-d273-47f7-924a-9cea6e97c5af'">{{ 'ໃນເຂດເສດຖະກິດພິເສດ' }} </div>
        <div v-else>{{ "ນອກເຂດເສດຖະກິດພິເສດ" }}</div>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <!-- <v-icon class="mr-2" @click="viewItem(item)"> mdi-file-document</v-icon> -->
        <v-icon class="mr-2" @click="seeMoreItem(item)"> mdi-eye</v-icon>
        <!-- <v-icon class="mr-2" @click="editItem(item)">
          mdi-pencil-outline
        </v-icon> -->
      </template>
    </v-data-table>

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
  </v-card>
</template>
<script>
// import gql from 'graphql-tag'
import Swal from "sweetalert2";

export default {
  data() {
    return {
      pagination: {
        page: 1,
        itemsPerPage: 15,
      },
      search: "",
      totalCount: 0,
      searchTimeout: null,
      data: [],
      view: [],
      transporters: [],
      dialogView: false,
      quantity: [],
      dialogExportType: false,
      dialogExport: false,
      exportProgress: 0,
      exportTotal: 0,
      exportFormat: 'csv',
    };
  },
  watch: {
    "pagination.page"(val) {
      this.getManifest();
    },
    "pagination.itemsPerPage"(val) {
      this.pagination.page = 1;
      this.getManifest();
    },
    search() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.pagination.page = 1;
        this.getManifest();
      }, 500);
    },
  },
  methods: {
    formatDate(date) {
      if (!date) return "-";
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    },
    checkLanguage() {
      const locale = localStorage.getItem("lang");
      this.$i18n.locale = locale;
    },
    buildWhere() {
      let where = {
        _and: [{ wg_stt: { _eq: 0 } }]
      };

      if (this.search) {
        where._and.push({
          _or: [
            { manifest_no: { _ilike: `%${this.search}%` } },
            { generator: { gen_name_lo: { _ilike: `%${this.search}%` } } },
            { generator: { gen_name: { _ilike: `%${this.search}%` } } }
          ],
        });
      }
      return where;
    },
    async getManifest() {
      const { page, itemsPerPage } = this.pagination;
      const limit = itemsPerPage === -1 ? this.totalCount || 10 : itemsPerPage;
      const offset = (page - 1) * limit;
      const whereCondition = this.buildWhere();

      try {
        const countRes = await this.$apollo.query({
          query: require("~/gql/queries/manifest/getManifest").getManifestApproveSubCount,
          variables: { where: whereCondition },
          fetchPolicy: "network-only",
        });
        this.totalCount = countRes.data.emac_manifests_aggregate.aggregate.count;

        const dataRes = await this.$apollo.query({
          query: require("~/gql/queries/manifest/getManifest").getManifestApproveSub,
          variables: { limit, offset, where: whereCondition },
          fetchPolicy: "network-only",
        });

        this.data = dataRes.data.emac_manifest_approve;
        
        this.transporters = this.data.map((item) => {
          return item.transporter_operations.map((item) => {
            return item.transporter.tran_name;
          });
        });

        this.quantity = this.data.map((item) => {
          return {
            d: item.waste_operations_aggregate.aggregate.sum.weight_disposal,
            g: item.waste_operations_aggregate.aggregate.sum.weight_generator,
          };
        });
        
        for (let i = 0; i < this.data.length; i++) {
          this.data[i].transporter = this.transporters[i];
          this.data[i].quantity = this.quantity[i];
        }
      } catch (err) {
        console.log("err :>> ", err);
      }
    },
    viewItem(item) {
      this.dialogView = true;
      this.view = item;
    },
    seeMoreItem(item) {
      this.$router.push("/manifest/approve?id=" + item.id);
    },
    toggleDialogEdit() {
      this.$store.commit("SET_DIALOGEDIT", !this.$store.state.dialogEdit);
      this.editInfo = false;
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
            query: require("~/gql/queries/manifest/getManifest").getManifestApproveSub,
            variables: { limit, offset, where: whereCondition },
            fetchPolicy: "network-only",
          });
          
          let chunk = data.emac_manifest_approve;
          for (let item of chunk) {
            let transporters = item.transporter_operations.map(t => t.transporter.tran_name);
            let qty_d = parseFloat(item.waste_operations_aggregate?.aggregate?.sum?.weight_disposal || 0);
            let qty_g = parseFloat(item.waste_operations_aggregate?.aggregate?.sum?.weight_generator || 0);
            
            allMappedData.push({
              "Manifest No": item.manifest_no || "-",
              "Expected Relocate Date": item.expected_relocate_date || "-",
              "Manifest Date": item.manifest_date || "-",
              "Transporter 1": transporters[0] || "-",
              "Transporter 2": transporters[1] || "-",
              "Transporter 3": transporters[2] || "-",
              "Status": "Draft",
              "Disposal": item.disposal?.dis_name || "-",
              "Generator": item.generator?.gen_name || "-",
              "WG Weight": qty_g,
              "WD Weight": qty_d,
              "Type of waste": item.type_of_service?.name || "-"
            });
            this.exportProgress++;
          }
          offset += limit;
        }

        const ds = new Date();
        const yyyy = ds.getFullYear();
        const mm = String(ds.getMonth() + 1).padStart(2, '0');
        const dd = String(ds.getDate()).padStart(2, '0');

        if (this.exportFormat === 'excel') {
          const XLSX = await import('xlsx');
          const worksheet = XLSX.utils.json_to_sheet(allMappedData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "Manifests");
          XLSX.writeFile(workbook, `Manifest_Approve_${yyyy}-${mm}-${dd}.xlsx`);
        } else {
          const csvString = this.convertToCSV(allMappedData);
          const element = document.createElement("a");
          const file = new Blob([csvString], { type: "text/csv;charset=utf-8\uFEFF" }); 
          element.href = URL.createObjectURL(file);
          element.download = `Manifest_Approve_${yyyy}-${mm}-${dd}.csv`;
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
  },
  mounted() {
    this.getManifest();
    this.checkLanguage();
  },
  computed: {
    draft(){
      return this.$t("draft") 
    },
    dialogEdit: {
      get() {
        return this.$store.state.dialogEdit;
      },
      set(newVal) {
        this.$store.commit("SET_DIALOGEDIT", newVal);
      },
    },
    headers() {
      return [
        {
          text: this.$t("no"),
          // filterable: false,
          sortable: false,
          value: "no",
        },
        {
          text: this.$t("request_date"),
          value: "manifest_date",
          sortable: false,
        },
        {
          text: this.$t("manifest_no"),
          // filterable: false,
          sortable: false,
          value: "manifest_no",
        },
        // {
        //   text: this.$t("relocate_date"),
        //   value: "relocate_date",
        //   sortable: false,
        // },
        {
          text: this.$t("type"),
          value: "type_of_service.name_short",
          filter: this.typeFilter,
          width: "100px",
        },
        {
          text: this.$t("organization_level"),
          sortable: false,
          value: "generator.level.level_name_lo",
          filter: this.levelFilter,
        },
        {
          text: this.$t("waste_generator"),
          sortable: false,
          value: "generator.gen_name",
        },
        {
          text: this.$t("waste_transporter"),
          sortable: false,
          value: "transporter",
        },
        {
          text: this.$t("waste_disposal"),
          sortable: false,
          value: "disposal.dis_name",
        },
        { text: this.$t("quantity"), value: "quantity", width: "100px" },
        { text: this.$t("status"), value: "wg_stt", filter: this.statusFilter },
        {
          text: this.$t("action"),
          align: "center",
          width: "100px",
          value: "actions",
        },
      ];
    },
  },
};
</script>