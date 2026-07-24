<template>
  <v-card>
    <v-card-title class="py-0 pt-2">
      <v-row>
        <v-col cols="3">
          <p class="display-1" style="border-right: 3px solid #0d47a1">
            {{ text_m }}
          </p>
        </v-col>
        <v-spacer></v-spacer>

        <v-col>
          <v-select
            item-text="level_name"
            item-value="level_name_lo"
            :items="items_filter_level"
            v-model="levelFilterValue" 
            label="Level"
            required
          ></v-select>
        </v-col>
        <v-col>
          <v-select
            item-text="name"
            item-value="value"
            :items="items_filter_type"
            v-model="typeFilterValue"
            label="Type"
            required
          ></v-select>
        </v-col>
        <v-col>
          <v-select
            item-text="name"
            item-value="value"
            :items="items_filter"
            v-model="statusFilterValue"
            label="Status"
            required
          ></v-select>
        </v-col>
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
<!-- <p>{{  this.checkPage }}</p> -->
    <v-data-table
      :loading="loading"
      :headers="
        this.checkPage == 'Tracking'
          ? headers
          : this.checkPage == 'uncompleted'
          ? headers3
          : this.checkPage == 'History' 
          ? headers4
          : headers2
      "
      :items="data"
      :server-items-length="totalCount"
      :options.sync="pagination"
      @update:options="getManifest"
      :sort-desc="[false, true]"
    >
      <template v-slot:[`item.no`]="{ index }">
        {{ (pagination.page - 1) * pagination.itemsPerPage + index + 1 }}
      </template>
      <template v-slot:[`item.manifest_date`]="{ item }">
        {{ formatDate(item.manifest_date) }}
      </template>
      <template v-slot:[`item.expected_relocate_date`]="{ item }">
        {{ formatDate(item.expected_relocate_date) }}
      </template>
      <template v-slot:[`item.relocate_date`]="{ item }">
        {{ formatDate(item.relocate_date) }}
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

      <template v-slot:[`item.manifest_stt`]="{ item }">
        <div v-if="item.manifest_stt == 0">
          <v-chip small> Draft</v-chip>
        </div>
        <div v-if="item.manifest_stt == 'Requested'">
          <v-chip small dark color="#7864CC">Requested</v-chip>
        </div>
        <div v-if="item.manifest_stt == 'Ready'">
          <v-chip small dark color="#3423E2">Ready</v-chip>
        </div>
        <div v-if="item.manifest_stt == 'WT Processing'">
          <v-chip small dark color="#FAD02C">WT Processing</v-chip>
        </div>
        <div v-if="item.manifest_stt == 'WD Processing'">
          <v-chip small dark color="#FAD02C">WD Processing</v-chip>
        </div>
        <div v-if="item.manifest_stt == 'Completed'">
          <v-chip small dark color="#FF8500">Completed</v-chip>
        </div>
        <div v-if="item.manifest_stt == 'Certified'">
          <v-chip small dark color="#56CC4A">Certified</v-chip>
        </div>
        <div v-if="item.manifest_stt == 'WT Denied'">
          <v-chip small dark color="error">WT Denied</v-chip>
        </div>
        <div v-if="item.manifest_stt == 'WD Denied'">
          <v-chip small dark color="error">WD Denied</v-chip>
        </div>
        <div v-if="item.manifest_stt == 'Unapprove'">
          <v-chip small dark color="error">Unapprove</v-chip>
        </div>
        <div v-if="item.manifest_stt == 'WT Rejected'">
          <v-chip small dark color="error">WT Rejected</v-chip>
        </div>
        <div v-if="item.manifest_stt == 'WD Rejected'">
          <v-chip small dark color="error">WD Rejected</v-chip>
        </div>
        <div v-if="item.manifest_stt == 'WS Denied'">
          <v-chip small dark color="error">WS Denied</v-chip>
        </div>
        <div v-if="item.manifest_stt == 'Expired'">
          <v-chip small dark color="#000000">Expired</v-chip>
        </div>
      </template>

      <template v-slot:[`item.quantity`]="{ item }">
        <div v-if="item.quantity.d == 0">
          {{ (item.quantity.g * 1).toLocaleString("en-US") }} KG
        </div>
        <div v-else>{{ (item.quantity.d * 1).toLocaleString("en-US") }} KG</div>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip top color="error">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-if="item.manifest_stt == 'Requested'"
              v-bind="attrs"
              v-on="on"
              @click="editItem(item)"
              >mdi-file-document-alert</v-icon
            >
          </template>
          <span>Reset to draft</span>
        </v-tooltip>
        <v-tooltip top color="success">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-if="item.manifest_stt == 'Completed' && canCertifyManifest"
              class="mx-2"
              color="success"
              v-bind="attrs"
              v-on="on"
              @click="certifyItem(item)"
            >
              mdi-certificate-outline
            </v-icon>
          </template>
          <span>Certify manifest</span>
        </v-tooltip>
        <v-icon class="mx-2" @click="viewNote(item)"> mdi-note</v-icon>
        <v-icon @click="seeMoreItem(item)"> mdi-eye</v-icon>
      </template>
    </v-data-table>

    <v-dialog class="pa-4" max-width="600px" v-model="dialogView">
      <v-card>
        <div class="pa-2">
          <v-card-title>
            <p
              style="margin-bottom: -6px"
              class="text-h4 blue--text text--darken-4 font-weight-bold text-uppercase"
            >
              Description
            </p>
            <v-divider
              style="border: 1px solid #0d47a1"
              class="ml-4"
              vertical
            ></v-divider>
          </v-card-title>
          <v-row>
            <v-col>
              <v-textarea
                v-model="message"
                outlined
                readonly
                max-width="600px"
                hide-details="auto"
                rows="6"
                required
              ></v-textarea>
            </v-col>
          </v-row>
        </div>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            outlined
            color="primary"
            class="my-4"
            @click="dialogView = false"
          >
            Cancel
          </v-btn>
        </v-card-actions>
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
  </v-card>
</template>
<script>
import setToDraft from "~/gql/mutations/manifest/setToDraft.gql";
import certifyManifest from "~/gql/mutations/manifest/certify_manifest.gql";
import updateWsCertifyQrDate from "~/gql/mutations/manifest/update_ws_certify_qr_date.gql";
import gql from "graphql-tag";
const Swal = require("sweetalert2");
export default {
  props: {
    page: {
      type: String,
      default: "Tracking",
    },
    checkPage: {
      type: String,
      default: "Tracking",
    },
  },
  data() {
    return {
      levelFilterValue: null,
      statusFilterValue: null,
      typeFilterValue: null,
      items_filter: [
        {
          name: "All",
          value: null,
        },
        {
          name: "Requested",
          value: "Requested",
        },
        {
          name: "Ready",
          value: "ready",
        },
        {
          name: "WT Processing",
          value: "wt processing",
        },
        {
          name: "WD Processing",
          value: "wd processing",
        },
        {
          name: "Completed",
          value: "completed",
        },
        {
          name: "Certified",
          value: "certified",
        },
        {
          name: "WT Denied",
          value: "wt denied",
        },
        {
          name: "WD Denied",
          value: "wd denied",
        },
        {
          name: "Unapprove",
          value: "unapprove",
        },
        {
          name: "WT Rejected",
          value: "wt rejected",
        },
        {
          name: "WD Rejected",
          value: "wd rejected",
        },
        {
          name: "WS Denied",
          value: "ws renied",
        },
        {
          name: "Expired",
          value: "expired",
        },
      ],
      items_filter_type: [
        {
          name: "All",
          value: null,
        },
        {
          name: "Non Hazardous",
          value: "nhz",
        },
        // {
        //   name: "Hazardous",
        //   value: "hz",
        // },
      ],
      items_filter_level: [
        {
          level_name: "All",
          level_name_lo: null,
        },
        {
          level_name: "ຂັ້ນກະຊວງ",
          level_name_lo: "ຂັ້ນກະຊວງ",
        },
        {
          level_name: "ຂັ້ນພະແນກ",
          level_name_lo: "ຂັ້ນພະແນກ",
        },
        {
          level_name: "ຂັ້ນເຂດເສດຖະກິດພິເສດ",
          level_name_lo: "ຂັ້ນເຂດເສດຖະກິດພິເສດ",
        },
        {
          level_name: "ກະຊວງແຜນການ ແລະ ການລົງທຶນ",
          level_name_lo: "ກະຊວງແຜນການ ແລະ ການລົງທຶນ",
        },
      ],
      dialog: false,
      loading: false,
      pagination: {
        page: 1,
        itemsPerPage: 15,
      },
      search: "",
      data: [],
      view: [],
      transporters: [],
      transporters_lo: [],
      dialogView: false,
      manifest_stt: "",
      quantity: "",
      message: "",
      dataFilter: [],
      totalCount: 0,
      searchTimeout: null,
      dialogExport: false,
      exportProgress: 0,
      exportTotal: 0,
      dialogExportType: false,
      exportFormat: 'csv',
      canCertifyManifest: false,
    };
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
    viewNote(item) {
      this.dialogView = true;
      this.message = item.message;
    },
    buildWhere() {
      let where = {
        _and: [{ wg_stt: { _neq: 0 } }]
      };

      if (this.levelFilterValue) {
        where._and.push({ generator: { level: { level_name_lo: { _ilike: `%${this.levelFilterValue}%` } } } });
      }

      if (this.typeFilterValue) {
        where._and.push({ type_of_service: { name_short: { _ilike: this.typeFilterValue } } });
      }

      if (this.search) {
        where._and.push({
          _or: [
            { manifest_no: { _ilike: `%${this.search}%` } },
            { generator: { gen_name: { _ilike: `%${this.search}%` } } },
            { disposal: { dis_name: { _ilike: `%${this.search}%` } } }
          ]
        });
      }

      // Helper to map computed sum text to exact Hasura wg/wt/wd/wr combination rules
      const getStatusConditions = (statusName) => {
        if (!statusName) return [];
        switch (statusName.toLowerCase()) {
          case 'requested': return [
            { wg_stt: { _in: [1, 2] }, wt_stt: { _eq: 0 }, wd_stt: { _eq: 0 }, wr_stt: { _eq: 0 } },
            { wg_stt: { _eq: 1 }, wt_stt: { _eq: 1 }, wd_stt: { _eq: 0 }, wr_stt: { _eq: 0 } },
          ];
          case 'ready': return [
            { wg_stt: { _eq: 3 }, wt_stt: { _eq: 0 }, wd_stt: { _eq: 0 }, wr_stt: { _eq: 0 } },
            { wg_stt: { _eq: 1 }, wt_stt: { _eq: 1 }, wd_stt: { _eq: 1 }, wr_stt: { _eq: 0 } },
          ];
          case 'wt processing': return [
            { wg_stt: { _eq: 3 }, wt_stt: { _in: [1, 2] }, wd_stt: { _eq: 0 }, wr_stt: { _eq: 0 } },
            { wg_stt: { _eq: 2 }, wt_stt: { _eq: 2 }, wd_stt: { _eq: 1 }, wr_stt: { _eq: 0 } },
          ];
          case 'wd processing': return [{ wg_stt: { _eq: 3 }, wt_stt: { _eq: 3 }, wd_stt: { _in: [1, 2] }, wr_stt: { _eq: 0 } }]; 
          case 'completed': return [{ wg_stt: { _eq: 3 }, wt_stt: { _eq: 3 }, wd_stt: { _eq: 3 }, wr_stt: { _eq: 0 } }]; 
          case 'certified': return [{ wg_stt: { _eq: 3 }, wt_stt: { _eq: 3 }, wd_stt: { _eq: 3 }, wr_stt: { _eq: 1 } }]; 
          case 'wt denied': return [{ wg_stt: { _eq: 3 }, wt_stt: { _eq: 8 }, wd_stt: { _eq: 0 }, wr_stt: { _eq: 0 } }]; 
          case 'wd denied': return [{ wg_stt: { _eq: 3 }, wt_stt: { _eq: 3 }, wd_stt: { _eq: 6 }, wr_stt: { _eq: 0 } }]; 
          case 'unapprove': return [{ wg_stt: { _eq: 21 }, wt_stt: { _eq: 0 }, wd_stt: { _eq: 0 }, wr_stt: { _eq: 0 } }]; 
          case 'wt rejected': return [{ wg_stt: { _eq: 3 }, wt_stt: { _eq: 19 }, wd_stt: { _eq: 0 }, wr_stt: { _eq: 0 } }]; 
          case 'wd rejected': return [{ wg_stt: { _eq: 3 }, wt_stt: { _eq: 3 }, wd_stt: { _eq: 18 }, wr_stt: { _eq: 0 } }]; 
          case 'ws denied': return [{ wg_stt: { _eq: 100 }, wt_stt: { _eq: 0 }, wd_stt: { _eq: 0 }, wr_stt: { _eq: 0 } }]; 
          case 'expired': return [{ wg_stt: { _eq: 102 }, wt_stt: { _eq: 0 }, wd_stt: { _eq: 0 }, wr_stt: { _eq: 0 } }]; 
          default: return [];
        }
      };

      let statusCombos = [];
      if (this.statusFilterValue) {
        statusCombos = getStatusConditions(this.statusFilterValue);
      } else {
        if (this.page == "History") {
          statusCombos = [...getStatusConditions('certified')];
        } else if (this.page == "Uncompleted") {
          statusCombos = [
            ...getStatusConditions('wt rejected'), ...getStatusConditions('wd rejected'),
            ...getStatusConditions('ws denied'), ...getStatusConditions('expired'),
            ...getStatusConditions('unapprove'), ...getStatusConditions('wd denied'),
            ...getStatusConditions('wt denied')
          ];
        } else if (this.page == "Tracking") {
          statusCombos = [
            ...getStatusConditions('requested'), ...getStatusConditions('completed'),
            ...getStatusConditions('ready'), ...getStatusConditions('wt processing'),
            ...getStatusConditions('wd processing')
          ];
        }
      }

      if (statusCombos.length > 0) {
        where._and.push({ _or: statusCombos });
      }

      return where;
    },
    async getManifest() {
      this.loading = true;
      try {
        const { page, itemsPerPage } = this.pagination;
        const limit = itemsPerPage === -1 ? 5000 : itemsPerPage;
        const offset = (page - 1) * limit;
        const whereCondition = this.buildWhere();

        // 1. Fetch Total Count for Pagination
        const countRes = await this.$apollo.query({
          query: require("~/gql/queries/manifest/getManifest").getManifestSubQueryCount,
          variables: { where: whereCondition },
          fetchPolicy: "network-only",
        });
        this.totalCount = countRes.data.emac_manifests_aggregate.aggregate.count;

        // 2. Fetch Paginated Records
        const { data } = await this.$apollo.query({
          query: require("~/gql/queries/manifest/getManifest").getManifestSubQuery,
          variables: { limit, offset, where: whereCondition },
          fetchPolicy: "network-only",
        });

        this.data = data.emac_manifests;
        this.transporters = this.data.map((item) => {
          return item.transporter_operations.map((item) => {
            return item.transporter.tran_name;
          });
        });
        this.transporters_lo = this.data.map((item) => {
          return item.transporter_operations.map((item) => {
            return item.transporter.tran_name_lo;
          });
        });

        this.quantity = this.data.map((item) => {
          return {
            d: item.waste_operations_aggregate.aggregate.sum.weight_disposal,
            g: item.waste_operations_aggregate.aggregate.sum.weight_generator,
          };
        });

        // We re-compute the Status Text on the frontend because existing UI relies on it 
        this.manifest_stt = this.data.map((item) => {
          if (item.wg_stt + item.wt_stt + item.wd_stt + item.wr_stt == 0) {
            return "Draft";
          } else if (item.wg_stt + item.wt_stt + item.wd_stt + item.wr_stt == 1) {
            return "Requested";
          } else if (item.wg_stt + item.wt_stt + item.wd_stt + item.wr_stt == 2) {
            return "Requested";
          } else if (item.wg_stt + item.wt_stt + item.wd_stt + item.wr_stt == 3) {
            return "Ready";
          } else if (item.wg_stt + item.wt_stt + item.wd_stt + item.wr_stt == 5) {
            return "WT Processing";
          } else if (item.wg_stt + item.wt_stt + item.wd_stt + item.wr_stt == 8) {
            return "WD Processing";
          } else if (item.wg_stt + item.wt_stt + item.wd_stt + item.wr_stt == 9) {
            return "Completed";
          } else if (item.wg_stt + item.wt_stt + item.wd_stt + item.wr_stt == 10) {
            return "Certified";
          } else if (item.wg_stt + item.wt_stt + item.wd_stt + item.wr_stt == 11) {
            return "WT Denied";
          } else if (item.wg_stt + item.wt_stt + item.wd_stt + item.wr_stt == 12) {
            return "WD Denied";
          } else if (item.wg_stt + item.wt_stt + item.wd_stt + item.wr_stt == 21) {
            return "Unapprove";
          } else if (item.wg_stt + item.wt_stt + item.wd_stt + item.wr_stt == 22) {
            return "WT Rejected";
          } else if (item.wg_stt + item.wt_stt + item.wd_stt + item.wr_stt == 24) {
            return "WD Rejected";
          } else if (item.wg_stt + item.wt_stt + item.wd_stt + item.wr_stt == 100) {
            return "WS Denied";
          } else if (item.wg_stt + item.wt_stt + item.wd_stt + item.wr_stt == 102) {
            return "Expired";
          }
        });
        
        for (let i = 0; i < this.data.length; i++) {
          this.data[i].transporter = this.transporters[i];
          this.data[i].transporter_lo_1 = this.transporters_lo[i][0];
          this.data[i].transporter_lo_2 = this.transporters_lo[i][1];
          this.data[i].transporter_lo_3 = this.transporters_lo[i][2];
          this.data[i].manifest_stt = this.manifest_stt[i];
          this.data[i].quantity = this.quantity[i];
          this.data[i].Disposal = this.data[i].disposal?.dis_name_lo || "-";
          this.data[i].Generator = this.data[i].generator?.gen_name_lo || "-";
          this.data[i].WG_weight = this.data[i].quantity.g;
          this.data[i].WD_weight = this.data[i].quantity.d;
          this.data[i].tos = this.data[i].type_of_service?.name || "-";
        }
        
        // Removed Frontend Array.filter and Pagination because the backend handled it!
        this.dataFilter = this.data;
        this.loading = false;
      } catch (error) {
        console.error("Error fetching getManifestSubQuery: ", error);
        // window.location.reload();
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
              // Convert value to string and escape internal double quotes
              let str = val === null || val === undefined ? "" : String(val);
              str = str.replace(/"/g, '""');
              // Wrap in double quotes if it contains commas, quotes, or newlines
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
            query: require("~/gql/queries/manifest/getManifest").getManifestSubQuery,
            variables: { limit, offset, where: whereCondition },
            fetchPolicy: "network-only",
          });
          
          let chunk = data.emac_manifests;
          // Format specific keys strictly for CSV layout
          for (let item of chunk) {
            let transportersLo = item.transporter_operations.map(
              (t) => t.transporter.tran_name_lo
            );
            let qty_d = parseFloat(item.waste_operations_aggregate.aggregate.sum.weight_disposal || 0);
            let qty_g = parseFloat(item.waste_operations_aggregate.aggregate.sum.weight_generator || 0);
            
            let statusText = "Draft";
            let sttSum = (item.wg_stt || 0) + (item.wt_stt || 0) + (item.wd_stt || 0) + (item.wr_stt || 0);
            if (sttSum == 1 || sttSum == 2) statusText = "Requested";
            else if (sttSum == 3) statusText = "Ready";
            else if (sttSum == 5) statusText = "WT Processing";
            else if (sttSum == 8) statusText = "WD Processing";
            else if (sttSum == 9) statusText = "Completed";
            else if (sttSum == 10) statusText = "Certified";
            else if (sttSum == 11) statusText = "WT Denied";
            else if (sttSum == 12) statusText = "WD Denied";
            else if (sttSum == 21) statusText = "Unapprove";
            else if (sttSum == 22) statusText = "WT Rejected";
            else if (sttSum == 24) statusText = "WD Rejected";
            else if (sttSum == 100) statusText = "WS Denied";
            else if (sttSum == 102) statusText = "Expired";
            
            allMappedData.push({
              manifest_date: item.manifest_date || "-",
              manifest_no: item.manifest_no || "-",
              note: item.note || "-",
              message: item.message || "",
              security_seal: item.security_seal || "-",
              relocate_date: item.relocate_date || "-",
              expected_relocate_date: item.expected_relocate_date || "-",
              manifest_stt: statusText,
              transporter_lo_1: transportersLo[0] || "",
              transporter_lo_2: transportersLo[1] || "",
              transporter_lo_3: transportersLo[2] || "",
              Disposal: item.disposal?.dis_name_lo || "-",
              Generator: item.generator?.gen_name_lo || "-",
              WG_weight: qty_g,
              WD_weight: qty_d,
              tos: item.type_of_service?.name || "-"
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
          XLSX.writeFile(workbook, `Manifest ${yyyy}-${mm}-${dd}.xlsx`);
        } else {
          const csvString = this.convertToCSV(allMappedData);
          const element = document.createElement("a");
          const file = new Blob([csvString], { type: "text/csv;charset=utf-8\uFEFF" }); // Added BOM for Excel UTF-8 support
          element.href = URL.createObjectURL(file);
          
          element.download = `Manifest ${yyyy}-${mm}-${dd}.csv`;
          
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
    async fetchCurrentUserCertifyPermission() {
      const currentUserId = this.$nuxt?.$fire?.auth?.currentUser?.uid;
      if (!currentUserId) {
        this.canCertifyManifest = false;
        return false;
      }

      try {
        const { data } = await this.$apollo.query({
          query: require("~/gql/queries/users_management/getWSUsers").getCurrentWSUserCertifyPermission,
          variables: { id: currentUserId },
          fetchPolicy: "network-only",
        });
        this.canCertifyManifest = !!data?.emac_users_by_pk?.can_certify_manifest;
        return this.canCertifyManifest;
      } catch (error) {
        console.error("Error fetching WS certify permission:", error);
        this.canCertifyManifest = false;
        return false;
      }
    },

    editItem(item) {
      this.view = item;
      Swal.fire({
        title: "Are you sure?",
        text: "This manifest will be draft again!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#56CB4A",
        cancelButtonColor: "#FF5252",
        confirmButtonText: "Yes, reset it!",
      }).then((result) => {
        if (result.isConfirmed) {
          this.$apollo
            .mutate({
              mutation: gql`
                ${setToDraft.setToDraft}
              `,
              variables: {
                id: this.view.id,
                ws_user: this.$nuxt.$fire.auth.currentUser.uid,
              },
            })
            .then(() => {
              Swal.fire({
                title: "Reset!",
                text: "This manifest has been reset.",
                icon: "success",
                confirmButtonColor: "#56CB4A",
              }).then(() => {
                window.location.reload();
              });
            });
        }
      });
    },
    certifyItem(item) {
      Swal.fire({
        title: "Are you sure?",
        text: "This manifest will be certified.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#56CB4A",
        cancelButtonColor: "#FF5252",
        confirmButtonText: "Yes, certify it!",
      }).then((result) => {
        if (result.isConfirmed) {
          this.performCertify(item);
        }
      });
    },
    async performCertify(item) {
      const certifyUser = this.$nuxt.$fire.auth.currentUser?.uid;
      const certifyDate = new Date().toISOString();

      if (!certifyUser) {
        Swal.fire("Error", "Cannot identify current WS user.", "error");
        return;
      }

      const hasPermission = await this.fetchCurrentUserCertifyPermission();
      if (!hasPermission) {
        Swal.fire(
          "Forbidden",
          "This WS user is not allowed to certify manifest.",
          "error"
        );
        return;
      }

      this.$apollo
        .mutate({
          mutation: gql`
            ${certifyManifest.certifyManifest}
          `,
          variables: {
            id: item.id,
            wr_stt: 1,
            ws_certify_user: certifyUser,
          },
        })
        .then(async () => {
          await this.$apollo.mutate({
            mutation: gql`
              ${updateWsCertifyQrDate.updateWsCertifyQrDate}
            `,
            variables: {
              manifest_id: item.id,
              ws_certify_date: certifyDate,
            },
          });

          Swal.fire({
            title: "Certified!",
            text: "This manifest has been certified.",
            icon: "success",
            confirmButtonColor: "#56CB4A",
          }).then(() => {
            this.getManifest();
          });
        })
        .catch((error) => {
          console.error(error);
          Swal.fire("Error", "Cannot certify this manifest.", "error");
        });
    },
    seeMoreItem(item) {
      this.$router.push("/manifest/tracking?id=" + item.id);
    },
    toggleDialogEdit() {
      this.$store.commit("SET_DIALOGEDIT", !this.$store.state.dialogEdit);
      this.editInfo = false;
    },

    statusFilter(value) {
      // If this filter has no value we just skip the entire filter.
      if (!this.statusFilterValue) {
        return true;
      }
      return value.toLowerCase().includes(this.statusFilterValue.toLowerCase());
    },
    typeFilter(value) {
      // If this filter has no value we just skip the entire filter.
      if (!this.typeFilterValue) {
        return true;
      }
      if (!value) return false;
      return value.toLowerCase() === this.typeFilterValue.toLowerCase();
    },
    levelFilter(value) {
      // If this filter has no value we just skip the entire filter.
      if (!this.levelFilterValue) {
        return true;
      }
      return value.toLowerCase().includes(this.levelFilterValue.toLowerCase());
    },
    checkLanguage() {
      const locale = localStorage.getItem("lang");
      this.$i18n.locale = locale;
    },
  },
  mounted() {
    this.fetchCurrentUserCertifyPermission();
    this.getManifest();
    this.checkLanguage();
  },
  watch: {
    levelFilterValue() {
      this.pagination.page = 1;
      this.getManifest();
    },
    statusFilterValue() {
      this.pagination.page = 1;
      this.getManifest();
    },
    typeFilterValue() {
      this.pagination.page = 1;
      this.getManifest();
    },
    search() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.pagination.page = 1;
        this.getManifest();
      }, 500);
    }
  },
  computed: {
    text_m() {
      return this.$t("manifest");
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
        // {
        //   text: this.$t("manifest_date"),
        //   value: "manifest_date",
        //   sortable: false,
        // },
        {
          text: this.$t("manifest_no"),
          // filterable: false,
          sortable: false,
          value: "manifest_no",
        },
        {
          text: this.$t("relocate_date"),
          value: "expected_relocate_date",
          sortable: false,
        },
        // {
        //   text: this.$t("manifest_date"),
        //   value: "manifest_date",
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
        {
          text: this.$t("status"),
          value: "manifest_stt",
          filter: this.statusFilter,
        },
        {
          text: this.$t("action"),
          align: "center",
          width: "150px",
          value: "actions",
        },
      ];
    },
    headers2() {
      return [
        {
          text: this.$t("no"),
          // filterable: false,
          sortable: false,
          value: "no",
        },
          {
          text: this.$t("manifest_date"), 
          value: "manifest_date",
          sortable: false,
        },
       
        {
          text: this.$t("expected_relocate_date"),
          value: "expected_relocate_date",
          sortable: false,
        },
         {
          text: this.$t("relocate_date"),
          value: "relocate_date",
          sortable: false,
        },
        {
          text: this.$t("manifest_no"),
          // filterable: false,
          sortable: false,
          value: "manifest_no",
        },

      
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
        {
          text: this.$t("status"),
          value: "manifest_stt",
          filter: this.statusFilter,
        },
        {
          text: this.$t("action"),
          align: "center",
          width: "150px",
          value: "actions",
        },
      ];
    },
    headers3() {
      return [
        {
          text: this.$t("no"),
          // filterable: false,
          sortable: false,
          value: "no",
        },
         {
          text: this.$t("manifest_date"), 
          value: "manifest_date",
          sortable: false,
        },
       
        {
          text: this.$t("expected_relocate_date"),
          value: "expected_relocate_date",
          sortable: false,
        },
         {
          text: this.$t("relocate_date"),
          value: "relocate_date",
          sortable: false,
        },
        {
          text: this.$t("manifest_no"),
          // filterable: false,
          sortable: false,
          value: "manifest_no",
        },

       
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
        {
          text: this.$t("status"),
          value: "manifest_stt",
          filter: this.statusFilter,
        },
        {
          text: this.$t("action"),
          align: "center",
          width: "150px",
          value: "actions",
        },
      ];
    },
    headers4() {
      return [
        {
          text: this.$t("no"),
          // filterable: false,
          sortable: false,
          value: "no",
        },
          {
          text: this.$t("manifest_date"), 
          value: "manifest_date",
          sortable: false,
        },
       
        {
          text: this.$t("expected_relocate_date"),
          value: "expected_relocate_date",
          sortable: false,
        },
         {
          text: this.$t("relocate_date"),
          value: "relocate_date",
          sortable: false,
        },
        {
          text: this.$t("manifest_no"),
          // filterable: false,
          sortable: false,
          value: "manifest_no",
        },

        
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
        {
          text: this.$t("status"),
          value: "manifest_stt",
          filter: this.statusFilter,
        },
        {
          text: this.$t("action"),
          align: "center",
          width: "150px",
          value: "actions",
        },
      ];
    },
  },
};
</script>
