<template>
  <div class="new-human">
    <div class="ws-res">
      {{ state.res }}
    </div>
    <div class="worktop">
      <div class="buttons">
        <el-button :plain="true" @click="getSerialList">查找蓝牙</el-button>
        <el-button v-if="state.serialList.length>0" :plain="true" @click="confirmSerial">确认蓝牙</el-button>
      </div>
      <div class="serial-list">
        <template v-for="(item, index) in state.serialList">
          <label class="serial-item">
            <input class="input-radio" type="radio" v-model="state.queryBluetooth" :value="item"
                   name="serialList">{{ item }}
          </label>
        </template>
      </div>
      <!--      </div>-->
    </div>
    <div class="model">
      <NewHuman @sliderInput="sliderInput"></NewHuman>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import NewHuman from '@/components/newHuman/index.vue'

const router = useRouter();
import API from "@/api";
// const bus = inject('bus')
const $bus = inject('$bus')

const state = reactive({
  url           : "ws://127.0.0.1:",
  port          : "3002",
  socket        : "",
  messages      : [],
  queryBluetooth: {},
  serialList    : "",
  res           : "",
  serialStatus  : "",
});

// 点击按钮时给websocket服务器端发送消息
const setWs = (socket) => {
  $bus.emit("postWebSocket", socket);
};


const getSerialList = () => {
  API.newHuman.query_bluetooth().then(res => {
    state.serialList = res.data;
  });
};
getSerialList()
const confirmSerial = () => {
  let data = state.queryBluetooth
  state.serialList = []
  API.newHuman.confirm_serial(data).then(res => {
    state.serialStatus = res.data;
  });
};

const sliderInput = (e, name, direction, option) => {
  let val = e * 100
  let str_val = val.toFixed(0)
  let data = {
    name     : name,
    direction: direction,
    val      : str_val,
    option   : option
  }
  setWs(JSON.stringify(data))
};

onMounted(() => {
  $bus.on("resWebSocket", (parameter) => {
    state.res = parameter
  })
})
</script>

<style lang="scss">
.new-human {
  display: flex;
  flex-direction: column;

  .ws-res {
    width: 300px;
    overflow: hidden;
    position: fixed;
    top: 1rem;
    left: 50%;
    background-color: rgba(0, 0, 0, .3);
    transform: translateX(-50%);
    z-index: 1;

  }

  .worktop {
    position: fixed;
    max-width: 15rem;
    height: 32px;
    z-index: 1;
    right: 0;
    display: flex;
    flex-direction: column;
    background-color: rgba(0, 0, 0, .3);
    .buttons {
      display: flex;
      justify-content: right;
      flex-direction: row;
      flex-wrap: nowrap;
    }

    .serial-list {
      position: absolute;
      top: 30px;
      background-color: rgba(0, 0, 0, .3);
      display: none;
      .serial-item {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;

        .input-radio {
          width: 20px;
          flex-shrink: 0;
        }
      }
    }
    &:hover{
      .serial-list {
        display: block;
      }
    }
  }

  .model {
    overflow: hidden;
    height: 100vh;
    //height: calc(100vh - 3rem);
  }
}


</style>
