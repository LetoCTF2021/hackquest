<template>
  <a-row class="loginPage">
    <a-col :span="12" :offset="6">
      <a-form :form="form" class="login">
        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="Team name"
        >
          <a-input
            v-decorator="[
              'username',
              {
                rules: [
                  {
                    required: true,
                    message: 'Введите название комманды',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="Password"
        >
          <a-input
            type="password"
            v-decorator="[
              'password',
              {
                rules: [
                  {
                    required: true,
                    message: 'Введите пароль',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item
          :label-col="formTailLayout.labelCol"
          :wrapper-col="formTailLayout.wrapperCol"
          class="loginButton"
        >
          <a-button type="primary" @click="check"> Войти </a-button>
        </a-form-item>
      </a-form>
    </a-col>
  </a-row>
</template>

<script>
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 },
};
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
};
export default {
  props: ["linkName"],
  data() {
    return {
      checkNick: false,
      formItemLayout,
      formTailLayout,
      form: this.$form.createForm(this, { name: "dynamic_rule" }),
    };
  },
  methods: {
    check() {
      this.form.validateFields((err) => {
        if (!err) {
          console.info("success");
          this.$router.push(this.linkName)
        }
      });
    },
    handleChange(e) {
      this.checkNick = e.target.checked;
      this.$nextTick(() => {
        this.form.validateFields(["nickname"], { force: true });
      });
    },
  },
};
</script>

<style>
.loginPage {
  transform: translate(0%, 100%);
}

.loginButton .ant-col-offset-4 {
  margin-left: 0px !important;
}
</style>

