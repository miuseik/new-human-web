<template>
  <div>
    <draggable v-model="list">
      <template #item="{ element }">
        <div class="draggable-item">
          {{ element.name }}
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import draggable from 'vuedraggable';

const list = ref([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
  { id: 4, name: 'Item 4' },
  { id: 5, name: 'Item 5' }
]);
</script>

<style scoped>
.draggable-item {
  width: 200px;
  height: 50px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  margin: 10px;
  padding: 10px;
  text-align: center;
  cursor: move;
}
</style>
