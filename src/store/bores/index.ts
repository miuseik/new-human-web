import {defineStore} from "pinia"
import storage from "store2";
import API from "@/api";
import axios from "axios";

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
const bores = defineStore('bores', {
    state  : () => ({
        boresList: [],
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
        getBoresList() {
            return new Promise(((resolve, reject) => {
                API.bores.list().then(res => {
                    console.log('--------------------',1)
                    let data = res.data
                    console.log('--------------------',2)
                    // let newData = data
                    console.log('--------------------',3)
                    this.boresList = data
                    resolve(this.boresList)
                }).catch(err => {
                    reject(err)
                })
            }))
        },
    }
})

export default bores
