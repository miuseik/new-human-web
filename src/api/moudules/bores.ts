import axios from "@/api/request.js";

const login = {
    list(data = {}) { //          * 所有
        let url = '/bones/list'
        let param = data
        return axios.get(url, param);
    },
    push(data = {}) { //          * 修改
        let url = '/bones/new'
        let param = data || {}
        return axios.post(url, param);
    },
    delete(data = {}) { //          * 修改
        let url = '/bores/delete'
        let param = {
            InvitationCode: data['InvitationCode'] || '', //|邀请码||false|string||
        }
        return axios.post(url, param);
    },
    put(data = {}) { //          * 修改
        let url = '/bores/put'
        let param = {
            InvitationCode: data['InvitationCode'] || '', //|邀请码||false|string||
        }
        return axios.post(url, param);
    },
    get(data = {}) { //          * 修改
        let url = '/bores'
        let param = {
            InvitationCode: data['InvitationCode'] || '', //|邀请码||false|string||
        }
        return axios.post(url, param);
    },

}

export default login
