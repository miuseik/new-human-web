import axios from "@/api/request.js";

const login = {
    GetCaptcha(data = {}) { //          * 获取一个验证码
        let url = '/api/Captcha/GetCaptcha'
        let param = data
        return axios.get(url, param);
    },
    Register(data = {}) { //          * 注册
        let url = '/api/Member/Register'
        let param = {
            Email         : data['Email'] || '', //|电子信箱||true|string||
            Name          : data['Name'] || '', //|昵称，不允许重复||true|string||
            Code          : data['Code'] || '', //|电子信箱验证码||true|string||
            Password      : data['Password'] || '', //|密码||true|string||
            InvitationCode: data['InvitationCode'] || '', //|邀请码||false|string||
        }
        return axios.post(url, param);
    },
    SendRegisterCodeegisterCode(data = {}) { //      * 发送注册验证码ta
        let url = '/api/Member/SendRegisterCode'
        let param = {
            "ImageId": data['ImageId'] || "",//图形验证Id string
            "Code"   : data['Code'] || "",//用户输入的验证码 string
            "Email"  : data['Email'] || "" //电子信箱 string
        }
        return axios.post(url, param);
    },
    SendResetPasswordCode(data = {}) { //          * 向电子信箱发送重置密码验证码
        let url = '/api/Member/SendResetPasswordCode'
        let param = {
            ImageId: data['ImageId'] || '',//|图形验证Id||false|string||
            Code   : data['Code'] || '',//用户输入的验证码||false|string||
            Email  : data['Email'] || '',//电子信箱||false|string||
        }
        return axios.post(url, param);
    },
    ResetPassword(data = {}) { //          * 重置密码
        let url = '/api/Member/ResetPassword'
        let param = {
            Email   : data['Email'] || '',	//电子信箱		false             string
            Code    : data['Code'] || '',	//电子信箱验证码		false             string
            Password: data['Password'] || '',	//密码		false             string
        }
        return axios.post(url, param);
    },
    Login(data = {}) { //          * 登录
        let url = '/api/Member/Login'
        let param = {
            Email   : data['Email'] || '',	//电子邮件		false             string
            Password: data['Password'] || '',	//密码		false             string
        }
        return axios.post(url, param);
        //UserId	用户Id	integer(int64)	integer(int64)
        // Email	电子邮件	string
        // Name	昵称	string
        // Address	用户钱包地址	string
        // InvitationCode	用户邀请码	string
        // Token	用户Token	string
    },
    LoginOut(data = {}) { //          * 退出登录
        let url = '/api/Member/LoginOut'
        let param = data
        return axios.post(url, param);
    },
    UpdateMember(data = {}) { //          * 修改会员信息
        let url = '/api/Member/UpdateMember'
        let param = {
            Name   : data['Name'] || '',	//昵称		false string
            Address: data['Address'] || '',	//钱包地址		false string
        }
        return axios.post(url, param);
    },
    InvitationCodeIsExist(data = {}) { //          * 验证邀请码是否存在
        let url = '/api/Member/InvitationCodeIsExist'
        let param = {
            "code": data['code'] || "",//图形验证Id string
        }
        return axios.post(url, param);
    },
    MemberInfo(data = {}) { //          * 获取用户自身信息
        let url = '/api/Member/MemberInfo'
        let param = data
        return axios.get(url, param);
        //UserId	用户Id	integer(int64)	integer(int64)
        // Email	电子邮件	string
        // Name	昵称	string
        // Address	用户钱包地址	string
        // InvitationCode	用户邀请码	string
    },
    GetMe(data = {}) { //          * 获取当前用户的数字Id
        let url = '/api/Member/GetMe'
        let param = data
        return axios.post(url, param);
    },



    GETFUCToURate(data = {}) { // 查询fuc兑换usdt的
        let url = '/api/Game/GetFUCToURate'
        let param = data
        return axios.get(url, param);
        //OrderId	订单ID
    },
    PayOrderNotify(data = {}) { // 支付回调
        let url = '/api/Member/PayOrderNotify'
        let param = {
            OrderId: data['OrderId'] || 0, //订单号		false integer(int64)
            Amount : data['Amount'] || 0, //支付金额		false integer(int32)
            Status : data['Status'] || 0, //支付状态 1-成功 0-失败		false integer(int32)
            Type   : data['Type'] || 0, //货币类型		false integer(int32)
            Address: data['Address'] || '', //地址		false string
            Sign   : data['Sign'] || '', //签名		false string
            Ticket : data['Ticket'] || 0, //回调发起时间		false integer(int64)
            Time   : data['Time'] || 0//充值完成时间		falseinteger(int64)

        }
        return axios.post(url, param);
    },


    WithdrawalToGameRole(data = {}) { // 申请提现到角色
        let url = '/api/Game/WithdrawalToGameRole'
        let param = {
            AccId:      data['AccId'] || '', //	账号        false string
            ServerId:   data['ServerId'] || '', //	区服ID        false string 
            RId :       data['RId'] || 0, //角色ID        false integer(int32)
            ItemId :    data['ItemId'] || 0, //	提现物品ID        false integer(int32)
            Num :       data['Num'] || 0, //提现物品数量        false integer(int32)

        }
        return axios.post(url, param);
    },
    WithdrawalNotify(data = {}) { // 提现回调//
        let url = '/api/Member/WithdrawalNotify'
        let param = {
            Type   : data['Type'] || '',	//提现类型		false integer(int32)
            OrderId: data['OrderId'] || '',	//订单ID		false integer(int64)
            Amount : data['Amount'] || '',	//提现金额		false integer(int64)
            Time   : data['Time'] || '',	//提现完成时间		false integer(int64)
            Address: data[''] || '',	//提现地址		false string
            Ticket : data['Address'] || '',	//提现发起时间		false integer(int64)
            Hash   : data['Ticket'] || '',	//哈希值		false string
            Sign   : data['Hash'] || '',	//签名		false string
        }
        return axios.post(url, param);

    },
}

export default login
