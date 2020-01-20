import Vue from "vue";
import Vuex, { GetterTree, MutationTree } from "vuex";
import createPersistedState from "vuex-persistedstate";
import {
  LogIn_login as LogInResponse,
  LogIn_login_claims as JWTClaims
} from "@/graphql/types/LogIn";

Vue.use(Vuex);

export class State {
  token: string = "";
  claims: JWTClaims = {} as JWTClaims;
}

const getters = <GetterTree<State, any>>{
  isLoggedIn(state) {
    return state.token.length > 0;
  }
};

const mutations = <MutationTree<State>>{
  logIn(state, response: LogInResponse) {
    state.token = response.token;
    state.claims = response.claims;
  },

  logOut(state) {
    state.token = "";
    state.claims = {} as JWTClaims;
  }
};

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: new State(),
  getters,
  mutations
});

// https://stackoverflow.com/questions/53807294/how-is-the-correct-way-to-work-with-vuex-and-typescript
