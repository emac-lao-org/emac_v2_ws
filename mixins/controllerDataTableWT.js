// import delete_wt_type_op from '~/gql/mutations/delete_wt_type_op'
import update_wt from "~/gql/mutations/update_wt";
import update_emac_transporters from "~/gql/mutations/update_emac_transporters";
import gql from "graphql-tag";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      hasAction: false,
      typeFilterValue: null,
      loading: false,
      search: "",
      data: [],
      dataHz: [],
      types: [],
      checkTypes: [],
      selected: [],
      items_filter_type: [
        {
          name: "All",
          value: null,
        },
        {
          name: "Hazardous",
          value: "Hz",
        },
        {
          name: "Non Hazardous",
          value: "NHz",
        },
      ],
      edit: {
        tran_name: "",
        tran_name_lo: "",
        enterprise_no: "",
        email: "",
        emac_id: "",
        province: "",
        district: "",
        village: {
          district: {
            pr_id: "",
          },
          dr_id: "",
          vill_id: "",
        },
        type_operations: [],
        custom_address: "",
        tel: "",
        latlng: "",
        status: "",
      },
      provinces: [],
      districts: [],
      villages: [],
      items: [],
      level_id: "",
      pas_latlng: "",
      statuses: this.$store.state.statuses,
      filterType: [],
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
      this.getTransporters();
    },
    "pagination.itemsPerPage"(val) {
      this.pagination.page = 1;
      this.getTransporters();
    },
    search() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.pagination.page = 1;
        this.getTransporters();
      }, 500);
    },
    typeFilterValue() {
      this.pagination.page = 1;
      this.getTransporters();
    }
  },
  methods: {
    check() {
      if (this.hasAction == true) {
        Swal.fire({
          icon: "warning",
          text: "Form has been changed, Please save changes",
        });
      } else {
        this.toggleDialogEdit();
      }
    },
    // getLatlng(value) {
    //   this.latlng = value
    //   this.latlng = [value[1], value[0]]
    //   this.latlng = this.latlng.join(',')
    //   // console.log('this.latlng:P :>> ', this.latlng)
    // },
    toggleDialogEdit() {
      this.$store.commit("SET_DIALOGEDIT", !this.$store.state.dialogEdit);
    },
    editItem(item) {
      this.toggleDialogEdit();
      (this.edit = item),
        // console.log("this.edit :>> ", this.edit);

        (this.edit.status = this.edit.status.toString());

      this.selected = this.edit.type_operations[0].type_id;
      // console.log("this.selected :>> ", this.selected);
      this.getProvince(), this.getDistricts(), this.getVillages();
    },
    async getTypeOfServices() {
      await this.$apollo
        .query({
          query: require("~/gql/queries/getTypeofservices").getTypeofservices,
        })
        .then((data) => {
          // console.log('Data :>> ', data.data.emac_transporters)
          this.items = data.data.emac_type_of_services;
          // console.log('this.items :>> ', this.items)
        })
        .catch((err) => {
          // console.log("err :>> ", err);
        });
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
            pr_id: this.edit.village.district.pr_id,
          },
        })
        .then((data) => {
          this.districts = data.data.emac_provinces[0].districts;
          // console.log("this.districts :>> ", this.districts);
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
            dr_id: this.edit.village.dr_id,
          },
        })
        .then((data) => {
          this.villages = data.data.emac_districts[0].villages;
          // console.log("this.villages :>> ", this.villages);
        })
        .catch((err) => {
          // console.log("err :>> ", err);
        });
    },
    buildWhere() {
      let where = {
        _and: [{ status: { _neq: 4 } }]
      };

      if (this.typeFilterValue && this.typeFilterValue !== 'All') {
        where._and.push({ type_operations: { type_of_service: { name_short: { _eq: this.typeFilterValue } } } });
      }

      if (this.search) {
        where._and.push({
          _or: [
            { tran_name: { _ilike: `%${this.search}%` } },
            { tran_name_lo: { _ilike: `%${this.search}%` } },
            { enterprise_no: { _ilike: `%${this.search}%` } },
            { tel: { _ilike: `%${this.search}%` } },
            { custom_address: { _ilike: `%${this.search}%` } },
          ]
        });
      }
      return where;
    },
    async getTransporters() {
      this.loading = true;
      const { page, itemsPerPage } = this.pagination;
      const limit = itemsPerPage === -1 ? this.totalCount || 10 : itemsPerPage;
      const offset = (page - 1) * limit;
      const whereCondition = this.buildWhere();

      try {
        const countRes = await this.$apollo.query({
          query: require("~/gql/queries/getTransporter").getTransportersNeqCount,
          variables: { where: whereCondition },
          fetchPolicy: "network-only",
        });
        this.totalCount = countRes.data.emac_transporters_aggregate.aggregate.count;

        const { data } = await this.$apollo.query({
          query: require("~/gql/queries/getTransporter").getTransportersNeq,
          variables: { limit, offset, where: whereCondition },
          fetchPolicy: "network-only",
        });

        this.data = data.emac_transporters;

        this.checkTypes = this.data.map((item) => {
          return item.type_operations.map((item) => {
            return item.type_of_service.name_short;
          });
        });

        let status_text = this.data.map((item) => {
          if (item.status == 1) { return "Active"; }
          else if (item.status == 2) { return "Suspened"; }
          else { return "Deleted"; }
        });

        for (let i = 0; i < this.data.length; i++) {
          this.data[i].tos = this.checkTypes[i].join(", ");
          this.data[i].village_lo = this.data[i].village.vill_name_lo;
          this.data[i].district_lo = this.data[i].village.district.dr_name_lo;
          this.data[i].cus_addr = this.data[i].custom_address ? this.data[i].custom_address.replaceAll(",", " -") : "";
          this.data[i].level_lo = this.data[i].levelByLevel?.level_name_lo || '-';
          this.data[i].status_txt = status_text[i];
        }

        this.dataFilter = this.data;
        this.dataHz = this.data.filter((item) => {
          return item.tos.includes("hz");
        });
        this.loading = false;
      } catch (error) {
        console.error("Error fetching transporters: ", error);
        this.loading = false;
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
            query: require("~/gql/queries/getTransporter").getTransportersNeq,
            variables: { limit, offset, where: whereCondition },
            fetchPolicy: "network-only",
          });

          let chunk = data.emac_transporters;
          for (let item of chunk) {
            let status_txt = "Deleted";
            if (item.status == 1) status_txt = "Active";
            else if (item.status == 2) status_txt = "Suspended";

            let tys = item.type_operations.map(t => t.type_of_service.name_short).join(", ");

            allMappedData.push({
              "Enterprise Name (Lao)": item.tran_name_lo || "-",
              "Enterprise Name (Eng)": item.tran_name || "-",
              "Enterprise Number": item.enterprise_no || "-",
              "EMCT ID": item.emac_id || "-",
              "Telephone": item.tel || "-",
              "Email": item.email || "-",
              "Type of service": tys || "-",
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
        const fileName = `WT_${yyyy}-${mm}-${dd}`;

        if (this.exportFormat === 'excel') {
          const XLSX = await import('xlsx');
          const worksheet = XLSX.utils.json_to_sheet(allMappedData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "Waste Transporters");
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

    async updateWT() {
      await this.$apollo
        .mutate({
          mutation: gql`
            ${update_wt.update_wt}
          `,
          variables: {
            id: this.edit.id,
            email: this.edit.email,
            // emac_id: this.edit.emac_id,
            tran_name: this.edit.tran_name,
            enterprise_no: this.edit.enterprise_no,
            tran_name_lo: this.edit.tran_name_lo,
            custom_address: this.edit.custom_address,
            tel: this.edit.tel,
            status: this.edit.status,
            // vill_id: this.edit.village.vill_id,
            // latlng: this.latlng || this.pas_latlng,
            // level_id: this.level_id,
          },
        })
        // .then(() => {
        //   this.$apollo.mutate({
        //     mutation: gql`
        //       ${insertType.insert_wt_type_op}
        //     `,
        //     variables: {
        //       tran_id: this.edit.id,
        //       type_id: this.filterType[0],
        //     },
        //   })
        // })
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
        text: "You will not be able to recover this imaginary file!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          this.$apollo
            .mutate({
              mutation: gql`
                ${update_emac_transporters.update_emac_transporters}
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
    viewCompany(item) {
      this.$router.push("/company_management/WT/" + item.id);
    },
  },
  computed: {
    dialogEdit: {
      get() {
        return this.$store.state.dialogEdit;
      },
      set(newVal) {
        this.$store.commit("SET_DIALOGEDIT", newVal);
      },
    },
    labels() {
      return [
        this.$t("enterprise_namelao"),
        this.$t("enterprise_nameeng"),
        this.$t("enterprise_number"),
        this.$t("email"),
        "EMCT ID",
        "Province",
        "District",
        "Village",
        this.$t("custom_address"),
        this.$t("office_telephone"),
        this.$t("status"),
        "Latitude and Longitude",
      ];
    },
    headers() {
      return [
        {
          text: this.$t("enterprise_name"),

          value: "tran_name",
        },
        {
          text: this.$t("enterprise_number"),

          value: "enterprise_no",
        },
        { text: "EMCT ID", value: "emac_id" },
        {
          text: this.$t("address"),

          value: "custom_address",
          width: "10%",
        },
        { text: this.$t("office_telephone"), value: "tel" },
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
  },
  mounted() {
    this.getTypeOfServices(), this.getTransporters();
  },
};
