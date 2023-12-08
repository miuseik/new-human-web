import axios from "@/api/request.js";

const bone = {
    list(data = {}) { //          * 所有
        let url = '/bone/list'
        return axios.get(url, { params: data });
    },
    push(data = {}) {
        let url = '/bone/new'
        let param = data || {}
        return axios.post(url, param);
    },
    delete(data = {}) {
        let url = '/bone/delete'
        return axios.get(url, { params: data });
    },
    revise(data = {}) {
        let url = '/bone/revise'
        let param = data || {}
        return axios.post(url, param);
    },
    get(data = {}) {
        let url = '/bone'
        let param = data || {}
        return axios.post(url, param);
    },

}

export default bone
