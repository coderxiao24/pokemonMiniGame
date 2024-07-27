<template>
  <div>
    <a-row :gutter="12" style="width: 100%">
      <a-col
        :xs="24"
        :sm="24"
        :md="24"
        :lg="12"
        :xl="12"
        style="margin-bottom: 8px"
      >
        <a-card>
          <template #actions>
            <a-button
              @click="openPokemonModal()"
              type="primary"
              :icon="h(SearchOutlined)"
              >寻找宝可梦</a-button
            >

            <a-button
              :icon="h(SmileTwoTone)"
              @click="
                computer = userInfo;
                open1 = true;
              "
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
                @click="dev"
                :src="userInfo.avatar ? baseUrl + userInfo.avatar : null"
              />
            </template>
          </a-card-meta>

          <a-row style="margin: 12px 0 0">
            <a-col span="24" v-if="clickCount === 5">
              <a-row>
                <a-col span="6"
                  ><span
                    style="font-size: 1.5em; font-weight: bolder; color: orange"
                    >遇闪概率:</span
                  >
                </a-col>
                <a-col span="6">
                  <a-slider
                    v-model:value="shinyP"
                    :step="0.1"
                    :tipFormatter="(v) => `${v}%`"
                  />
                </a-col>

                <a-col span="4">
                  <a-button
                    style="background-color: orange"
                    @click="cheat('money', 10000)"
                    >加钱</a-button
                  >
                </a-col>
                <a-col span="4">
                  <a-button
                    style="background-color: orange"
                    @click="cheat('ballNum', 10)"
                    >加球</a-button
                  >
                </a-col>
                <a-col span="4">
                  <a-button
                    style="background-color: orange"
                    @click="cheat('ad', 10)"
                    >加ad</a-button
                  >
                </a-col>

                <a-col span="6"
                  ><span style="font-weight: bolder; color: red"
                    >强制下线:</span
                  >
                </a-col>
                <a-col span="18">
                  <a-select
                    v-model:value="selectUsers"
                    mode="multiple"
                    style="width: 100%"
                    size="small"
                  >
                    <a-select-option
                      :value="item._id"
                      v-for="item in onlineUsers"
                      >{{ item.nickname }}</a-select-option
                    >
                  </a-select>
                </a-col>
                <a-col span="6"
                  ><span style="font-weight: bolder; color: red">备注:</span>
                </a-col>
                <a-col span="14">
                  <a-input
                    v-model:value="remark"
                    mode="multiple"
                    style="width: 100%"
                    placeholder="下线备注"
                    size="small"
                  />
                </a-col>
                <a-col span="4">
                  <a-button danger type="primary" @click="Offline" size="small"
                    >下线</a-button
                  >
                </a-col>
              </a-row>
            </a-col>

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
            <a-col span="12"></a-col>
            <a-col span="6">大喇叭：</a-col>
            <a-col span="18">
              <a-input-group compact>
                <a-input
                  style="width: calc(100% - 60px)"
                  v-model:value="allText"
                />
                <a-button
                  type="primary"
                  @click="send('all')"
                  style="width: 60px"
                >
                  发送</a-button
                >
              </a-input-group>
            </a-col>
          </a-row>
        </a-card>
      </a-col>

      <a-col
        :xs="24"
        :sm="24"
        :md="24"
        :lg="12"
        :xl="12"
        style="margin-bottom: 8px"
      >
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
                desc: '抓宝可梦',
                money: 100 * userInfo.ballNum,
                field: 'ballNum',
              },
              {
                name: '支持作者',
                desc: '买杯咖啡',
                key: 'author',
              },
            ]"
          >
            <template #bodyCell="{ text, column, record }">
              <template v-if="column.dataIndex === 'money'">
                <span style="color: orange; font-weight: bolder">
                  ￥{{ record.key === "author" ? "随意" : text }}</span
                >
              </template>

              <template v-if="column.key === 'action'">
                <a-button
                  size="small"
                  type="primary"
                  v-if="record.key === 'author'"
                  style="background-color: orange"
                  @click="open2 = true"
                  >打赏</a-button
                >
                <a-button
                  size="small"
                  type="primary"
                  @click="buy(record)"
                  v-else
                  >购买</a-button
                >
              </template>
            </template>
          </a-table>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <a-card>
          <div style="margin: 12px 0">
            <a-radio-group
              v-model:value="rankingType"
              button-style="solid"
              @change="rankingTypeChange"
            >
              <a-radio-button :value="0">富豪榜</a-radio-button>
              <a-radio-button :value="1">宝可梦大师榜</a-radio-button>
              <a-radio-button :value="2">在线玩家</a-radio-button>
            </a-radio-group>

            <a-button
              style="float: right"
              size="small"
              type="primary"
              shape="circle"
              :icon="h(RedoOutlined)"
              :loading="loading"
              @click="loadTop5User"
            />
          </div>

          <a-list
            size="small"
            item-layout="horizontal"
            :data-source="rankingType == 2 ? onlineUsers : top5Users"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <template #actions>
                  <a-button
                    v-if="rankingType != 2"
                    @click="
                      computer = item;
                      open1 = true;
                    "
                    size="small"
                    type="primary"
                    >{{
                      item._id == userInfo._id ? "您的电脑" : "他的电脑"
                    }}</a-button
                  >

                  <a-button
                    v-else-if="!item.showSend && item._id != userInfo._id"
                    type="primary"
                    @click="
                      () => {
                        if (onlineUsers.find((v) => v.showSend))
                          onlineUsers.find((v) => v.showSend).showSend = false;
                        item.showSend = true;
                      }
                    "
                    style="width: 60px"
                    >私聊</a-button
                  >
                </template>
                <a-list-item-meta>
                  <template #description v-if="rankingType != 2">
                    {{ item._id == userInfo._id ? "您" : "" }}拥有
                    <span style="color: orange; font-weight: bolder">
                      {{
                        rankingType
                          ? `${item.pokemons?.length}`
                          : `￥${item.money}`
                      }}</span
                    >
                    {{ rankingType ? "只宝可梦" : "元" }}
                  </template>
                  <template #title>
                    <span
                      :style="
                        item._id == userInfo._id
                          ? 'color: orange; font-weight: bolder'
                          : ' '
                      "
                    >
                      {{ item.nickname }}</span
                    >

                    <div v-if="rankingType == 2 && item._id != userInfo._id">
                      <a-input-group compact v-if="item.showSend">
                        <a-input
                          style="width: calc(100% - 60px)"
                          v-model:value="singleText"
                        />
                        <a-button
                          type="primary"
                          @click="send(item._id)"
                          style="width: 60px"
                          >发送</a-button
                        >
                      </a-input-group>
                    </div>
                  </template>
                  <template #avatar>
                    <a-avatar
                      :src="item.avatar ? baseUrl + item.avatar : null"
                    />
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
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
      :centered="!look"
      forceRender
    >
      <template #title>
        <b :style="{ color: currentPokemon.isShiny == 2 ? 'orange' : '' }">
          {{
            look
              ? `【 
            ${
              (currentPokemon["isShiny"] == 2 ? "☆★☆闪光☆★☆  " : "") +
              currentPokemon["name"]
            }】`
              : (currentPokemon["isShiny"] == 2 ? "☆★☆闪光☆★☆  " : "") +
                "野生" +
                currentPokemon["name"]
          }}
        </b>
      </template>

      <a-card :bodyStyle="{ padding: '0 8px' }">
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
          ref="img"
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
            <a-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
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
            <a-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <a-form-item label="属性">
                <a-input
                  disabled
                  :value="`${currentPokemon['type1']} ${currentPokemon['type2']}`"
                />
              </a-form-item>
            </a-col>

            <a-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
              <a-form-item label="捕捉成功概率">
                <a-textarea
                  auto-size
                  disabled
                  :value="`${
                    parseFloat(currentPokemon['catchRate']) *
                    ((currentPokemon.hp / currentPokemon.feStat[0]) * 100 <= 50
                      ? (currentPokemon.hp / currentPokemon.feStat[0]) * 100 <=
                        25
                        ? 3
                        : 2
                      : 1)
                  }%`"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" v-if="look">
              <a-form-item label="宝可梦描述">
                <a-textarea
                  auto-size
                  disabled
                  v-model:value="currentPokemon['desc']"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" v-if="look">
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
            <a-col span="24" v-if="look">
              <a-form-item
                label="种族值"
                :labelCol="{ span: 0 }"
                :wrapperCol="{ span: 24 }"
              >
                <a-row>
                  <a-col
                    :xs="24"
                    :sm="24"
                    :md="24"
                    :lg="12"
                    :xl="12"
                    id="Racial"
                    style="height: 300px"
                  ></a-col>

                  <a-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <table border="1" style="width: 100%">
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
                  </a-col>
                </a-row>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>

        <template #actions v-if="!look">
          <a-button
            @click="attack"
            type="primary"
            :danger="currentPokemon.hp === 1"
            >攻击</a-button
          >
          <a-button @click="catchPokemon">捕捉 </a-button>
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
        <a-empty
          v-if="!computer.pokemons.length"
          description="还没有宝可梦呢"
        />
        <a-card-grid
          style="
            padding: 0;
            width: 25%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-around;
          "
          v-for="item in computer.pokemons"
        >
          <img
            style="width: 60%; cursor: pointer"
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
            <a-button
              v-if="computer._id == userInfo._id"
              type="primary"
              danger
              style="margin-bottom: 8px"
              size="small"
              >放生</a-button
            >
          </a-popconfirm>

          <a-popconfirm
            title="确认出售吗?"
            ok-text="确定"
            cancel-text="不卖了"
            @confirm="sell(item)"
          >
            <a-button
              v-if="computer._id == userInfo._id"
              type="primary"
              style="background-color: orange"
              size="small"
              >出售</a-button
            >
          </a-popconfirm>

          价值
          <span
            :style="{ color: item.isShiny == 2 ? 'orange' : '' }"
            style="font-weight: bolder; font-size: 1.25em"
          >
            {{
              item.stat
                .split(",")
                .reduce((total, num) => total * 1 + num * 1, 0) *
              (item.isShiny == 2 ? 100 : 1)
            }}
          </span>
          元
        </a-card-grid>
      </a-card>
    </a-modal>

    <a-modal
      v-model:open="open2"
      :footer="null"
      :bodyStyle="{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }"
    >
      <template #title>
        <span style="font-weight: bolder; color: orange">为作者充电</span>
      </template>
      <img src="/payQr.jpg" alt="支付宝收款码" style="width: 80%" />
      <div>为作者提供开发创意？请联系vx:13140022101</div>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import * as echarts from "echarts";

import {
  ref,
  toRaw,
  onMounted,
  nextTick,
  h,
  onBeforeUnmount,
  createVNode,
} from "vue";

import {
  SettingOutlined,
  EditOutlined,
  EllipsisOutlined,
  LogoutOutlined,
  SmileTwoTone,
  SearchOutlined,
  ArrowRightOutlined,
  DollarTwoTone,
  RedoOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons-vue";
import { getPokemon } from "@/api/pokemon";
import { getUser, editUser, setFreePokemon, getUserTop5 } from "@/api/users";

import { useRouter } from "vue-router";
const router = useRouter();
import { baseUrl } from "@/config/index";

import { message, notification, Modal } from "ant-design-vue";

import { io } from "socket.io-client";

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
const open2 = ref<boolean>(false);
const look = ref<boolean>(false);

const currentPokemon = ref<any>({});

const pokemonsLen = ref<number>(0);

const findPokemon = async (id) => {
  const res = await getPokemon(id);
  return res.data.data[0];
};

const shinyP = ref<number>(1);

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
    currentPokemon.value.isShiny = generateRandomBoolean(`${shinyP.value}%`)
      ? 2
      : 1;

    if (currentPokemon.value.isShiny === 2)
      socket.emit("sendAll", `我遇到了闪光${currentPokemon.value.name}!!!`);
  }

  for (let i = 0; i < currentPokemon.value.feChain.length; i++) {
    let item = currentPokemon.value.feChain[i];

    currentPokemon.value.feChain[i] =
      item == currentPokemon.value.id
        ? currentPokemon.value
        : await findPokemon(item);
  }

  open.value = true;
  look.value &&
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
const img = ref(null);
const attack = () => {
  img.value.classList.add("attacked");
  setTimeout(() => {
    img.value.classList.remove("attacked");
  }, 300);

  if (currentPokemon.value.hp === 1) {
    // 这次即将击杀了

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
  } else {
    currentPokemon.value.hp -= userInfo.value.ad;
    if (currentPokemon.value.hp <= 0) {
      currentPokemon.value.hp = 1;
    }

    message.success(
      `攻击成功，${currentPokemon.value.name}还剩${currentPokemon.value.hp}滴血!`
    );
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

const sell = (record) => {
  doSet(record._id).then((res) => {
    if (res.data.ok === 1) {
      const money =
        record.stat.split(",").reduce((total, num) => total * 1 + num * 1, 0) *
        (record.isShiny == 2 ? 100 : 1);

      const data = { money: money };

      editUser({
        _id: userInfo.value._id,
        data,
      }).then(async (res) => {
        if (res.data.ok === 1) {
          message.success(`${record.name}出售成功,获得${money}元！`);
          await loadUser();
          computer.value = userInfo.value;
        }
      });
    }
  });
};
const cheat = (field, value) => {
  const data = {};
  data[field] = value;
  editUser({
    _id: userInfo.value._id,
    data,
  }).then((res) => {
    if (res.data.ok === 1) {
      message.success(`作弊成功,${field}增加${value}！`);
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
  doSet(pokemonId).then(async (res) => {
    if (res.data.ok === 1) {
      await loadUser();
      computer.value = userInfo.value;
      message.success(`放生成功！`);
    }
  });
};

const doSet = (pokemonId) => {
  return setFreePokemon({
    userId: userInfo.value._id,
    pokemonId,
  });
};

const loadUser = () => {
  const { _id } = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : {};

  if (_id) {
    return getUser({ _id }).then((res) => {
      if (!res.data?.data?.length) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
        return;
      }
      if (res.data.ok === 1) userInfo.value = res.data.data[0];
    });
  } else {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }
};

const clickCount = ref<number>(0);
const lastClickTime = ref<number>(Date.now());

const dev = () => {
  if (!userInfo.value.admin) return;
  if (clickCount.value < 5) {
    if (Date.now() - lastClickTime.value <= 500) {
      clickCount.value++;
    } else clickCount.value = 0;

    if (clickCount.value >= 3) {
      clickCount.value == 5
        ? message.success(`已进入开发者模式，再次点击以退出开发者模式`)
        : message.info(`再点${5 - clickCount.value}次进入开发者模式`);
    }
  } else {
    clickCount.value = 0;
    message.error(`已退出开发者模式`);
  }

  lastClickTime.value = Date.now();
};

const rankingType = ref<number>(0);
const top5Users = ref<Array>([]);

const computer = ref<object>({
  pokemons: [],
});

const rankingTypeChange = () => {
  if (rankingType.value == 2) return;
  loadTop5User();
};

const loading = ref<boolean>(false);
const loadTop5User = () => {
  if (rankingType.value == 2) return;
  loading.value = true;
  getUserTop5({ rankingType: rankingType.value }).then((res) => {
    loading.value = false;

    if (res.data.ok === 1) {
      top5Users.value = res.data.data;
    }
  });
};

const timer = ref(null);

let socket = null;

const onlineUsers = ref<Array>([]);
const ws = () => {
  // socket = io(`ws://123.57.91.8:1124?token=${localStorage.getItem("token")}`);

  socket = io(
    `ws://${window.location.hostname}:1124?token=${localStorage.getItem(
      "token"
    )}`
  );

  socket.on("connect", () => {
    socket.emit("onlineUsers");
  });
  socket.on("error", (msg) => {
    //  token过期了
    message.error(msg.data);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  });
  socket.on("onlineUsers", (msg) => {
    onlineUsers.value = Array.from(
      new Map(msg.data.map((item) => [item._id, item])).values()
    );
    selectUsers.value = selectUsers.value.filter((v) =>
      onlineUsers.value.find((item) => item._id === v)
    );
  });
  socket.on("welcome", (msg) => {
    notification.success({
      message: `欢迎${msg.data.nickname}上线了！`,
      duration: 2,
    });
  });
  socket.on("sendAll", (msg) => {
    message.info(`来自${msg.user.nickname}的广播:${msg.data}`);
  });
  socket.on("send", (msg) => {
    message.info(`来自${msg.user.nickname}的私聊:${msg.data}`);
  });

  socket.on("Offline", (remark) => {
    logout();
    Modal.info({
      title: "系统管理员使你强制下线了",
      icon: createVNode(CloseCircleOutlined),
      content: `备注信息：${remark}。如有疑问，请联系vx:13140022101`,
    });
  });
};

const allText = ref<string>("");
const singleText = ref<string>("");
function send(to) {
  if (to == "all") {
    if (!allText.value) message.error("请输入要广播的消息");
    else {
      socket.emit("sendAll", allText.value);
      message.success("广播成功！");
      allText.value = "";
    }
  } else {
    if (!singleText.value) message.error("请输入要私聊的消息");
    else {
      socket.emit("send", { data: singleText.value, to });
      message.success("私聊成功！");
      singleText.value = "";
    }
  }
}

const selectUsers = ref<Array>([]);
const remark = ref<string>("");

function Offline() {
  if (!selectUsers.value.length) {
    message.error("还没选择让谁下线呢");
    return;
  }
  socket.emit("Offline", { users: selectUsers.value, remark: remark.value });
  remark.value = "";
}

onMounted(() => {
  loadUser();
  loadTop5User();
  timer.value = setInterval(loadTop5User, 1000 * 10);

  getPokemon().then((res) => {
    pokemonsLen.value = res.data.data;
  });
  ws();
});

onBeforeUnmount(() => {
  timer.value && clearInterval(timer.value);

  socket && socket.disconnect();
});
</script>

<style>
@keyframes shake {
  0% {
    transform: translate(5px, 0);
  }
  25% {
    transform: translate(-5px, 0);
  }
  50% {
    transform: translate(5px, 0);
  }
  75% {
    transform: translate(-5px, 0);
  }
  100% {
    transform: translate(5px, 0);
  }
}
.attacked img {
  animation: shake 0.3s;
  animation-timing-function: ease-in-out;
}
</style>

<style scoped>
:deep(.ant-card-body) {
  padding: 8px !important;
}
</style>
