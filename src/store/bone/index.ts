import {defineStore} from "pinia"
import storage from "store2";
import API from "@/api";

const bone = defineStore('bone', {
    state  : () => ({
        boneList: [],//骨骼原始数据
        JointArray: {},
        motionData:{
            Leg_lift:['','','','','','','','','','','','','','',],
            D3:['','','','','','','','','','','','','','',],
            D4x:['','','','','','','','','','','','','','',],
            D4y:['','','','','','','','','','','','','','',],
            D4z:['','','','','','','','','','','','','','',],
        }
    }),
    actions: {
        getBoneList() {
            return new Promise(((resolve, reject) => {
                API.bone.list().then(res => {
                    let data = res.data
                    // let newData = data
                    this.boneList = data
                    resolve(this.boneList)
                }).catch(err => {
                    reject(err)
                })
            }))
        },
    }
})

export default bone
