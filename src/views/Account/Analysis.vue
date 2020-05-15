<template>
  <div style="padding: 0 25px 0 25px;">
    <a-form :form="form" layout="inline" @submit="handleSubmit">
      <a-form-item label="选择月份">
        <a-month-picker
          @change="selecttime"
          v-decorator="['time', { rules: [{ required: false }] }]"
        />
      </a-form-item>
      <a-form-item :style="{ marginLeft: '40px' }">
        <a-button type="primary" html-type="submit">
          查询
        </a-button>
      </a-form-item>
    </a-form>

    <template>
      <div style="margin-top: 15px;">
        <a-row :gutter="12">
          <a-col class="gutter-row" :span="8">
            <div class="gutter-box">
              净收入：<br /><span style="font-size: 40px; color: blue; "
                >￥{{ message.Total }}</span
              >
              <hr
                style="height:1px;border:none;border-top:1px solid #A9A9A9;"
              />
              <span
                >花销单数：{{ message.outcomecount }} &emsp; &emsp;
                &emsp;&emsp;&emsp;&emsp;&emsp;&emsp; &emsp; 收入单数：{{
                  message.incomecount
                }}</span
              >
            </div>
          </a-col>
          <a-col class="gutter-row" :span="8">
            <div class="gutter-box">
              本月收入：<br /><span style="font-size: 40px; color: green;"
                >￥{{ message.MonthIncome }}</span
              >
              <hr
                style="height:1px;border:none;border-top:1px solid #A9A9A9;"
              />
              <span
                >上月收入：{{ message.LastMonthIncome }} &emsp; &emsp;
                &emsp;&emsp; &emsp; 同比：{{
                  message.MonthIncomePer > 0 ? "上升" : "下降"
                }}
                {{ message.MonthIncomePer }}%</span
              >
            </div>
          </a-col>
          <a-col class="gutter-row" :span="8">
            <div class="gutter-box">
              本月支出：<br /><span style="font-size: 40px; color: red;"
                >￥{{ message.MonthOutcome }}</span
              >
              <hr
                style="height:1px;border:none;border-top:1px solid #A9A9A9;"
              />
              <span
                >上月支出：{{ message.LastMonthOutcome }} &emsp; &emsp;
                &emsp;&emsp; &emsp; 同比：{{
                  message.MonthOutcomePer > 0 ? "上升" : "下降"
                }}
                {{ message.MonthOutcomePer }}%</span
              >
            </div>
          </a-col>
          <!-- <a-col class="gutter-row" :span="6">
            <div class="gutter-box">
              本月净收入：<br /><span style="font-size: 40px; color: green;"
                >￥{{ SIncome }}</span
              >
              <hr
                style="height:1px;border:none;border-top:1px solid #A9A9A9;"
              />
              <span>上月净收入：{{ SLastIncome }}</span>
            </div>
          </a-col>
          <a-col class="gutter-row" :span="6">
            <div class="gutter-box">
              净资产：<br /><span style="font-size: 60px; color: green; "
                >￥{{ message.Total }}</span
              >
            </div>
          </a-col> -->
        </a-row>
      </div>
      <div style="margin-top: 15px;">
        <a-row :gutter="16">
          <a-col class="gutter-row" :span="12">
            <div class="gutter-box" style="height: 400px">
              <a-tabs defaultActiveKey="1">
                <a-tab-pane tab="总计开销" :style="{ height: '305px' }" key="1"
                  ><Chart
                    :option="ChartData.zongkaixiao_pie"
                    style="height: 100%;width: 100%; float: left;"
                  />
                </a-tab-pane>
                <a-tab-pane
                  tab="张旭东"
                  :style="{ height: '305px' }"
                  key="2"
                  forceRender
                  ><Chart
                    :option="ChartData.zxdkaixiao_pie"
                    style="height: 100%;width: 100%; float: left;"
                  />
                </a-tab-pane>
                <a-tab-pane tab="山博" :style="{ height: '305px' }" key="3"
                  ><Chart
                    :option="ChartData.sbkaixiao_pie"
                    style="height: 100%;width: 100%; float: left;"
                  />
                </a-tab-pane>
                <span
                  style="font-weight: 800; font-size: 20px;"
                  slot="tabBarExtraContent"
                  >支出分析</span
                >
              </a-tabs>
            </div>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <div class="gutter-box">col-6</div>
          </a-col>
        </a-row>
      </div>
    </template>
  </div>
</template>
<script>
// import request from "../../utils/request";
import Chart from "../../components/Chart/Chart";
import { pie1 } from "../../components/Chart/PieFunction.js";
import request from "../../utils/request";
import address from "./address.js";
import MyDate from "../../utils/MyDate";
export default {
  computed: {
    // 计算属性的 getter
    // SIncome: function() {
    //   // `this` 指向 vm 实例
    //   return this.message.MonthIncome - this.message.MonthOutcome;
    // },
    // SLastIncome: function() {
    //   // `this` 指向 vm 实例
    //   return this.message.LastMonthIncome - this.message.LastMonthOutcome;
    // },
    // SPer: () => {
    //   console.log(" ");
    //   return (this.SIncome - this.SLastIncome) / this.SLastIncome;
    // }
  },
  components: {
    Chart
  },
  data() {
    return {
      mydate: null,
      ChartData: {
        zongkaixiao_pie: {},
        zxdkaixiao_pie: {},
        sbkaixiao_pie: {}
      },
      time: "",
      message: {
        Total: 0,
        incomecount: 0,
        outcomecount: 0,
        MonthIncome: 0,
        LastMonthIncome: 0,
        MonthIncomePer: 0,
        MonthOutcome: 0,
        LastMonthOutcome: 0,
        MonthOutcomePer: 0
      },
      form: this.$form.createForm(this)
    };
  },
  mounted() {
    this.mydate = new MyDate();
    this.time = this.mydate.Format("yyyy-MM-dd");
    this.getStatisticsData(this.mydate.Format("yyyy-MM-dd"));
  },
  methods: {
    getStatisticsData() {
      request({
        url: address.MonthAnalysis,
        method: "get",
        params: { time: this.time }
      }).then(response => {
        console.log(response);
        this.ChartData.sbkaixiao_pie = pie1(response.data.sbkaixiao_pie_data);
        this.ChartData.zongkaixiao_pie = pie1(
          response.data.zongkaixiao_pie_data
        );
        this.ChartData.zxdkaixiao_pie = pie1(response.data.zxdkaixiao_pie_data);
        this.message.outcomecount = response.data.outcomecount;
        this.message.incomecount = response.data.incomecount;
        this.message.Total = response.data.jingshouru;
        this.message.MonthIncome = response.data.income;
        this.message.MonthOutcome = response.data.outcome;
      });
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields(err => {
        if (!err) {
          this.getStatisticsData();
        }
      });
    },
    selecttime(date, dateString) {
      this.time = dateString + "-01";
    }
  }
};
</script>

<style scoped>
.gutter-example >>> .ant-row > div {
  background: transparent;
  border: 0;
}
.gutter-box {
  padding: 15px 25px;
  background-color: white;
  height: 150px;
  border-radius: 3px;
}
</style>
