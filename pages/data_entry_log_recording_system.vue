<template>
  <div>
    <title-page :title="title" :width="width" />

    <v-card class="mx-6 mt-4">
      <v-card-title class="py-0 pt-2">
        <v-spacer></v-spacer>
        <v-col cols="4">
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
              <v-btn icon @click="getLog" color="primary" v-bind="attrs" v-on="on">
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </template>
            <span>Reload Data</span>
          </v-tooltip>
        </v-col>
      </v-card-title>
      
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="data"
        :server-items-length="totalCount"
        :options.sync="pagination"
        @update:options="getLog"
        class="elevation-1"
      >
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      searchTimeout: null,
      loading: false,
      totalCount: 0,
      pagination: {
        page: 1,
        itemsPerPage: 10,
      },
      width: "35%",
      data: [],
      headers: [
        {
          text: "Date",
          align: "start",
          sortable: false,
          value: "log_date",
          width: "20%"
        },
        { text: "Manifest no", value: "manifest.manifest_no" },
        { text: "Action", value: "name", width: "15%" },
        { text: "Description", value: "description", width: "70%" },
      ],
    };
  },
  watch: {
    "pagination.page"(val) {
      this.getLog();
    },
    "pagination.itemsPerPage"(val) {
      this.pagination.page = 1;
      this.getLog();
    },
    search() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.pagination.page = 1;
        this.getLog();
      }, 500);
    },
  },
  methods: {
    buildWhere() {
      let where = {};
      if (this.search) {
        where._or = [
          { description: { _ilike: `%${this.search}%` } },
          { name: { _ilike: `%${this.search}%` } },
          { manifest: { manifest_no: { _ilike: `%${this.search}%` } } }
        ];
      }
      return where;
    },
    async getLog() {
      this.loading = true;
      const { page, itemsPerPage } = this.pagination;
      const limit = itemsPerPage === -1 ? this.totalCount || 10 : itemsPerPage;
      const offset = (page - 1) * limit;
      const whereCondition = this.buildWhere();

      try {
        const countRes = await this.$apollo.query({
          query: require("~/gql/queries/getDataEntryLog").getDataEntryLogCount,
          variables: { where: whereCondition },
          fetchPolicy: "network-only",
        });
        this.totalCount = countRes.data.emac_entry_logs_aggregate.aggregate.count;

        const { data } = await this.$apollo.query({
          query: require("~/gql/queries/getDataEntryLog").getDataEntryLog,
          variables: { limit, offset, where: whereCondition },
          fetchPolicy: "network-only",
        });

        this.data = data.emac_entry_logs;
      } catch (error) {
        console.error("Error fetching logs: ", error);
      } finally {
        this.loading = false;
      }
    },
  },
  computed: {
    title() {
      return this.$t("data_entry_log_recording_system");
    },
  },
};
</script>

<style>
</style>