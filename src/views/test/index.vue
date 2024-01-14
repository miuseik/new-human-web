<template>
</template>

<script setup>
import Worker from "@/worker/index.js?worker";
let worker = new Worker();
worker.postMessage({ type: 'init' });
onMounted(() => {
    worker.onmessage = (e) => {

    }
})

</script>

<style>

</style>
