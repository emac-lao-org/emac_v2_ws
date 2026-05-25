<template>
  <div class="ml-4 mt-8">
    <title-page :title="title" :width="width" />

    <v-card class="mt-4 mr-4">
      <v-card-title class="py-0 pt-2">
        <v-row>
          <v-col cols="4">
            <h2 style="border-right: 3px solid #0d47a1">
              Manage Certify Permissions
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
                <v-btn
                  icon
                  @click="getWSUsers"
                  color="primary"
                  class="mr-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
              </template>
              <span>Reload Data</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="dataUserWs"
        :server-items-length="totalCount"
        :options.sync="pagination"
        @update:options="getWSUsers"
        class="elevation-1"
      >
        <template v-slot:[`item.verification_status`]="{ item }">
          <v-chip
            small
            :color="
              item.verification_status == 1
                ? 'primary'
                : item.verification_status == 2
                ? 'warning'
                : 'error'
            "
          >
            {{
              item.verification_status == 1
                ? "Active"
                : item.verification_status == 2
                ? "Suspended"
                : "Deleted"
            }}
          </v-chip>
        </template>

        <template v-slot:[`item.is_main_ws`]="{ item }">
          <v-chip small :color="item.is_main_ws ? 'primary' : 'grey'" dark>
            {{ item.is_main_ws ? "Main WS" : "Standard WS" }}
          </v-chip>
        </template>

        <template v-slot:[`item.can_certify_manifest`]="{ item }">
          <v-switch
            :input-value="item.can_certify_manifest"
            :disabled="item.is_main_ws"
            inset
            color="success"
            @change="toggleCertifyPermission(item, $event)"
          ></v-switch>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import gql from "graphql-tag";
import Swal from "sweetalert2";
import titlePage from "~/components/titlePage.vue";
import update_ws_user from "~/gql/mutations/users_management/updateWSUser";

export default {
  components: { titlePage },
  data() {
    return {
      width: "42%",
      isMainWs: false,
      dataUserWs: [],
      totalCount: 0,
      searchTimeout: null,
      pagination: {
        page: 1,
        itemsPerPage: 10,
      },
      search: "",
    };
  },
  computed: {
    title() {
      return "WS Certify Permissions";
    },
    headers() {
      return [
        { text: "Name", value: "name" },
        { text: "Email", value: "email" },
        { text: "Telephone", value: "tel" },
        { text: "EMCS ID", value: "emc_id" },
        { text: "Main WS", value: "is_main_ws" },
        { text: "Status", value: "verification_status" },
        { text: "Can Certify Manifest", value: "can_certify_manifest" },
      ];
    },
  },
  watch: {
    "pagination.page"() {
      this.getWSUsers();
    },
    "pagination.itemsPerPage"() {
      this.pagination.page = 1;
      this.getWSUsers();
    },
    search() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.pagination.page = 1;
        this.getWSUsers();
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
          { emc_id: { _ilike: `%${this.search}%` } },
        ];
      }
      return where;
    },
    async getCurrentUserPermission() {
      const uid = this.$nuxt?.$fire?.auth?.currentUser?.uid;
      if (!uid) {
        this.$router.push("/waste_staff");
        return false;
      }

      try {
        const { data } = await this.$apollo.query({
          query: require("~/gql/queries/users_management/getWSUsers").getCurrentWSUserCertifyPermission,
          variables: { id: uid },
          fetchPolicy: "network-only",
        });
        this.isMainWs = !!data?.emac_users_by_pk?.is_main_ws;
        if (!this.isMainWs) {
          Swal.fire("Forbidden", "Only Main WS can manage certify permissions.", "error")
            .then(() => this.$router.push("/waste_staff"));
          return false;
        }
        return true;
      } catch (error) {
        console.error("Error loading current WS permission:", error);
        this.$router.push("/waste_staff");
        return false;
      }
    },
    async getWSUsers() {
      const allowed = await this.getCurrentUserPermission();
      if (!allowed) return;

      const { page, itemsPerPage } = this.pagination;
      const limit = itemsPerPage === -1 ? this.totalCount || 10 : itemsPerPage;
      const offset = (page - 1) * limit;
      const whereCondition = this.buildWhere();

      try {
        const countRes = await this.$apollo.query({
          query: require("~/gql/queries/users_management/getWSUsers").getWSUsersCount,
          variables: { where: whereCondition },
          fetchPolicy: "network-only",
        });
        this.totalCount = countRes.data.emac_users_aggregate.aggregate.count;

        const { data } = await this.$apollo.query({
          query: require("~/gql/queries/users_management/getWSUsers").getWSUsers,
          variables: { limit, offset, where: whereCondition },
          fetchPolicy: "network-only",
        });

        this.dataUserWs = data.emac_users;
      } catch (error) {
        console.error("Error fetching WS users:", error);
      }
    },
    async toggleCertifyPermission(item, value) {
      if (!this.isMainWs) {
        Swal.fire("Forbidden", "Only Main WS can update certify permissions.", "error");
        return;
      }

      try {
        await this.$apollo.mutate({
          mutation: gql`
            ${update_ws_user.updateWSUser}
          `,
          variables: {
            id: item.id,
            name: item.name,
            tel: item.tel ? item.tel.toString() : "",
            verification_status: item.verification_status,
            can_certify_manifest: !!value,
          },
        });

        item.can_certify_manifest = !!value;
        Swal.fire("Updated!", "Certify permission has been updated.", "success");
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Cannot update certify permission.", "error");
        this.getWSUsers();
      }
    },
  },
  mounted() {
    this.getWSUsers();
  },
};
</script>
