import {defineStore} from "pinia"
import storage from "store2";
import API from "@/api";
import axios from "axios";

const bores = defineStore('bores', {
    state  : () => ({
        boresList  : [],
    }),
    actions: {
        getBoresList() {
            return new Promise(((resolve, reject) => {
                API.bores.list().then(res => {
                    this.boresList =res.data
                    resolve(this.boresList)
                }).catch(err => {
                    reject(err)
                })
            }))
        },
    }
})

export default bores
