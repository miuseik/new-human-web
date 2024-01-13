<template>
</template>

<script setup>
import Worker from "@/workers/worker.js?worker";
let worker = new Worker();
worker.postMessage({ type: 'init', planePoints });
onMounted(() => {
    worker.onmessage = (e) => {

    }
})

</script>

<style>

</style>
