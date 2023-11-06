<template>
  <div class="common-layout">
    <div class="three-class" id="my_three"></div>
  </div>
</template>
<script setup>

import mixins from "@/mixin/myThree";
let {initThree} = mixins();
onMounted(() => {
  initThree();
});

</script>

<style lang="scss">
.three-class {
  left: 50%;
  transform: translateX(-50%);
  position: absolute;
  height: 20rem;
  overflow: hidden;
  z-index: -12;
}

</style>



