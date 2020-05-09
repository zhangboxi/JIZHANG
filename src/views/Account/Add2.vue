<template>
  <a-form :form="form" @submit="handleSubmit">
    <a-form-item
      label="钱数"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 16 }"
    >
      <a-input
        autocomplete="off"
        v-decorator="[
          'money',
          { rules: [{ required: true, message: '请输入金额!' }] }
        ]"
      />
    </a-form-item>
    <a-form-item
      label="支出或收入"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 16 }"
    >
      <a-select
        v-decorator="[
          'pay',
          { rules: [{ required: true, message: '请选择是支出还是收入' }] }
        ]"
        placeholder="请选择是支出还是收入"
        @change="handleSelectChange"
      >
        <a-select-option
          v-for="d in templateDatas"
          :key="d.value"
          :value="d.value"
          >{{ d.text }}</a-select-option
        >
      </a-select>
    </a-form-item>
    <a-form-item
      label="开销人"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 16 }"
    >
      <a-select
        v-decorator="[
          'person',
          { rules: [{ required: true, message: '请选择开销人' }] }
        ]"
        placeholder="请选择开销人"
      >
        <a-select-option
          v-for="d in persondata"
          :key="d.PERSONID"
          :value="d.PERSONID"
          >{{ d.NAME }}</a-select-option
        >
      </a-select>
    </a-form-item>
    <a-form-item
      label="花销类型"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 16 }"
    >
      <a-select
        v-decorator="[
          'expendtype',
          { rules: [{ required: true, message: '请选择开销类型' }] }
        ]"
        placeholder="请选择开销类型"
      >
        <a-select-option
          v-for="d in accounttypedata"
          :key="d.TYPEID"
          :value="d.TYPEID"
          >{{ d.TYPE }}</a-select-option
        >
      </a-select>
    </a-form-item>
    <a-form-item
      label="开销时间"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 16 }"
    >
      <a-date-picker
        v-decorator="[
          'time',
          { rules: [{ required: true, message: '请输入时间!' }] }
        ]"
        placeholder="请选择时间"
        @change="selecttimeF"
      />
    </a-form-item>
    <a-form-item
      label="备注信息"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 16 }"
    >
      <a-textarea
        v-decorator="[
          'note',
          { rules: [{ required: false, message: '请输入备注信息!' }] }
        ]"
        :autosize="{ minRows: 4, maxRows: 12 }"
        placeholder="请输入备注信息"
      />
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 12, offset: 5 }" v-show="displayfoot">
      <a-button type="primary" html-type="submit">
        提交
      </a-button>
      <a-button
        type="primary"
        @click="handleReset"
        :style="{ marginLeft: '64px' }"
      >
        Clear
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import request from "../../utils/request";
import myMixin from "./basic";
import address from "./address.js";
export default {
  mounted() {
    if (this.$store.state.account.persondata === null) {
      this.getPerson();
    } else {
      this.persondata = this.$store.state.account.persondata;
    }
    if (this.$store.state.account.accounttypedata === null) {
      this.getAccountType();
    } else {
      this.accounttypedata = this.$store.state.account.accounttypedata;
    }
  },
  mixins: [myMixin],
  props: {
    displayfoot: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      formLayout: "horizontal",
      form: this.$form.createForm(this),
      persondata: null,
      accounttypedata: null,
      selecttime: null,
      templateDatas: [
        {
          value: "1",
          text: "支出"
        },
        {
          value: "0",
          text: "收入"
        }
      ]
    };
  },
  methods: {
    selecttimeF(date, dateString) {
      this.selecttime = dateString;
      console.log(this.selecttime);
    },
    addAccount(params) {
      request({
        url: address.addAccount,
        method: "get",
        params: params
      }).then(response => {
        console.log(response);
        alert("添加成功");
        this.handleReset();
      });
    },
    handleReset() {
      this.form.resetFields();
    },
    handleSubmit() {
      // e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          values.datetime = this.selecttime;
          delete values.time;
          console.log(values);
          values.note = values.note + "";
          this.addAccount(values);
        }
      });
    },
    handleSelectChange(value) {
      this.form.resetFields("expendtype");
      if (value == 1) {
        this.accounttypedata = this.$store.state.account.accounttypedata.filter(
          one => {
            return one.ISPAY == 1;
          }
        );
      } else {
        this.accounttypedata = this.$store.state.account.accounttypedata.filter(
          one => {
            return one.ISPAY == 0;
          }
        );
      }
    }
  }
};
</script>

<style></style>
