<template>
  <v-card
    class="mx-auto"
    :max-width="width"
    outlined
    id="cardDetail"
  >
    <v-list-item three-line>
      <v-list-item-content>
        <div class="mb-4">
          <h3>{{title}}</h3>
        </div>
        <v-list-item-title class="text-h5 mb-1">
          <h1>{{amount}}</h1>
        </v-list-item-title>
      </v-list-item-content>

      <v-list-item-avatar tile size="72">
        <v-img
          :src="img"
        ></v-img>
      </v-list-item-avatar>
    </v-list-item>
  </v-card>
</template>

<script>
export default {
    props:{
        title:{
            type:String,
            default:''
        },
        amount:{
            type:String,
            default:''
        },
        img:{
            type:String,
            default:''
        },
        width:{
            type:String,
            default:'250'
        }
    },
    methods:{
       checkLanguage() {
      const locale = localStorage.getItem("lang");
      this.$i18n.locale = locale;
    },
    },
    mounted(){
        this.checkLanguage()
    }
}
</script>

<style scoped>
*{
  font-family: "Phetsarath OT";
}
#cardDetail{
  border-bottom: 5px solid #0d47a1;
}
#cardDetail:hover{
  background-color: #edecec;
}

</style>