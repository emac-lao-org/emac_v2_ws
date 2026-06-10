<template>
  <div
    class="catalog-extension-tracking-page"
    :class="{ 'catalog-extension-tracking-page--lao': isLao }"
  >
    <title-page :title="title" :width="width" />

    <v-card class="mx-6 mt-4 extension-tracking-page">
      <v-card-text class="pb-0">
        <div class="text-body-2 grey--text text--darken-1">
          {{ $t("catalog_extension_tracking_action_description") }}
        </div>
      </v-card-text>

      <v-tabs v-model="tab" color="#0d47a1" fixed-tabs>
        <v-tab
          v-for="item in tabItems"
          :key="item.value"
          class="text-none"
        >
          <span>{{ item.label }}</span>
          <v-chip x-small class="ml-2" color="primary" text-color="white">
            {{ item.count }}
          </v-chip>
        </v-tab>
      </v-tabs>
    </v-card>

    <extension-tracking-table
      :records="records"
      :loading="loading"
      :extension-type="selectedExtensionType"
      :current-year="currentYear"
    />
  </div>
</template>

<script>
import titlePage from "~/components/titlePage.vue";
import ExtensionTrackingTable from "~/components/waste_catalog/tracking/extensionTrackingTable.vue";

export default {
  components: {
    titlePage,
    ExtensionTrackingTable,
  },
  data() {
    return {
      loading: false,
      records: [],
      tab: 0,
      width: "48%",
    };
  },
  computed: {
    isLao() {
      return this.$i18n.locale === "la";
    },
    title() {
      return this.$t("catalog_extension_tracking");
    },
    currentYear() {
      return new Date().getFullYear();
    },
    selectedExtensionType() {
      return this.tab === 0 ? "Time extended" : "Quota extended";
    },
    tabItems() {
      return [
        {
          value: "Time extended",
          label: this.$t("time_extended"),
          count: this.countByType("Time extended"),
        },
        {
          value: "Quota extended",
          label: this.$t("quota_extended"),
          count: this.countByType("Quota extended"),
        },
      ];
    },
  },
  methods: {
    checkLanguage() {
      const locale = localStorage.getItem("lang");
      this.$i18n.locale = locale;
    },
    matchesReminderType(item, type) {
      const hasExtensionRequest = (item.extension_operations || []).some(
        (operation) => operation.extended_type === type
      );

      if (type === "Time extended") {
        if (hasExtensionRequest || !item.expire_date) return false;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const days = Math.floor(
          (new Date(item.expire_date).getTime() - today.getTime()) / 86400000
        );

        return [1, 2].includes(Number(item.status)) && days >= 0 && days <= 30;
      }

      const quotaAmount = Number(item.quota_amount || 0);
      const remainingAmount = Number(item.remaining_amount || 0);
      if (!quotaAmount || hasExtensionRequest) return false;

      const usedPercent = ((quotaAmount - remainingAmount) / quotaAmount) * 100;
      return [1, 4].includes(Number(item.status)) && usedPercent >= 90;
    },
    countByType(type) {
      return this.records.filter((item) => this.matchesReminderType(item, type)).length;
    },
    async getExtensionTracking() {
      this.loading = true;
      try {
        const res = await this.$apollo.query({
          query: require("~/gql/queries/waste_categories/catalogExtensionReminder.gql")
            .catalogExtensionReminder,
          variables: {
            operationStatuses: [1, 2, 4],
            startDate: `${this.currentYear}-01-01`,
            endDate: `${this.currentYear}-12-31`,
          },
          fetchPolicy: "network-only",
        });

        this.records = res.data.emac_catalog_operations || [];
      } catch (err) {
        console.log("extension tracking error", err);
        this.records = [];
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.checkLanguage();
    this.getExtensionTracking();
  },
};
</script>

<style scoped>
.extension-tracking-page {
  border-radius: 16px;
}

.catalog-extension-tracking-page--lao ::v-deep * {
  font-family: "Phetsarath OT";
}
</style>
