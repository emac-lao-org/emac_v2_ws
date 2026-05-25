<template>
  <div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
export default {
  dialog: true,
  layout: "empty",
  middleware: "auth",
  methods: {
    logout() {
      $nuxt.$fire.auth.signOut();
      localStorage.clear();
      document.cookie = "token=" + "";
      this.$store.commit("SET_USER", {});
      this.dialog = false;
    },
  },
  created() {
    setTimeout(() => {
      this.logout();
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "You are not authorized to access this page.",
        }).then(() => {
            this.$router.push("/");
        });
    }, 1000);
  },
};
</script>

<style scoped>
/* .centered {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
} */
</style>