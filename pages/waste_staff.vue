<template>
  <div class="ml-4 mt-8">
    <title-page :title="title" :width="width" />
    <v-row>
      <v-col>
        <CardTab :amount="amountWs" :title="titleCard" color="#0d47a1" />
      </v-col>

      <v-col align-self="end" cols="2">
        <card-tab-small
          color_a="#3C9700"
          color_b="#1CBF27"
          color="green"
          height="100"
          width="240"
         :title="text_active"
          :total="dataUserWs_active"
        />
      </v-col>
      <v-col align-self="end" cols="2">
        <card-tab-small
          color_a="#EB7E12"
          color_b="#FF9B00"
          color="orange"
          height="100"
          width="240" 
          :title="text_suspended"
          :total="dataUserWs_suspended"
        />
      </v-col>
      <v-col align-self="end" cols="2">
        <card-tab-small
          color_a="#cb2d3e"
          color_b="#ef473a"
          color="red"
          height="100"
          width="240"
         :title="text_banned"
          :total="dataUserWs_delete"
        />
      </v-col>
      <v-col class="mr-4" align="end" align-self="end">
        <v-btn
          v-if="isMainWs"
          class="mr-0 mb-2"
          outlined
          color="primary"
          to="/waste_staff_certify_permissions"
        >
          Manage Certify Permissions
        </v-btn>
        <dialogCreateUser />
      </v-col>
    </v-row>
    <tabHeaderWS />
  </div>
</template>

<script>
import tabHeaderWS from '~/components/users_management/tabHeaderWS.vue'
import dialogCreateUser from '~/components/users_management/dialogCreateUser.vue'
import getWSUsers from '~/mixins/getWSUsers'

export default {
  mixins: [getWSUsers],
  components: { tabHeaderWS, dialogCreateUser  },
  data() {
    return {
      width: '35%',
      isMainWs: false,
    }
  },
  methods: {
    async getCurrentUserPermission() {
      const uid = this.$nuxt?.$fire?.auth?.currentUser?.uid;
      if (!uid) {
        this.isMainWs = false;
        return;
      }
      try {
        const { data } = await this.$apollo.query({
          query: require("~/gql/queries/users_management/getWSUsers").getCurrentWSUserCertifyPermission,
          variables: { id: uid },
          fetchPolicy: "network-only",
        });
        this.isMainWs = !!data?.emac_users_by_pk?.is_main_ws;
      } catch (error) {
        console.error("Error loading WS permission:", error);
        this.isMainWs = false;
      }
    },
  },
  computed:{
      titleCard() {
      return this.$t("all_ws_user");
    },
    title() {
      return this.$t("waste_staff");
    },
    text_active() {
      return this.$t("active_user");
    },
    text_suspended() {
      return this.$t("suspened_user");
    },
    text_banned() {
      return this.$t("banned_user");
    },
  }
  ,
  mounted() {
    this.getCurrentUserPermission();
  }
}
</script>

<style>
</style>
