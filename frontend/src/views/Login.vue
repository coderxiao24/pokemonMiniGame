<template>
  <div>
    <a-form
      ref="formRef"
      :model="formState"
      v-bind="formItemLayout"
      :rules="rules"
    >
      <a-form-item label="账号" name="username">
        <a-input v-model:value="formState['username']" />
      </a-form-item>
      <a-form-item label="密码" name="password">
        <a-input-password v-model:value="formState['password']" />
      </a-form-item>
    </a-form>

    <a-button type="primary" @click="onSubmit">登录</a-button>
    <a-button @click="router.push('/Register')">没有账号？去注册→</a-button>
  </div>
</template>
<script lang="ts" setup>
import { ref, toRaw } from "vue";

import { PlusOutlined, LoadingOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";

import { login } from "@/api/users";

import { useRouter } from "vue-router";

const router = useRouter();
const formRef = ref();

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const formState = ref<any>({
  username: "",
  password: "",
});

const rules = <any>{
  username: [
    {
      required: true,
      message: "请输入账号",
      trigger: "change",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "change",
    },
  ],
};

const onSubmit = () => {
  formRef.value
    .validate()
    .then(() => {
      login(formState.value).then((res) => {
        if (res.data.ok === 1) {
          router.push("/");
          localStorage.setItem("user", JSON.stringify(res.data.data[0]));
        } else message.error(`用户名或密码不正确！`);
      });
    })
    .catch((error) => {
      console.log("error", error);
    });
};
</script>
