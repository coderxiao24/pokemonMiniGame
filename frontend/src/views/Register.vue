<template>
  <div>
    <a-form
      ref="formRef"
      :model="formState"
      v-bind="formItemLayout"
      :rules="rules"
    >
      <a-form-item label="头像" name="avatar"
        ><a-upload
          v-model:file-list="fileList"
          list-type="picture-card"
          :show-upload-list="false"
          :maxCount="1"
          :action="baseUrl + 'upload'"
          @change="handleChange"
        >
          <img
            style="max-width: 100%; max-height: 100%"
            v-if="formState.avatar"
            :src="
              formState.avatar.startsWith('http')
                ? formState.avatar
                : baseUrl + formState.avatar
            "
            alt="avatar"
          />
          <div v-else>
            <loading-outlined v-if="loading"></loading-outlined>
            <plus-outlined v-else></plus-outlined>
            <div class="ant-upload-text">上传头像</div>
          </div>
        </a-upload>
      </a-form-item>
      <a-form-item label="昵称" name="nickname">
        <a-input v-model:value="formState['nickname']" />
      </a-form-item>
      <a-form-item label="账号" name="username">
        <a-input v-model:value="formState['username']" />
      </a-form-item>
      <a-form-item label="密码" name="password">
        <a-input-password v-model:value="formState['password']" />
      </a-form-item>
      <a-form-item label="年龄" name="age">
        <a-input-number v-model:value="formState['age']" :min="0" :max="100" />
      </a-form-item>
      <a-form-item name="gender" label="性别">
        <a-radio-group v-model:value="formState['gender']">
          <a-radio value="male">男</a-radio>
          <a-radio value="female">女</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>

    <a-button type="primary" @click="onSubmit">注册</a-button>
    <a-button @click="router.push('/login')">已有账号？去登录→</a-button>
  </div>
</template>
<script lang="ts" setup>
import { ref, toRaw } from "vue";
import { baseUrl } from "@/config/index";

import { message } from "ant-design-vue";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons-vue";

import { addUser } from "@/api/users";
import { useRouter } from "vue-router";
const router = useRouter();

const formRef = ref();

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const formState = ref<any>({
  nickname: "",
  username: "",
  password: "",
  avatar: "",
  age: 0,
  gender: "",
});

const fileList = ref([]);
const loading = ref<boolean>(false);

const handleChange = (info: any) => {
  if (info.file.status === "uploading") {
    loading.value = true;
    return;
  }
  if (info.file.status === "done") {
    loading.value = false;

    formState.value.avatar = info.file.response.path;
  }
  if (info.file.status === "error") {
    loading.value = false;
    message.error("上传失败");
  }
};

const rules = <any>{
  nickname: [
    {
      required: true,
      message: "请输入昵称",
      trigger: "change",
    },
  ],
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
    {
      min: 6,
      message: "密码最小6位",
      trigger: "change",
    },
  ],
  avatar: [
    {
      required: true,
      message: "请上传头像",
      trigger: "change",
    },
  ],
  age: [
    {
      required: true,
      message: "请选择年龄",
      trigger: "change",
    },
  ],
  gender: [
    {
      required: true,
      message: "请选择性别",
      trigger: "change",
    },
  ],
};

const onSubmit = () => {
  formRef.value
    .validate()
    .then(() => {
      addUser(formState.value).then((res) => {
        console.log(res);
        if (res.data.ok === 1) router.push("/login");
      });
    })
    .catch((error) => {
      console.log("error", error);
    });
};
</script>
