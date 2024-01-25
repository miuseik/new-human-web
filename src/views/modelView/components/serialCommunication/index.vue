<template>
  <div class="serial-communication">
    <div class="buttons">
      <input type="text" value="">
      <div class="my-button-common" @click="getSerialList">查找设备</div>
    </div>
    <div class="serial-list">
      <div class="my-table serial-table my-card-warp">
        <table>
          <tr>
            <td :style="{width:`${item.width}px`,'max-width':`${item.width}px`}"
                v-for="(item,index) in state.showList">
              {{ item.field }}
            </td>
          </tr>
          <tr v-for="(group,bar) in state.serialList">
            <td v-for="(item,index) in state.showList">
              <template v-if="item.field !== 'option'">
                {{ group[item.field] }}
              </template>
              <template v-if="item.field === 'option'">
                {{ group[item.field] }}
                <el-button link type="primary" size="small" @click="deletePort(group)">delete
                </el-button>
                <el-button link type="primary" size="small" @click="openPort(group)">Edit</el-button>
              </template>
            </td>
          </tr>
        </table>
      </div>
    </div>
<!--    <div class="multi-panel-box my-card-warp">-->
<!--      <div v-for="(item,index) in 400">-->
<!--        <bar-graph :props-data="state.remoteData[index]" :chart-id=index :width="'200px'" :height="'200px'"></bar-graph>-->
<!--      </div>-->
<!--    </div>-->
    <div class="serial-msg my-card-warp">
      <button style="color: aliceblue" @click="test()">开始</button>
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
import BarGraph from "@/components/echart/multiPanel.vue";
import getData from "./data/index.js"
// import setAngleWorker from "@/workers/setAngle.js"

const ipcRenderer = window['electron'] && window['electron'].ipcRenderer
const state = reactive({
  queryBluetooth: {},
  serialList    : [],
  checkedSerial : {},
  remoteData: {},
  remoteDataTmp: {},
  showList      : getData.showList,
  isTest        : false
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
    path : path,
    type : 'remote',
    input: '',
    msg  : ''
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
    console.log('s---------------------',s)
    console.log('n',n)
  }
  state.remoteData = state.remoteDataTmp
  requestAnimationFrame(animate);
}
animate()
onMounted(() => {
  bus.on("baseSliderInput", () => {
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

  max-width: 150px;
  height: 32px;

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
    right: 0;
    background-color: rgba(0, 0, 0, .3);
    display: none;

    .my-table {
      table {
        overflow: hidden;
        border-collapse: collapse; /* 合并边框 */
        //border-width: 1px; /* 边框宽度 */
        //border-style: solid; /* 边框样式 */
        //border-color: #ccc; /* 边框颜色 */
        min-width: 500px; /* 设置表格最小宽度 */
        //border: 1px red solid;
      }

      tr:nth-child(odd) { /* 奇数行 */
        //background-color: #f9f9f9;
      }

      tr:nth-child(even) { /* 偶数行 */
        //background-color: #fff;
      }

      td {
        white-space: nowrap; /* 防止单元格文本换行 */
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 超出部分用省略号表示 */
        word-break: break-all; /* 单词过长自动换行 */
      }

      caption {
        font-size: 16px; /* 字号设置 */
        font-weight: bold; /* 加粗 */
        text-align: left; /* 居左 */
      }

      th {
        //background-color: #ccc; /* 表头背景色 */
        text-align: center; /* 居中对齐 */
      }

      td:hover {
        //background-color: #ffff99; /* 鼠标移上去背景色 */
      }
    }

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

  &:hover {
    .serial-list {
      display: block;
    }
  }

  .multi-panel-box {
    width: calc(100vw - 500px);
    position: fixed;
    right: 0;
    bottom: 150px;
    display: flex;
    flex-wrap: wrap;

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

        .serial-msg-title {
        }

        .input-box {
        }

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