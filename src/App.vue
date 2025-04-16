<script setup lang="ts">
import mixins from "@/components/threeBackground/index.js";
import inkWash from "@/utils/effects/InkWash/index.vue";
import storage from "store2";
import bus from "@/utils/Bus";

let {initThree} = mixins();
const getBrowser = () => {
  const userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  //判断是否Opera浏览器
  if (userAgent.indexOf("Opera") > -1) {
    return "Opera"
  }
  if (userAgent.indexOf("Edg") > -1) {
    return 'Edge'
  }
  if (userAgent.indexOf("Firefox") > -1) {
    return "firefox";
  }
  if (userAgent.indexOf("Chrome") > -1) {
    return "Chrome";
  }
  if (userAgent.indexOf("Safari") > -1) {
    return "Safari";
  }
  if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1) {
    return "IE";
  }
  if (userAgent.indexOf("Trident") > -1) {
    return "IE";
  }
}
const getKeyboard = (event) => {
  bus.emit("keyboardEvent", event.key)
  console.log('event.key====', event.key)
  if (event.key === 'Enter') {
    console.log()
  }
}
onMounted(() => {
  // initThree();
  if (window && window['electron']) {
    storage.set('currentBrowser', 'electron');
  } else {
    storage.set('currentBrowser', getBrowser());
  }
  // window.addEventListener('keydown', getKeyboard);
})
</script>
<template>
  <div class="three-class" id="my_three"/>
<!--  <ink-wash class="ink-wash"/>-->
  <router-view class="prohibit-selection"/>
</template>
<style scoped>
.three-class {
  left: 50%;
  transform: translateX(-50%);
  position: absolute;
  height: 100vh;
  overflow: hidden;
  z-index: -12;
}

.ink-wash {
  position: fixed;
  width: 100%;
  height: 100%;
}
</style>
