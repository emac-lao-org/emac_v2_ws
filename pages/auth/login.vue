<template>
  <div id="body">
    <v-form v-model="valid" class="centered">
      <v-card class="mx-auto my-2" width="540" height="660" elevation="2">
        <center>
          <img class="mt-16" src="~/assets/image/emac-logo.png" alt="" />
        </center>
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title class="text-h5 mb-1">
              <h5 class="my-6" align="center">Welcome To Waste Staff</h5>
            </v-list-item-title>
            <div>
              <v-text-field
                label="Email"
                class="my-3 mx-16"
                v-model="auth.email"
                prepend-inner-icon="mdi-email"
                type="email"
                clearable
                :rules="[
                  (v) => !!v || 'Email is required',
                  (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
                ]"
                required
                outlined
                hide-details="flase"
              >
              </v-text-field>
              <v-text-field
                label="Password"
                class="my-3 mx-16"
                v-model="auth.password"
                prepend-inner-icon="mdi-lock"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show1 ? 'text' : 'password'"
                required
                outlined
                :rules="[(v) => !!v || 'Password is required']"
                @click:append="show1 = !show1"
                hide-details="flase"
                clearable
              >
              </v-text-field>
            </div>
          </v-list-item-content>
        </v-list-item>

        <v-card-actions class="d-flex justify-center">
          <v-btn
            width="80%"
            color="primary"
            elevation="0"
            max-width="350"
            large
            :loading="loading"
            :disabled="!valid"
            @click="login"
          >
            Sign In
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </div>
</template>

<script>
export default {
  name: "Login",
  layout: "login",
  middleware: "auth",

  data() {
    return {
      loading: false,
      show1: false,
      valid: true,
      role: "",
      auth: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    async getRole() {
      this.role = await this.$nuxt.$fire.auth.currentUser.getIdTokenResult();
      // console.log(value.claims["https://hasura.io/jwt/claims"]["x-hasura-default-role"])
      this.role =
        this.role.claims["https://hasura.io/jwt/claims"][
          "x-hasura-default-role"
        ];
      // console.log(
      //   "🚀 ~ file: index.vue ~ line 72 ~ this.role.then ~  this.role =>",
      //   this.role
      // );
    },
    setRole() {
      this.$store.commit("SET_ROLE", this.role);
      // console.log("this.$store.state :>> ", this.$store.state);
    },
    async getToken() {
      const result = await $nuxt.$fire.auth.currentUser
        .getIdTokenResult()
        .catch((err) => console.log(err));
      this.token = result.token;
      // console.log('this.token :>> ', this.token);
      localStorage.setItem("token", this.token);
      document.cookie = "token=" + this.token;
      // await window.location.reload()
    },
    async login() {
      this.loading = true;
      try {
        await this.$fire.auth
          .signInWithEmailAndPassword(this.auth.email, this.auth.password)

          .catch((e) => {
            alert(e.message);
            window.location.reload();
          });

        this.getToken();
        await this.getRole();
        await this.setRole();
        this.loading = false;
        setTimeout(() => {
          this.getToken();
          this.getRole();
          this.setRole();
        }, 1000);
        if (
          this.$store.state.role === "admin" ||
          this.$store.state.role === "staff"
        ) {
          window.location.href = "/";
        } else {
          window.location.href = "/auth/invalid_role";
        }
      } catch {
        (error) => {
          alert(error.message);
        };
      }
    },
  },
  created() {
    this.$store.commit("SET_USER", {});
    console.log("$store.state.user :>> ", this.$store.state.user);
  },
};
</script>

