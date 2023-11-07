<!--// 路径：src/views/home/components/Menu/index.vue-->
<template>
  <div class="human-menu">
    <div class="human-menu-action">
      <div class="form-button" @click="newBores()">新增一条</div>
      <div class="form-button" @click="state.showAll = !state.showAll">
        {{
          state.showAll ?
              '控制模式' :
              '全部模型'
        }}
      </div>
      <span class="demonstration">鼠标视角控制器</span>
      <el-switch v-model="mouseValue" @change="switchChange"/>
    </div>
    <div class="list-warp">
      <template v-for="(item, index) in state.boresList ">
        <div class="bores-item">
          <div class="item-data card-warp">
            <div class="operate flex" v-if="state.currentChange.includes(item.id)">
              <div class="login_short_btn" @click="saveChange(item)">保存</div>
              <div class="login_short_btn" @click="filterId(item.id)">取消</div>
              <div class="login_short_btn" @click="deleteItem(item.id)">删除</div>
            </div>
            <div class="operate" v-else>
              <button class="btn btn-warning" @click="setItem(item)">修改</button>
            </div>

            <div class="item-set" v-if="state.currentChange.includes(item.id)" t>
              <template v-for="(grid, key) in item ">
                <div v-if="key === 'size'" class="item-set-bar">
                  <span class="title">{{ key }}</span>
                  <input class="input-box" type="text" v-model="state.boresList[index][key]" @input="setInputVal" :disabled="key === 'id'">
                </div>
                <div v-else-if="key === 'position' || key === 'rotate'" class="item-set-bar">
                  <span class="title">{{ key }}</span>
                  x:<input type="text" class="input-box" v-model="state.boresList[index][key]['x']" @input="setInputVal" :disabled="key === 'id'">
                  y:<input type="text" class="input-box" v-model="state.boresList[index][key]['y']" @input="setInputVal" :disabled="key === 'id'">
                  z:<input type="text" class="input-box" v-model="state.boresList[index][key]['z']" @input="setInputVal" :disabled="key === 'id'">
                </div>
                <div v-else-if="key === 'model_type' " class="item-set-bar item-set-select">
                  <span class="title">{{ key }}</span>
                  <div class="select-warp">
                    <div>
                      {{ state.modelType[state.boresList[index][key]] }}
                    </div>
                    <div class="select-box">
                      <template v-for="(select, select_index) in state.modelType">
                        <div @click="state.boresList[index][key]=select_index">{{ select }}{{ select_index }}</div>
                      </template>
                    </div>
                  </div>
                </div>
                <div v-else-if="key === 'master_slave' " class="item-set-bar item-set-select">
                  <span class="title">{{ key }}</span>
                  <div class="select-warp">
                    <div>
                      {{ state.masterSlave[state.boresList[index][key]] }}
                    </div>
                    <div class="select-box">
                      <template v-for="(select, select_index) in state.masterSlave">
                        <div @click="state.boresList[index][key]=select_index">{{ select }}{{ select_index }}</div>
                      </template>
                    </div>
                  </div>
                </div>
                <div v-else-if="key === 'option'" class="item-set-bar item-set-option">
                  <span class="title">{{ key }}</span>
                  <div class="option-warp">
                    <template v-for="(opt, index) in grid">
                      <div class="option-item">
                        <div class="option-switch">
                          <span>{{ index }}:</span>
                          <el-switch v-model="opt.open"/>
                        </div>
                        <div class="option-switch">
                          <span>舵机反转:</span>
                          <el-switch v-model="opt.server_reverse"/>
                        </div>
                        <div class="option-switch">
                          <span>模型反转:</span>
                          <el-switch v-model="opt.model_reverse"/>
                        </div>
                        <div class="option-input">
                          <p>
                            <span>min:</span><input class="input-box" type="text" v-model="opt.min">
                          </p>
                          <p>
                            <span>max:</span><input class="input-box" type="text" v-model="opt.max">
                          </p>
                          <p>
                            <span>value:</span><input class="input-box" type="text" v-model="opt.value">
                          </p>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
                <div v-else class="item-set-bar">
                  <span class="title">{{ key }}</span>
                  <input type="text" v-model="state.boresList[index][key]" :disabled="key === 'id'">
                </div>
              </template>
            </div>
            <div class="item-info" v-else>
              <div class="item-info-option" :class="item.model_type === 0 ?  'b-brand' : 'b-success'">
                <span class="name"> {{ item.name }}</span>
                <span>id:{{ item.id }}</span>
                <span>field:{{ item.field }}</span>
                <span>Pid:{{ item.parent }}</span>
              </div>
              <template v-for="(option, index) in item.option">
                <p v-if="option.open">
                  {{ index }} {{ state.innerData[item.field][index] }}
                  <inputRange
                      :min="option.min"
                      :max="option.max"
                      v-model="state.innerData[item.field][index]"
                      @sliderInput="sliderInput( $event,`${item.field}`, index, state.innerData[item.field])"
                      @input="sliderInput(state.innerData[item.field][index], `${item.field}`, index, state.innerData[item.field])"
                  ></inputRange>
                </p>
              </template>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import API from "@/api";
import debounce from "@/utils/putlic/index.js";
import inputRange from '@/components/public/inputRange.vue'
import boresStore from '@/store/bores/index.ts';

const boresX = boresStore()
const state = reactive({
  boresList    : boresX.boresList || [],
  currentChange: [],
  showAll      : false,
  newId        : 0,
  showGrid     : [
    'name'
  ],
  innerData:{

  },
  itemTpl      : {
    id          : 0,
    field       : "D",
    name        : '',
    model_name  : '.stl',
    model_type  : '0',
    master_slave: '0',
    option      : {
      x: {
        open          : false,
        server_reverse: false,
        model_reverse : false,
        max           : (Math.PI / 2).toFixed(4) * 1,
        min           : (-Math.PI / 2).toFixed(4) * 1,
        value         : 0
      },
      y: {
        open          : false,
        server_reverse: false,
        model_reverse : false,
        max           : (Math.PI / 2).toFixed(4) * 1,
        min           : (-Math.PI / 2).toFixed(4) * 1,
        value         : 0
      },
      z: {
        open          : false,
        server_reverse: false,
        model_reverse : false,
        max           : (Math.PI / 2).toFixed(4) * 1,
        min           : (-Math.PI / 2).toFixed(4) * 1,
        value         : 0
      }
    },
    size        : 10,
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
const emit = defineEmits(["sliderInput", "switchChange", "updateBoresList"]);

const getList = () => {
  boresX.getBoresList().then((data) => {
    emit("updateBoresList");
    state.boresList = data
    console.log(state.boresList)
    for (let index in state.boresList){
      let item = state.boresList[index]
      let option = item.option
      state.innerData[item.field] = {
        x:option.x['value'],
        y:option.y['value'],
        z:option.z['value'],
      }
    }
  })
}
getList()
// const sliderInput = debounce((e, name, direction) => {
//   emit("sliderInput", e, name, direction);
// }, 1);
const sliderInput = (e, name, direction,option) => {
  emit("sliderInput",  name, option);
}
const switchChange = (e) => {
  emit("switchChange", e);
};
const setItem = (item) => {
  state.currentChange.push(item.id)
};
const setInputVal = () => {
  emit("updateBoresList");
  console.log(state.boresList)
  for (let index in state.boresList){
    let item = state.boresList[index]
    let option = item.option
    state.innerData[item.field] = {
      x:option.x['value'],
      y:option.y['value'],
      z:option.z['value'],
    }
  }
}
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

<style lang="scss" scoped>
.human-menu {
  //padding: 20px 10px;
  display: flex;
  flex-direction: column;

  .slider-item {
    //margin: 20px 0;
  }
  .human-menu-action{
    display: flex;
  }
  .demonstration {
    font-size: 15px;
    margin: 0 10px 10px 0;
  }

  .list-warp {
    overflow: auto;
    //height: 100%;
    //height: calc(80vh - 100px);

    .bores-item {
      .item-data {
        font-family: MeiHei;
        font-size: 15px;
        .item-set {
          .item-set-bar {
            display: flex;
            flex-direction: row;
            margin: 1px 0;

            .title {
              width: 60px;
              flex-shrink: 0;
            }
          }

          .item-set-option {
            flex-direction: column;

            .option-warp {
              display: flex;
              flex-direction: row;

              .option-item {
                text-align: center;
                border: var(--Warning) solid 1px;

                .option-switch {
                }

                .option-input {
                  p {
                    display: flex;

                    span {
                      display: inline-block;
                      width: 33%;
                      flex-shrink: 0;
                    }
                  }
                }
              }
            }
          }

          .item-set-select {
            .select-warp {
              position: relative;
              width: 100%;
              z-index: auto;
              color: var(--Brand-unset);
              cursor: pointer;

              .select-box {
                display: none;
                z-index: 1;
                border: #2DC3FE solid 1px;
                position: absolute;
                cursor: pointer;
                width: 100px;
              }

              &:hover {
                .select-box {
                  display: block;
                }
              }
            }

          }
        }

        .item-info {
          .item-info-option {
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            font-size: 16px;
            padding: 1px 0;

            span {
              display: inline-block;
            }

            .name {
              width: 40%;
            }
          }
        }
      }
    }


  }
}


</style>

