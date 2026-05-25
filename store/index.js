
const actions = {
    async onAuthStateChangedAction(state, {
      authUser,
    }) {
      if (!authUser) {
        state.commit('SET_USER', null)
        this.$router.push({
          path: '/auth/login'
        })
      } else {
        const {
          uid,
          email,
          displayName,
        } = authUser
        state.commit('SET_USER', {
          uid,
          email,
          displayName,
        })
      }
    },
  }
  
  const mutations = {
    SET_USER(state, user) {
      state.user = user
    },
    SET_ROLE(state, newVal) {
      state.role = newVal
    },
    SET_TAB(state, newVal) {
      state.tab = newVal;
    },
    SET_EDIT(state, newVal) {
      state.edit = newVal;
    },
    SET_EDITREJECTQ(state, newVal) {
      state.editRejectQ = newVal;
    },
    SET_EDITREJECTT(state, newVal) {
      state.editRejectT = newVal;
    },
    SET_DIALOG(state, newVal) {
      state.dialog = newVal;
    },
    SET_DIALOGEDIT(state, newVal) {
      state.dialogEdit = newVal;
    },
    SET_DIALOGEDITWD(state, newVal) {
      state.dialogEditWD = newVal;
    },
    SET_DIALOGEDITWG(state, newVal) {
      state.dialogEditWG = newVal;
    },
    SET_DIALOGEDITWR(state, newVal) {
      state.dialogEditWR = newVal;
    },
    addLatlon (state, local) {
      state.latlogMarker.push(local)
    }
  }
  
  function state() {
    return ({
      user: null,
      role: null,
      tab: null,
      edit:false,
      editRejectQ:false,
      editRejectT:false,
      dialog: false,
      dialogEdit: false,
      dialogEditWD: false,
      dialogEditWG: false,
      dialogEditWR: false,
      latlogMarker: [],
      statusUser: [
        {
          name: 'Active',
          value: 1,
        },
        {
          name: 'Suspened',
          value: 2,
        },
        {
          name: 'Deleted',
          value: 3,
        },
      ],

      statuses: [
        {
          name: 'Active',
          value: '1',
        },
        {
          name: 'Suspened',
          value: '2',
        },
      ],
      
    })
  }
  
  const getters = {
    setUser(state) {
      state.user = user
    },
  }
  
  export default {
    state,
    actions,
    mutations,
    getters
    
  }
  