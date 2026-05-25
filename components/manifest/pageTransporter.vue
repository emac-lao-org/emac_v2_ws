<template>
  <div>
    <div v-if="this.data_wt.length == 1">
      <!-- {{ data_vill_wt1 }} -->
      <page-tran
        address="1"
        :data_vill_wt="data_vill_wt1"
        :data_wt="data_wt"
        :wt_status="wt_status"
        :order="0"
        :vehicles_order="0"
      />
    </div>

    <div v-if="this.data_wt.length == 2">
      <!-- Transporter 1 -->
      <page-tran
        address="1"
        :data_vill_wt="data_vill_wt1"
        :data_wt="data_wt"
        :wt_status="wt_status"
        :order="0"
        :vehicles_order="0"
      />
      <div class="point-break"></div>
      <page-tran
        address="2"
        :data_vill_wt2="data_vill_wt2"
        :data_wt="data_wt"
        :wt_status="wt_status"
        :order="1"
        :vehicles_order="1"
      />
    </div>

    <div v-if="this.data_wt.length == 3">
      <page-tran
        address="1"
        :data_vill_wt="data_vill_wt1"
        :data_wt="data_wt"
        :wt_status="wt_status"
        :order="0"
        :vehicles_order="0"
      />

      <page-tran
        address="2"
        :data_vill_wt2="data_vill_wt2"
        :data_wt="data_wt"
        :wt_status="wt_status"
        :order="1"
        :vehicles_order="1"
      />

      <page-tran
        address="3"
        :data_vill_wt3="data_vill_wt3"
        :data_wt="data_wt"
        :wt_status="wt_status"
        :order="2"
        :vehicles_order="2"
      />
    </div>
  </div>
</template>
<script>
import pageTran from "./pageTran.vue";

export default {
  components: { pageTran },
  props: {
    data_wt: {
      type: [Array, Object],
      default: () => [],
    },
    wt_status: {
      type: [String, Number],
    },
    // transporter_operations_1: {
    //   type: Object,
    // },
    data_vill_wt1: {
      type: String,
      default: "No data",
    },
    // transporter_operations_2: {
    //   type: [Array, Object],
    // },
    data_vill_wt2: {
      type: String,
      default: "No data",
    },
    // transporter_operations_3: {
    //   type: [Array, Object],
    // },
    data_vill_wt3: {
      type: String,
      default: "No data",
    },
    security_seal: {
      type: String,
      default: "No data",
    },
  },

  data() {
    return {
      id: this.$route.query.id,
    };
  },
};
</script>

<style scoped>
.point-break {
  page-break-after: always;
}
</style>