<template>
  <div>
    <v-card-title class="py-0 pt-2">
      <v-row>
        <v-col cols="3">
          <p class="display-1" style="border-right: 3px solid #0d47a1">
            {{text_m}}
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
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="data"
        :search="search"
        :page.sync="pagination.page"
        :itemsPerPage.sync="pagination.itemsPerPage"
      >
        <template v-slot:[`item.no`]="{ index }">
          {{ (pagination.page - 1) * pagination.itemsPerPage + index + 1 }}
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
        <template v-slot:[`item.actions`]="{ item }">
          <!-- <v-icon class="mr-2" @click="viewCompany(item)"> mdi-eye</v-icon> -->
          <v-icon class="mr-2" @click="seeMoreItem(item)"> mdi-eye</v-icon>

          <v-icon @click="updateStatus(item)"> mdi-delete-outline </v-icon>
        </template>
      </v-data-table>
    </v-card-text>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      // headers: [
      //   {
      //     text: "No",
      //     // filterable: false,
      //     value: "no",
      //   },
      //   {
      //     text: "Manifest no",
      //     // filterable: false,
      //     value: "manifest_no",
      //   },
      //   { text: "Type", value: "type_of_service.name_short" },
      //   { text: "Create code", value: "manifest_date" },
      //   { text: "Generator", value: "generator.gen_name" },
      //   { text: "Disposal", value: "disposal.dis_name" },
      //   { text: "Transporter", value: "transporter" },
      //   { text: "Action", align: "center", value: "actions" },
      // ],
      loading: false,
      pagination: {
        page: 1,
        itemsPerPage: 15,
      },
      data: [],
      transporters: [],
      dialogView: false,
      manifest_stt: "",
      quantity: "",
    };
  },
  methods: {
    async getToken() {
      const result = await $nuxt.$fire.auth.currentUser
        .getIdTokenResult()
        .catch((err) => console.log(err));
      this.token = result.token;
      // console.log('this.token :>> ', this.token);
      localStorage.setItem("token", this.token);
      document.cookie = "token=" + this.token;
      // await window.location.reload()
    },
    async getManifest() {
      this.loading = true;
      try {
        const { data } = await this.$apollo.query({
          query: require("~/gql/queries/manifest/getManifest").getManifestPerQuery,
          variables: {
            id: this.$route.params.id,
          },
          fetchPolicy: "network-only",
        });

        this.data = data.emac_manifests;
        
        this.transporters = this.data.map((item) => {
          return item.transporter_operations.map((item) => {
            return item.transporter.tran_name;
          });
        });

        this.manifest_stt = this.data.map((item) => {
          if (item.wg_stt + item.wt_stt + item.wd_stt + item.wr_stt == 0) {
            return (item.manifest_stt = "Draft");
          } else if (
            item.wg_stt + item.wt_stt + item.wd_stt + item.wr_stt ==
            1
          ) {
            return (item.manifest_stt = "Requested");
          } else if (
            item.wg_stt + item.wt_stt + item.wd_stt + item.wr_stt ==
            2
          ) {
            return (item.manifest_stt = "Requested");
          } else if (
            item.wg_stt + item.wt_stt + item.wd_stt + item.wr_stt ==
            3
          ) {
            return (item.manifest_stt = "Ready");
          } else if (
            item.wg_stt + item.wt_stt + item.wd_stt + item.wr_stt ==
            5
          ) {
            return (item.manifest_stt = "WT Processing");
          } else if (
            item.wg_stt + item.wt_stt + item.wd_stt + item.wr_stt ==
            8
          ) {
            return (item.manifest_stt = "WD Processing");
          } else if (
            item.wg_stt + item.wt_stt + item.wd_stt + item.wr_stt ==
            9
          ) {
            return (item.manifest_stt = "Completed");
          } else if (
            item.wg_stt + item.wt_stt + item.wd_stt + item.wr_stt ==
            10
          ) {
            return (item.manifest_stt = "Certified");
          } else if (
            item.wg_stt + item.wt_stt + item.wd_stt + item.wr_stt ==
            11
          ) {
            return (item.manifest_stt = "WT Denied");
          } else if (
            item.wg_stt + item.wt_stt + item.wd_stt + item.wr_stt ==
            12
          ) {
            return (item.manifest_stt = "WD Denied");
          } else if (
            item.wg_stt + item.wt_stt + item.wd_stt + item.wr_stt ==
            21
          ) {
            return (item.manifest_stt = "Unapprove");
          } else if (
            item.wg_stt + item.wt_stt + item.wd_stt + item.wr_stt ==
            22
          ) {
            return (item.manifest_stt = "WT Rejected");
          } else if (
            item.wg_stt + item.wt_stt + item.wd_stt + item.wr_stt ==
            24
          ) {
            return (item.manifest_stt = "WD Rejected");
          } else if (
            item.wg_stt + item.wt_stt + item.wd_stt + item.wr_stt ==
            100
          ) {
            return (item.manifest_stt = "WS Denied");
          } else if (
            item.wg_stt + item.wt_stt + item.wd_stt + item.wr_stt ==
            102
          ) {
            return (item.manifest_stt = "Expired");
          }
        });

        for (let i = 0; i < this.data.length; i++) {
          this.data[i].transporter = this.transporters[i];
          this.data[i].manifest_stt = this.manifest_stt[i];
          this.data[i].quantity = this.quantity[i];
        }

        this.loading = false;
      } catch (error) {
        console.error("Error fetching getManifestPerQuery: ", error);
        this.loading = false;
      }
    },
    seeMoreItem(item) {
      this.$router.push("/manifest/tracking?id=" + item.id);
    },
    updateStatus(item) {
      this.$emit("updateStatus", item);
    },
  },
  computed: {
    text_m(){
      return this.$t("manifest");
    },
    headers() {
      return [
        {
          text: this.$t("no"),
          // filterable: false,
          sortable: false,
          value: "no",
        },
        { text: this.$t("manifest_date"), value: "manifest_date", sortable: false },
        {
          text: this.$t("manifest_no"),
          // filterable: false,
          sortable: false,
          value: "manifest_no",
        },
        // { text: this.$t("relocate_date"), value: "relocate_date", sortable: false },
        {
          text: this.$t("type"),
          value: "type_of_service.name_short",
          filter: this.typeFilter,
          width: "100px",
        },
        // {
        //   text: this.$t("organization_level"),
        //   sortable: false,
        //   value: "generator.level.level_name_lo",
        //   filter: this.levelFilter,
        // },
        { text: this.$t("waste_generator"), sortable: false, value: "generator.gen_name" },
        { text: this.$t("waste_transporter"), sortable: false, value: "transporter" },
        { text: this.$t("waste_disposal"), sortable: false, value: "disposal.dis_name" },
        // { text: this.$t("quantity"), value: "quantity", width: "100px" },
        { text: this.$t("status"), value: "manifest_stt", filter: this.statusFilter },
        { text: this.$t("action"), align: "center", width: "100px", value: "actions" },
      ];
    },
  },
  created() {
    this.getToken();
    this.getManifest();
  },
};
</script>

<style>
</style>