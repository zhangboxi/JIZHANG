import Vue from "vue";
import Vuex from "vuex";
import form from "./modules/form";
import global from "./modules/global";
import login from "./modules/login";
import account from "./modules/account";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  modules: {
    login,
    form,
    global,
    account
  }
});
