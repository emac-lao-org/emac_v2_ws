export default function ({ store, route, redirect }) {
  // if (route.path !== "/auth/register") {
  //   if (!$nuxt.$fire.auth.currentUser) {
  //     return redirect("/auth/register")
  //   }
  // }

  // const role =result.claims['https://hasura.io/jwt/claims']['x-hasura-default-role']\

  // if ($nuxt.$fire.auth.currentUser != null) {
  //   let AuthUser = function () {
  //     return $nuxt.$fire.auth.currentUser.getIdTokenResult()
  //   }

  //   let userToken = AuthUser()

  //   userToken.then(function (result) {
  //     //  console.log(result) // "Some User token"

  //     let role = result.claims['https://hasura.io/jwt/claims']['x-hasura-default-role']
  //     console.log(role) // "Some User token"

  //     if (route.path === '/auth/register') {
  //       if (role === 'admin') {
  //         return redirect('/auth/register')
  //       }
  //     }

  //   })
  // }

  // function getUid() {
  //   return $nuxt.$fire.auth.currentUser.uid
  // }

  // if (route.path === '/') {
  //   if ($nuxt.$fire.auth.currentUser === null) {
  //     return redirect('/auth/login')
  //   }
  // } else if (route.path === '/auth/register') {
  //   if ($nuxt.$fire.auth.currentUser !== null) {
  //     let uid = getUid()
  //     console.log('uid :>> ', uid);
  //     if (uid !== "tUXozDpq3kgK1BFi98MnxuwLK822") {
  //       return redirect('/')
  //     } else {
  //       return redirect('/auth/register')
  //     }
  //   } else {
  //     return redirect('/')
  //   }
  // }

  // let AuthUser = function () {
  //       return $nuxt.$fire.auth.currentUser.getIdTokenResult()
  //     }
  //     let userToken = AuthUser()
  //     userToken.then(function (result) {
  //       //  console.log(result) // "Some User token"

  //       let role = result.claims['https://hasura.io/jwt/claims']['x-hasura-default-role']
  //       console.log(role) // "Some User token"

  //       if (route.path === '/auth/register') {
  //         if (role === 'admin') {
  //           return redirect('/auth/register')
  //         }else{
  //           return redirect('/auth/login')
  //         }
  //       }

  //     })

  // } else

  // if ($store.state.role != "admin" || $store.state.role != "staff") {
  //   $nuxt.$fire.auth.signOut()
  //   return redirect("/auth/invalid_role");
  // } else if ($nuxt.$fire.auth.currentUser !== null && $store.state.role !== "staff") {
  //   return redirect("/auth/invalid_role");
  // }else if ($nuxt.$fire.auth.currentUser !== null && $store.state.role === "staff") {
  //   return redirect("/");
  // }

  if (route.path === "/") {
    if ($nuxt.$fire.auth.currentUser === null) {
      return redirect("/auth/login");
    } 
    // else if(this.$store.state.role !== "staff") {
    //   return redirect("/auth/login");
    // }
  }
}
