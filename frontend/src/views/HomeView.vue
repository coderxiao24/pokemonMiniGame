<template>
  <div>
    <a-row :gutter="12" style="width: 100%">
      <a-col span="8">
        <a-card>
          <template #actions>
            <a-button
              @click="openPokemonModal()"
              type="primary"
              :icon="h(SearchOutlined)"
              >寻找宝可梦</a-button
            >

            <a-button :icon="h(SmileTwoTone)" @click="open1 = true"
              >电脑</a-button
            >
            <a-popconfirm
              title="确认退出登录吗?"
              ok-text="确定"
              cancel-text="再玩会"
              @confirm="logout"
            >
              <a-button type="primary" :icon="h(LogoutOutlined)" danger
                >退出</a-button
              >
            </a-popconfirm>
          </template>
          <a-card-meta :title="userInfo.nickname">
            <template #avatar>
              <a-avatar
                :src="userInfo.avatar ? baseUrl + userInfo.avatar : null"
              />
            </template>
          </a-card-meta>

          <a-row style="margin: 12px 0 0">
            <a-col span="6">年龄：</a-col>
            <a-col span="6">{{ userInfo.age }}</a-col>
            <a-col span="6">性别：</a-col>
            <a-col span="6">{{
              userInfo.gender == "male" ? "男" : "女"
            }}</a-col>
            <a-col span="6">攻击力：</a-col>
            <a-col span="6">{{ userInfo.ad }}</a-col>
            <a-col span="6">钱包：</a-col>
            <a-col span="6">{{ userInfo.money }}元</a-col>
            <a-col span="6">精灵球：</a-col>
            <a-col span="6">{{ userInfo.ballNum }}个</a-col>
          </a-row>
        </a-card>
      </a-col>

      <a-col span="8">
        <a-card>
          <a-card-meta title="商店">
            <template #avatar>
              <DollarTwoTone />
            </template>
          </a-card-meta>

          <a-table
            style="margin-top: 12px"
            :pagination="false"
            size="small"
            bordered
            :columns="[
              { dataIndex: 'name', title: '商品名称', align: 'center' },
              {
                dataIndex: 'desc',
                title: '商品描述',
                ellipsis: true,
                align: 'center',
              },
              { dataIndex: 'money', title: '价格', align: 'center' },
              { key: 'action', title: '操作', align: 'center' },
            ]"
            :dataSource="[
              {
                name: '大力丸',
                desc: '攻击力+1',
                money: 500 * userInfo.ad,
                field: 'ad',
              },
              {
                name: '精灵球',
                desc: '用于捕捉宝可梦',
                money: 100 * userInfo.ballNum,
                field: 'ballNum',
              },
            ]"
          >
            <template #bodyCell="{ text, column, record }">
              <template v-if="column.dataIndex === 'money'">
                <span style="color: orange; font-weight: bolder">
                  ￥{{ text }}</span
                >
              </template>

              <template v-if="column.key === 'action'">
                <a-button size="small" type="primary" @click="buy(record)"
                  >购买</a-button
                >
              </template>
            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>

    <a-modal
      :closable="look"
      :maskClosable="look"
      v-model:open="open"
      :width="1000"
      destroyOnClose
      :footer="null"
      :keyboard="look"
      @cancel="
        open = false;
        look = false;
      "
    >
      <template #title>
        <b :style="{ color: currentPokemon.isShiny == 2 ? 'orange' : '' }">
          {{
            look
              ? `你的【 
            ${
              (currentPokemon["isShiny"] == 2 ? "☆★☆闪光☆★☆  " : "") +
              currentPokemon["name"]
            }】`
              : (currentPokemon["isShiny"] == 2 ? "☆★☆闪光☆★☆  " : "") +
                "野生宝可梦"
          }}
        </b>
      </template>

      <a-card>
        <div style="display: flex; align-items: center">
          <span>hp:</span
          ><a-progress
            style="margin: 0 12px"
            :percent="(currentPokemon.hp / currentPokemon.feStat[0]) * 100"
            :showInfo="false"
            :status="
              (currentPokemon.hp / currentPokemon.feStat[0]) * 100 <= 50
                ? (currentPokemon.hp / currentPokemon.feStat[0]) * 100 <= 25
                  ? 'exception'
                  : 'normal'
                : 'success '
            "
          />

          <span>{{ currentPokemon.hp }}</span>
        </div>

        <div v-if="!look">
          当前捕捉概率 ×

          <b style="color: orange">
            {{
              (currentPokemon.hp / currentPokemon.feStat[0]) * 100 <= 50
                ? (currentPokemon.hp / currentPokemon.feStat[0]) * 100 <= 25
                  ? 3
                  : 2
                : 1
            }}
          </b>

          倍
        </div>
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin-bottom: 24px;
          "
        >
          <img
            style="max-width: 200px; cursor: pointer; margin: 24px 0"
            :src="
              baseUrl +
              currentPokemon[
                `${currentPokemon.isShiny == 2 ? 'shiny-' : ''}${
                  currentPokemon.direction ? 'back' : 'forward'
                }`
              ]
            "
            title="点击切换正反面"
            @click="currentPokemon.direction = !currentPokemon.direction"
          />
          <a-image
            style="max-width: 200px"
            :src="baseUrl + currentPokemon['gif']"
          />
        </div>

        <a-form v-bind="formItemLayout">
          <a-row>
            <a-col span="12">
              <a-form-item label="宝可梦">
                <a-input
                  disabled
                  :value="
                    (currentPokemon['isShiny'] == 2 ? '☆★☆闪光☆★☆  ' : '') +
                    currentPokemon['name']
                  "
                />
              </a-form-item>
            </a-col>
            <a-col span="12">
              <a-form-item label="属性">
                <a-input
                  disabled
                  :value="`${currentPokemon['type1']} ${currentPokemon['type2']}`"
                />
              </a-form-item>
            </a-col>

            <a-col span="12">
              <a-form-item label="捕捉成功概率">
                <a-textarea
                  auto-size
                  disabled
                  :value="currentPokemon['catchRate']"
                />
              </a-form-item>
            </a-col>
            <a-col span="12">
              <a-form-item label="宝可梦描述">
                <a-textarea
                  auto-size
                  disabled
                  v-model:value="currentPokemon['desc']"
                />
              </a-form-item>
            </a-col>
            <a-col span="24" v-if="look">
              <a-form-item
                label="进化链"
                :labelCol="{ span: 6 }"
                :wrapperCol="{ span: 18 }"
              >
                <div style="display: flex; align-items: center">
                  <div v-for="(item, idx) in currentPokemon['feChain']">
                    <img
                      style="width: 48px"
                      :style="{
                        cursor:
                          item.id == currentPokemon['id']
                            ? 'not-allowed'
                            : 'pointer',
                      }"
                      :src="baseUrl + item['gif']"
                      @click="
                        () => {
                          if (item.id == currentPokemon['id']) return;
                          open = false;
                          openPokemonModal(item.id);
                        }
                      "
                    />

                    <ArrowRightOutlined
                      style="margin: 0 12px"
                      v-if="idx != currentPokemon['feChain'].length - 1"
                    />
                  </div>
                </div>
              </a-form-item>
            </a-col>
            <a-col span="24">
              <a-form-item
                label="种族值"
                :labelCol="{ span: 6 }"
                :wrapperCol="{ span: 18 }"
              >
                <div style="display: flex; align-items: center">
                  <div style="width: 240px; height: 240px" id="Racial"></div>
                  <table border="1" style="flex: 1; margin: 0 24px">
                    <thead>
                      <tr>
                        <th>种族值</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td
                          style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                          "
                        >
                          <span
                            style="
                              background-color: #007ce7;
                              color: #fff;
                              text-wrap: nowrap;
                            "
                            :style="{
                              width: `${
                                (currentPokemon.feStat[0] / 255) * 100
                              }%`,
                            }"
                            >HP: </span
                          ><span>{{ currentPokemon.feStat[0] }}</span>
                        </td>
                      </tr>
                      <tr>
                        <td
                          style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                          "
                        >
                          <span
                            style="
                              background-color: #007ce7;
                              color: #fff;
                              text-wrap: nowrap;
                            "
                            :style="{
                              width: `${
                                (currentPokemon.feStat[1] / 255) * 100
                              }%`,
                            }"
                            >攻击:</span
                          ><span>{{ currentPokemon.feStat[1] }}</span>
                        </td>
                      </tr>
                      <tr>
                        <td
                          style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                          "
                        >
                          <span
                            style="
                              background-color: #007ce7;
                              color: #fff;
                              text-wrap: nowrap;
                            "
                            :style="{
                              width: `${
                                (currentPokemon.feStat[2] / 255) * 100
                              }%`,
                            }"
                            >防御:</span
                          ><span>{{ currentPokemon.feStat[2] }}</span>
                        </td>
                      </tr>
                      <tr>
                        <td
                          style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                          "
                        >
                          <span
                            style="
                              background-color: #007ce7;
                              color: #fff;
                              text-wrap: nowrap;
                            "
                            :style="{
                              width: `${
                                (currentPokemon.feStat[3] / 255) * 100
                              }%`,
                            }"
                            >特攻:</span
                          ><span>{{ currentPokemon.feStat[3] }}</span>
                        </td>
                      </tr>
                      <tr>
                        <td
                          style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                          "
                        >
                          <span
                            style="
                              background-color: #007ce7;
                              color: #fff;
                              text-wrap: nowrap;
                            "
                            :style="{
                              width: `${
                                (currentPokemon.feStat[4] / 255) * 100
                              }%`,
                            }"
                            >特防:</span
                          ><span>{{ currentPokemon.feStat[4] }}</span>
                        </td>
                      </tr>
                      <tr>
                        <td
                          style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                          "
                        >
                          <span
                            style="
                              background-color: #007ce7;
                              color: #fff;
                              text-wrap: nowrap;
                            "
                            :style="{
                              width: `${
                                (currentPokemon.feStat[5] / 255) * 100
                              }%`,
                            }"
                            >速度:</span
                          ><span>{{ currentPokemon.feStat[5] }}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>

        <template #actions v-if="!look">
          <a-button @click="attack">攻击</a-button>
          <a-button @click="catchPokemon"
            >捕捉 剩余{{ userInfo.ballNum }}个精灵球</a-button
          >
          <a-button
            @click="
              open = false;
              look = false;
              currentPokemon = {};
            "
            >逃跑</a-button
          >
        </template>
      </a-card>
    </a-modal>

    <a-modal
      v-model:open="open1"
      title="电脑"
      destroyOnClose
      :footer="null"
      :width="1000"
    >
      <a-card>
        <a-card-grid
          style="
            width: 25%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-around;
          "
          v-for="item in userInfo.pokemons"
        >
          <img
            style="width: 50%; cursor: pointer"
            :src="baseUrl + item['gif']"
            @click="
              open1 = false;
              look = true;
              openPokemonModal(item);
            "
          />

          <b :style="{ color: item.isShiny == 2 ? 'orange' : '' }">
            {{ (item["isShiny"] == 2 ? "★闪光★  " : "") + item["name"] }}
          </b>

          <a-popconfirm
            title="确认放生吗?"
            ok-text="确定"
            cancel-text="不放了"
            @confirm="setFree(item._id)"
          >
            <a-button type="primary" danger>放生</a-button>
          </a-popconfirm>
        </a-card-grid>
      </a-card>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import * as echarts from "echarts";

import { ref, toRaw, onMounted, nextTick, h } from "vue";

import {
  SettingOutlined,
  EditOutlined,
  EllipsisOutlined,
  LogoutOutlined,
  SmileTwoTone,
  SearchOutlined,
  ArrowRightOutlined,
  DollarTwoTone,
} from "@ant-design/icons-vue";
import { getPokemon } from "@/api/pokemon";
import { getUser, editUser, setFreePokemon } from "@/api/users";

import { useRouter } from "vue-router";
const router = useRouter();
import { baseUrl } from "@/config/index";

import { message } from "ant-design-vue";

const formItemLayout = {
  labelCol: { span: 12 },
  wrapperCol: { span: 12 },
};

const userInfo = ref<any>({});

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  router.push("login");
};

const open = ref<boolean>(false);
const open1 = ref<boolean>(false);
const look = ref<boolean>(false);

const currentPokemon = ref<any>({});

const pokemonsLen = ref<number>(0);

const findPokemon = async (id) => {
  const res = await getPokemon(id);
  return res.data.data[0];
};

const openPokemonModal = async (id) => {
  if (!id) {
    id = Math.floor(Math.random() * (pokemonsLen.value + 1));
  }

  if (typeof id == "object") {
    currentPokemon.value = id;
  } else {
    currentPokemon.value = await findPokemon(id);
  }

  currentPokemon.value.feChain = currentPokemon.value.chain.split(",");
  currentPokemon.value.feStat = currentPokemon.value.stat.split(",");

  currentPokemon.value.hp = currentPokemon.value.feStat[0];

  if (!currentPokemon.value.isShiny) {
    currentPokemon.value.isShiny = generateRandomBoolean("10%") ? 2 : 1;
  }

  for (let i = 0; i < currentPokemon.value.feChain.length; i++) {
    let item = currentPokemon.value.feChain[i];

    currentPokemon.value.feChain[i] =
      item == currentPokemon.value.id
        ? currentPokemon.value
        : await findPokemon(item);
  }

  open.value = true;
  nextTick(() => {
    const myChart = echarts.init(document.getElementById("Racial"));
    const option = {
      tooltip: {
        trigger: "item",
      },
      radar: {
        indicator: [
          { name: "HP", max: 255 },
          { name: "攻击", max: 255 },
          { name: "防御", max: 255 },
          { name: "特攻", max: 255 },
          { name: "特防", max: 255 },
          { name: "速度", max: 255 },
        ],
      },
      series: [
        {
          type: "radar",
          data: [
            {
              value: currentPokemon.value.feStat,
              name: currentPokemon.value.name,
            },
          ],
        },
      ],
    };
    option && myChart.setOption(option);
  });
};

const attack = () => {
  currentPokemon.value.hp -= userInfo.value.ad;
  if (currentPokemon.value.hp <= 0) {
    currentPokemon.value.hp = 0;
    open.value = false;
    look.value = false;
    editUser({
      _id: userInfo.value._id,
      data: {
        money: currentPokemon.value.feStat[0],
      },
    }).then((res) => {
      if (res.data.ok === 1) {
        message.success(
          `成功击败${currentPokemon.value.name},获得${currentPokemon.value.feStat[0]}元！`
        );
        loadUser();
      }
    });
  }
};
const buy = (record) => {
  console.log(record);
  if (userInfo.value.money - record.money < 0) {
    message.error(`你的钱不够，再去击败一些宝可梦赚钱吧！`);
    return;
  }
  const { name, money, field } = record;
  const data = { money: -money };
  data[field] = 1;
  editUser({
    _id: userInfo.value._id,
    data,
  }).then((res) => {
    if (res.data.ok === 1) {
      message.success(`${name}购买成功！`);
      loadUser();
    }
  });
};

function generateRandomBoolean(percentage) {
  const randomNumber = Math.random() * 100;
  return randomNumber <= parseFloat(percentage);
}

const catchPokemon = () => {
  if (userInfo.value.ballNum <= 0) {
    message.error(`你没有精灵球了，再去买一些吧！`);
    return;
  }

  const k =
    (currentPokemon.value.hp / currentPokemon.value.feStat[0]) * 100 <= 50
      ? (currentPokemon.value.hp / currentPokemon.value.feStat[0]) * 100 <= 25
        ? 3
        : 2
      : 1;

  const p = parseFloat(currentPokemon.value.catchRate) * k + "%";

  if (generateRandomBoolean(p)) {
    const newPokenmon = { ...currentPokemon.value };
    delete newPokenmon.feChain;
    delete newPokenmon.feStat;

    editUser({
      _id: userInfo.value._id,
      data: {
        ballNum: -1,
        pokemons: newPokenmon,
      },
    }).then((res) => {
      if (res.data.ok === 1) {
        loadUser();
        open.value = false;
        look.value = false;
        message.success(`捕捉成功！`);
      }
    });
  } else {
    editUser({
      _id: userInfo.value._id,
      data: {
        ballNum: -1,
      },
    }).then((res) => {
      if (res.data.ok === 1) {
        loadUser();
        message.error(`捕捉失败！`);
      }
    });
  }
};

const setFree = (pokemonId) => {
  setFreePokemon({
    userId: userInfo.value._id,
    pokemonId,
  }).then((res) => {
    if (res.data.ok === 1) {
      loadUser();
      message.error(`放生成功！`);
    }
  });
};

const loadUser = () => {
  const { _id } = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : {};
  _id &&
    getUser({ _id }).then((res) => {
      console.log(res);
      if (!res.data.data.length) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
        return;
      }
      if (res.data.ok === 1) userInfo.value = res.data.data[0];
    });
};

onMounted(() => {
  loadUser();

  getPokemon().then((res) => {
    pokemonsLen.value = res.data.data;
  });
});
</script>
