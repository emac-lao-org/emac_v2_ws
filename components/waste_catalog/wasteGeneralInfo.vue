<template>
  <div>
    <v-row>
      <v-col cols="3">
        <h2 class="text-uppercase">{{text_title}}</h2>
      </v-col>
      <v-col cols="3">
        <div v-if="data.status == 1">
          <v-chip class="ml-6" small color="success"> {{this.$t("active")}}</v-chip>
        </div>
        <div v-else-if="data.status == 2">
          <v-chip class="ml-6" small color="warning"> {{this.$t("suspended")}}</v-chip>
        </div>
        <div v-else-if="data.status == 3">
          <v-chip class="ml-6" dark small color="black"> {{this.$t("expired")}}</v-chip>
        </div>
        <div v-else-if="data.status == 4">
          <v-chip class="ml-6" small color="secondary">{{this.$t("delete")}}</v-chip>
        </div>
        <div v-else-if="data.status == 5">
          <v-chip class="ml-6" small color="error">{{this.$t("rejected")}} </v-chip>
        </div>
      </v-col>
      <v-col align="end">
        <v-btn @click="back" outlined color="primary"> <b>{{this.$t("back")}}</b> </v-btn>
        <v-btn @click="dialog = true" color="primary"> <b>{{this.$t("edit")}}</b> </v-btn>
        <v-btn
          v-if="this.$store.state.edit == true"
          @click="approveWaste(5,9)"
          color="error"
        >
        {{this.$t("rejected")}} 
        </v-btn>

        <v-btn
          v-if="this.$store.state.editRejectQ == true"
          @click="approveWaste(5,7)"
          color="error"
        >
          Rejected quota
        </v-btn>
        <v-btn
          v-if="this.$store.state.editRejectT == true"
          @click="approveWaste(5,6)"
          color="error"
        >
          Rejected time
        </v-btn>

        <v-btn
          v-if="
            this.$store.state.edit ||
            this.$store.state.editRejectQ ||
            this.$store.state.editRejectT == true
          "
          @click="approveWaste(1,1)"
          color="success"
        >
          {{this.$t("approve")}} 
        </v-btn>

        <!-- <v-btn
          v-if="this.$store.state.edit == true"
          @click="approveWaste(7)"
          color="error"
        >
          Reject quota extention
        </v-btn> -->
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          v-model="data.name"
          :label="labelsCat[0]"
          outlined
          hide-details="auto"
          readonly
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          v-model="data.expire_date"
          :label="labelsCat[1]"
          outlined
          hide-details="auto"
          readonly
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          v-model="totalQuota"
           :label="labelsCat[2]"
          outlined
          hide-details="auto"
          readonly
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-textarea
          v-model="data.description"
           :label="labelsCat[3]"
          outlined
          hide-details="auto"
          readonly
        ></v-textarea>
      </v-col>
    </v-row>
    <v-divider style="border: 1px solid #0d47a1" class="my-6"></v-divider>
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col>
            <h2 class="text-uppercase">{{this.$t("enterprise_infomation")}}</h2>
          </v-col>
          <v-spacer></v-spacer>
          <v-col align="end">
            <v-btn outlined color="primary" @click="toMoreDetails">
              {{this.$t("more_detail")}} >></v-btn
            >
          </v-col>
        </v-row>
      </v-col>
      <v-col>
        <v-text-field
          v-model="gen_name_lo"
            :label="labelsCat[4]"
          outlined
          hide-details="auto"
          readonly
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          v-model="gen_name"
         :label="labelsCat[5]"
          outlined
          hide-details="auto"
          readonly
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          v-model="emct_id"
          label="EMACT ID"
          outlined
          hide-details="auto"
          readonly
        ></v-text-field>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" persistent>
      <v-card>
        <div class="mx-6">
          <v-card-title>
            <h2
              style="margin-bottom: -6px"
              class="
                
                blue--text
                text--darken-4
                font-weight-bold
                text-uppercase
              "
            >
              {{this.$t("edit")}}
            </h2>
            <v-divider
              style="border: 1px solid #0d47a1"
              class="ml-4"
              vertical
            ></v-divider>
          </v-card-title>
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="data.name"
                outlined
                clearable
                 :label="labelsCat[0]"
                required
              ></v-text-field>
            </v-col>
            <!-- <v-col cols="6">
              <v-select
                v-model="data.status"
                item-text="name"
                item-value="value"
                :items="statuses"
                 :label="labelsCat[6]"
                required
                outlined
              ></v-select>
            </v-col> -->
            <v-col cols="6">
              <v-text-field
                v-model="totalQuota"
                outlined
                disabled
                  :label="labelsCat[2]"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="data.description"
                outlined
                clearable
                  :label="labelsCat[3]"
                required
              ></v-textarea>
            </v-col>
          </v-row>
          <v-card-actions class="mx-4">
            <v-spacer></v-spacer>
            <v-btn
              outlined
              color="primary"
              class="mx-4 my-4"
              @click="dialog = false"
            >
              {{this.$t("cancel")}}
            </v-btn>
            <v-btn @click="updateWasteCatalog" color="primary">
              <!-- <v-icon small>mdi-plus</v-icon> -->
              {{this.$t("update")}}
            </v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import updateWasteCat from "~/gql/mutations/waste_catalog/updateWasteCat.gql";
import approveWasteCatOpt from "~/gql/mutations/waste_catalog/autoApproveWasteCatOpt.gql";
import approve from "~/gql/mutations/waste_catalog/approveWasteCat.gql";
import gql from "graphql-tag";
export default {
  data() {
    return {
      statuses: this.$store.state.statuses,
      data: [],
      totalQuota: 0,
      gen_name_lo: "",
      gen_name: "",
      emct_id: "",
      dialog: false,
    };
  },
  methods: {
    toMoreDetails() {
      this.$router.push("/company_management/WG/" + this.data.generator.id);
    },
    approveWaste(cl,cr) {
      // console.log('number :>> ', number)
      this.$apollo
        .mutate({
          mutation: gql`
            ${approve.approveWasteCat}
          `,
          variables: {
            id: this.data.id,
            status: cl,
          },
        })
        .then(() => {
          this.$apollo
            .mutate({
              mutation: gql`
                ${approveWasteCatOpt.autoApproveWasteCatOpt}
              `,
              variables: {
                id: this.data.id,
                status: cr,
              },
            })
            .then(() => {
              Swal.fire({
                icon: "success",
                title: "Approve success",
                showConfirmButton: false,
                timer: 1500,
              })
            }).then(() => {
              window.location.href = "/waste_catalog_approved";
            })
        });
    },
    back() {
      this.$router.go(-1);
      this.toggleEdit();
    },
    toggleEdit() {
      this.$store.commit("SET_EDIT", false);
      this.$store.commit("SET_EDITREJECTQ", false);
      this.$store.commit("SET_EDITREJECTT", false);
    },
    updateWasteCatalog() {
      this.$apollo
        .mutate({
          mutation: gql`
            ${updateWasteCat.updateWasteCat}
          `,
          variables: {
            id: this.data.id,
            name: this.data.name,
            description: this.data.description,
            status: this.data.status,
          },
        })
        .then(() => {
          alert("Update success");
          window.location.reload();
        });
    },
    async getWasteCat() {
      this.data = await this.$apollo.query({
        query: require("~/gql/queries/waste_catalog/getWasteCatalog")
          .getWasteCatalogById,

        variables: {
          id: this.$route.query.id,
        },
      });
      this.data = this.data.data.emac_catalogs[0];
      // console.log(
      //   "🚀 ~ file: wasteGeneralInfo.vue ~ line 124 ~ getWasteCat ~ this.data",
      //   this.data
      // );
      this.data.status = this.data.status.toString();

      this.totalQuota =
        this.data.catalog_operations_aggregate.aggregate.sum.quota_amount;

      this.gen_name = this.data.generator.gen_name;
      this.gen_name_lo = this.data.generator.gen_name_lo;
      this.emct_id = this.data.generator.emac_id;
      //   console.log(
      //     '🚀 ~ file: wasteGeneralInfo.vue ~ line 62 ~ getWasteCat ~ this.data',
      //     this.data
      //   )
    },
       checkLanguage() {
      const locale = localStorage.getItem("lang");
      this.$i18n.locale = locale;
    },
  },
  mounted() {
    this.getWasteCat();
    this.checkLanguage();
  },
  computed: {
    text_title(){
      return this.$t("general_info");
    },
    edit: {
      get() {
        return this.$store.state.edit;
      },
      set(newVal) {
        this.$store.commit("SET_EDIT", newVal);
      },
    },
    editRejectQ: {
      get() {
        return this.$store.state.editRejectQ;
      },
      set(newVal) {
        this.$store.commit("SET_EDITREJECTQ", newVal);
      },
    },
    labelsCat() {
      return [
        this.$t('catalog_name'),
        this.$t('expired_date'),
        this.$t('quota_weight'),
        this.$t('description'),
        this.$t('enterprise_namelao'),
        this.$t('enterprise_nameeng'),
        this.$t('status'),

      ]
    },
  },
};
</script>

<style scoped>
h2 {
  color: #0d47a1;
}
</style>