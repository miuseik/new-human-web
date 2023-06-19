<!--// 路径：src/views/home/components/Robot3d/index.vue-->
<template>
  <canvas class="webgl" ref="webgl" id="three_id"></canvas>
</template>
<script lang="ts" setup>

// import BaseManager from "../manager/BaseManager.js";
import BaseManager from "../manager/copy.js";
// import BaseManager from "../manager/copy_action.js";

let base = null;

onMounted(() => {
  let canvas = document.getElementById("three_id");

  base = new BaseManager(canvas);
});

const setRobotRotation = (e, name, direction) => {
  base.setRobotRotation(e, name, direction);
};

const setControlsEnabled = (enabled) => {
  base.setControlsEnabled(enabled);
};

defineExpose({ setRobotRotation, setControlsEnabled });
</script>

<style scscope>
.webgl {
  width: 100%;
  height: 100%;
  outline: none;
}
</style>
