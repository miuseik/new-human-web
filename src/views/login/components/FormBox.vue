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
              <i class="icon icon-center-column" :class="item.icon"></i>
              <div class="input-box" :class="item.code ? 'input-box-code' : ''">
                <span class="input-title">{{ item.title }}</span>
                <input
                  :type="item.field === 'pwd' ? 'password' : 'text'"
                  :placeholder="item.placeholder"
                  v-model="state.formData[item.field]"
                />
                <span class="warning">{{ validateItem(item) }}</span>
              </div>
              <!--              行为验证码-->
              <div
                ref="invitation_ref"
                id="invitation_id"
                @click="clickGetVerify"
                v-if="item.code && item.field === 'verification'"
                class="input-button"
              >
                <img :src="state.verifyImage" alt="" />
              </div>
              <!--              邮箱验证码-->
              <div
                ref="verification_ref"
                id="verification_id"
                @click="handleGetVerify"
                v-if="item.code && item.field === 'verification_email'"
                class="input-button"
              >
                {{ item.code }}
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

<script setup>
import {
  ref,
  reactive,
  shallowReactive,
  watch,
  onMounted,
  onBeforeUnmount,
  computed,
} from "vue";
// import { string } from "vue-types";
import { formTplGroup } from "../data";
import { validateForm } from "@/utils/validateForm";
import {
  // login,
  // logOut,
  // reg,
  // resetPwd,
  // sendSignupCode,
  // resetPwdSendEmail,
  // verifyInvitationCode,
  // getVerifyImage,
} from "@/api/index.ts";
import { getCurrentInstance } from "vue";

const cxt = getCurrentInstance(); //相当于Vue2中的this
const bus = cxt.appContext.config.globalProperties.$bus;
import {
  messageBoxWarningConfirm,
  messageBoxSuccessAutoClose,
} from "@/utils/popup";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();

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
  currentFormTpl: {},
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
  for (var i = 0; i < state.currentFormTpl.length; i++) {
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
  bus.emit("openLogin", "login");
  console.log("login");
};
const Reg = () => {
  bus.emit("openLogin", "reg");
  console.log("reg");
};
const Forget = () => {
  bus.emit("openLogin", "retrieve");
  console.log("retrieve");
};
const closeLogin = () => {
  bus.emit("closeLogin");
};

const reqlogin = () => {
  let userinfo = {
    Email: state.formData.email,
    Password: state.formData.pwd,
  };
  store.dispatch("Login", userinfo).then(() => {
    window.location.reload();
  });
};
const reqreg = () => {
  let data = {
    Email: state.formData.email,
    Name: state.formData.uname,
    Code: state.formData.verification_email,
    Password: state.formData.pwd,
    InvitationCode: state.formData.invitation || "",
  };
  reg(data).then((res) => {
    state.submitLoading = true;
    console.log("reg", res);
    if (res.Code == 200) {
      messageBoxSuccessAutoClose("Register successfully.", () => {
        // store.dispatch("Login", {
        //   Email   : data.email,
        //   Password: data.pwd,
        // }).then(() => {
        //   window.location.reload();
        // }).catch(err => {

        openLogin();

        //  window.location.reload();

        // });
      });
    }
  });
};
const retrieve = () => {
  let data = {
    Email: state.formData.email,
    Name: state.formData.uname,
    Code: state.formData.verification_email,
    Password: state.formData.pwd,
    InvitationCode: state.formData.invitation,
  };
  resetPwd(data).then((res) => {
    console.log("resetPwd", res);

    if (res.Code == 200) {
      messageBoxSuccessAutoClose("Reset password successfully");
      openLogin();
    }
  });
};
const clickGetVerify = () => {
  getVerifyImage()
    .then((res) => {
      let data = (res && res.Data) || "";
      state.verifyImage = data.Image;
      state.verifyImageId = data.ImageId;
    })
    .catch((err) => {
      console.error(err);
    });
};
const handleGetVerify = () => {
  console.log("state.pageType", props.pageType);
  if (state.verifyTime < 60 || state.isVerify) return;
  if (
    state.formData.verification &&
    state.formData.verification != "" &&
    state.formData.email
  ) {
    state.sendLoading = true;
    state.isVerify = true;
    let postType = props.pageType == "reg" ? sendSignupCode : resetPwdSendEmail;
    postType({
      Email: state.formData.email,
      ImageId: state.verifyImageId,
      Code: state.formData.verification,
    })
      .then((res) => {
        state.sendLoading = false;
        const timer = setInterval(() => {
          state.verifyTime--;
          if (state.verifyTime < 0) {
            clearInterval(timer);
            state.verifyTime = 60;
            state.isVerify = false;
          }
        }, 1000);
        messageBoxSuccessAutoClose("Verfication code has been sent.");
      })
      .catch((err) => {
        if (err.code === "WKS1020") {
          setTimeout(() => {
            block.value?.openDialog(state.formData.email);
          }, 1800);
        } else {
          state.sendLoading = false;
          state.isVerify = false;
        }
      });
  } else {
    messageBoxWarningConfirm("Please Input Verify Result and email!");
  }
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
    //max-height: 90vh;
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    position: fixed;
    z-index: 99999;
    left: 50%;
    transform: translateX(-50%);
    padding: 1rem 0;
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    .form-box {
      width: 11.9rem;
      display: flex;
      flex-direction: column;

      .form-title {
        height: 1.1rem;
        line-height: 1.1rem;
        border-image-slice: 30 fill;
        border-image-width: 1rem;
        //border-image-source: url("../../../assets/img/login/form_box/title.png");
        position: relative;
        span {
          font-size: .6rem;
        }
        .icon:before {
          bottom: 0;
          right: 0;
        }
      }

      .form-content {
        //overflow: auto;
        position: relative;
        //height: 5rem;
        z-index: 1;
        border-image-slice: 40 fill;
        border-image-width: 1rem;
        border-image-source: url("../../../assets/img/home/card_box1.png");
        padding:.5rem 2rem;
        min-height: 10rem;
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
          margin-top: .5rem;
          width: 100%;
          //height: 3rem;
          .icon {
            display: block;
            &:before {
              left: -1rem;
              margin-top: .3rem;
              width: 1rem;
              height: 1rem;
            }
          }

          padding-top: .5rem;
          .input-box {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            width: 100%;

            .input-title {
              font-size: .4rem;
              font-weight: 400;
              color: #00FFF6;
              padding-left: .5rem;
              white-space: nowrap;
              position: absolute;
              top: -.6rem;
            }

            .warning {
              position: absolute;
              bottom: -.5rem;
              left: .5rem;
              font-size: .3rem;
            }

            input {
              width: 100%;
              height: 1.05rem;
              font-size: .5rem;
              //border-image-source: url('../../../assets/img/login/login_form_input.png');
              border-top: .1rem solid;
              border-right: .1rem solid;
              border-bottom: .1rem solid;
              border-left: .1rem solid;
              border-image-slice: 33 fill;
              border-image-width: .55rem;
              color: #fff;
              padding-left: .3rem;
            }
          }

          .input-box-code {
            input {
              width: 5rem;
            }
          }

          .input-button {
            width: 7rem;
            cursor: pointer;
            height: 1.25rem;
            line-height: 1.25rem;
            font-size: .25rem;
            font-weight: bold;
            //background-image: url("../../../assets/img/login/login_btn.png");
            background-repeat: no-repeat;
            background-position: center;
            background-size: 100% 1.25rem;
          }
        }

        .more-button {
          width: 100%;
          display: flex;
          justify-content: space-between;
          margin-top: .5rem;
          font-size: .4rem;

          span {
            cursor: pointer;
          }
        }

        .form-bottom {
          margin-top: 1rem;
          display: flex;
          justify-content: center;
          flex-direction: column;
          p:first-child {
            color: #00FFF6;
            font-size: .4rem;
          }

          p:last-child {
            font-size: .1rem;
          }
        }
      }
    }

    .form-button {
      margin-top: .5rem;
      width: 4.8725rem;
      height: 1rem;
      line-height: 1rem;
      font-size: .5rem;
      //background-image: url("../../../assets/img/login/login_btn.png");
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
  @media only screen and (max-width: 1024px) {
    .form-warp {
      width: 100vw;
      padding: 3rem;
      .form-box {
        width: 100%;
        .form-title {
          height: 3rem;
          line-height: 3rem;
          border-image-slice: 30 fill;
          span {
            font-size: 1.5rem;
          }
          .icon:before {
            bottom: 0;
            right: -.3rem;
            width: 4rem;
            height: 4rem;
          }
        }

        .form-content {
          justify-content: start;
          min-height: 25rem;
          padding: 1rem 2rem;
          .form-item {
            margin-top: 3rem;
            .icon {
              display: none;
              &:before {
                width: 3rem;
                height: 3rem;
              }
            }
            .input-box {
              .input-title {
                top: -2rem;
                font-size: 1rem;
              }
              input {
                height: 2rem;
                font-size: .8rem;
              }
            }
            .input-box-code {
              width: 50%;
              input {
                width: 100%;
              }
            }

            .input-button {
              width: 50%;
              cursor: pointer;
              height: 3rem;
              line-height: 3rem;
              font-size: .25rem;
              font-weight: bold;
              padding: 0 .5rem;
              //border-image-source: url("../../assets/img/login/login_btn.png");
              //border-image-slice: 20 fill;
              //border-image-width: .5rem;
              //background-image: url("../../../assets/img/login/login_btn.png");
              background-repeat: no-repeat;
              background-position: center;
              background-size: 100% 3rem;
            }
          }
          .form-bottom {
            width: 100%;
            padding:0 2rem;
            p:first-child {
              color: #00FFF6;
              font-size: 1.2rem;
            }

            p:last-child {
              font-size: .9rem;
            }
          }
        }
      }

      .form-button {
        width: 50%;
        height: 5rem;
        line-height: 5rem;
        border-image-slice: 20 fill;
        border-image-width: 1rem;
        //border-image-source: url("../../../assets/img/login/login_btn.png");
      }
    }
  }
}

</style>
