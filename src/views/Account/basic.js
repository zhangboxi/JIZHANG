import request from "../../utils/request";
import address from "./address";
let myMixin = {
  methods: {
    getAccountType() {
      request({
        url: address.SelectAccountType,
        method: "get"
      }).then(response => {
        this.accounttypedata = response.data;
        // this.$store.state.account.accounttypedata = this.accounttypedata;
        this.$store.commit("account/set_Accounttypedata", response.data);
        return response.data;
      });
    },
    getPerson() {
      request({
        url: address.SelectPerson,
        method: "get"
      }).then(response => {
        this.persondata = response.data;
        this.$store.commit("account/set_Persondata", response.data);
        console.log("返回数据");
        return response.data;
      });
    },
    getAccountType2() {
      return request({
        url: address.SelectAccountType,
        method: "get"
      }).then(res => {
        return res;
      });
    },
    getPerson2() {
      return request({
        url: address.SelectPerson,
        method: "get"
      }).then(res => {
        return res;
      });
    }
  }
};

export default myMixin;
