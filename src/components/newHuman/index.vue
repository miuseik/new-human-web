<!--// 路径：src/views/home/components/Robot3d/index.vue-->
<template>
  <div class="three-box">
    <div class="menu">
      <Menu @sliderInput="sliderInput" @switchChange="switchChange"/>
    </div>
    <canvas class="webgl" ref="webgl" id="three_id"></canvas>
  </div>
</template>
<script lang="ts" setup>
import myThree from "./index.js";
import Menu from "./Menu/index.vue";
let base = null;
import {bores} from '@/store/bores/index'
onMounted(() => {
  let dom = document.getElementById("three_id");
  base = new myThree(dom);
});
const sliderInput = (e, name, direction) => {
  base.setRobotRotation(e, name, direction);
};
const switchChange = (enabled) => {
  base.setControlsEnabled(enabled);
};
// defineExpose({ setRobotRotation, setControlsEnabled });
</script>

<style lang="scss" scscope>
.three-box {
  display: flex;
  height: 100%;
  position: relative;
  .menu {
    background-color: rgba(0,0,0,.2);
    position: absolute;
    width: 15rem;
    flex-shrink: 0;
    color: #fff;
    font-size: .7rem;
  }

  .webgl {
  }
}
</style>
