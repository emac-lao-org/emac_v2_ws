<template>
  <v-card class="mt-4 mx-6 tracking-card">
    <v-card-text class="pb-2">
      <v-row align="center">
        <v-col cols="12" md="8">
          <div class="text-h6 font-weight-bold blue--text text--darken-4">
            {{ tableTitle }}
          </div>
          <div class="caption grey--text text--darken-1 mt-1">
            {{ priorityHint }}
          </div>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            :label="$t('search_extension_tracking')"
            single-line
            hide-details
            clearable
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row dense class="mt-1">
        <v-col
          v-for="card in summaryCards"
          :key="card.key"
          cols="12"
          sm="6"
          lg="3"
        >
          <v-sheet
            rounded="lg"
            class="pa-4 tracking-summary-card"
            :class="card.className"
          >
            <div class="caption text-uppercase tracking-summary-card__label">
              {{ card.label }}
            </div>
            <div class="text-h5 font-weight-bold mt-1">
              {{ card.value }}
            </div>
            <div class="caption mt-1 tracking-summary-card__hint">
              {{ card.hint }}
            </div>
          </v-sheet>
        </v-col>
      </v-row>

      <v-alert
        dense
        border="left"
        colored-border
        class="mt-4 mb-0"
        :color="alertMeta.color"
        :icon="alertMeta.icon"
      >
        {{ alertMeta.text }}
      </v-alert>
    </v-card-text>

    <v-data-table
      :loading="loading"
      :headers="headers"
      :items="filteredRecords"
      :page.sync="pagination.page"
      :items-per-page.sync="pagination.itemsPerPage"
      :no-data-text="$t('no_data')"
      :item-class="itemClass"
      class="elevation-0"
    >
      <template v-slot:[`item.generator_info`]="{ item }">
        <div class="d-flex flex-column tracking-cell">
          <span class="font-weight-medium">{{ getGeneratorName(item) }}</span>
          <span class="caption grey--text text--darken-1">
            {{ $t("emcg_id") }}: {{ item.catalog?.generator?.emac_id || "-" }}
          </span>
        </div>
      </template>

      <template v-slot:[`item.catalog_info`]="{ item }">
        <div class="d-flex flex-column tracking-cell">
          <div class="d-flex align-center flex-wrap" style="gap: 6px">
            <v-chip x-small outlined color="primary">
              {{ item.catalog?.catalog_no || "-" }}
            </v-chip>
            <v-chip x-small outlined color="blue-grey">
              {{ item.waste_category?.entry_type || "-" }}
            </v-chip>
            <v-chip x-small outlined color="grey darken-1">
              {{ currentYear }}
            </v-chip>
          </div>
          <span class="font-weight-medium mt-2">
            {{ getCategoryName(item) }}
          </span>
          <span class="caption grey--text text--darken-1 mt-1">
            {{ $t("code") }}:
            {{ formatWasteCode(item.waste_category?.code, item.waste_category?.entry_type) }}
          </span>
        </div>
      </template>

      <template v-slot:[`item.current_snapshot`]="{ item }">
        <div class="tracking-summary">
          <div
            v-if="extensionType === 'Time extended'"
            class="tracking-summary__row"
          >
            <span class="tracking-summary__label">{{ $t("current_expiry") }}</span>
            <span class="tracking-summary__value">
              {{ formatDate(item.expire_date) }}
            </span>
          </div>
          <div
            v-if="extensionType === 'Time extended'"
            class="tracking-summary__row"
          >
            <span class="tracking-summary__label">{{ $t("days_remaining") }}</span>
            <span class="tracking-summary__value warning--text text--darken-2">
              {{ daysUntilExpire(item) }} {{ $t("day_label") }}
            </span>
          </div>

          <div
            v-if="extensionType === 'Quota extended'"
            class="tracking-summary__row"
          >
            <span class="tracking-summary__label">{{ $t("current_quota") }}</span>
            <span class="tracking-summary__value">
              {{ formatNumber(item.remaining_amount) }} /
              {{ formatNumber(item.quota_amount) }} KG
            </span>
          </div>
          <div
            v-if="extensionType === 'Quota extended'"
            class="tracking-summary__row"
          >
            <span class="tracking-summary__label">{{ $t("used_of_quota") }}</span>
            <span class="tracking-summary__value warning--text text--darken-2">
              {{ quotaUsedPercent(item) }}%
            </span>
          </div>
        </div>
      </template>

      <template v-slot:[`item.priority_info`]="{ item }">
        <div class="d-flex flex-column tracking-cell">
          <v-chip
            small
            dark
            :color="priorityMeta(item).color"
            class="align-self-start"
          >
            {{ priorityMeta(item).label }}
          </v-chip>
          <span class="caption grey--text text--darken-1 mt-2">
            {{ priorityMeta(item).hint }}
          </span>
        </div>
      </template>

      <template v-slot:[`item.request_gap`]="{ item }">
        <div class="d-flex flex-column tracking-cell">
          <v-chip small color="warning" dark class="align-self-start">
            {{ $t("no_request_yet") }}
          </v-chip>
          <span class="caption grey--text text--darken-1 mt-2">
            {{
              extensionType === "Time extended"
                ? $t("time_request_missing")
                : $t("quota_request_missing")
            }}
          </span>
        </div>
      </template>

      <template v-slot:[`item.detail_link`]="{ item }">
        <v-btn
          v-if="item.catalog?.id"
          icon
          small
          color="primary"
          @click="goToDetail(item)"
        >
          <v-icon small>mdi-open-in-new</v-icon>
        </v-btn>
        <span v-else class="grey--text">-</span>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import moment from "moment";
import wasteCodeMixin from "~/mixins/wasteCode";

export default {
  mixins: [wasteCodeMixin],
  props: {
    extensionType: {
      type: String,
      required: true,
    },
    currentYear: {
      type: Number,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    records: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      pagination: {
        page: 1,
        itemsPerPage: 15,
      },
      search: "",
    };
  },
  computed: {
    currentTypeRecords() {
      return this.records.filter((item) => this.matchesExtensionType(item));
    },
    filteredRecords() {
      return this.currentTypeRecords
        .filter((item) => this.matchesSearch(item))
        .sort((a, b) => this.sortRecords(a, b));
    },
    headers() {
      return [
        { text: this.$t("wg_and_emac"), value: "generator_info", sortable: false },
        {
          text: this.$t("catalog_and_category"),
          value: "catalog_info",
          sortable: false,
        },
        {
          text: this.$t("current_snapshot"),
          value: "current_snapshot",
          sortable: false,
        },
        { text: this.$t("priority"), value: "priority_info", sortable: false },
        { text: this.$t("request_gap"), value: "request_gap", sortable: false },
        {
          text: this.$t("detail"),
          value: "detail_link",
          sortable: false,
          align: "center",
          width: "80px",
        },
      ];
    },
    tableTitle() {
      return this.formatExtensionType(this.extensionType);
    },
    priorityHint() {
      const baseHint =
        this.extensionType === "Time extended"
          ? this.$t("priority_hint_time_reminder")
          : this.$t("priority_hint_quota_reminder");

      return `${this.$t("current_year_only", { year: this.currentYear })} ${baseHint}`;
    },
    alertMeta() {
      if (this.extensionType === "Time extended") {
        return {
          color: "warning",
          icon: "mdi-bell-alert-outline",
          text: this.$t("ws_reminder_time_hint"),
        };
      }

      return {
        color: "deep-orange",
        icon: "mdi-gauge-empty",
        text: this.$t("ws_reminder_quota_hint"),
      };
    },
    urgentCount() {
      return this.currentTypeRecords.filter((item) => this.isUrgent(item)).length;
    },
    generatorCount() {
      return new Set(
        this.currentTypeRecords
          .map((item) => item.catalog?.generator?.id)
          .filter((id) => !!id)
      ).size;
    },
    summaryCards() {
      return [
        {
          key: "visible",
          label: this.$t("visible_records"),
          value: this.filteredRecords.length,
          hint: this.$t("no_request_action_needed"),
          className: "tracking-summary-card--primary",
        },
        {
          key: "urgent",
          label: this.$t("urgent_items"),
          value: this.urgentCount,
          hint:
            this.extensionType === "Time extended"
              ? this.$t("follow_up_within_7_days")
              : this.$t("follow_up_full_or_near_full"),
          className: "tracking-summary-card--danger",
        },
        {
          key: "generator",
          label: this.$t("wg_affected"),
          value: this.generatorCount,
          hint: this.$t("waste_generators_to_notify"),
          className: "tracking-summary-card--warning",
        },
        {
          key: "year",
          label: this.$t("current_catalog_year"),
          value: this.currentYear,
          hint: this.$t("current_year_catalog_only"),
          className: "tracking-summary-card--success",
        },
      ];
    },
  },
  watch: {
    extensionType() {
      this.pagination.page = 1;
      this.search = "";
    },
  },
  methods: {
    formatDate(value) {
      if (!value) return "-";
      return moment(value).format("DD-MM-YYYY");
    },
    formatNumber(value) {
      return Number(value || 0).toLocaleString("en-US");
    },
    formatExtensionType(value) {
      if (value === "Time extended") return this.$t("time_extended");
      if (value === "Quota extended") return this.$t("quota_extended");
      return value || "-";
    },
    getGeneratorName(item) {
      return item.catalog?.generator?.gen_name_lo || item.catalog?.generator?.gen_name || "-";
    },
    getCategoryName(item) {
      return (
        item.custom_description ||
        item.cat_name ||
        item.waste_category?.description_6_lo ||
        "-"
      );
    },
    goToDetail(item) {
      const catalogId = item.catalog?.id;
      if (!catalogId) return;
      this.$router.push(`/waste_catalog/details?id=${catalogId}`);
    },
    hasExtensionRequest(item, type) {
      return (item.extension_operations || []).some(
        (operation) => operation.extended_type === type
      );
    },
    daysUntilExpire(item) {
      if (!item.expire_date) return Number.MAX_SAFE_INTEGER;
      return moment(item.expire_date).startOf("day").diff(moment().startOf("day"), "days");
    },
    quotaUsedPercent(item) {
      const quotaAmount = Number(item.quota_amount || 0);
      const remainingAmount = Number(item.remaining_amount || 0);

      if (!quotaAmount) return 0;

      const usedAmount = quotaAmount - remainingAmount;
      return Math.min(100, Math.round((usedAmount / quotaAmount) * 100));
    },
    matchesExtensionType(item) {
      if (this.extensionType === "Time extended") {
        const days = this.daysUntilExpire(item);
        return (
          [1, 2].includes(Number(item.status)) &&
          days >= 0 &&
          days <= 30 &&
          !this.hasExtensionRequest(item, "Time extended")
        );
      }

      return (
        [1, 4].includes(Number(item.status)) &&
        this.quotaUsedPercent(item) >= 90 &&
        !this.hasExtensionRequest(item, "Quota extended")
      );
    },
    isUrgent(item) {
      if (this.extensionType === "Time extended") {
        return this.daysUntilExpire(item) <= 7;
      }

      return this.quotaUsedPercent(item) >= 100;
    },
    priorityMeta(item) {
      if (this.extensionType === "Time extended") {
        const days = this.daysUntilExpire(item);

        if (days <= 7) {
          return {
            color: "error",
            label: `${days} ${this.$t("days_left")}`,
            hint: this.$t("follow_up_within_7_days"),
          };
        }

        return {
          color: "warning",
          label: `${days} ${this.$t("days_left")}`,
          hint: this.$t("expiring_soon"),
        };
      }

      const usedPercent = this.quotaUsedPercent(item);
      if (usedPercent >= 100) {
        return {
          color: "error",
          label: `100% ${this.$t("quota_used")}`,
          hint: this.$t("quota_limit_reached"),
        };
      }

      return {
        color: "warning",
        label: `${usedPercent}% ${this.$t("quota_used")}`,
        hint: this.$t("near_quota_limit"),
      };
    },
    sortRecords(a, b) {
      if (this.extensionType === "Time extended") {
        return this.daysUntilExpire(a) - this.daysUntilExpire(b);
      }

      return this.quotaUsedPercent(b) - this.quotaUsedPercent(a);
    },
    matchesSearch(item) {
      if (!this.search) return true;

      const q = this.search.toLowerCase();
      const searchFields = [
        this.getGeneratorName(item),
        item.catalog?.generator?.emac_id,
        item.catalog?.catalog_no,
        this.getCategoryName(item),
        item.waste_category?.code,
        this.formatWasteCode(item.waste_category?.code, item.waste_category?.entry_type),
      ];

      return searchFields.some((value) =>
        String(value || "").toLowerCase().includes(q)
      );
    },
    itemClass(item) {
      return this.isUrgent(item) ? "tracking-row--urgent" : "";
    },
  },
};
</script>

<style scoped>
.tracking-card {
  border-radius: 16px;
}

.tracking-summary-card {
  min-height: 112px;
  border: 1px solid #e3e8f0;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
}

.tracking-summary-card__label {
  letter-spacing: 0.08em;
}

.tracking-summary-card__hint {
  color: #5f6b7a;
}

.tracking-summary-card--primary {
  border-color: #bbdefb;
}

.tracking-summary-card--warning {
  border-color: #ffe082;
}

.tracking-summary-card--success {
  border-color: #a5d6a7;
}

.tracking-summary-card--danger {
  border-color: #ffab91;
}

.tracking-cell {
  min-width: 0;
}

.tracking-summary {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 180px;
}

.tracking-summary__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.tracking-summary__label {
  color: #5f6b7a;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.tracking-summary__value {
  font-weight: 600;
  text-align: right;
}
</style>

<style>
.tracking-row--urgent {
  background: #fff8f2;
}
</style>
