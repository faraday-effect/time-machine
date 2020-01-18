import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],

  state: {
    accessToken: "",
    account: {}
  },

  getters: {
    isLoggedIn(state) {
      return state.accessToken.length;
    }
  },

  mutations: {
    logIn() {},
    logOut() {}
  }
});
