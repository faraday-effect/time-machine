import Vue from "vue";
import Vuetify from "vuetify/lib";
import Store from "../store";

Vue.use(Vuetify);

export default new Vuetify({
  theme: { dark: Store.state.darkMode },
});
