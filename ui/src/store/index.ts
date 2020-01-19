import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import {
  LogIn_login as LogInResponse,
  LogIn_login_claims as JWTClaims
} from "@/graphql/types/LogIn";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],

  state: {
    token: "",
    claims: {} as JWTClaims
  },

  getters: {
    isLoggedIn(state) {
      return state.token.length > 0;
    }
  },

  mutations: {
    logIn(state, response: LogInResponse) {
      state.token = response.token;
      state.claims = response.claims;
    },

    logOut(state) {
      state.token = "";
      state.claims = {} as JWTClaims;
    }
  }
});
