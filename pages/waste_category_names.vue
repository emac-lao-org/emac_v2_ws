<template>
  <div>
    <title-page :title="title" :width="width" />

    <v-card class="mt-4 mx-6">
      <v-card-title class="py-0 pt-2">
        <v-row align="center">
          <v-col cols="12" md="3">
            <h2 style="border-right: 3px solid #0d47a1">
              {{ $t("waste_details") }}
            </h2>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="statusFilter"
              :items="statusItems"
              item-text="text"
              item-value="value"
              :label="$t('status')"
              clearable
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              :label="$t('search')"
              single-line
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="2" class="text-md-right">
            <v-btn color="primary" @click="openCreateDialog">
              <v-icon left>mdi-plus</v-icon>
              {{ $t("create") }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>

      <v-card-text v-if="selectedWasteCategoryLabel" class="pt-2 pb-0">
        <div class="text-subtitle-2">
          {{ $t("selected_code") }}:
          <strong>{{ selectedWasteCategoryLabel }}</strong>
        </div>
      </v-card-text>

      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="filteredItems"
        :search="search"
      >
        <template v-slot:[`item.waste_category.code`]="{ item }">
          {{ formatWasteCode(item.waste_category.code, item.waste_category.entry_type) }}
        </template>

        <template v-slot:[`item.waste_category.description_6_lo`]="{ item }">
          <div class="text-truncate" style="max-width: 280px">
            {{ item.waste_category.description_6_lo }}
          </div>
        </template>

        <template v-slot:[`item.name`]="{ item }">
          <div class="text-truncate" style="max-width: 240px">
            {{ item.name }}
          </div>
        </template>

        <template v-slot:[`item.status`]="{ item }">
          <v-chip small :color="statusColor(item.status)">
            {{ statusLabel(item.status) }}
          </v-chip>
        </template>

        <template v-slot:[`item.action`]="{ item }">
          <v-icon class="mr-2" @click="openEditDialog(item)">mdi-pencil-outline</v-icon>
          <v-icon
            v-if="item.status === 9"
            class="mr-2"
            color="success"
            @click="activateItem(item)"
          >
            mdi-check-circle-outline
          </v-icon>
          <v-icon
            v-else
            color="error"
            @click="deactivateItem(item)"
          >
            mdi-close-circle-outline
          </v-icon>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" persistent max-width="720px">
      <v-card>
        <v-card-title>
          <h2 class="blue--text text--darken-4 font-weight-bold text-uppercase">
            {{ editMode ? $t("edit") : $t("create") }}
          </h2>
          <v-divider
            style="border: 1px solid #0d47a1"
            class="ml-4"
            vertical
          ></v-divider>
        </v-card-title>
        <v-card-text class="mt-4">
          <v-row>
            <v-col cols="12" md="4">
              <v-select
                v-model="form.entry_type"
                :items="entryTypeItems"
                item-text="text"
                item-value="value"
                :label="$t('entry_type')"
                :disabled="editMode || !!prefilledWasteCatId"
                outlined
                hide-details="auto"
                @change="onDialogEntryTypeChange"
              ></v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-autocomplete
                v-model="form.waste_cat_id"
                :items="filteredWasteCategoryItems"
                item-text="display_text"
                item-value="id"
                :label="$t('waste_code')"
                :disabled="editMode || !!prefilledWasteCatId"
                outlined
                hide-details="auto"
                clearable
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                :value="selectedDialogWasteCategoryDescription"
                :label="$t('waste_name')"
                readonly
                outlined
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model.trim="form.name"
                :label="$t('waste_details_name')"
                outlined
                hide-details="auto"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="mx-4">
          <v-spacer></v-spacer>
          <v-btn outlined color="primary" class="mx-4 my-4" @click="closeDialog">
            {{ $t("cancel") }}
          </v-btn>
          <v-btn color="primary" class="mx-4 my-4" @click="submitDialog">
            {{ editMode ? $t("update") : $t("create") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import gql from "graphql-tag";
import Swal from "sweetalert2";
import titlePage from "~/components/titlePage.vue";
import wasteCodeMixin from "~/mixins/wasteCode";
import insertWasteCategoryName from "~/gql/mutations/waste_category_names/insertWasteCategoryName.gql";
import approveWasteCategoryName from "~/gql/mutations/waste_category_names/approveWasteCategoryName.gql";
import rejectWasteCategoryName from "~/gql/mutations/waste_category_names/rejectWasteCategoryName.gql";
import updateWasteCategoryName from "~/gql/mutations/waste_category_names/updateWasteCategoryName.gql";

export default {
  components: { titlePage },
  mixins: [wasteCodeMixin],
  data() {
    return {
      width: "38%",
      loading: false,
      dialog: false,
      editMode: false,
      search: "",
      statusFilter: null,
      data: [],
      wasteCategoryItems: [],
      form: {
        id: "",
        waste_cat_id: "",
        entry_type: "",
        name: "",
      },
    };
  },
  computed: {
    title() {
      return this.$t("waste_details");
    },
    prefilledWasteCatId() {
      return this.$route.query.waste_cat_id || "";
    },
    selectedWasteCategoryLabel() {
      const item = this.wasteCategoryItems.find((d) => d.id === this.prefilledWasteCatId);
      if (!item) return "";
      return `${this.formatWasteCode(item.code, item.entry_type)} ${item.description_6_lo}`;
    },
    selectedDialogWasteCategoryDescription() {
      const item = this.wasteCategoryItems.find((d) => d.id === this.form.waste_cat_id);
      return item ? item.description_6_lo : "";
    },
    entryTypeItems() {
      return [
        { text: "Hz", value: "Hz" },
        { text: "NHz", value: "NHz" },
      ];
    },
    filteredWasteCategoryItems() {
      if (!this.form.entry_type) {
        return this.wasteCategoryItems;
      }

      if (this.form.entry_type === "Hz") {
        return this.wasteCategoryItems.filter((item) => item.entry_type === "Hz");
      }

      return this.wasteCategoryItems.filter((item) => item.entry_type !== "Hz");
    },
    statusItems() {
      return [
        { text: this.$t("all"), value: null },
        { text: this.$t("active"), value: 1 },
        { text: this.$t("inactive"), value: 9 },
      ];
    },
    filteredItems() {
      return this.data.filter((item) => {
        if (this.statusFilter === null || this.statusFilter === "") return true;
        return item.status === this.statusFilter;
      });
    },
    headers() {
      return [
        { text: this.$t("code"), value: "waste_category.code" },
        { text: this.$t("waste_name"), value: "waste_category.description_6_lo" },
        { text: this.$t("waste_details_name"), value: "name" },
        { text: this.$t("status"), value: "status", align: "center" },
        { text: this.$t("action"), value: "action", align: "center", sortable: false },
      ];
    },
  },
  watch: {
    "$route.query.waste_cat_id"() {
      this.fetchNames();
    },
  },
  methods: {
    async fetchWasteCategories() {
      const { data } = await this.$apollo.query({
        query: require("~/gql/queries/waste_categories/getWastCategories").getWasteCategories,
        fetchPolicy: "network-only",
      });
      this.wasteCategoryItems = (data.emac_waste_categories || []).map((item) => ({
        ...item,
        display_text: `${this.formatWasteCode(item.code, item.entry_type)} ${item.description_6_lo || item.description_6 || ""}`,
      }));
    },
    async fetchNames() {
      this.loading = true;
      try {
        const where = {};
        if (this.prefilledWasteCatId) {
          where.waste_cat_id = { _eq: this.prefilledWasteCatId };
        }

        const { data } = await this.$apollo.query({
          query: require("~/gql/queries/waste_category_names/getWasteCategoryNames.gql")
            .getWasteCategoryNames,
          variables: { where },
          fetchPolicy: "network-only",
        });
        this.data = data.emac_waste_category_names || [];
      } catch (error) {
        console.log(error);
        Swal.fire("Error", "Can't load waste details", "error");
      } finally {
        this.loading = false;
      }
    },
    openCreateDialog() {
      const prefilledWasteCategory = this.wasteCategoryItems.find(
        (d) => d.id === this.prefilledWasteCatId
      );
      this.editMode = false;
      this.form = {
        id: "",
        waste_cat_id: this.prefilledWasteCatId || "",
        entry_type: prefilledWasteCategory
          ? prefilledWasteCategory.entry_type
          : "",
        name: "",
      };
      this.dialog = true;
    },
    openEditDialog(item) {
      this.editMode = true;
      this.form = {
        id: item.id,
        waste_cat_id: item.waste_cat_id,
        entry_type: item.waste_category?.entry_type || "",
        name: item.name,
      };
      this.dialog = true;
    },
    closeDialog() {
      const prefilledWasteCategory = this.wasteCategoryItems.find(
        (d) => d.id === this.prefilledWasteCatId
      );
      this.dialog = false;
      this.editMode = false;
      this.form = {
        id: "",
        waste_cat_id: this.prefilledWasteCatId || "",
        entry_type: prefilledWasteCategory
          ? prefilledWasteCategory.entry_type
          : "",
        name: "",
      };
    },
    onDialogEntryTypeChange() {
      if (this.editMode || this.prefilledWasteCatId) {
        return;
      }

      const selectedWasteCategory = this.wasteCategoryItems.find(
        (d) => d.id === this.form.waste_cat_id
      );

      const stillMatches =
        selectedWasteCategory &&
        ((this.form.entry_type === "Hz" &&
          selectedWasteCategory.entry_type === "Hz") ||
          (this.form.entry_type === "NHz" &&
            selectedWasteCategory.entry_type !== "Hz"));

      if (!stillMatches) {
        this.form.waste_cat_id = "";
      }
    },
    async submitDialog() {
      if (!this.form.waste_cat_id || !this.form.name.trim()) {
        Swal.fire("Error", "Please complete all required fields", "error");
        return;
      }

      try {
        if (this.editMode) {
          await this.$apollo.mutate({
            mutation: gql`
              ${updateWasteCategoryName.updateWasteCategoryName}
            `,
            variables: {
              id: this.form.id,
              name: this.form.name.trim(),
            },
          });
          Swal.fire("Success", "Waste details updated", "success");
        } else {
          await this.$apollo.mutate({
            mutation: gql`
              ${insertWasteCategoryName.insertWasteCategoryName}
            `,
            variables: {
              waste_cat_id: this.form.waste_cat_id,
              name: this.form.name.trim(),
              approved_by_user_id: this.currentUserId(),
            },
          });
          Swal.fire("Success", "Waste details created", "success");
        }

        this.closeDialog();
        this.fetchNames();
      } catch (error) {
        console.log(error);
        Swal.fire("Error", error.message || "Operation failed", "error");
      }
    },
    async activateItem(item) {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "to activate this waste details item!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, activate it!",
        cancelButtonText: "No, cancel!",
        confirmButtonColor: "#4caf50",
      });
      if (!result.isConfirmed) return;

      try {
        await this.$apollo.mutate({
          mutation: gql`
            ${approveWasteCategoryName.approveWasteCategoryName}
          `,
          variables: {
            id: item.id,
            approved_by_user_id: this.currentUserId(),
          },
        });
        Swal.fire("Success!", "Waste details item has been activated.", "success");
        this.fetchNames();
      } catch (error) {
        console.log(error);
        Swal.fire("Error", error.message || "Activate failed", "error");
      }
    },
    async deactivateItem(item) {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "to deactivate this waste details item!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, deactivate it!",
        cancelButtonText: "No, cancel!",
        confirmButtonColor: "#ef5350",
      });
      if (!result.isConfirmed) return;

      try {
        await this.$apollo.mutate({
          mutation: gql`
            ${rejectWasteCategoryName.rejectWasteCategoryName}
          `,
          variables: {
            id: item.id,
          },
        });
        Swal.fire("Success!", "Waste details item has been deactivated.", "success");
        this.fetchNames();
      } catch (error) {
        console.log(error);
        Swal.fire("Error", error.message || "Deactivate failed", "error");
      }
    },
    statusColor(status) {
      if (status === 1) return "success";
      if (status === 9) return "grey";
      return "warning";
    },
    statusLabel(status) {
      if (status === 1) return this.$t("active");
      if (status === 9) return this.$t("inactive");
      return this.$t("pending");
    },
    currentUserId() {
      if (
        this.$nuxt &&
        this.$nuxt.$fire &&
        this.$nuxt.$fire.auth &&
        this.$nuxt.$fire.auth.currentUser
      ) {
        return this.$nuxt.$fire.auth.currentUser.uid || "";
      }
      return "";
    },
  },
  async created() {
    await this.fetchWasteCategories();
    await this.fetchNames();
  },
};
</script>
