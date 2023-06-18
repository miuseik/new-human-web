<template>
  <router-view></router-view>

  <div class="blues">
    <div class="buttons">
      <el-button :plain="true" @click="setWs">按钮</el-button>
      <el-button :plain="true" @click="linkWs">linkWs启动ws</el-button>
      <el-button :plain="true" @click="setApi">查找串口</el-button>
      <el-button :plain="true" @click="confirmSerial">确认串口</el-button>
    </div>
    <input v-model="state.socket" type="text" name="" id="demo"/>
    <div id="res">
      <p></p>
    </div>
    <div>
      <p>{{ state.res }}</p>
    </div>
    <div class="serial-list">
      <label v-for="item in state.serialList">
        <input type="radio" v-model="state.queryBluetooth" :value="item" name="serialList">{{ item['path'] }}
      </label>
    </div>
  </div>
  <div class="circular-warp">
    <div id="servo_l" class="circular"></div>
    <div id="servo_r" class="circular"></div>
  </div>
</template>

<script lang="ts" setup>

import {useRouter} from "vue-router";

const router = useRouter();
import API from "@/api";
import newHuman from "../../api/moudules/newHuman";


const state = reactive({
  url: "ws://127.0.0.1:",
  port: "3002",
  socket: "",
  messages: [],
  queryBluetooth: {},
  serialList: "",
  res: "",
  serialStatus: "",
});

// 点击按钮时给websocket服务器端发送消息
let ws: any;
const setWs = (socket) => {
  ws.send(socket);
};
const linkWs = () => {
  ws = new WebSocket(state.url + state.port);
  ws.addEventListener("open", function (event) {
    ws.send("hello");
    state.res = "当前客户端已经连接到websocket服务器";
  });
  // 接收消息后客户端处理方法
  ws.addEventListener("message", function (event) {
    state.socket = "------------" + event.data;
  });
// 关闭websocket
  ws.onclose = function () {
    // 关闭 websocket
    console.log("连接已关闭...");
  };
};
const setApi = () => {
  API.newHuman.query_bluetooth().then(res => {
    state.serialList = res.data;
  });
};
const confirmSerial = () => {
  // let path = state.queryBluetooth &&  state.queryBluetooth.path || '';
  let data = {
    // path: path,
    port: state.port,
  };
  API.newHuman.confirm_serial(data).then(res => {
    console.log(res);
    state.serialStatus = res.data;
  });
};


//////////
//////////npm
//////////

// const created = () => {
//   var userAgent = navigator.userAgent.toLowerCase();
//   if (userAgent.indexOf(" electron/") > -1) {
//     selectBluetooth();
//     bluetoothPairingRequest();
//   }
// };
//
// created();
const toTest = () => {
  console.log("跳转测试");
  router.push({
    path: "/test",
  });
};

onMounted(() => {
  var servo_l = document.getElementById("servo_l");
  servo_l.onmousemove = function (event) {
    let offsetX = event['offsetX'] || ''
    let offsetY = event['offsetY'] || ''
    let stock = {
      x: offsetX,
      y: offsetY
    }
    setWs(`a${offsetX}`)
    setWs(`b${offsetY}`)
  }
  var servo_r = document.getElementById("servo_r");
  servo_r.onmousemove = function (event) {
    let offsetX = event['offsetX'] || ''
    let offsetY = event['offsetY'] || ''
    let stock = {
      x: offsetX,
      y: offsetY
    }
    setWs(`c${offsetX}`)
    setWs(`d${offsetY}`)
  }
})
</script>

<style lang="scss">
#app {
  padding: .1rem;
}

input {
  height: 2rem;
}

.serial-list {
  display: flex;
  flex-direction: column;
}

.circular-warp {
  display: flex;

  .circular {
    cursor: move;
    height: 600px;
    width: 600px;
    border-radius: 50%;
    border: #00fcff solid 2px;
  }
}

</style>
