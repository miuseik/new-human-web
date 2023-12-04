import {defineStore} from "pinia"
import storage from "store2";
import API from "@/api";

const setBody = (data) => {
    data.map(group => {
        for (let item in group) {
            if (item === 'size' || item === 'position' || item === 'rotate' || item === 'option') {
                console.log(item)
                console.log(group[item])

                group[item] = JSON.parse(group[item])
            }
        }
    })
    return data
}
const bone = defineStore('bone', {
    state  : () => ({
        boneList: [],
        joinTArr: {},
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
                    console.log('--------------------',1)
                    let data = res.data
                    console.log('--------------------',2)
                    // let newData = data
                    console.log('--------------------',3)
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
