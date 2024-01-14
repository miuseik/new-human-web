<template>
    <div class="new-human">
        <div class="index-border"></div>
        <serial-communication class="serial-communication"></serial-communication>
        <new-human></new-human>
        <action-library class="action-library"></action-library>
    </div>
</template>

<script setup lang="ts">
import serialCommunication from "./components/serialCommunication/index.vue"
import newHuman from "./components/newHuman/index.vue"
import actionLibrary from "./components/actionLibrary/index.vue"
</script>

<style lang="scss">
.three-class {
    left: 50%;
    transform: translateX(-50%);
    position: absolute;
    height: 100vh;
    overflow: hidden;
    z-index: -12;
}
.serial-communication{
    position: fixed;
    z-index: 1;
    right: 0;
}
.action-library{
    position: fixed;
    z-index: 1;
    left: 500px;
}
.new-human {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;

    .index-border {
        position: absolute;
        width: 100vw;
        height: 100vh;
        background-image: url("../../assets/img/window/10.png");
        border-image-slice: 180 fill;
        border-image-width: 3rem;
        border-image-source: url("../../assets/img/background/index_com_border.png");
        //background-image: url("../../assets/img/background/first_bg.png");
        background-size: 100vw 100vh;
    }
}


</style>
