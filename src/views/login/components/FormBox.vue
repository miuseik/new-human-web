<template>
  <div class="account-channel-page">
    <div class="mask" @click=""></div>
    <div class="form-warp">
      <div class="form-box">
        <div class="form-title">
          <span>{{ props.pageType && props.pageType.toUpperCase() }}</span>
          <i @click="closeLogin" class="icon icon-close"></i>
        </div>
        <div class="form-content">
          <!--          <i class="icon icon-form-header"></i>-->
          <template v-for="(item, index) in state.currentFormTpl" key="index">
            <div class="form-item">
              <i class="icon icon-center-column" :class="item['icon']"></i>
              <div class="input-box" :class="item['code'] ? 'input-box-code' : ''">
                <span class="input-title">{{ item['title'] }}</span>
                <input
                  :type="item['field'] === 'pwd' ? 'password' : 'text'"
                  :placeholder="item['placeholder']"
                  v-model="state.formData[item['field']]"
                />
                <span class="warning">{{ validateItem(item) }}</span>
              </div>
              <!--              行为验证码-->
              <div
                ref="invitation_ref"
                id="invitation_id"
                @click="clickGetVerify"
                v-if="item['code'] && item['field'] === 'verification'"
                class="input-button"
              >
                <img :src="state.verifyImage" alt="" />
              </div>
              <!--              邮箱验证码-->
              <div
                ref="verification_ref"
                id="verification_id"
                @click="handleGetVerify"
                v-if="item['code'] && item['field'] === 'verification_email'"
                class="input-button"
              >
                {{ item['code'] }}
              </div>
            </div>
          </template>
          <div class="more-button">
            <span v-if="pageType !== 'login'" @click="openLogin">LOGIN</span>
            <span v-if="pageType !== 'reg'" @click="Reg">REGISTER</span>
            <span v-if="pageType !== 'retrieve'" @click="Forget">FORGET PASSWORD</span>
          </div>
          <div class="form-bottom">
            <p>Welcome Join FUNNY COIN</p>
            <p>
              For all WarSindia Warriors, please check your email to get our amazing
              SPACEPASS!
            </p>
          </div>
          <!--          <i class="icon icon-form-bottom"></i>-->
        </div>
      </div>
      <div @click="toPost" class="form-button">
        {{ props.pageType && props.pageType.toUpperCase() }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  reactive,
  onMounted,
  onBeforeUnmount,
  computed,
} from "vue";
// import { string } from "vue-types";
import { formTplGroup } from "../data";
import { validateForm } from "@/utils/validateForm";
import {} from "@/api/index.ts";
import { getCurrentInstance } from "vue";

const cxt = getCurrentInstance(); //相当于Vue2中的this

const props = defineProps({
  msg: {
    type: Object,
    default: {},
  },
  pageType: {
    type: String,
    default: "login",
  },
  cardStyle: {
    type: Object,
    default: {},
  },
});
const state = reactive({
  currentFormTpl: [],
  postEd: false,
  formData: {
    email: "",
    pwd: "",
    uname: "",
    verification: "", //行为验证码
    verification_email: "", //邮箱验证码
    invitation: "", //邀请码
  },
  verifyTime: 60,
  isVerify: false,
  sendLoading: false,
  submitLoading: false,
  verifyImage: "",
  verifyImageId: "",
});
const validateItem = computed(() => {
  return function (item) {
    let data = {
      key: item.field || "",
      value: state.formData[item.field] || "",
      title: item.title || "",
    };
    return state.postEd && item.required ? validateForm(data) : "";
  };
});
const toPost = () => {
  state.postEd = true;
  for (let i = 0; i < state.currentFormTpl.length; i++) {
    let item = state.currentFormTpl[i];
    let data = {
      key: item.field || "",
      value: state.formData[item.field] || "",
      title: item.title || "",
    };
    if (state.postEd && item.required && validateForm(data)) {
      return;
    }
  }
  console.log("props.pageType", props.pageType);
  switch (props.pageType) {
    case "login":
      reqlogin();
      break;
    case "reg":
      reqreg();
      break;
    case "retrieve":
      retrieve();
      break;
  }
};

const openLogin = () => {

};
const Reg = () => {

};
const Forget = () => {

};
const closeLogin = () => {
};

const reqlogin = () => {

};
const reqreg = () => {

};
const retrieve = () => {

};
const clickGetVerify = () => {

};
const handleGetVerify = () => {
  console.log("state.pageType", props.pageType);
  if (state.verifyTime < 60 || state.isVerify) return;
};
const getCurrentTpl = () => {
  state.currentFormTpl = formTplGroup[props.pageType];
};
const created = () => {
  getCurrentTpl();
  clickGetVerify();
};
created();
onMounted(() => {});
onBeforeUnmount(() => {});
</script>

<style scoped lang="scss">
.account-channel-page {
  color: #fff;
  height: 100vh;
  text-align: center;
  position: fixed;
  z-index: 100;
  .form-warp {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    position: fixed;
    z-index: 99999;
    left: 50%;
    transform: translateX(-50%);
    padding: 120px 0;
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    .form-box {
      width: 50vw;
      max-width: 500px;
      min-width: 300px;
      display: flex;
      flex-direction: column;

      .form-title {
        height: 30px;
        font-family: MeiHei;
        line-height: 30px;
        border-image-slice: 30 fill;
        border-image-width: 20px;
        border-image-source: url("../../../assets/img/login/form_box/title.png");
        position: relative;
        span {
          font-size: 20px;
        }
        .icon:before {
          bottom: 0;
          right: 0;
        }
      }

      .form-content {
        position: relative;
        z-index: 1;
        border-image-slice: 30 fill;
        border-image-width: 30px;
        border-image-source: url("../../../assets/img/public/card_box1.png");
        padding: 20px 60px;
        min-height: 100px;
        display: flex;
        flex-direction: column;
        //justify-content: center;
        align-items: center;
        .form-item {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          position: relative;
          margin-top: 30px;
          width: 100%;
          .icon {
            display: block;
            &:before {
              left: -40px;
              margin-top: 7.5px;
              width: 50px;
              height: 50px;
            }
          }

          padding-top: 15px;
          .input-box {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            width: 100%;

            .input-title {
              font-size: 15px;
              font-weight: 400;
              color: #00FFF6;
              //padding-left: 10px;
              white-space: nowrap;
              position: absolute;
              top: -25px;
            }

            .warning {
              position: absolute;
              bottom: -15px;
              left: 15px;
              font-size: 13px;
            }

            input {
              height: 30px;
              color: #fff;
            }
          }

          .input-box-code {
            input {
              width: 5rem;
            }
          }

          .input-button {
            width: 102px;
            cursor: pointer;
            height: 102px;
            line-height: 102px;
            font-size: 12px;
            font-weight: bold;
            //background-image: url("../../../assets/img/login/login_btn.png");
            background-repeat: no-repeat;
            background-position: center;
            background-size: 100% 102px;
          }
        }

        .more-button {
          width: 100%;
          display: flex;
          justify-content: space-between;
          margin-top: 15px;
          font-size: .12px;

          span {
            cursor: pointer;
          }
        }

        .form-bottom {
          margin-top: 30px;
          display: flex;
          justify-content: center;
          flex-direction: column;
          p:first-child {
            color: #00FFF6;
            font-size: .12px;
          }

          p:last-child {
            font-size: 10px;
          }
        }
      }
    }

    .form-button {
      margin-top: 15px;
      width: 155px;
      font-family: MeiHei;
      height: 50px;
      line-height: 50px;
      font-size: 15px;
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100%;
      cursor: pointer;
    }
  }
  .mask {
    background-color: rgba(0, 0, 0, .8);
    height: 100vh;
    position: fixed;
    z-index: 9999;
  }
}

</style>
