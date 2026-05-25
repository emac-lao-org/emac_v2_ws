<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <!-- <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>register user</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                outlined
                v-model="displayName"
                name="displayName"
                label="Input displayName"
                type="text"
              ></v-text-field>
              <v-text-field
                outlined
                v-model="email"
                name="email"
                label="Input email"
                :rules="rulesEmail"
                type="text"
              ></v-text-field>
              <v-text-field
                outlined
                v-model="password"
                name="password"
                label="Input password"
                type="password"
                :rules="rulesPassword"
              ></v-text-field>
              <v-select
                outlined
                v-model="select"
                item-text="name"
                item-value="value"
                :items="items"
                label="Role"
                required
              ></v-select>

              <div v-if="select == 'staff'"></div>
              <div v-else-if="select == 'generator'">
                <v-select
                  outlined
                  v-model="company_id"
                  item-text="name"
                  item-value="id"
                  :items="cp_gen_ids"
                  label="Company"
                  required
                ></v-select>
              </div>
              <div v-else-if="select == 'transporter'">
                <v-select
                  outlined
                  v-model="company_id"
                  item-text="name"
                  item-value="id"
                  :items="cp_tran_ids"
                  label="Company"
                  required
                ></v-select>
              </div>
              <div v-else-if="select == 'disposal'">
                <v-select
                  outlined
                  v-model="company_id"
                  item-text="name"
                  item-value="id"
                  :items="cp_dis_ids"
                  label="Company"
                  required
                ></v-select>
              </div>
              <div v-else>
                <v-select
                  outlined
                  v-model="company_id"
                  item-text="name"
                  item-value="id"
                  :items="cp_regulator_ids"
                  label="Company"
                  required
                ></v-select>
              </div>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" outlined to="/">Back</v-btn>
            <v-spacer></v-spacer>
            
            
          </v-card-actions>
        </v-card> -->
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { getFunctions, httpsCallable } from 'firebase/functions'
import getDisposal_id from '~/mixins/getDisposalId'
import getTransporter_id from '~/mixins/getTransporterId'
import getGenerator_id from '~/mixins/getGeneratorId'
import getRegulator_id from '~/mixins/getRegulatorId'
export default {
  layout: '',
  name: 'Login',
  middleware: 'auth',
  mixins: [getDisposal_id, getTransporter_id, getGenerator_id, getRegulator_id],
  data() {
    return {
      email: null,
      password: null,
      displayName: null,
      select: 'staff',
      company_id: null,
      items: [
        { name: 'Staff (WS)', value: 'staff' },
        { name: 'Generator (WG)', value: 'generator' },
        { name: 'Transporter (WT)', value: 'transporter' },
        { name: 'Disposal (WD)', value: 'disposal' },
        { name: 'Regulator (WR)', value: 'regulator' },
      ],
      rulesEmail: [(value) => !!value || 'Required.'],
      rulesPassword: [(value) => !!value || 'Required.'],
    }
  },
  methods: {
  
  },
}
</script>

<style></style>
