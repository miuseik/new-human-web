<template>
    <div class="echarts-box">
        <!--        <input type="range" id="r2" class="input-box" :value="state.remoteData">-->
        <svg id="clock" viewBox="0 0 100 100" width="30" height="30">
            <circle id="face" cx="50" cy="50" r="45"/> <!-- 钟缅 -->
            <g id="ticks">
                <line x1='50' y1='5.000' x2='50.00' y2='10.00'/>
            </g>
            <line :id="'secondhand'+props.chartId" x1="50" y1="50" x2="50" y2="11"/>
        </svg>
    </div>
</template>

<script setup>
import {
    onMounted,
    onUnmounted
} from "vue";

const props = defineProps({
    modelValue: {
        type   : [String, Number],
        default: 0,
    },
    width     : {
        type   : [String, Number],
        default: 100,
    },
    height    : {
        type   : [String, Number],
        default: 100,
    },
    chartId   : {
        type   : [String, Number],
        default: 100,
    },
    propsData : [String, Number],
    default   : 0,
});
const state = reactive({
    remoteDom : null,
    remoteData: 0,
});

watch(() => props.propsData, val => {
    let value        = val * 1 || 0;
    state.remoteData = value
}, {
    deep     : true,
    immediate: false
})
let i = 0
onMounted(() => {
    let domID       = `secondhand${props.chartId}`
    state.remoteDom = document.getElementById(domID);
    animate()
});
onUnmounted(() => {
});
const setRemote = (r) => {
    state.remoteDom.setAttribute("transform", "rotate(" + r + ",50,50)")
}

function animate() {
    requestAnimationFrame(animate);
    i += 10
    setRemote(i)
}
</script>
<style>
#clock {
    stroke: black;
    stroke-linecap: round;
    fill: #eef;
}

#face {
    stroke-width: 2px;
}

#ticks {
    stroke-width: 2px;
}

#minutehand {
    stroke-width: 2px;
}

#secondhand {
    stroke-width: 1px;
}

#numbers {
    font-family: sans-serif;
    font-size: 7pt;
    font-weight: bold;
    text-anchor: middle;
    stroke: none;
    fill: black;
}
</style>