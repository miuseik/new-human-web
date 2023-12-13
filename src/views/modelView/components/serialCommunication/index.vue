<template>
  <div class="worktop">
    <div class="buttons">
      <input type="text" value="">
      <!--      <div class="form-button" @click="putPortMsg">发送消息</div>-->
      <div class="form-button" @click="getSerialList">查找蓝牙</div>
      <!--      <div class="form-button" v-if="state.serialList.length>0" @click="confirmSerial">确认蓝牙</div>-->
    </div>
    <div class="serial-list">
      <!--      <my-table></my-table>-->
      <div class="my-table serial-table card-warp">
        <table>
          <tr>
            <td :style="{width:`${item.width}px`,'max-width':`${item.width}px`}" v-for="(item,index) in state.showList">
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
                <el-button link type="primary" size="small" @click="deletePort(group)">delete</el-button>
                <el-button link type="primary" size="small" @click="openPort(group)">Edit</el-button>
              </template>
            </td>
          </tr>
        </table>
      </div>
    </div>

    <div class="serial-msg card-warp">
      <template v-for="(item,index) in state.checkedSerial">
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
import myTable from '@/components/public/table.vue'
import Table from "@/components/public/table.vue";

const ipcRenderer = window['electron'] && window['electron'].ipcRenderer
const state = reactive({
  queryBluetooth: {},
  serialList: [],
  checkedSerial: {},
  showList: [
    {
      field: 'path',
      width: '10',
    },
    {
      field: 'friendlyName',
      width: '10',
    },
    {
      field: 'locationId',
      width: '10',
    },
    {
      field: 'manufacturer',
      width: '10',
    },

    // {
    //   field: 'pnpId',
    //   width: '10',
    // },
    {
      field: 'productId',
      width: '10',
    },
    {
      field: 'serialNumber',
      width: '10',
    },
    {
      field: 'vendorId',
      width: '10',
    },
    {
      field: 'Operations',
      width: '10',
    },
    {
      field: 'option',
      width: '100',
    }
  ]
});
const portMsg = ref()
const 已连接的串口 = ref()
const getSerialList = async () => {
  if (window['electron']) {
    state.serialList = await ipcRenderer.invoke('GET_PORT_LIST');
    // AutoLinkPort()
    console.log(state.serialList)
  } else {
  }
};
const AutoLinkPort = async () => {
  for (let index in state.serialList) {
    let item = state.serialList[index]
    let path = item['path']
    console.log(item)
    state.serialList = await ipcRenderer.invoke('CHECKOUT_POR', path);
  }
};
const openPort = async (item) => {
  let path = item['path']
  console.log(item)
  let port = await ipcRenderer.invoke('CHECKOUT_POR', path, "control");
  state.checkedSerial[path]={
      path: path,
      type: 'remote',
      input: '',
      msg: ''
  }
  console.log(state.checkedSerial)
};

const deletePort = async (item) => {
  let path = item['path']
  let port = await ipcRenderer.invoke('CLOSE_PORT', path);
  delete state.checkedSerial[path];
  console.log(state.checkedSerial)
}
const putPortMsg = async (item) => {
  let path = item['path']
  let data = item['input']
  let msg = await ipcRenderer.invoke('SEND_DATA_TO_PORT', path, data);
  console.log('msg=====', msg)
}
const confirmSerial = () => {
  let data = state.queryBluetooth
  state.serialList = []
};
onMounted(() => {
  ipcRenderer.on('message-from-main', (event, res) => {
    state.checkedSerial[res.path].msg = res.data
    console.log('===主进程获取的串口信息==',  res)
  });
  getSerialList()
})
</script>

<style scoped lang="scss">
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