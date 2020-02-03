import request from "../../utils/request";
let myMixin = {
  methods: {
    getAccountType() {
      request({
        url: "/ACCOUNT/AccountController/SelectAccountType.do",
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
        url: "/ACCOUNT/AccountController/SelectPerson.do",
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
        url: "/ACCOUNT/AccountController/SelectAccountType.do",
        method: "get"
      }).then(res => {
        return res;
      });
    },
    getPerson2() {
      return request({
        url: "/ACCOUNT/AccountController/SelectPerson.do",
        method: "get"
      }).then(res => {
        return res;
      });
    }
  }
};

export default myMixin;
