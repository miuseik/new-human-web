<template>
  <InkWash class="ink-wash"></InkWash>
</template>

<script setup lang="ts">
import InkWash from "src/utils/effects/InkWash/index.vue";

import {ref, reactive, watch, onMounted, onBeforeUnmount} from "vue";
const state = reactive({
});
onMounted(() => {

})

</script>

<style lang="scss" scoped>
.ink-wash{
  //background-color: #00ffd9;
  position: fixed;
  width: 100%;
  height: 100%;
  //top: 0;
  //left: 0;
}
</style>
