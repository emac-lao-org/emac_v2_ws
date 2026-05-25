<template>
  <div>
    <v-card-title class="py-0 pt-2">
      <v-row>
        <v-col cols="4">
          <h2 style="border-right: 3px solid #0d47a1">
            {{ text_wt }}
          </h2>
        </v-col>
        <v-spacer></v-spacer>
        <v-col>
          <v-select
            item-text="name"
            item-value="value"
            :items="items_filter_type"
            v-model="typeFilterValue"
            label="Type of service"
            required
          ></v-select>
        </v-col>
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
              <v-btn icon @click="getTransporters" color="primary" class="mr-2" v-bind="attrs" v-on="on">
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </template>
            <span>Reload Data</span>
          </v-tooltip>
          <v-btn @click="dialogExportType = true" color="primary"> Export </v-btn>
        </v-col>
      </v-row>
    </v-card-title>

    <v-data-table
      :loading="loading"
      :headers="headers"
      :items="data"
      :server-items-length="totalCount"
      :options.sync="pagination"
      @update:options="getTransporters"
      class="elevation-1"
    >
      <!-- <template v-slot:[`item.type_operations`]="{ item }">
        {{item.tos}}
      </template> -->
      <template v-slot:[`item.status`]="{ item }">
        <div v-if="item.status == 1">
          <v-chip small color="primary">{{ stt_active }}</v-chip>
        </div>
        <div v-else-if="item.status == 2">
          <v-chip small color="warning">{{ stt_suspended }}</v-chip>
        </div>
        <div v-else-if="item.status == 3">
          <v-chip small color="error">{{ stt_delete }}</v-chip>
        </div>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon class="mr-2" @click="viewCompany(item)"> mdi-eye</v-icon>
        <v-icon class="mr-2" @click="editItem(item)">
          mdi-pencil-outline
        </v-icon>
        <v-icon @click="updateStatus(item)"> mdi-delete-outline </v-icon>
      </template>
    </v-data-table>
    <v-dialog v-model="dialogEdit" persistent>
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
              {{ this.$t("edit") }}
            </h2>
            <v-divider
              style="border: 1px solid #0d47a1"
              class="ml-4"
              vertical
            ></v-divider>
          </v-card-title>
          <v-row>
            <v-col cols="7">
              <v-row>
                <v-col cols="4">
                  <v-text-field
                    v-model="edit.tran_name"
                    outlined
                    clearable
                    @change="hasAction = true"
                    :label="labels[0]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    v-model="edit.tran_name_lo"
                    outlined
                    clearable
                    @change="hasAction = true"
                    :label="labels[1]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    v-model="edit.enterprise_no"
                    outlined
                    clearable
                    @change="hasAction = true"
                    :label="labels[2]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    v-model="edit.email"
                    outlined
                    clearable
                    @change="hasAction = true"
                    :label="labels[3]"
                    required
                  ></v-text-field>
                </v-col>
                <!-- <v-col cols="4">
                  <v-text-field
                    v-model="edit.emac_id"
                    outlined
                    clearabl
                    :label="labels[4]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-select
                    v-model="edit.village.district.pr_id"
                    outlined
                    item-text="pr_name_lo"
                    item-value="pr_id"
                    :items="provinces"
                    :label="labels[5]"
                    required
                  ></v-select>
                </v-col>

                <v-col cols="4">
                  <v-select
                    v-model="edit.village.dr_id"
                    outlined
                    item-text="dr_name_lo"
                    item-value="dr_id"
                    :items="districts"
                    :label="labels[6]"
                    required
                    @click="getDistricts"
                  ></v-select>
                </v-col>

                <v-col cols="4">
                  <v-select
                    v-model="edit.village.vill_id"
                    outlined
                    item-text="vill_name_lo"
                    item-value="vill_id"
                    :items="villages"
                    :label="labels[7]"
                    required
                    @click="getVillages"
                  ></v-select>
                </v-col> -->
                <v-col cols="4">
                  <v-text-field
                    v-model="edit.custom_address"
                    outlined
                    clearable
                    @change="hasAction = true"
                    :label="labels[8]"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="4">
                  <v-text-field
                    v-model="edit.tel"
                    outlined
                    clearable
                    @change="hasAction = true"
                    :label="labels[9]"
                    required
                  ></v-text-field>
                </v-col>
                <!-- <v-col cols="4">
                  <v-select
                    v-model="level_id"
                    item-text="level_name"
                    item-value="id"
                    :items="levels"
                    label="Operation Level"
                    required
                    outlined
                  ></v-select>
                </v-col> -->
                <v-col cols="4">
                  <v-select
                    v-model="edit.status"
                    item-text="name"
                    item-value="value"
                    :items="statuses"
                    @change="hasAction = true"
                    :label="labels[10]"
                    required
                    outlined
                  ></v-select>
                </v-col>
                <v-col>
                  <h3 class="mb-2">{{this.$t('type_of_service')}}:</h3>
                  <v-radio-group v-model="selected" mandatory>
                    <v-radio
                      dense
                      disabled
                      v-for="i in items"
                      :key="i.text"
                      :label="i.name"
                      :value="i.id"
                    ></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
            </v-col>
            <v-col>
              <div class="pa-2" outlined tile>
                <div>
                  <iframe
                    :src="
                      '//maps.google.com/maps?q=' +
                      edit.latlng +
                      '&z=17&output=embed'
                    "
                    width="420"
                    height="400"
                    style="border: 0"
                    allowfullscreen=""
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </v-col>
          </v-row>
          <br />
          <v-card-actions class="mx-4">
            <v-spacer></v-spacer>
            <v-btn outlined color="primary" class="mx-4 my-4" @click="check">
              {{ this.$t("cancel") }}
            </v-btn>
            <v-btn @click="updateWT" color="primary">
              <!-- <v-icon small>mdi-plus</v-icon> -->
             {{ this.$t("update") }}
            </v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog max-width="350px" v-model="dialogExportType">
      <v-card class="pa-4 text-center">
        <v-card-title class="justify-center">Select Export Format</v-card-title>
        <v-card-actions class="justify-center">
          <v-btn color="primary" outlined @click="startExport('csv')">CSV</v-btn>
          <v-btn color="success" outlined @click="startExport('excel')">Excel (.xlsx)</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog class="pa-4" max-width="400px" persistent v-model="dialogExport">
      <v-card class="pa-4">
        <v-card-text class="text-center pt-4">
          <h3 class="font-weight-bold mb-2">Exporting Data...</h3>
          <p>{{ exportProgress }} / {{ exportTotal }} records processed</p>
          <v-progress-linear
            color="primary"
            height="15"
            :value="exportTotal > 0 ? (exportProgress / exportTotal) * 100 : 0"
            striped
            rounded
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import controllerDataTableWT from "@/mixins/controllerDataTableWT";
// import MapboxMarker from './mapboxMarker.vue'
import levels from "~/mixins/getLevels";

export default {
  components: {
    // MapboxMarker,
  },
  mixins: [controllerDataTableWT, levels],

  computed: {
    text_wt() {
      return this.$t("waste_transporter");
    },
    stt_active() {
      return this.$t("active");
    },
    stt_suspended() {
      return this.$t("suspended");
    },
    stt_delete() {
      return this.$t("deleted");
    },
  },
};
</script>
<style scoped>
</style>