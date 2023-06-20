<!--// 路径：src/views/home/components/Menu/index.vue-->
<template>
  <el-scrollbar height="100%">
    <div class="slider-block">
      <div class="slider-item">
        <span class="demonstration">鼠标视角控制器</span>
        <el-switch v-model="mouseValue" @change="switchChange"/>
      </div>
      <div>
        <button class="btn btn-brand" @click="newBores()">新增一条</button>
        <button class="btn btn-brand" @click="state.showAll = !state.showAll">{{state.showAll? '控制模式': '全部模型'}}</button>
      </div>
      <div>
        <template v-for="item in state.boresList ">
          <div class="bores-item">
            <div class="item-data">
              <template v-for="grid in item ">
                <input type="text" >
                {{grid.toString() || '--'}}
<!--                <input type="text" v>-->
              </template>
            </div>
            <div class="operate" v-if="state.currentChange.includes(item.id)">
              <button class="btn btn-success" @click="saveChange(item)">保存</button>
              <button class="btn btn-info" @click="state.currentChange = 0">取消</button>
              <button class="btn btn-danger" @click="state.currentChange = 0">删除</button>
            </div>
            <div  class="operate" v-else>
              <button class="btn btn-warning" @click="setItem(item)">修改</button>
            </div>
          </div>
        </template>
      </div>
      <div class="slider-item">
        <span class="demonstration">关节一（绕Y轴旋转）</span>
        <el-slider
            v-model="value1"
            show-input
            :min="min"
            :max="max"
            :step="0.01"
            @input="sliderInput($event, 'D1', 'y')"
        />
      </div>
      <div class="slider-item">
        <span class="demonstration">关节二（绕X轴旋转）</span>
        <el-slider
            v-model="value2"
            show-input
            :min="min"
            :max="max"
            :step="0.01"
            @input="sliderInput($event, 'D2', 'x')"
        />
      </div>
      <div class="slider-item">
        <span class="demonstration">关节二（绕Y轴旋转）</span>
        <el-slider
            v-model="value2"
            show-input
            :min="min"
            :max="max"
            :step="0.01"
            @input="sliderInput($event, 'D2', 'y')"
        />
      </div>
      <div class="slider-item">
        <span class="demonstration">关节二（绕Z轴旋转）</span>
        <el-slider
            v-model="value2"
            show-input
            :min="min"
            :max="max"
            :step="0.01"
            @input="sliderInput($event, 'D2', 'z')"
        />
      </div>
      <div class="slider-item">
        <span class="demonstration">关节三（绕X轴旋转）</span>
        <el-slider
            v-model="value3"
            show-input
            :min="min"
            :max="max"
            :step="0.01"
            @input="sliderInput($event, 'D3', 'x')"
        />
      </div>
      <div class="slider-item">
        <span class="demonstration">关节四（绕Z轴旋转）</span>
        <el-slider
            v-model="value4"
            show-input
            :min="min"
            :max="max"
            :step="0.01"
            @input="sliderInput($event, 'D4', 'z')"
        />
      </div>
      <div class="slider-item">
        <p class="demonstration">关节五</p>
        <span class="demonstration">绕x轴旋转</span>
        <el-slider
            v-model="value5_1"
            show-input
            :min="min"
            :max="max"
            :step="0.01"
            @input="sliderInput($event, 'D5', 'x')"
        />
        <span class="demonstration">绕y轴旋转</span>
        <el-slider
            v-model="value5_2"
            show-input
            :min="min"
            :max="max"
            :step="0.01"
            @input="sliderInput($event, 'D5', 'y')"
        />
        <span class="demonstration">绕Z轴旋转</span>
        <el-slider
            v-model="value5_3"
            show-input
            :min="min"
            :max="max"
            :step="0.01"
            @input="sliderInput($event, 'D5', 'z')"
        />
      </div>
    </div>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import API from "@/api";

const state = reactive({
  boresList: [],
  currentChange: [],
  showAll: false,
  newId:0,
  itemTpl: {
    id: 0,
    field: '',
    name: '',
    size: '',
    position: '',
    rotate: '',
    type: '',
    parent: '',
  }
})
const mouseValue = ref(true);
const value1 = ref(0);
const value2 = ref(0);
const value3 = ref(0);
const value4 = ref(0);

const value5_1 = ref(0);
const value5_2 = ref(0);
const value5_3 = ref(0);

const min = ref(Number(-Math.PI.toFixed(2)));
const max = ref(Number(Math.PI.toFixed(2)));
const emit = defineEmits(["sliderInput", "switchChange"]);
API.bores.list().then((res) => {
  state.boresList = res.data
})
const sliderInput = (e, name, direction) => {
  emit("sliderInput", e, name, direction);
};

const switchChange = (e) => {
  emit("switchChange", e);
};
const setItem = (item) => {
  state.currentChange = item.id
};
const saveChange = (item) => {
  state.currentChange = 0
};
const newBores = (item) => {
  let data = {
    id: state.newId--,
    field: '',
    name: '',
    size: '',
    position: '',
    rotate: '',
    type: '',
    parent: '',
  }
  state.boresList.push(data)
  console.log(data)
  state.currentChange.push(data.id)
};
</script>

<style scope>
.slider-block {
  padding: 20px 10px;
}

.slider-item {
  margin: 20px 0;
}

.demonstration {
  margin: 0 10px 10px 0;
}
</style>

