<template>
  <div>
    <v-card-title class="py-0 pt-2">
      <v-row>
        <v-col cols="3">
          <h2 style="border-right: 3px solid #0d47a1">
            {{ text_wg }}
          </h2>
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
              <v-btn icon @click="getWGUsers" color="primary" class="mr-2" v-bind="attrs" v-on="on">
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
      :items="dataUserWg"
      :server-items-length="totalCount"
      :options.sync="pagination"
      @update:options="getWGUsers"
      class="elevation-1"
    >
      <template v-slot:[`item.verification_status`]="{ item }">
        <div v-if="item.verification_status == 1">
          <v-chip small color="primary">{{ text_active }}</v-chip>
        </div>
        <div v-else-if="item.verification_status == 2">
          <v-chip small color="warning">{{ text_suspended }}</v-chip>
        </div>
        <div v-else-if="item.verification_status == 3">
          <v-chip small color="error">{{ text_deleted }}</v-chip>
        </div>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <!-- <v-icon class="mr-2" @click="viewCompany(item)"> mdi-eye</v-icon> -->
        <v-icon class="mr-2" @click="editItem(item)">
          mdi-pencil-outline
        </v-icon>
        <v-icon @click="updateStatus(item)"> mdi-delete-outline </v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" persistent>
      <v-card>
        <v-card-title>
          <h2
            style="margin-bottom: -6px"
            class="blue--text text--darken-4 font-weight-bold text-uppercase"
          >
            {{ title_update }}
          </h2>
          <v-divider
            style="border: 1px solid #0d47a1"
            class="ml-4"
            vertical
          ></v-divider>
        </v-card-title>
        <v-form v-model="valid">
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row class="mt-4">
                <v-col cols="4">
                  <v-text-field
                    label="Full name"
                    outlined
                    v-model="edit.name"
                    @change="hasAction = true"
                    :rules="[
                      (v) => !!v || 'Name is required',
                      (v) =>
                        (v && v.length <= 100) ||
                        'Name must be less than 100 characters',
                    ]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    :label="label[4]"
                    outlined
                    @change="hasAction = true"
                    :rules="[
                      (v) => !!v || 'Phone is required',
                      (v) =>
                        (String(v).length >= 8 && String(v).length <= 12) ||
                        'The phone must be 8 to 12 digits',
                    ]"
                    v-model.number="edit.tel"
                    hide-details="auto"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-select
                    v-model="edit.verification_status"
                    item-text="name"
                    item-value="value"
                    @change="hasAction = true"
                    :rules="[(v) => !!v || 'Item is required']"
                    :items="statuses"
                    label="Status"
                    required
                    outlined
                    hide-details="auto"
                  ></v-select>
                </v-col>
                <!-- <v-col cols="4">
                  <v-text-field
                    label="Full name"
                    outlined
                    v-model="edit.email"
                    @change="hasAction = true"
                    :rules="[
                      (v) => !!v || 'Email is required',
                      (v) => /.+@.+/.test(v) || 'E-mail must be valid',
                    ]"
                    required
                    hide-details="auto"
                  ></v-text-field>
                </v-col> -->
                <v-col align-self="center" cols="4">
                  <v-btn large color="error" @click="confirmedReset" depressed>
                    reset password
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions class="mx-4">
            <v-spacer></v-spacer>
            <v-btn outlined color="primary" class="mx-4 my-4" @click="check">
              {{ this.$t("cancel") }}
            </v-btn>
            <v-btn :disabled="!valid" @click="update" color="primary">
              {{ this.$t("update") }}</v-btn
            >
          </v-card-actions>
        </v-form>
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
import update_wg_user from "~/gql/mutations/users_management/updateWGUser";
import delete_wg_user from "~/gql/mutations/users_management/deleteWGUser";
import gql from "graphql-tag";
import Swal from "sweetalert2"; 
export default {
  data() {
    return {
      dataUserWg: [],
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
      valid: true,
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      select: null,
      company_id: null,
      dialog: false,
      search: "",
      status: null,
      label: [
        "First name",
        "Last name",
        "Email",
        "Password",
        "Phone",
        "Role",
        "Organizaiton",
      ],
      statuses: this.$store.state.statusUser,
      edit: [],
      hasAction: false,
    };
  },
  watch: {
    "pagination.page"(val) {
      this.getWGUsers();
    },
    "pagination.itemsPerPage"(val) {
      this.pagination.page = 1;
      this.getWGUsers();
    },
    search() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.pagination.page = 1;
        this.getWGUsers();
      }, 500);
    },
  },
  methods: {
    buildWhere() {
      let where = {};
      if (this.search) {
        where._or = [
          { name: { _ilike: `%${this.search}%` } },
          { email: { _ilike: `%${this.search}%` } },
          { tel: { _ilike: `%${this.search}%` } },
          { generator: { gen_name: { _ilike: `%${this.search}%` } } },
          { generator: { emac_id: { _ilike: `%${this.search}%` } } }
        ];
      }
      return where;
    },
    async getWGUsers() {
      const { page, itemsPerPage } = this.pagination;
      const limit = itemsPerPage === -1 ? this.totalCount || 10 : itemsPerPage;
      const offset = (page - 1) * limit;
      const whereCondition = this.buildWhere();

      try {
        const countRes = await this.$apollo.query({
          query: require("~/gql/queries/users_management/getWGUsers").getWGUsersCount,
          variables: { where: whereCondition },
          fetchPolicy: "network-only",
        });
        this.totalCount = countRes.data.emac_wg_users_aggregate.aggregate.count;

        const { data } = await this.$apollo.query({
          query: require("~/gql/queries/users_management/getWGUsers").getWGUsers,
          variables: { limit, offset, where: whereCondition },
          fetchPolicy: "network-only",
        });

        this.dataUserWg = data.emac_wg_users;
      } catch (error) {
        console.error("Error fetching WG users: ", error);
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
            query: require("~/gql/queries/users_management/getWGUsers").getWGUsers,
            variables: { limit, offset, where: whereCondition },
            fetchPolicy: "network-only",
          });

          let chunk = data.emac_wg_users;
          for (let item of chunk) {
            let status_txt = "Deleted";
            if (item.verification_status == 1) status_txt = "Active";
            else if (item.verification_status == 2) status_txt = "Suspended";

            allMappedData.push({
              "Name": item.name || "-",
              "Email": item.email || "-",
              "Telephone": item.tel || "-",
              "Enterprise Name": item.generator?.gen_name || "-",
              "EMCD ID": item.generator?.emac_id || "-",
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
        const fileName = `WGUsers_${yyyy}-${mm}-${dd}`;

        if (this.exportFormat === 'excel') {
          const XLSX = await import('xlsx');
          const worksheet = XLSX.utils.json_to_sheet(allMappedData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "Waste Generator Users");
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
    confirmedReset() {
      Swal.fire({
        title: "Are you sure?",
        text: "You will reset password for this user",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, reset it!",
        cancelButtonText: "No, cancel!",
      }).then((result) => {
        if (result.value) {
          this.resetPassword();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("Cancelled", "Your action is cancelled", "error");
        }
      });
    },
    resetPassword() {
      this.$fire.auth.sendPasswordResetEmail(this.edit.email).then(() => {
        Swal.fire({
          icon: "success",
          text: "Wait for a moment, Please check your email",
        });
      });
    },
    check() {
      if (this.hasAction == true) {
        Swal.fire({
          icon: "warning",
          text: "Form has been changed, Please save changes",
        });
      } else {
        this.dialog = false;
      }
    },
    editItem(item) {
      this.edit = item;
      // console.log("this.edit :>> ", this.edit);
      this.dialog = true;
    },
    update() {
      this.$apollo
        .mutate({
          mutation: update_wg_user,
          variables: {
            id: this.edit.id,
            name: this.edit.name,
            tel: this.edit.tel.toString(),
            verification_status: this.edit.verification_status,
          },
        })
        .then(() => {
          this.dialog = false;
          Swal.fire("Updated!", "User has been updated.", "success").then(
            () => {
              window.location.reload();
            }
          );
        });
    },
    updateStatus(item) {
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
                ${delete_wg_user.deleteWGUser}
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
  },
  computed: {
    text_wg() {
      return this.$t("waste_generator");
    },
    title_update() {
      return this.$t("update_user");
    },
    text_active() {
      return this.$t("active");
    },
    text_suspended() {
      return this.$t("suspended");
    },
    text_deleted() {
      return this.$t("deleted");
    },
    headers() {
      return [
        {
          text: this.$t("name"),
          align: "start",
          sortable: false,
          value: "name",
        },
        {
          text: this.$t("email"),
          value: "email",
        },
        {
          text: this.$t("telephone"),
          value: "tel",
        },
        {
          text: this.$t("enterprise_name"),
          value: "generator.gen_name",
        },
        {
          text: this.$t("emac_id"),
          value: "generator.emac_id",
        },
        {
          text: this.$t("status"),
          value: "verification_status",
        },
        {
          text: this.$t("action"),
          value: "actions",
          sortable: false,
        },
      ];
    },
  },
};
</script>

<style>
</style>