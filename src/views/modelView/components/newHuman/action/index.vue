<template>
  <div class="action">
    <div class="option">
      <div class="btn btn-success">添加动作</div>
    </div>
    <div class="action-list">
    </div>
  </div>
  <div class="set-action">
    <div class="option">
      <div class="btn btn-success">保存</div>
      <div class="btn btn-danger">取消</div>
    </div>
    <div class="set-action-box">
      <slider @modelAction = "modelAction" @sliderInput="sliderInput" :current-action="state.currentAction"></slider>
    </div>
  </div>
</template>
<script lang="ts" setup>
import slider from '../slider/index.vue'

import debounce from "@/utils/putlic/index.js";

const emit = defineEmits(["sliderInput", "modelAction", "updateBoneList"]);
const props = defineProps({
  currentAction     : {
    type   : [String, Number],
    default: 0,
  },
});
const state = reactive({
  currentAction: ''

});
const times = () => {

}

const sliderInput = (e, name, direction) => {
  emit("sliderInput", e, name, direction);
};
const modelAction = (key, eulerData) => {
  emit("modelAction", key, eulerData);
};
</script>

<style lang="scss" scoped>
.action {
  background-color: rgba(0, 0, 0, .2);
  position: absolute;
  width: calc(100vw - 500px);
  height: 80vh;
  right: 0;
  flex-shrink: 0;
  overflow: hidden;
  color: #fff;
  font-size: .7rem;
}

.set-action {
  background-color: rgba(0, 0, 0, .2);
  border-top: #2DC3FE solid 1px;
  position: absolute;
  width: 100%;
  height: 20vh;
  padding: 10px;
  bottom: 0;
  flex-shrink: 0;
  overflow: hidden;
  color: #fff;
  font-size: .7rem;
  .set-action-box {
    width: calc(100vw - 500px);
  }
}
</style>