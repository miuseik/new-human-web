<script setup lang="ts">
import mixins from "@/components/threeBackground/index.js";
import InkWash from "@/utils/effects/InkWash/index.vue";
// import env from "./env/moudules/env.js";

let {initThree} = mixins();

// import { ElMessage } from 'element-plus';

// import env from "@/env/moudules/env.js";
const bus = inject('$bus')
// console.log(env)
// let ws;
// const linkWs = () => {
//   ws = new WebSocket(env.WS_URL);
//   ws.addEventListener("open", function (event) {
//     ws.send("hello");
//   });
//   ws.addEventListener("message", function (event) {
//
//       bus.emit('resWebSocket', event.data)
//   });
//   ws.onclose = function () {
//     ElMessage({
//       showClose: true,
//       message: '连接已关闭 ...',
//       type: 'warning',
//     });
//   };
// };
// linkWs()

// const setWs = (socket) => {
//
//   ws.send(socket);
// };
console.log(process.env)

onMounted(() => {
  initThree();

  // bus.on("postWebSocket", (parameter) => {
  //   setWs(parameter);
  // })
})
</script>

<template>
  <div class="three-class" id="my_three"></div>
  <InkWash class="ink-wash"></InkWash>
  <router-view class="prohibit-selection"></router-view>
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
.ink-wash{
  position: fixed;
  width: 100%;
  height: 100%;

}

</style>
