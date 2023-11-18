import axios from "axios";
import router from "../router";
import storage from "store2";
import {ElMessage} from 'element-plus';
import env from "@/env/moudules/env.js";
import {debounce} from "@/utils/putlic/index.js"
// 创建axios实例
const request   = axios.create({
    baseURL        : "/api",// 所有的请求地址前缀部分(没有后端请求不用写)
    timeout        : 80000, // 请求超时时间(毫秒)
    withCredentials: true,// 异步请求携带cookie  baseURL: '/api',
    headers        : {},
});
const tip       = debounce((msg) => {
    ElMessage({
        showClose: true,
        message  : msg || '未知错误',
        type     : 'warning',
    });
}, 200);
const resHandle = (data, other) => {
    let code = data.code || data.status || ''
    let msg = data.msg || data.Message || ''
    if (code.toString() !== '200') {
        errorHandle(data, code, msg);
    }
};

const errorHandle = (data, status, message) => {
    // 状态码判断
    switch (status) {
        case 401: // 401: 未登录状态，跳转登录页
            // router.replace ({path: '/login'});
            if (router.currentRoute.value.name !== 'login') {
                // setTimeout(() => {
                    tip('Login Expired');
                    localStorage.removeItem('ACCESS_TOKEN');
                    // window.localStorage.clear (); //清除缓存
                    router.replace({path: '/login'});
                // }, 1000);
            }

            break;
        case 403: // 403 token过期
            if (router.currentRoute.value.name !== 'login') {
                // setTimeout(() => {
                    tip('Login Expired');
                    localStorage.removeItem('ACCESS_TOKEN');
                    // window.localStorage.clear (); //清除缓存
                    router.replace({path: '/login'});
                // }, 1000);
            }

            // tip ('Login Expired');

            // window.localStorage.clear (); //清除缓存
            // setTimeout (() => {
            // 		router.replace ({path: '/login'});
            // }, 1000);
            break;
        case 404: // 404请求不存在
            tip('The requested resource does not exist');
            break;
        case 500: // 404请求不存在
            tip('500);
            break;
        default:
            console.log('data', data)
            tip(message);
    }
};
// request拦截器
request.interceptors.request.use(config => {
        // const token = storage.get('ACCESS_TOKEN');
        // if (token) {
        //     config.headers["Authorization"] = `Bearer ${token}`;
        // } else {
        //     sessionStorage.removeItem("ACCESS_TOKEN");
        // }
        return config;
    }, error => {
        Promise.reject(error);
    },
);
// response 拦截器
request.interceptors.response.use(res => {
        resHandle(res.data);
        return res.data;
    }, error => {
        const response = error.response || "";
        if (response) {
            errorHandle(response, response.status);
            return Promise.reject(response);
        }
    },
);
export default request;
