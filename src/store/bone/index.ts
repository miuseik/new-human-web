import {defineStore} from "pinia"
import API from "@/api";

const bone = defineStore('bone', {
    state  : () => ({
        boneList: [],//骨骼原始数据
        JointArray: {}, //主动以及关节数据
        animateActions: null, //动画动作库
    }),
    actions: {
        setBoneList() {
            return new Promise(((resolve, reject) => {
                API.bone.list().then(res => {
                    this.boneList = res.data
                    resolve(this.boneList)
                }).catch(err => {
                    reject(err)
                })
            }))
        },
        addAnimateAction(actionData) {
            this.animateActions = actionData;
        }
    },
    getters: {
        getBoneList() {
            return this.boneList
        },
        getAnimateActions() {
            return this.animateActions
        }
    }
})

export default bone
