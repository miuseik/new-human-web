import axios from "@/api/request.js";

const account = {
    GetRemainTime(data = {}) { // 剩余时间
        let url = '/api/PayWithdrawal/GetRemainTime'
        return axios.get(url, data);
    },
    ApplyWithdrawal(data = {}) { // 申请提现
        let url = '/api/PayWithdrawal/ApplyWithdrawal'
        let param = {
            Address: data['Address'] || '', //提现地址        false string
            Type   : data['Type'] || 0, //提现货币类型        false integer(int32)
            Amount : data['Amount'] || 0, //提现金额数量        false integer(int64)
            Content: data['Content'] || '', //提现备注        false integer(int64)
        }
        return axios.post(url, param);
    },
    PayOrder(data = {}) { // 支付
        let url = '/api/PayWithdrawal/PayOrder'
        let param = {
            AccId        : data['AccId'] || '',//账号		falsestring
            ServerId     : data['ServerId'] || '',//区服ID		falsestring
            RId          : data['RId'] || 0,//角色ID		falseinteger(int32)
            Amount       : data['Amount'] || 0,//支付金额		false double(double32)
            TransactionId: data['TransactionId'] || 0,//商品ID （充值类型，礼包或者FUC）		falseinteger(int32)
            PayType      : data['PayType'] || 0,//支付类型 1-线上支付 2-余额支付falseinteger(int32)
        }
        return axios.post(url, param);
        //OrderId	订单ID
    },
    GetSaledBoxNum(data = {}) { //          * 获取游戏区服列表
        let url = '/api/PayWithdrawal/GetSaledBoxNum'
        let param = data
        return axios.get(url, param);
    },
}

export default account
