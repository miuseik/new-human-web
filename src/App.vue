<script setup lang="ts">
import { ElMessage } from 'element-plus';

import env from "@/env/moudules/env.js";
const bus = inject('$bus')
let ws;
const linkWs = () => {
  ws = new WebSocket(env.WS_URL);
  ws.addEventListener("open", function (event) {
    ws.send("hello");
  });
  ws.addEventListener("message", function (event) {

      bus.emit('resWebSocket', event.data)
  });
  ws.onclose = function () {
    ElMessage({
      showClose: true,
      message: '连接已关闭 ...',
      type: 'warning',
    });
  };
};
linkWs()

const setWs = (socket) => {

  ws.send(socket);
};
onMounted(() => {
  bus.on("postWebSocket", (parameter) => {
    setWs(parameter);
  })
})
</script>

<template>
  <router-view></router-view>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
