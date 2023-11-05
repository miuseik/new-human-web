import axios from "@/api/request.js";


const newHuman = {
    // index(data){ // 登陆
    //     let url = '/'
    //     return axios.post(url, data);
    // },
    query_bluetooth(){ // 登陆
        let url = '/serial/query_bluetooth'
        return axios.get(url);
    },
    confirm_serial(data){ // 登陆
        let url = '/serial/confirm_serial'
        return axios.post(url, data);
    },
}

export default newHuman
