import {defineStore} from "pinia"
import storage from "store2";
import API from "@/api";
import axios from "axios";

const setBody = (data) => {
    data.map(group => {
        for (let item in group) {
            if (item === 'size' || item === 'position' || item === 'rotate' || item === 'option') {
                group[item] = JSON.parse(group[item])
            }
        }
    })
    return data
}
const bores = defineStore('bores', {
    state  : () => ({
        boresList: [],
    }),
    actions: {
        getBoresList() {
            return new Promise(((resolve, reject) => {
                API.bores.list().then(res => {
                    let data = res.data
                    let newData = setBody(data)
                    this.boresList = newData
                    resolve(this.boresList)
                }).catch(err => {
                    reject(err)
                })
            }))
        },
    }
})

export default bores
