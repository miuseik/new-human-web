import {defineStore} from "pinia"
import storage from "store2";
import API from "@/api";
import {useRouter} from 'vue-router'
import {ElMessage} from 'element-plus';
const router = useRouter()

const user = defineStore('user', {
    state: () => ({
        token: storage.get('ACCESS_TOKEN') || '',
    }),
    actions: {
        toLogin(req) {
            return new Promise(((resolve, reject) => {
                API.login.Login(req).then(res => {
                    let data = res.data || {}
                    if (res.code.toString() === '200') {
                        ElMessage ({
                            showClose: true,
                            message  : '登陆成功',
                            type     : 'success',
                        });
                        storage.set('ACCESS_TOKEN', data['token']);
                        this.token = data['token']
                        resolve(res)
                    }
                }).catch(err => {
                    reject(err)
                })
            }))
        },
    }
})

export default user
