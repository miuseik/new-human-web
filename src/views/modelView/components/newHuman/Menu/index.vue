<!--// 路径：src/views/home/components/Menu/index.vue-->
<template>
  <div class="human-menu">
    <div class="human-menu-action">
      <div class="my-button-common" @click="addBone()">新增一条</div>
      <div class="my-button-common">123</div>
      <div class="my-button-common" @click="state.showAll = !state.showAll">
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
        <div class="description-info my-card-warp">
          <template v-for="group in state.helpDescription">
            <div>
              <template v-for="(item, key) in group">
                <p :class="key">{{ item }}</p>
              </template>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="list-warp">
      <template v-for="(item, index) in boneList ">
        <div class="bone-item">
          <div class="item-data my-card-warp">
            <div class="operate flex" v-if="currentChange.includes(item.id)">
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
            <div class="item-set" v-if="currentChange.includes(item.id)">
              <template v-for="(grid, key) in item ">
                <div v-if="key.toString() === 'size'" class="item-set-bar">
                  <span class="title">{{ key }}</span>
                  <input class="input-box" type="text" v-model="boneList[index][key]"
                         @input="setInputVal"
                         :disabled="key.toString() === 'id'">
                </div>

                <div v-else-if="key.toString() === 'position' || key.toString() === 'rotate'"
                     class="item-set-bar">
                  <span class="title">{{ key }}</span>
                  x:<input type="text" class="input-box" v-model="boneList[index][key]['x']"
                           @input="setInputVal"
                           :disabled="key.toString() === 'id'">
                  y:<input type="text" class="input-box" v-model="boneList[index][key]['y']"
                           @input="setInputVal"
                           :disabled="key.toString() === 'id'">
                  z:<input type="text" class="input-box" v-model="boneList[index][key]['z']"
                           @input="setInputVal"
                           :disabled="key.toString() === 'id'">
                </div>
                <div v-else-if="key.toString() === 'model_name'" class="item-set-bar">
                  <span class="title">{{ key }}</span>
                  <div class="login_short_btn input-box-file">
                    选择文件
                    <input type="file" ref="fileInput" class="hidden-input" @change="onFileChange($event,index, key)"/>
                  </div>
                  <input type="text" class="input-box" v-model="boneList[index][key]"
                         :disabled="setDisabled(key)">
                </div>
                <div v-else-if="key.toString() === 'model_type' " class="item-set-bar item-set-select">
                  <span class="title">{{ key }}</span>
                  <div class="select-warp input-box">
                    <div>
                      {{ state.modelType[boneList[index][key]] }}
                    </div>
                    <div class="select-box">
                      <template v-for="(select, select_index) in state.modelType">
                        <div class="input-box" @click="boneList[index][key]=select_index">
                          {{
                            select
                          }}{{ select_index }}
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
                <!--                选择主从方式-->
                <div v-else-if="key.toString() === 'master_slave' "
                     class="item-set-bar item-set-select">
                  <span class="title">{{ key }}</span>
                  <div class="select-warp input-box">
                    <div>
                      {{ state.masterSlave[boneList[index][key]] }}
                    </div>
                    <div class="select-box">
                      <template v-for="(select, select_index) in state.masterSlave">
                        <div class="input-box" @click="boneList[index][key]=select_index">
                          {{ select }}{{ select_index }}
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
                          {{ opt.open }}
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
                  <input type="text" class="input-box" v-model="boneList[index][key]"
                         :disabled="setDisabled(key)">
                </div>
              </template>
            </div>
            <div class="item-info" v-else>
              {{ item['option'] }}
              <template v-for="(option, index) in JSON.parse(item['option'])">
                <p class="input-range-box" v-if="option.open*1 !== 0"><!--open 开启-->
                  <span>{{ index }} {{ state.innerData[item['field']][index] }}</span>
                  <bar-graph :chart-id=index :width="'200px'" :height="'200px'"></bar-graph>
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
import inputRange from '@/components/public/inputRange.vue'
import bone from '@/store/bone/index.ts';
// import {boneData} from "../data/index.js"
import dataIndex from "../data/index.js"
import {computed} from "vue";
import BarGraph from "@/components/echart/multiPanel.vue";
import {deepClone} from "@/utils/common.ts";
function parseNumber(input: string): number {
  return parseFloat(input); // 或者使用 parseInt(input, 10)
}

const boneList = ref([])
const currentChange = ref([])
const state = reactive({
  helpDescription: [],
  // boneList: [],
  // currentChange: [],
  showAll: false,
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

const emit = defineEmits(["sliderInput", "updateBoneList"]);
const setDisabled = computed(() => {
  return function (key) {
    return key.toString() === 'id' || key.toString() === 'createdAt' || key.toString() === 'updatedAt'
  };
});
const getList = async () => {
  console.log('getList')
  await bone().setBoneList()
  boneList.value = bone().getBoneList
  emit("updateBoneList");
  for (let index in boneList.value) {
    let item = boneList.value[index]
    let option = JSON.parse(item.option)
    console.log('item--------', item)
    state.innerData[item.field] = {
      x: option.x['value'],
      y: option.y['value'],
      z: option.z['value'],
    }
  }
  console.log(boneList.value)
}
getList()
state.helpDescription = dataIndex['helpDescription']

// const sliderInput = debounce((e, name, direction) => {
//   emit("sliderInput", e, name, direction);
// }, 1);
const sliderInput = (e, name, direction, option) => {
  emit("sliderInput", name, option);
}
// 点击修改按钮进入编辑状态
const setItem = (item) => {
  currentChange.value.push(item.id)
};
const fileInput = ref<HTMLInputElement | null>(null);

const selectFile = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const onFileChange = (event: Event, index, key) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    boneList.value[index][key] = input.files[0].name
    // console.log(index,'///', key,'--------------------', input.files[0].name);
    // 你可以在这里处理文件，比如上传到服务器
  }
};
// 输入框输入内容或者拖动滑块时触发
const setInputVal = () => {
  emit("updateBoneList");
  for (let index in boneList.value) {
    let item = boneList.value[index]
    let option = item.option
    state.innerData[item.field] = {
      x: option.x['value'],
      y: option.y['value'],
      z: option.z['value'],
    }
  }
}
// 保存编辑.新增或者修改
const saveChange = async (item) => {
  let id = item.id
  if (id > 0) {
    await API.bone.revise(item)
  } else {
    let res = await API.bone.push(item)
    state.itemTpl.parent = res.data.id //提前给下一次添加做准备,只有在连续添加时才有效
  }
  console.log('保存编辑.新增或者修改')
  getList() //重新获取数据
  filterId(id)
};
// 取消编辑状态
const filterId = (id) => {
  if (id > 0) {
    // 修改的时候取消,清空修改区
    console.log('修改的时候取消,清空修改区')
    currentChange.value = currentChange.value.filter(item => item !== id);
  } else {
    //新增时取消,直接从列表删除
    console.log('新增时取消,直接从列表删除')
    boneList.value = boneList.value.filter(item => item.id !== id);
  }
  console.log(boneList.value)
};
// 删除一条
const deleteItem = async (id) => {
  await API.bone.delete({'id': id}) //直接删除数据库
  getList()// 获取新的骨骼列表!有点暴力了
};
// 点击新增一条
const addBone = () => {
  state.itemTpl.id-- //新增的id为负值代表新增, >0的id是修改才有的
  let tpl = deepClone(state.itemTpl)
  boneList.value.push(tpl) //放到渲染列表里去
  currentChange.value.push(state.itemTpl.id) //放进可编辑的列表里去
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
        z-index: 999999;
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

            .input-box-file {
              position: relative;
              width: 160px;
              height: 30px;
              line-height: 30px;

              .hidden-input {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
                cursor: pointer;
                z-index: 999;
              }
            }

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
          .input-range-box {
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

