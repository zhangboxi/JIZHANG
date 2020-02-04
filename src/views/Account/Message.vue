<template>
  <div>
    <a-form :form="form" layout="inline" @submit="handleSubmit">
      <a-form-item label="花销人过滤">
        <a-select
          style="width: 200px"
          v-decorator="[
            'person',
            { rules: [{ required: false, message: '花销人' }] }
          ]"
          placeholder="花销人"
        >
          <a-select-option
            v-for="d in persondata"
            :key="d.PERSONID"
            :value="d.PERSONID"
            >{{ d.NAME }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item label="类型过滤">
        <a-select
          style="width: 220px"
          v-decorator="[
            'type',
            { rules: [{ required: false, message: '花销类型' }] }
          ]"
          placeholder="花销类型"
        >
          <a-select-option
            v-for="d in accounttypedata"
            :key="d.TYPEID"
            :value="d.TYPEID"
            >{{ d.TYPE }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item label="支出/收入">
        <a-select
          style="width: 180px"
          v-decorator="[
            'pay',
            { rules: [{ required: false, message: '支出/收入' }] }
          ]"
          placeholder="支出/收入"
        >
          <a-select-option value="999">全部</a-select-option>
          <a-select-option value="0">收入</a-select-option>
          <a-select-option value="1">支出</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="时间筛选">
        <a-range-picker
          @change="selecttime"
          v-decorator="['time', { rules: [{ required: false }] }]"
        />
      </a-form-item>
      <a-form-item :style="{ marginLeft: '40px' }">
        <a-button type="primary" html-type="submit">
          查询
        </a-button>
        <a-button
          type="primary"
          @click="handleReset"
          :style="{ marginLeft: '10px' }"
        >
          Clear
        </a-button>
      </a-form-item>
    </a-form>
    <div style="width:100%; height:30px; float:left;"></div>
    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="pagination"
    >
      <a slot="name" slot-scope="text" href="javascript:;">{{ text }}</a>
      <span slot="customTitle"><a-icon type="smile-o" /> 金额</span>
      <span slot="PAY" slot-scope="PAY">
        <a-tag :color="PAY.color">
          {{ PAY.text }}
        </a-tag>
      </span>
      <span slot="PERSON" slot-scope="PERSON">
        <a-tag :color="PERSON.color">
          {{ PERSON.text }}
        </a-tag>
      </span>
      <span slot="action" slot-scope="record">
        <!-- <a-divider type="vertical" />
        <a href="javascript:;" @click="updata(record)">修改</a> -->
        <a-divider type="vertical" />
        <a href="javascript:;" @click="shownote(record)">查看备注</a>
        <!-- <a-divider type="vertical" />
        <a href="javascript:;" @click="deleterow(record)">删除</a> -->
      </span>
    </a-table>
    <div style=" float:right; font-size:25px;">
      总计支出：{{ sumout }}<br />总计收入: {{ sumin }}<br />净收入：{{
        jinglirun
      }}
    </div>
  </div>
</template>

<script>
import request from "../../utils/request";
import myMixin from "./basic";

const columns = [
  {
    dataIndex: "MONEY",
    key: "MONEY",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "MONEY" }
  },
  {
    title: "支出/收入",
    key: "PAY",
    dataIndex: "PAY",
    scopedSlots: { customRender: "PAY" }
  },
  {
    title: "时间",
    dataIndex: "TIME",
    key: "TIME"
  },
  {
    title: "花销人",
    key: "PERSON",
    dataIndex: "PERSON",
    scopedSlots: { customRender: "PERSON" }
  },
  {
    title: "类型",
    dataIndex: "TYPE",
    key: "TYPE"
  },
  {
    title: "Action",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
];

export default {
  //http://127.0.0.1:8090/ACCOUNT/AccountController/QueryAccount.do?starttime=2019-02-02+12:00:00&endtime=2020-02-02+12:00:00&personid=null&typeid=null&ispay=null&page=0&pagesize=3
  computed: {
    // 计算属性的 getter
    jinglirun: function() {
      // `this` 指向 vm 实例
      return this.sumin - this.sumout;
    }
  },
  data() {
    return {
      sumout: 0,
      sumin: 0,
      persondata: null,
      accounttypedata: null,
      form: this.$form.createForm(this),
      dataSource: null,
      columns,
      starttime: "",
      endtime: "",
      page: 1,
      pagination: {
        pageNo: 1,
        pageSize: 5, // 默认每页显示数量
        showSizeChanger: true, // 显示可改变每页数量
        pageSizeOptions: ["5", "10", "20", "40"], // 每页数量选项
        showTotal: total => `总计 ${total} 条`, // 显示总数
        onShowSizeChange: (current, pageSize) =>
          (this.pagination.pageSize = pageSize), // 改变每页数量时更新显示
        onChange: (page, pageSize) => this.changePage(page, pageSize), //点击页码事件
        total: 0 //总条数
      }
    };
  },
  mixins: [myMixin],
  mounted() {
    let endtime = new Date().Format("yyyy-MM-dd");
    let starttime = new Date();
    starttime.setMonth(starttime.getMonth() - 1);

    this.starttime = starttime.Format("yyyy-MM-dd") + " 00:00:00";
    this.endtime = endtime + " 23:59:59";

    let params = {
      starttime: this.starttime,
      endtime: this.endtime,
      personid: "null",
      typeid: "null",
      ispay: "null",
      page: 1,
      pagesize: 5
    };
    this.queryAccount(params);
    this.getPerson();
    this.getType();
  },
  methods: {
    handleReset() {
      let endtime = new Date().Format("yyyy-MM-dd");
      let starttime = new Date();
      starttime.setMonth(starttime.getMonth() - 1);

      this.starttime = starttime.Format("yyyy-MM-dd") + " 00:00:00";
      this.endtime = endtime + " 23:59:59";
      this.form.resetFields();
      let params = {
        starttime: this.starttime,
        endtime: this.endtime,
        personid: "null",
        typeid: "null",
        ispay: "null",
        page: 1,
        pagesize: 10
      };
      this.queryAccount(params);
    },
    getPerson() {
      if (this.$store.state.account.persondata === null) {
        this.getPerson2().then(response => {
          this.$store.commit("account/set_Persondata", response.data);
          this.persondata = JSON.parse(JSON.stringify(response.data));
          this.persondata.push({ NAME: "全部", PERSONID: 999 });
        });
      } else {
        this.persondata = JSON.parse(
          JSON.stringify(this.$store.state.account.persondata)
        );
        this.persondata.push({ NAME: "全部", PERSONID: 999 });
      }
    },
    getType() {
      if (this.$store.state.account.accounttypedata === null) {
        this.getAccountType2().then(response => {
          this.$store.commit("account/set_Accounttypedata", response.data);
          this.accounttypedata = JSON.parse(JSON.stringify(response.data));
          this.accounttypedata.push({ ID: "999", TYPE: "全部" });
        });
      } else {
        this.accounttypedata = JSON.parse(
          JSON.stringify(this.$store.state.account.accounttypedata)
        );
        this.accounttypedata.push({ ID: "999", TYPE: "全部" });
      }
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          let params = {
            // "starttime":values.time[0].format('YYYY-MM-DD') + " 00:00:00",
            // "endtime": values.time[1].format('YYYY-MM-DD') + " 23:59:59",
            starttime: this.starttime,
            endtime: this.endtime,
            personid:
              typeof values.person == "undefined" || values.person == 999
                ? "null"
                : values.person,
            typeid:
              typeof values.type == "undefined" || values.type == 999
                ? "null"
                : values.type,
            ispay:
              typeof values.pay == "undefined" || values.pay == 999
                ? "null"
                : values.pay,
            page: this.page,
            pagesize: this.pagination.pageSize
          };

          this.queryAccount(params);
        }
      });
    },
    queryAccount(params) {
      console.log(params);
      console.log(this);
      request({
        url: "ACCOUNT/AccountController/QueryAccount.do?",
        method: "get",
        params: params
      }).then(response => {
        console.log(response.data);
        this.sumout = 0;
        this.sumin = 0;
        let outmoney = 0;
        let inmoney = 0;
        let rdata = response.data;
        this.pagination.total = rdata.total * 1;
        let newtabledata = [];
        for (let i = 0; i < rdata.data.length; i++) {
          let data = rdata.data[i];
          let formatetime = new Date(data.TIME).Format("yyyy-MM-dd");
          let onedata = {
            key: data.ID,
            MONEY: data.MONEY,
            TYPE: data.EXPENDTYPE,
            TIME: formatetime,
            PAY: {
              text: data.PAY == 1 ? "支出" : "收入",
              color: data.PAY == 1 ? "red" : "green"
            },
            PERSON: {
              text: data.PERSON,
              color:
                data.PERSON == "张旭东"
                  ? "red"
                  : data.PERSON == "山博"
                  ? "blue"
                  : "green"
            },
            NOTE: data.NOTE
          };

          newtabledata.push(onedata);
          if (data.PAY == 1) {
            outmoney = outmoney + data.MONEY;
          } else {
            inmoney = inmoney + data.MONEY;
          }
        }
        this.dataSource = newtabledata;
        this.sumout = outmoney.toFixed(2);
        this.sumin = inmoney.toFixed(2);
      });
    },
    changePage(page, pageSize) {
      this.page = page;
      console.log(pageSize);
      this.pagination.pageSize = pageSize;
    },
    shownote(values) {
      console.log(values);
    },
    selecttime(date, dateString) {
      this.starttime = dateString[0] + " 00:00:00";
      this.endtime = dateString[1] + " 23:59:59";
    }
    // updata(values) {
    //   console.log(values);
    // },
    // deleterow(values) {
    //   //下发删除事件
    //   this.data = data.filter(item => item.key !== values.key);
    // }
  }
};
</script>

<style></style>
