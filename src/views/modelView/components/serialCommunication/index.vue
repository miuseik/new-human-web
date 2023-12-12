<script setup lang="ts">
const ipcRenderer = window['electron'] && window['electron'].ipcRenderer
const state = reactive({
  queryBluetooth: {},
  serialList    : [],
});
const getSerialList = async () => {
  if (window['electron']) {
    console.log('getSerialList')
    state.serialList = await ipcRenderer.invoke('GET_PORT_LIST');
    AutoLinkPort()
  } else {
  }
};
const AutoLinkPort = async () => {
  for (let index in state.serialList) {
    let item = state.serialList[index]
    let path = item['path']
    console.log(item)
    state.serialList = await ipcRenderer.invoke('CHECKOUT_POR',path);
  }
};

const handleClick = itemElement => {

}
const confirmSerial = () => {
  let data = state.queryBluetooth
  state.serialList = []
};
onMounted(() => {
    getSerialList()
})
</script>
<template>
  <div class="worktop">
    <div class="buttons">
      <div class="form-button" @click="getSerialList">查找蓝牙</div>
      <div class="form-button" v-if="state.serialList.length>0" @click="confirmSerial">确认蓝牙</div>
    </div>
    <div class="serial-list">
      <input type="check">
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
</template>

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
</style>