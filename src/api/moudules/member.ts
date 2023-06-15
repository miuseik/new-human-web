import axios from "@/api/request.js";
import storage from "store2";

const member = {
    GetMemberUserBag() { //          * 获取用户背包列表
        let url = '/api/Member/GetMemberUserBag'
        let Email = storage.get('EMAIL') || ''
        if (!Email) return
        let param = {
            AccId: Email	//用户账号		false string
        }
        return axios.post(url, param);
        //Id	背包物品编号	string
        // ItemType	物品类型	integer(int32)	integer(int32)
        // ItemID	物品编号	integer(int32)	integer(int32)
        // ItemNum	物品数量	integer(int32)	integer(int32)
    },
    GetMemberUserAssetInfo() { //          * 获取用户资产信息
        let url = '/api/Member/GetMemberUserAssetInfo'
        let Email = storage.get('EMAIL') || ''
        if (!Email) return
        let param = {
            Email: Email	//账号 邮件地址
        }
        if (!Email) return
        return axios.post(url, param);
        // USDT	USDT 余额	number(double)	number(double)
        // Fuc	Fuc余额	number(double)	number(double)
        // Diamond	矿钻	number(double)	number(double)
        // Fa	Fα	integer(int64)	integer(int64)
        // Ticket	代金券	number(double)	number(double)
    },
    GetShopList(data = {}) { //          * 获取商店列表
        let url = '/api/Member/GetShopList'
        let param = data
        return axios.get(url, param);
        //	"shopList": []
    },
    GetMineDiamondNum(data = {}) { //          * 获取矿池中矿钻的数量
        let url = '/api/Member/GetMineDiamondNum'
        let param = data
        return axios.get(url, param);
    },
    Lottery(data = {}) { //          * 抽奖
        let url = '/api/Member/Lottery'
        let param = {
            ItemId: data['ItemId'], //	背包物品ID		falseinteger(int32)
            Num   : data['Num'], //	数量		falseinteger(int32)
        }
        return axios.post(url, param);
        //ItemId	物品ID	integer(int32)	integer(int32)
        // ItemType	物品类型	integer(int32)	integer(int32)
        // ItemNum	物品数量	integer(int32)	integer(int32)
    },
    BindReferrer(data = {}) { //          * 获取矿池中矿钻的数量
        let url = '/api/Member/BindReferrer'
        let param = {
            InvitationCode: data["InvitationCode"] || ""
        }
        return axios.post(url, param);
    },
    GetCenterInfo() { //          * 获取矿池中矿钻的数量
        let url = '/api/Member/GetCenterInfo'
        return axios.post(url, '');
        //ParentCode	推荐人邀请码	string
        // centerInfos	代理信息	array	CenterInfo
        // Level	代理的级别	integer(int32)
        // Num	邀请的人数	integer(int32)
        // Commission	佣金	number(double)
    },
    GetWithDrawalRecord(data = {}) { // 获取用户提现记录
        let url = '/api/Member/GetWithDrawalRecord'
        let param = {
            pageIndex: data['pageIndex'] || 0, //	开始索引		falseinteger(int32)
            pageCount: data['pageCount'] || 20, //	每页数量		falseinteger(int32
        }
        return axios.post(url, param);
        //ID	ID	integer(int64)
        // AccId	账号ID	string
        // OrderId	订单号	integer(int64)
        // Address	提现地址	string
        // Type	提现类型	integer(int32)
        // Amount	提现金额	number(double)
        // RealAmount	到账金额	number(double)
        // Status	状态	integer(int32)
        // CreateTime	订单生成时间	string(date-time)
        // ReceivedTime	提现到账时间	string(date-time)
        // Content	提现备注	string
    },
}

export default member
