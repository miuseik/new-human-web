<!--// 路径：src/views/home/components/Menu/index.vue-->
<template>
  <div class="human-menu">
    <div class="human-menu-action">
      <div class="my-button-common" @click="addBone()">新增</div>
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
            <div class="flex-row-center-between">
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
                  <div>id: <span>{{ item.id }}</span>---</div>
                  <!--                <div>field: <span>{{ item['field'] }}</span>-</div>-->
                  <div>Pid: <span>{{ item.parent }}</span></div>
                </div>
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
                          {{ select }}
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
                          {{ select }}
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
                        <div class="option-switch flex-row-center-between">
                          <span>{{ index }}:</span>
                          <el-switch v-model="opt.open"/>
                        </div>
                        <div class="option-switch flex-row-center-between">
                          <span>舵机反转:</span>
                          <el-switch v-model="opt.server_reverse"/>
                        </div>
                        <div class="option-switch flex-row-center-between">
                          <span>模型反转:</span>
                          <el-switch v-model="opt.model_reverse"/>
                        </div>
                        <div class="option-input ">
                          <p class="flex-row-center-between">
                            <span style="text-align: left">min:</span>
                            <input class="input-box" type="text" v-model="opt.min">
                          </p>
                          <p class="flex-row-center-between">
                            <span style="text-align: left">max:</span>
                            <input class="input-box" type="text" v-model="opt.max">
                          </p>
                          <p class="flex-row-center-between">
                            <span style="text-align: left">value:</span>
                            <input class="input-box" type="text" v-model="opt.value">
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
              <template v-for="(option, index) in item['option']">
                <p class="input-range-box" v-if="option.open"><!--open 开启-->
                  <span>{{ index }} {{ innerData[item[itemKey]][index] }} </span>
<!--                  <bar-graph :chart-id=index :width="'200px'" :height="'200px'"></bar-graph>-->
<!--                  这里直接用item['option']就可以取值,但是这样会严重卡顿-->
                  <inputRange
                      class="input-box"
                      :min="option.min"
                      :max="option.max"
                      v-model="innerData[item[itemKey]][index]"
                      @sliderInput="sliderInput( $event,`${item[itemKey]}`, innerData[item[itemKey]])"
                      @input="sliderInput(innerData[item[itemKey]][index], `${item[itemKey]}`, innerData[item[itemKey]])"
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
import dataIndex from "../data/index.js"
import {computed} from "vue";
import BarGraph from "@/components/echart/multiPanel.vue";
import {deepClone} from "@/utils/common.ts";
import {ElMessage, ElMessageBox} from "element-plus";

const boneList = ref([]) // 骨骼列表
const currentChange = ref([]) // 当前正在编辑包括新增的数据
const innerData = ref([]) //
// const itemKey = ref('field') //
const itemKey = ref('id') //
const state = reactive({
  helpDescription: [],
  itemTpl: {},
  showAll: false,
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
/**
 * 获取列表,并更新boneList
 */
const getList = async () => {
  await bone().setBoneList()
  boneList.value = bone().getBoneList
  emit("updateBoneList");
  for (let index in boneList.value) {
    let item = boneList.value[index]
    let option = item.option
    innerData.value[item[itemKey.value]] = {
      x: option.x['value'],
      y: option.y['value'],
      z: option.z['value'],
    }
  }
  // console.log(boneList.value)
}
getList()
state.helpDescription = dataIndex['helpDescription']
state.itemTpl = dataIndex['itemTpl']

const sliderInput = (_, id, option) => {
  emit("sliderInput", id, option);
}
// 点击修改按钮进入编辑状态
const setItem = (item) => {
  currentChange.value.push(item.id)
};

const onFileChange = (event: Event, index, key) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    boneList.value[index][key] = input.files[0].name
  }
};
// 输入框输入内容或者拖动滑块时触发
const setInputVal = () => {
  emit("updateBoneList");
  console.log('输入框输入内容或者拖动滑块时触发')
  for (let index in boneList.value) {
    let item = boneList.value[index]
    let option = item.option
    innerData.value[itemKey.value] = {
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
    state.itemTpl['parent'] = res.data.id //提前给下一次添加做准备,只有在连续添加时才有效
  }
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
  ElMessageBox.confirm(
      '你确定要删除这个模型吗?',
      '注意!',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(async() => {
        await API.bone.delete({'id': id}) //直接删除数据库
        getList()// 获取新的骨骼列表!有点暴力了
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消删除',
        })
      })
};
// 点击新增一条
const addBone = () => {
  state.itemTpl['id']-- //新增的id为负值代表新增, >0的id是修改才有的
  let tpl = deepClone(state.itemTpl)
  boneList.value.push(tpl) //放到渲染列表里去
  currentChange.value.push(state.itemTpl['id']) //放进可编辑的列表里去
};
</script>

<style lang="scss" scoped>
.human-menu {
  .input-box {
    height: 30px;
    line-height: 30px;
  }
  display: flex;
  flex-direction: column;
  width: 500px;
  flex-shrink: 0;

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
    .bone-item {
      .item-data {
        //font-family: MeiHei;
        font-size: 15px;
        position: relative;

        .item-info-option {
          line-height: 25px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          font-size: 16px;
          padding: 1px 0;
          //position: absolute;
          //right: 10px;
          //top: 10px;

          .option {
            display: flex;
            flex-direction: row;

            span {
              display: inline-block;
              width: 25px;
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
              text-align: left;
              padding-right: 10px;
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
                border-radius: 10px;
                padding: 5px;

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
                position: absolute;
                cursor: pointer;
                width: 100px;
                border: var(--Warning) solid 1px;
                border-radius: 5px;
                padding: 5px;
                background-color: var(--Success-unset);
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

