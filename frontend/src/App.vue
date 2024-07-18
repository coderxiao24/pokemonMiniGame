<script lang="ts" setup>
import { RouterLink, RouterView } from "vue-router";
import zhCN from "ant-design-vue/es/locale/zh_CN";
</script>

<template>
  <a-config-provider :locale="zhCN">
    <RouterView />
  </a-config-provider>
</template>

<style scoped></style>
