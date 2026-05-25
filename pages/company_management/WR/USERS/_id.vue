<template>
  <div class="ml-4 mt-8">
    <title-page :title="title" :width="width" />
    <v-row>
      <v-col>
        <CardTab :title="titleCard" :amount="amountWrPer" color="#0d47a1" />
      </v-col>

      <v-col align-self="end" cols="2">
        <card-tab-small
          color_a="#3C9700"
          color_b="#1CBF27"
          color="green"
          height="100"
          width="240"
          :title="text_active"
          :total="dataUserWrPer_active"
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
          :total="dataUserWrPer_suspended"
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
          :total="dataUserWrPer_delete"
        />
      </v-col>
      <v-col class="mr-2" align="end" align-self="end">
        <dialogCreateUser />
      </v-col>
    </v-row>

   
    <TabHeaderWRPer />
  </div>
</template>

<script>
import titlePage from '~/components/titlePage.vue'
import TabHeaderWRPer from '~/components/users_management/tabHeaderWRPer.vue'
import getWRUsersPer from '~/mixins/getWRUsersPer'
import dialogCreateUser from '~/components/users_management/dialogCreateUser.vue'

export default {
    mixins: [getWRUsersPer],
  components: {TabHeaderWRPer, titlePage,dialogCreateUser },
  data() {
    return {
      id: this.$route.params.id,
      // title: 'Users Management',
      width: '35%',
    }
  },
  computed: {
    title() {
      return this.$t('waste_regulator')
    },
    titleCard() {
      return this.$t("all_wr_user");
    },
    text_active() {
      return this.$t('active_user')
    },
    text_suspended() {
      return this.$t('suspened_user')
    },
    text_banned() {
      return this.$t('banned_user')
    },
  },
}
</script>

<style>
</style>