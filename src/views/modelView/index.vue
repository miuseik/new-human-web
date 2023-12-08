<template>
  <div class="new-human">
    <div class="three-class" id="my_three"></div>
    <div class="index-border"></div>
    <div class="ws-res">
      {{ state.res }}
    </div>
    <div class="worktop">
      <div class="buttons">
        <div class="form-button" :plain="true" @click="getSerialList">查找蓝牙</div>
        <div class="form-button" v-if="state.serialList.length>0" :plain="true" @click="confirmSerial">确认蓝牙</div>
      </div>
      <div class="serial-list">
        <el-table :data="state.serialList" style="width: 100%">
          <el-table-column fixed prop="friendlyName" label="friendlyName" width="150"/>
          <el-table-column prop="locationId" label="locationId" width="120"/>
          <el-table-column prop="manufacturer" label="manufacturer" width="120"/>
          <el-table-column prop="path" label="path" width="120"/>
          <el-table-column prop="pnpId" label="pnpId" width="600"/>
          <el-table-column prop="productId" label="productId" width="120"/>
          <el-table-column prop="serialNumber" label="serialNumber" width="120"/>
          <el-table-column prop="vendorId" label="vendorId" width="120"/>
          <el-table-column fixed="right" label="Operations" width="120">
            <template #default="item">
              <el-button link type="primary" size="small" @click="handleClick(item['row'])"
              >Detail
              </el-button
              >
              <el-button link type="primary" size="small">Edit</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--    <div class="model">-->
    <NewHuman @modelAction="modelAction" @sliderInput="sliderInput"></NewHuman>
    <!--    </div>-->
  </div>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import NewHuman from "./components/newHuman/index.vue"

const ipcRenderer = window['electron'] && window['electron'].ipcRenderer

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
  serialList    : [],
  res           : "",
  serialStatus  : "",
  response      : []

});

// 点击按钮时给websocket服务器端发送消息
const setWs = (socket) => {
  $bus['emit']("postWebSocket", socket);
};

const getSerialList = async () => {
  if (window['electron']) {
    state.serialList = await ipcRenderer.invoke('GET_PORT_LIST');
    console.log('serialList=======',state.serialList)
  } else {
    console.log('serialList!!!!!!!!!!!!!!!!!!!!!!!!')
  }
};
const handleClick = itemElement => {

}
const confirmSerial = () => {
  let data = state.queryBluetooth
  state.serialList = []

  // API.newHuman.confirm_serial(data).then(res => {
  //   state.serialStatus = res.data;
  // });
};
const modelAction = (key, eulerData) => {
  let e, name, direction, option
  sliderInput(e, name, direction, option)
};
const sliderInput = (e, name, direction, option) => {
  let val = e
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
  $bus['on']("resWebSocket", (parameter) => {
    state.res = parameter
  })
  if (window['electron']) {
    getSerialList()
  }
})
</script>

<style lang="scss">
.three-class {
  left: 50%;
  transform: translateX(-50%);
  position: absolute;
  height: 100vh;
  overflow: hidden;
  z-index: -12;
}

.new-human {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;

  .ws-res {
    width: 300px;
    overflow: hidden;
    position: fixed;
    top: 1rem;
    left: 50%;
    background-color: rgba(0, 0, 0, .3);
    transform: translateX(-50%);
    z-index: 1;
    font-size: 16px;
  }

  .index-border {
    position: absolute;
    width: 100vw;
    height: 100vh;
    background-image: url("../../assets/img/window/10.png");
    border-image-slice: 180 fill;
    border-image-width: 3rem;
    border-image-source: url("../../assets/img/background/index_com_border.png");
    //background-image: url("../../assets/img/background/first_bg.png");
    background-size: 100vw 100vh;
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
      right: 0;
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

    &:hover {
      .serial-list {
        display: block;
      }
    }
  }

  .model {
    //overflow: hidden;
    //height: 100vh;

    //height: calc(100vh - 3rem);
  }
}


</style>
