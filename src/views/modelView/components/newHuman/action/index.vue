<template>
  <div class="action-warp" >
    <div class="serial-msg my-card-warp pointer flex-row-center-center">
      <div class="login_short_btn" @click="start" >{{isStart?'停止' :'开始'}}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, defineEmits } from 'vue';
import boneStore from '@/store/bone/index.ts';

const isStart = ref(false);
const animateActions = ref({});
const bone = boneStore();
const emit = defineEmits(["sliderInput", "modelAction", "updateBoneList"]);

watch(() => bone.animateActions, (val) => {
  console.log('动作的数据结构', val)
  // 动作的数据结构
  // const val = [
  //   {
  //     actionData: {
  //       0: [0.6137886047363281, 101.67965698242188, 1.3260784149169922],
  //       0.5: [5.097713470458984, 101.7661361694336, 86.972900390625],
  //       // ... 其他时间点和值
  //     },
  //     jointName: "髋关节",
  //     motionType: "移动"
  //   },
  //   {
  //     actionData: {
  //       0: [0.00047304187319241464, 0.08762151747941971, -0.04123074188828468, 0.9953001141548157],
  //       0.5: [0.007993373088538647, -0.023453708738088608, 0.052337221801280975, 0.9983220100402832],
  //       // ... 其他时间点和值
  //     },
  //     jointName: "髋关节",
  //     motionType: "旋转"
  //   }
  // ];
  animateActions.value = val;
}, {
  deep: true,
  immediate: false
});

let startTime = null;

function animate(timestamp) {
  console.log(timestamp);
  if (!isStart.value) return;
  if (startTime === null) {
    startTime = timestamp;
  }

  const elapsedTime = (timestamp - startTime) / 1000; // 转换为秒

  // 遍历所有动作
  console.log('遍历所有动作.value', animateActions.value)
  for (const action of animateActions.value) {
    const actionData = action.actionData;
    const timePoints = Object.keys(actionData).map(Number).sort((a, b) => a - b);

    // 找到当前时间点对应的索引
    let currentIndex = 0;
    for (let i = 0; i < timePoints.length - 1; i++) {
      if (elapsedTime >= timePoints[i] && elapsedTime < timePoints[i + 1]) {
        currentIndex = i;
        break;
      }
    }

    const currentTimePoint = timePoints[currentIndex];
    const currentData = actionData[currentTimePoint];

    console.log(`关节名称: ${action.jointName}`);
    console.log(`运动类型: ${action.motionType}`);
    console.log(`当前时间点: ${currentTimePoint}`);
    console.log(`当前空间数据: ${currentData}`);
  }

  requestAnimationFrame(animate);
}

const start = () => {
  isStart.value = !isStart.value;
  if (isStart.value) {
    startTime = null; // 重置开始时间
    requestAnimationFrame(animate);
  }
};

const sliderInput = (e, name, direction) => {
  emit("sliderInput", e, name, direction);
};

const modelAction = (key, eulerData) => {
  emit("modelAction", key, eulerData);
};
</script>

<style lang="scss" scoped>
.action-warp{
  width: calc(100vw - 500px);
  position: fixed;
  right: 0;
  bottom: 0;
}
</style>