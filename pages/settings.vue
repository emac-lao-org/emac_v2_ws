<template>
  <div style="height: 100%" class="d-flex">
    <v-card
      height="100%"
      width="300"
      class="d-flex align-center justify-center"
    >
      <div>
        <div class="d-flex justify-center mb-4">
          <img
            src="@/assets/image/emac-logo.png"
            alt=""
            width="120"
          />
        </div>
        <div class="d-flex justify-center flex-column">
          <h3 class="d-flex justify-center">{{ name }}</h3>
          <h4 class="d-flex justify-center my-4">{{ role }}</h4>
        </div>

        <div class="d-flex justify-center mt-16">
          <v-btn @click="logout" color="error" outlined clearable>
            Logout
          </v-btn>
        </div>
      </div>
    </v-card>
    <div style="width: 100%">
      <div class="d-flex justify-center mt-16">
        <img
          src="https://emac-lao.org/wp-content/uploads/2021/12/LOGO.png"
          alt=""
          width="120"
        />
      </div>

      <v-form ref="form" v-model="valid" lazy-validation>
        <v-row class="d-flex justify-center my-4">
          <v-col cols="8">
            <v-text-field
              v-model="name"
              :readonly="edit"
              dense
              label="User Name"
              outlined
              :clearable="!edit"
            ></v-text-field>
            <v-text-field
              v-model="tel"
              :readonly="edit"
              dense
              label="Telephone"
              outlined
              :clearable="!edit"
            ></v-text-field>
          </v-col>
        </v-row>
        <div class="d-flex justify-end mr-16">
          <div v-if="!edit">
            <v-btn @click="update" class="mx-4" outlined clearable color=""
              >Save</v-btn
            >
          </div>
          <div v-else></div>
          <v-btn @click="check" color="primary">{{ textEdit }}</v-btn>
        </div>
      </v-form>
    </div>
  </div>
</template>

<script>
import updateInfomation from "~/gql/mutations/users_management/updateInfo.gql";
export default {
  data() {
    return {
      valid: true,

      name: "",
      tel: "",
      role: "",
      uid: "",
      edit: true,
      data: [],
    };
  },
  methods: {
    logout() {
      $nuxt.$fire.auth.signOut();
      localStorage.clear();
      document.cookie = "token=" + "";
      this.$store.commit("SET_USER", {});
      this.$router.push("/");
    },
    getData() {
      this.uid = this.$nuxt.$fire.auth.currentUser.uid;
      this.$apollo
        .query({
          query: require("~/gql/queries/getUserInfo").getUserInfo,
          variables: {
            uuid: this.uid,
          },
        })
        .then((data) => {
          this.data = data.data.emac_users[0];
          // console.log("Data :>> ", this.data);
          this.name = this.data.name;
          this.tel = this.data.tel;
        })
        .catch((err) => {
          // console.log("err :>> ", err);
        });
    },
    update() {
      this.$apollo
        .mutate({
          mutation: updateInfomation,
          variables: {
            id: this.uid,
            name: this.name,
            tel: this.tel,
          },
        })
        .then(() => {
          this.edit = !this.edit;
          alert("Update Success");
          window.location.reload();
        });
    },
    getRole() {
      const role = Promise.resolve(
        this.$nuxt.$fire.auth.currentUser.getIdTokenResult()
      );
      role.then((value) => {
        // console.log(value.claims["https://hasura.io/jwt/claims"]["x-hasura-default-role"])
        this.role =
          value.claims["https://hasura.io/jwt/claims"]["x-hasura-default-role"];
      });
    },
    check() {
      if (this.data == !this.data) {
        alert("Please wait for a moment");
        alert("Please Save");
      } else {
        this.edit = !this.edit;
      }
    },
  },
  created() {
    this.getData(), this.getRole();
  },
  computed: {
    textEdit() {
      return this.edit ? "edit" : "cancel";
    },
  },
  mounted() {},
};
</script>