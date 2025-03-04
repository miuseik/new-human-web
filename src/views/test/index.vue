<template>
  <div>
    <ul>

    </ul>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import modelViewData from '@/views/modelView/data/index.js'
// 定义接收的 props
 defineProps({
  animateAction: {
    type: Object,
  }
});

// 处理关节名称的函数
const getJointName = (name) => {
  // 处理点分隔的情况
  let jointName = name.split('.')[0];
  // 处理路径分隔的情况，如 root/bone1
  jointName = jointName.split('/').pop();
  // 处理命名空间或前缀的情况，如 model_1:boneName
  jointName = jointName.split(':').pop();
  // 处理编号的情况，如 bone_01
  jointName = jointName.replace(/_\d+$/, '');

  let demo = {
    uointName: '髋关节',
    motionType: '移动',
    actionData: {
      0: [ 0.00047304187319241464,  0.08762151747941971,  -0.04123074188828468,  0.9953001141548157,],
      0.03333333507180214:[ 0.008556477725505829,  0.07383628934621811,  -0.03188781812787056,  0.9967237114906311,]
    }
  }
  // 根据英文关节名称查找对应的中文名称
  return modelViewData.boneName[jointName] || jointName;
};

// 处理运动类型的函数
const getMotionType = (name) => {
  if (name.includes('.position')) {
    return '位置';
  } else if (name.includes('.rotation')) {
    return '旋转';
  } else if (name.includes('.scale')) {
    return '缩放';
  } else if (name.includes('.quaternion')) {
    return '四元数';
  }
  return '未知';
};
</script>

<style scoped>
h2 {
  text-align: center;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px 0;
}
</style>
