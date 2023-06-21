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
        <button class="btn btn-brand" @click="state.showAll = !state.showAll">
          {{
            state.showAll ?
                '控制模式' :
                '全部模型'
          }}
        </button>
      </div>
      <div class="list-warp">
        <template v-for="(item, index) in state.boresList ">
          <div class="bores-item">
            <div class="item-data">
              <div class="operate" v-if="state.currentChange.includes(item.id)">
                <button class="btn btn-success" @click="saveChange(item)">保存</button>
                <button class="btn btn-info" @click="filterId(item.id)">取消</button>
                <button class="btn btn-danger" @click="deleteItem(item.id)">删除</button>
              </div>
              <div class="operate" v-else>
                <button class="btn btn-warning" @click="setItem(item)">修改</button>
              </div>
              <div class="item-set" v-if="state.currentChange.includes(item.id)" t>
                <template v-for="(grid, key) in item ">
                  <div v-if="key === 'size' || key === 'position' || key === 'rotate'" class="item-set-bar">
                    <span class="title">{{ key }}</span>
                    x:<input type="text" v-model="state.boresList[index][key]['x']" :disabled="key === 'id'">
                    y:<input type="text" v-model="state.boresList[index][key]['y']" :disabled="key === 'id'">
                    z:<input type="text" v-model="state.boresList[index][key]['z']" :disabled="key === 'id'">
                  </div>
                  <div v-else-if="key === 'model_type' || key === 'master_slave'" class="item-set-bar">
                    <span class="title">{{ key }}</span>
                    <div class="select-warp">
                      <input type="text" v-model="state.boresList[index][key]" :disabled="key === 'id'">
                      <div>

                      </div>
                    </div>
                  </div>
                  <div v-else-if="key === 'option'" class="`item-set-bar item-set-option` ">
                    <span class="title">{{ key }}</span>
                    <template v-for="(opt, index) in grid">
                      <div>
                        <p>
                          {{ index }}:
                          <el-switch v-model="opt.open"/>
                        </p>
                        <p>
                          min:<input type="text" v-model="opt.min">
                          max:<input type="text" v-model="opt.max">
                          value:<input type="text" v-model="opt.value">
                        </p>
                      </div>
                    </template>
                  </div>
                  <div v-else class="item-set-bar">
                    <span class="title">{{ key }}</span>
                    <input type="text" v-model="state.boresList[index][key]" :disabled="key === 'id'">
                  </div>
                </template>
              </div>
              <div class="item-info" v-else>
                <soan>
                  {{ item.name }}
                  {{ state.boresList[index].value }}
                </soan>
                <!--                ({{ item.min }}- {{ item.max }})-->
                <template v-for="(option, index) in item.option">
                  <p v-if="option.open">
                    {{ index }}
                    <el-slider
                        v-model="option.value"
                        show-input
                        :min="option.min"
                        :max="option.max"
                        :step="0.01"
                        @input="sliderInput($event, `${item.field}`, index)"/>
                  </p>
                </template>

                <!--                </template>-->

                <!--                <el-slider-->
                <!--                    v-model="state.boresList[index].value"-->
                <!--                    show-input-->
                <!--                    :min="item.min"-->
                <!--                    :max="item.max"-->
                <!--                    :step="0.01"-->
                <!--                    @input="sliderInput($event, `${item.field}`, 'y')"/>-->
                <!--                <el-slider-->
                <!--                    v-model="state.boresList[index].value"-->
                <!--                    show-input-->
                <!--                    :min="item.min"-->
                <!--                    :max="item.max"-->
                <!--                    :step="0.01"-->
                <!--                    @input="sliderInput($event, `${item.field}`, 'y')"/>-->
              </div>
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
  boresList    : [],
  currentChange: [],
  showAll      : false,
  newId        : 0,
  showGrid     : [
    'name'
  ],
  itemTpl      : {
    id   : 0,
    field: 50,
    name : '',
    // value: 50,
    min         : 0,
    max         : 100,
    model_type  : '0',
    master_slave: '0',
    option      : {
      x: {
        open : false,
        max  : 100,
        min  : 0,
        value: 50
      },
      y: {
        open : false,
        max  : 100,
        min  : 0,
        value: 50
      },
      z: {
        open : false,
        max  : 100,
        min  : 0,
        value: 50
      }
    },
    size        : {
      x: 0,
      y: 0,
      z: 0
    },
    position    : {
      x: 0,
      y: 0,
      z: 0
    },
    rotate      : {
      x: 0,
      y: 0,
      z: 0
    },
    parent      : 0,
  },
  modelType    : {
    0: '骨骼',
    1: '关节轴',
    2: '外壳',
    3: '零件',
  },
  masterSlave  : {
    0: '主动',
    1: '从动',
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
const setBody = (data) => {
  data.map(group => {
    for (let item in group) {
      if (item === 'size' || item === 'position' || item === 'rotate' || item === 'option') {
        group[item] = JSON.parse(group[item])
      }
    }
  })
  console.log('datadatadatadata', data)
  return data
}
const getList = () => {
  API.bores.list().then((res) => {
    let newData = setBody(res.data)
    // let newData = res.data
    state.boresList = newData
  })
}
getList()
const sliderInput = (e, name, direction) => {
  console.log('e', e)
  emit("sliderInput", e, name, direction);
};

const switchChange = (e) => {
  emit("switchChange", e);
};
const setItem = (item) => {
  state.currentChange.push(item.id)
};
const saveChange = (item) => {
  let id = item.id
  if (id > 0) {
    API.bores.revise(item).then(res => {
      getList()
      filterId(id)
    })
  } else {
    API.bores.push(item).then(res => {
      state.itemTpl.parent = res.data.id
      getList()
      filterId(id)
    })
  }
};
const filterId = (id) => {
  console.log(state.currentChange)
  if (id > 0) {
    state.currentChange = state.currentChange.filter(item => item !== id);
  } else {
    state.boresList = state.boresList.filter(item => item.id !== id);
  }
};
const deleteItem = (id) => {
  API.bores.delete({'id': id}).then(() => {
    getList()
  })
};
const newBores = (item) => {
  state.itemTpl.id--
  let tpl = JSON.parse(JSON.stringify(state.itemTpl));
  state.boresList.push(tpl)
  state.currentChange.push(state.itemTpl.id)
};
</script>

<style lang="scss" scope>
.list-warp {
  overflow: auto;
  height: 80vh;

  .bores-item {
    .item-data {
      .item-set {
        .item-set-bar {
          //border: #0d4458 solid 5px;
          display: flex;
          flex-direction: row;

          .title {
            width: 3rem;
            flex-shrink: 0;
          }
        }

        .item-set-option {
          flex-direction: column;
        }
      }

      .item-info {

      }
    }
  }


}

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

