<template>
  <div class="action-warp">
    <div class="serial-msg my-card-warp pointer flex-row-center-center">
      <div class="login_short_btn" @click="start">{{ isStart ? '停止' : '开始' }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, defineEmits } from 'vue';
import boneStore from '@/store/bone/index.ts';

const isStart = ref(false);
const animateActions = ref([]);
const bone = boneStore();
const emit = defineEmits(['sliderInput', 'modelAction', 'updateBoneList']);

watch(
    () => bone.animateActions,
    (val) => {
      console.log('动作的数据结构', val);
      animateActions.value = val;
    },
    {
      deep: true,
      immediate: false
    }
);

let startTime = null;

function animate(timestamp) {
  if (!isStart.value) return;
  if (startTime === null) {
    startTime = timestamp;
  }
  const elapsedTime = (timestamp - startTime) / 1000; // 转换为秒

  // 找到所有动作数据中的最大时间
  let maxTime = 0;
  for (const action of animateActions.value) {
    const positionData = action.rotate;
    for (const time in positionData) {
      const currentTime = parseFloat(time);
      if (currentTime > maxTime) {
        maxTime = currentTime;
      }
    }
  }

  // 如果当前时间超过了最大时间，重置 startTime 以重新开始动画
  if (elapsedTime > maxTime) {
    startTime = timestamp;
    return animate(timestamp);
  }

  // 遍历每个关节的动作数据
  for (const action of animateActions.value) {
    const positionData = action.position;
    const rotateData = action.rotate;

    // 找到最接近当前时间的时间点
    let closestTime = null;
    let minDifference = Infinity; //最小差异
    for (const time in rotateData) {
      const difference = Math.abs(parseFloat(time) - elapsedTime);
      console.log('difference',difference)
      if (difference < minDifference) {
        minDifference = difference;
        closestTime = time;
      }
    }
    // 打印该时间点的位置和旋转数据
    if (closestTime!== null) {
      emit('modelAction', action.id, rotateData[closestTime]);
    }
  }
  requestAnimationFrame(animate);
}

const start = () => {
  isStart.value =!isStart.value;
  if (isStart.value) {
    startTime = null; // 重置开始时间
    requestAnimationFrame(animate);
  }
};

const sliderInput = (e, name, direction) => {
  emit('sliderInput', e, name, direction);
};

const modelAction = (key, eulerData) => {
  emit('modelAction', key, eulerData);
};
</script>

<style lang="scss" scoped>
.action-warp {
  width: calc(100vw - 500px);
  position: fixed;
  right: 0;
  bottom: 0;
}
</style>