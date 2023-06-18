import axios from "@/api/request.js";


const newHuman = {
    // index(data){ //
    //     let url = '/'
    //     return axios.post(url, data);
    // },
    query_bluetooth(){ //
        let url = '/serial/query_bluetooth'

        return axios.get(url);
    },
    confirm_serial(data){ //
        let url = '/serial/confirm_serial'
        return axios.post(url, data);
    },
}

export default newHuman
