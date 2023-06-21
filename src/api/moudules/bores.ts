import axios from "@/api/request.js";

const login = {
    list(data = {}) { //          * 所有
        let url = '/bones/list'
        let param = data
        return axios.get(url, param);
    },
    push(data = {}) {
        let url = '/bones/new'
        let param = data || {}
        return axios.post(url, param);
    },
    delete(data = {}) {
        let url = '/bones/delete'
        let param = data || {}
        return axios.post(url, param);
    },
    revise(data = {}) {
        let url = '/bones/revise'
        // let url = '/bores/newnw'
        let param = data || {}
        return axios.post(url, param);
    },
    get(data = {}) {
        let url = '/bones'
        let param = data || {}
        return axios.post(url, param);
    },

}

export default login
