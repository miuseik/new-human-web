import {defineStore} from "pinia"
import storage from "store2";
import API from "@/api";
import axios from "axios";

const common = defineStore('common', {
    // defineStore(id(一个储存库标识))
    state  : () => ({
        MineDiamond  : storage.get('MINE_DIAMOND') || '',
        recharge_data: {},
        item_data    : {},
        role_data    : {},
        shareInvitationCode:storage.get('shareInvitationCode')|| '',
        boxNum:storage.get('boxNum') || 0,
        FUCate:storage.get('FUCate') || 0,
    }),
    actions: {
        GetMineDiamondNum() {
            return new Promise(((resolve, reject) => {
                API.member.GetMineDiamondNum().then(res => {
                    this.MineDiamond =res && res.Data.toString() || ''
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            }))
        },
        GetSaledBoxNum() {
            return new Promise(((resolve) => {
                API.pay.GetSaledBoxNum().then((res) => {

                    let num = res.Data  ;
                    this.boxNum = num
                    storage.set('boxNum', num)
                    resolve(num)
                });
            }))
        },
        GetFUCToURate() {
            return new Promise(((resolve) => {
                API.game.GetFUCToURate().then((res) => {
                    let num = res.Data  ;
                    this.FUCate = num
                    storage.set('FUCate', num)
                    resolve(num)
                });
            }))
        },
        GetPublicData() {
            return new Promise(((resolve) => {
                axios.get('/json/recharge.json').then(res => {
                    this.recharge_data = res.data;
                    resolve(res)
                })
                axios.get('/json/item.json').then(res => {
                    this.item_data = res.data;
                    resolve(res)
                })
                axios.get('/json/role.json').then(res => {
                    this.role_data = res.data;
                    resolve(res)
                })
            }))
        },

    }
})

export default common
