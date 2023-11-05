<template>
  <div id="showTime">{{ state.showTime }}</div>
  <button id="startBn" @click="clickHandler">{{ state.startBn }}</button>
  <button id="restBn" @click="clickHandler">复位</button>
</template>
<script setup lang='ts'>
const state = reactive({
  time     : '',
  showTime : '00:00:00',
  startBn  : "启动",
  restBn   : '',
  pauseDate: '',
  bool: false,
  pauseTime: 0,
})
// function init() {
  setInterval(animation, 1);
// }
// init();

function animation() {
  if (!state.bool) return;
  //前时间减去上次开启时间减去暂停累计时间
  var times = new Date().getTime() - state.time - state.pauseTime;
  var minutes = Math.floor(times / 60000);//毫秒转化为分钟
  var seconds = Math.floor((times - minutes * 60000) / 1000);//已知分钟
  console.log(times)

  // 将time减去分钟 除去1000得出 秒
  var ms = Math.floor((times - minutes * 60000 - seconds * 1000) / 10);//
  state.showTime =
      (minutes < 10 ? "0" + minutes : minutes) + ":"
      + (seconds < 10 ? "0" + seconds : seconds) + ":"
      + (ms < 10 ? "0" + ms : ms);
}
//点击时的事件
function clickHandler(e) {
  if (!state.bool) {
    state.bool = !state.bool;
    if (state.bool) {
      state.startBn = "暂停";
      state.pauseTime += (!state.pauseDate ? 0 : new Date().getTime() - state.pauseDate);
      if (state.time) return;
      state.time = new Date().getTime();
      return;//是为bool判断跳出
    }
    state.startBn = "启动";
    state.pauseDate = new Date().getTime();
    return;
  }
  state.pauseTime = 0;
  state.pauseDate = null;
  state.bool = false;
  state.time = 0;
  state.showTime = "00:00:00";
}

</script>
<style lang="scss" scoped>
#showTime {
  width: 300px;
  height: 60px;
  font-size: 60px;
  line-height: 60px;
}
</style>
