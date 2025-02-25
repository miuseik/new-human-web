<template>
  <div class="serial-communication">
    <el-popover
        placement="top-start"
        :width="800"
        trigger="hover"
        content="this is content, this is content, this is content"
    >
      <template #reference>
              <div class="my-button-common" style="padding:0 30px" @click="getSerialList">查找设备</div>
      </template>
      <el-table :data="state.serialList" style="width: 100%">
        <el-table-column v-for="(item,index) in state.showList" :fixed ='index === 0' :prop="item.field" :label="item.field" />
        <el-table-column fixed="right" label="Operations" width="120">
          <template #default>
            <el-button link type="primary" size="small" @click="openPort"
            >Detail</el-button
            >
            <el-button link type="primary" size="small">Edit</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-popover>
    <div class="serial-msg my-card-warp pointer" @click="test()">
      <span>开始</span>
      <template v-for="item in state.checkedSerial">
        <div class="serial-msg-item">
          <div class="serial-msg-input">
            <div class="serial-msg-title">{{ item['path'] }}</div>
            <input type="text" class="input-box" v-model="item['input']">
            <div class="submit pointer" @click="putPortMsg(item)">发送</div>
          </div>
          <div class="serial-msg-msg">
            {{ item['msg'] || '----------' }}
          </div>
        </div>
        <hr>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import bus from "@/utils/Bus.ts";
import getData from "./data/index.js"

const ipcRenderer = window['electron'] && window['electron'].ipcRenderer
const state = reactive({
  queryBluetooth: {},
  serialList: [],
  checkedSerial: {},
  remoteData: {},
  remoteDataTmp: {},
  showList: getData.showList,
  isTest: false
});
const getSerialList = async () => {
  if (window['electron']) {
    state.serialList = await ipcRenderer.invoke('GET_PORT_LIST');
    // AutoLinkPort()
  } else {
  }
};
const AutoLinkPort = async () => {
  for (let index in state.serialList) {
    let item = state.serialList[index]
    let path = item['path']
    state.serialList = await ipcRenderer.invoke('CHECKOUT_POR', path);
  }
};
const openPort = async (item) => {
  let path = item['path']
  let port = await ipcRenderer.invoke('CHECKOUT_POR', path, "control");
  state.checkedSerial[path] = {
    path: path,
    type: 'remote',
    input: '',
    msg: ''
  }
};

const deletePort = async (item) => {
  let path = item['path']
  let port = await ipcRenderer.invoke('CLOSE_PORT', path);
  delete state.checkedSerial[path];
}
const putPortMsg = async (item) => {
  let path = item['path']
  let data = item['input']
  let msg = await ipcRenderer.invoke('SEND_DATA_TO_PORT', path, data);
}

function getRandomLetter() {
  var letters = 'abcdefghijklmnopqrstuvwxyz';
  var randomIndex = Math.floor(Math.random() * letters.length);
  return letters.charAt(randomIndex);
}

let num = 0
const test = async () => {
  console.log('开始')
  state.isTest = !state.isTest
  if (!state.isTest) return;
  var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  for (let i = 0; i < 10; i++) {
    for (let i = 0; i < 10; i++) {
      const loopCount = Math.floor(Math.random() * 26);
      for (let i = 0; i < loopCount; i++) {
        num++
        let json = `${letters[i]}${letters[i]}${num} `
        ipcRenderer.invoke('SEND_DATA_TO_PORT', "COM8", json);
        // console.log(json)
      }
    }
  }
  setTimeout(test, 1);
}
const confirmSerial = () => {
  let data = state.queryBluetooth
  state.serialList = []
};
let s = 0
let n = 0

function animate() {
  let now = new Date();
  let seconds = now.getSeconds();
  if (s !== seconds) {
    s = seconds
    // console.log('s---------------------',s)
    // console.log('n',n)
  }
  state.remoteData = state.remoteDataTmp
  requestAnimationFrame(animate);
}

animate()
onMounted(() => {
  bus.on("baseSliderInput", () => {
    console.log('基本滑块输入')
    const loopCount = Math.floor(Math.random() * 16);
    for (let i = 0; i < loopCount; i++) {
      const num1 = Math.floor(Math.random() * 16);
      const num2 = Math.floor(Math.random() * 60);
      let json = `aa${num2} `
      if (window['electron']) {
        ipcRenderer.invoke('SEND_DATA_TO_PORT', "COM8", json);
      }
    }
  })
  if (window['electron']) {
    ipcRenderer.on('message-from-main', (_, res) => {
      n++
      let data = res.data
      let path = res.path
      let json = JSON.parse(data)
      // bus.emit("multiPanelData", json)
      // let num = json['i']
      state.remoteData[json['i']] = ((json['v'] / 4096) * 100).toFixed(2)
      // state.remoteDataTmp[json['i']] = json['v']
      // state.checkedSerial[path].msg =  data || ''
    });
  }
  getSerialList()
})
</script>

<style scoped lang="scss">
.serial-communication {
  .serial-list {
    width: 100%;
    background-color: rgba(0, 0, 0, .3);
  }
  .serial-msg {
    width: calc(100vw - 500px);
    position: fixed;
    right: 0;
    bottom: 0;
    .serial-msg-item {
      display: flex;
      flex-direction: column;

      .serial-msg-input {
        display: flex;
        flex-direction: row;
        height: 30px;
        line-height: 30px;
        .submit {
          width: 60px;
        }
      }

      .serial-msg-msg {
        height: 40px;
      }
    }
  }
}
</style>