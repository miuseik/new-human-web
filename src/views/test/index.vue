<template>
  <div class="main-page">
    <div style="display: flex;">
      <div>
        <h3>List 1 {{ list1 }}</h3>
        <draggable v-model="list1" group="shared">
          <template #item="{ element }">
            <div class="draggable-item">
              {{ element.name }}
            </div>
          </template>
        </draggable>
      </div>
      <div>
        <h3>List 2 {{ list2 }}</h3>
        <draggable v-model="list2" group="shared">
          <template #item="{ element }">
            <div class="draggable-item">
              {{ element.name }}
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import draggable from 'vuedraggable';

const list1 = ref([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' }
]);

const list2 = ref([
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
  /* 添加过渡效果 */
  transition: transform 0.2s ease;
}

/* 拖动时的样式 */
.draggable-item.sortable-chosen {
  transform: scale(1.05);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

/* 拖动过程中占位元素的样式 */
.draggable-item.sortable-ghost {
  opacity: 0.5;
}
</style>
