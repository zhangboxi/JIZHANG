import request from "../../utils/request";
const state = {
  persondata: null,
  accounttypedata: null
};

const mutations = {
  set_Persondata(state, data) {
    state.persondata = data;
  },
  set_Accounttypedata(state, data) {
    state.accounttypedata = data;
  }
};

const actions = {
  async refresh_Persondata({ commit }) {
    console.log("刷新人数据");
    await request({
      url: "/ACCOUNT/AccountController/SelectPerson.do",
      method: "get"
    }).then(response => {
      commit("set_Persondata", response.data);
      console.log("刷新人数据完成");
      return state.persondata;
    });
  },
  async refresh_Typedata({ commit }) {
    console.log("刷新类型数据");
    await request({
      url: "/ACCOUNT/AccountController/SelectAccountType.do",
      params: { timestamp: new Date().valueOf() },
      method: "get"
    }).then(response => {
      commit("set_Accounttypedata", response.data);
      console.log("刷新类型据完成");
      return state.accounttypedata;
    });
  },
  get_Persondata({ dispatch }) {
    if (state.persondata === null) {
      dispatch("refresh_Persondata").then(data => {
        return data;
      });
    } else {
      return state.persondata;
    }
  }
};
export default {
  namespaced: true,
  state,
  actions,
  mutations
};
