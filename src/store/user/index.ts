import {defineStore} from "pinia"
import storage from "store2";
import API from "@/api";
import {useRouter} from 'vue-router'
const router = useRouter()
import {ElMessage} from 'element-plus';

const user = defineStore('user', {
    state: () => ({
        token: storage.get('ACCESS_TOKEN') || '',
    }),
    actions: {
        toLogin(req) {
            return new Promise(((resolve, reject) => {
                API.login.Login(req).then(res => {
                    console.log(res)
                    let data = res.data || {}
                    if (res.code.toString() === '200') {
                        ElMessage ({
                            showClose: true,
                            message  : '登陆成功',
                            type     : 'success',
                        });
                        storage.set('ACCESS_TOKEN', data['token']);
                        this.token = data['token']
                        router.replace({path: '/'})
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
