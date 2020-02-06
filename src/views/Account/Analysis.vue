<template>
  <div style="padding: 0 25px 0 25px;">
    <a-form :form="form" layout="inline" @submit="handleSubmit">
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
      </a-form-item>
    </a-form>

    <template>
      <div style="margin-top: 15px;">
        <a-row :gutter="16">
          <a-col class="gutter-row" :span="6">
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
          <a-col class="gutter-row" :span="6">
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
          <a-col class="gutter-row" :span="6">
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
          </a-col>
        </a-row>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  computed: {
    // 计算属性的 getter
    SIncome: function() {
      // `this` 指向 vm 实例
      return this.message.MonthIncome - this.message.MonthOutcome;
    },
    SLastIncome: function() {
      // `this` 指向 vm 实例
      return this.message.LastMonthIncome - this.message.LastMonthOutcome;
    },
    SPer: () => {
      return (this.SIncome - this.SLastIncome) / this.SLastIncome;
    }
  },
  data() {
    return {
      starttime: "",
      endtime: "",
      message: {
        Total: 100,
        MonthIncome: 110,
        LastMonthIncome: 100,
        MonthIncomePer: 10,
        MonthOutcome: 90,
        LastMonthOutcome: 100,
        MonthOutcomePer: 10
      },
      form: this.$form.createForm(this)
    };
  },
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
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values);
          let params = {
            starttime: this.starttime,
            endtime: this.endtime,
            personid: "null",
            typeid: "null",
            ispay: "null",
            page: 1,
            pagesize: 1
          };

          this.queryAccount(params);
        }
      });
    },
    queryAccount(params) {
      console.log(params);
    },
    selecttime(date, dateString) {
      this.starttime = dateString[0] + " 00:00:00";
      this.endtime = dateString[1] + " 23:59:59";
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
