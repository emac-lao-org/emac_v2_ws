export default function ({ app }) {
  if (process.client) {
    app.$fire.auth.onIdTokenChanged(async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          // Update Apollo client with the new token
          await app.$apolloHelpers.onLogin(token);
          
          // Update local storage and cookies to maintain compatibility
          localStorage.setItem("token", token);
          document.cookie = "token=" + token + "; path=/";
          
          // console.log("Token implicitly refreshed by onIdTokenChanged hook");
        } catch (error) {
          console.error("Error setting refreshed token:", error);
        }
      } else {
        await app.$apolloHelpers.onLogout();
      }
    });
  }
}
