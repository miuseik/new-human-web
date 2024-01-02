<!--// 路径：src/views/home/components/Menu/index.vue-->
<template>
  <div class="human-menu">
    <div class="human-menu-action">
      <div class="form-button" @click="newBone()">新增一条</div>
      <div class="form-button" @click="state.showAll = !state.showAll">
        {{
          state.showAll ?
              '控制模式' :
              '全部模型'
        }}
      </div>

      <div class="skeleton-description">
        <el-icon class="description-icon">
          <InfoFilled/>
        </el-icon>
        <div class="description-info card-warp">
          <template v-for="group in state.helpDescription">
            <div>
              <template v-for="(item, key) in group">
                <p :class="key">{{ item }}</p>
              </template>
            </div>
          </template>
        </div>
      </div>
      <!--      <span class="demonstration">鼠标视角控制器</span>-->
      <!--      <el-switch v-model="mouseValue" @change="switchChange"/>-->
    </div>
    <div class="list-warp">
      <template v-for="(item, index) in state.boneList ">
        <div class="bone-item">
          <div class="item-data card-warp">
            <div class="operate flex" v-if="state.currentChange.includes(item.id)">
              <div class="login_short_btn" @click="filterId(item.id)">取消</div>
              <div class="login_short_btn" @click="saveChange(item)">保存</div>
              <div class="login_short_btn" @click="deleteItem(item.id)">删除</div>
            </div>
            <div class="operate" v-else>
              <div class="login_short_btn" @click="setItem(item)">修改</div>
            </div>
            <div class="item-info-option" :class="item.model_type*1 === 0 ?  'b-brand' : 'b-success'">
              <div class="name"> {{ item.name }}</div>
              <div class="option">
                <div>id: <span>{{ item.id }}</span>-</div>
                <div>field: <span>{{ item['field'] }}</span>-</div>
                <div>Pid: <span>{{ item.parent }}</span></div>
              </div>
            </div>
            <div class="item-set" v-if="state.currentChange.includes(item.id)" t>
              <template v-for="(grid, key) in item ">
                <div v-if="key.toString() === 'size'" class="item-set-bar">
                  <span class="title">{{ key }}</span>
                  <input class="input-box" type="text" v-model="state.boneList[index][key]" @input="setInputVal"
                         :disabled="key.toString() === 'id'">
                </div>
                <div v-else-if="key.toString() === 'position' || key.toString() === 'rotate'" class="item-set-bar">
                  <span class="title">{{ key }}</span>
                  x:<input type="text" class="input-box" v-model="state.boneList[index][key]['x']" @input="setInputVal"
                           :disabled="key.toString() === 'id'">
                  y:<input type="text" class="input-box" v-model="state.boneList[index][key]['y']" @input="setInputVal"
                           :disabled="key.toString() === 'id'">
                  z:<input type="text" class="input-box" v-model="state.boneList[index][key]['z']" @input="setInputVal"
                           :disabled="key.toString() === 'id'">
                </div>
                <div v-else-if="key.toString() === 'model_type' " class="item-set-bar item-set-select">
                  <span class="title">{{ key }}</span>
                  <div class="select-warp input-box">
                    <div>
                      {{ state.modelType[state.boneList[index][key]] }}
                    </div>
                    <div class="select-box">
                      <template v-for="(select, select_index) in state.modelType">
                        <div class="input-box" @click="state.boneList[index][key]=select_index">{{
                            select
                          }}{{ select_index }}
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
                <!--                选择主从方式-->
                <div v-else-if="key.toString() === 'master_slave' " class="item-set-bar item-set-select">
                  <span class="title">{{ key }}</span>
                  <div class="select-warp input-box">
                    <div>
                      {{ state.masterSlave[state.boneList[index][key]] }}
                    </div>
                    <div class="select-box">
                      <template v-for="(select, select_index) in state.masterSlave">
                        <div class="input-box" @click="state.boneList[index][key]=select_index">{{
                            select
                          }}{{ select_index }}
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
                <!--                设置option-->
                <div v-else-if="key.toString() === 'option'" class="item-set-bar item-set-option">
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
                        <div class="option-input ">
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
                <!--                  设置其他选项-->
                <div v-else class="item-set-bar">
                  <span class="title">{{ key }}</span>
                  <input type="text" class="input-box" v-model="state.boneList[index][key]"
                         :disabled="setDisabled(key)">
                </div>
              </template>
            </div>
            <div class="item-info" v-else>
              <template v-for="(option, index) in item.option">
                <p class="input-range-box" v-if="option.open*1 !== 0">
                  <span>{{ index }} {{ state.innerData[item['field']][index] }}</span>
                  <inputRange
                      class="input-box"
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
import bone from '@/store/bone/index.ts';
// import {boneData} from "../data/index.js"
import dataIndex from "../data/index.js"
import {computed} from "vue";

const boneStore = bone()

function parseNumber(input: string): number {
  return parseFloat(input); // 或者使用 parseInt(input, 10)
}

const state = reactive({
  helpDescription: [],
  boneList: boneStore.boneList || [],
  currentChange: [],
  showAll: false,
  newId: 0,
  showGrid: [
    'name'
  ],
  innerData: {},

  itemTpl: {
    id: 0,
    field: "D",
    name: '',
    model_name: '.stl',
    model_type: '0',
    master_slave: '0',
    option: {
      x: {
        open: false,
        server_reverse: false,
        model_reverse: false,
        max: parseNumber((Math.PI / 2).toFixed(4)),
        min: parseNumber((-Math.PI / 2).toFixed(4)),
        value: 0
      },
      y: {
        open: false,
        server_reverse: false,
        model_reverse: false,
        max: parseNumber((Math.PI / 2).toFixed(4)),
        min: parseNumber((-Math.PI / 2).toFixed(4)),
        value: 0
      },
      z: {
        open: false,
        server_reverse: false,
        model_reverse: false,
        max: parseNumber((Math.PI / 2).toFixed(4)),
        min: parseNumber((-Math.PI / 2).toFixed(4)),
        value: 0
      }
    },
    size: 10,
    position: {
      x: 0,
      y: 0,
      z: 0
    },
    rotate: {
      x: 0,
      y: 0,
      z: 0
    },
    parent: 0,
  },
  modelType: {
    0: '骨骼',
    1: '关节轴',
    2: '外壳',
    3: '零件',
  },
  masterSlave: {
    0: '主动',
    1: '从动',
  }
})

const mouseValue = ref(true);
const emit = defineEmits(["sliderInput", "switchChange", "updateBoneList"]);
const setDisabled = computed(() => {
  return function (key) {
    return key.toString() === 'id' || key.toString() === 'createdAt' || key.toString() === 'updatedAt'
  };
});
const getList = () => {
  boneStore.getBoneList().then((data: any[]) => {
    emit("updateBoneList");
    state.boneList = data
    for (let index in state.boneList) {
      let item = state.boneList[index]
      let option = item.option
      state.innerData[item.field] = {
        x: option.x['value'],
        y: option.y['value'],
        z: option.z['value'],
      }
    }
  })
}
getList()
state.helpDescription = dataIndex['helpDescription']

// const sliderInput = debounce((e, name, direction) => {
//   emit("sliderInput", e, name, direction);
// }, 1);
const sliderInput = (e, name, direction, option) => {
  emit("sliderInput", name, option);
}
const switchChange = (e) => {
  emit("switchChange", e);
};
const setItem = (item) => {
  state.currentChange.push(item.id)
};
const setInputVal = () => {
  console.log('=============')
  emit("updateBoneList");
  for (let index in state.boneList) {
    let item = state.boneList[index]
    let option = item.option
    state.innerData[item.field] = {
      x: option.x['value'],
      y: option.y['value'],
      z: option.z['value'],
    }
    console.log(state.innerData[item.field])
  }
}
const saveChange = (item) => {
  let id = item.id
  if (id > 0) {
    API.bone.revise(item).then(res => {
      getList()
      filterId(id)
    })
  } else {
    API.bone.push(item).then(res => {
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
    state.boneList = state.boneList.filter(item => item.id !== id);
  }
};
const deleteItem = (id) => {

  API.bone.delete({'id': id}).then(() => {
    getList()
  })
};
const newBone = () => {
  state.itemTpl.id--
  let tpl = JSON.parse(JSON.stringify(state.itemTpl));
  state.boneList.push(tpl)
  state.currentChange.push(state.itemTpl.id)
};
</script>

<style lang="scss" scoped>
@import "./style/index.scss";

.human-menu {
  //padding: 20px 10px;
  .input-box {
    height: 30px;
  }

  display: flex;
  flex-direction: column;
  width: 500px;
  flex-shrink: 0;

  .slider-item {
    //margin: 20px 0;
  }

  .human-menu-action {
    display: flex;

    .skeleton-description {
      position: relative;

      .description-icon {
        cursor: pointer;
        height: 40px;
        width: 40px;
        font-size: 20px;
      }

      .description-info {
        display: none;
        padding: 20px 30px;
        position: absolute;
        text-align: left;
        z-index: 1;
        min-width: 400px;
        max-width: 600px;
      }

      &:hover {
        .description-info {
          display: block;
        }
      }
    }
  }

  .demonstration {
    font-size: 15px;
    margin: 0 10px 10px 0;
  }

  .list-warp {
    overflow: auto;
    //height: 100%;
    //height: calc(80vh - 100px);

    .bone-item {
      .item-data {
        font-family: MeiHei;
        font-size: 15px;
        position: relative;

        .item-info-option {
          line-height: 25px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          font-size: 16px;
          padding: 1px 0;
          position: absolute;
          right: 10px;
          top: 10px;

          .option {
            display: flex;
            flex-direction: row;

            span {
              display: inline-block;
              width: 15px;
            }
          }
        }

        .item-set {
          .item-set-bar {
            display: flex;
            flex-direction: row;
            margin: 1px 0;

            .title {
              display: block;
              width: 120px;
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
          .input-range-box{
            display: flex;
            flex-direction: column;
            align-items: self-start;
          }
        }
      }
    }


  }
}


</style>

