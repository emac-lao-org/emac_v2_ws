<template>
  <div class="ml-4 mt-8">
    <title-page :title="title" :width="width" />
    <v-row>
      <v-col>
        <CardTab :amount="amountWt" :title="titleCard" color="#0d47a1" />
      </v-col>

      <v-col align-self="end" cols="2">
        <card-tab-small
          color_a="#3C9700"
          color_b="#1CBF27"
          color="green"
          height="100"
          width="240"
          :title="text_active"
          :total="dataUserWt_active"
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
          :total="dataUserWt_suspended"
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
          :total="dataUserWt_delete"
        />
      </v-col>
      <v-col class="mr-2" align="end" align-self="end">
        <dialogCreateUser />
      </v-col>
    </v-row>
    <tabHeaderWT />
  </div>
</template>

<script>
import tabHeaderWT from '~/components/users_management/tabHeaderWT.vue'
import dialogCreateUser from '~/components/users_management/dialogCreateUser.vue'
import getWTUsers from '~/mixins/getWTUsers'

export default {
  mixins: [getWTUsers],
  components: { tabHeaderWT, dialogCreateUser  },
  data() {
    return {
      width: '35%',
    }
  },
  computed:{
    titleCard(){
      return this.$t('all_wt_user')
    },
    title(){
      return this.$t('waste_transporter')
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
}
</script>

<style>
</style>