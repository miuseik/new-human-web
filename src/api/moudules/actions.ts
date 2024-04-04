import axios from "@/api/request.js";

const login = {
    list(data = {}) { //          * 所有
        let url = '/actions/list'
        let param = data
        return axios.get(url, param);
    },
    push(data = {}) {
        let url = '/actions/new'
        let param = data || {}
        return axios.post(url, param);
    },
    delete(data = {}) {
        let url = '/actions/delete'
        let param = data || {}
        return axios.post(url, param);
    },
    revise(data = {}) {
        let url = '/actions/revise'
        let param = data || {}
        return axios.post(url, param);
    },
    get(data = {}) {
        let url = '/actions'
        let param = data || {}
        return axios.post(url, param);
    },
}

export default login
