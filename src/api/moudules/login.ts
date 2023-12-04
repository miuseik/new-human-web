import axios from "@/api/request.js";

const login = {
    Register(data = {}) { //          * 注册
        let url = '/Member/register'
        let param = {
            Email         : data['Email'] || '', //|电子信箱||true|string||
            Name          : data['Name'] || '', //|昵称，不允许重复||true|string||
            Code          : data['Code'] || '', //|电子信箱验证码||true|string||
            password      : data['password'] || '', //|密码||true|string||
            InvitationCode: data['InvitationCode'] || '', //|邀请码||false|string||
        }
        return axios.post(url, param);
    },
    Login(data = {}) { //          * 登录
        let url = '/user/login'
        let param = {
            username   : data['username'] || '',	//电子邮件		false             string
            password: data['password'] || '',	//密码		false             string
        }
        return axios.post(url, param);
        //UserId	用户Id	integer(int64)	integer(int64)
        // Email	电子邮件	string
        // Name	昵称	string
        // Address	用户钱包地址	string
        // InvitationCode	用户邀请码	string
        // Token	用户Token	string
    },
}

export default login
