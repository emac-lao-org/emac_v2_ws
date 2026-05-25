import { fromPromise } from 'apollo-link';

export default function(
  { graphQLErrors, networkError, operation, forward },
  nuxtContext
) {
  if (graphQLErrors) {
    const isJwtExpired = graphQLErrors.some((err) => 
      err.message === 'Could not verify JWT: JWTExpired' || 
      err.message.includes('JWT')
    );

    if (isJwtExpired) {
      console.log("[Apollo] JWT Expired. Attempting to refresh token...");
      
      const currentUser = nuxtContext.app.$fire.auth.currentUser;
      
      if (currentUser) {
        return fromPromise(
          currentUser.getIdTokenResult(true).then((result) => {
            const newToken = result.token;
            console.log("[Apollo] Token refreshed successfully!");

            // Update Apollo & Cookies via Nuxt Apollo Helpers
            nuxtContext.app.$apolloHelpers.onLogin(newToken);
            
            // Keep app compat with existing localStorage logic
            localStorage.setItem('token', newToken);
            document.cookie = 'token=' + newToken;

            // Apply new token to the failed operation's headers
            const oldHeaders = operation.getContext().headers;
            operation.setContext({
              headers: {
                ...oldHeaders,
                authorization: `Bearer ${newToken}`
              }
            });

            return true;
          }).catch((err) => {
            console.error("[Apollo] Failed to refresh token", err);
            nuxtContext.app.$apolloHelpers.onLogout();
            nuxtContext.redirect('/auth/login');
            return false;
          })
        )
        .filter(value => Boolean(value))
        .flatMap(() => forward(operation));
      } else {
        // Redirect to login if currentUser is missing
        nuxtContext.app.$apolloHelpers.onLogout();
        nuxtContext.redirect('/auth/login');
      }
    } else {
      console.log("GraphQL Errors:", graphQLErrors);
    }
  }

  if (networkError) {
    console.log("Network Error:", networkError);
  }
}