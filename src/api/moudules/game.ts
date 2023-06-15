import axios from "@/api/request.js";

const game = {
    GetServerInfo(data = {}) { //          * 获取游戏区服列表
        let url = '/api/Game/GetServerInfo'
        let param = data
        return axios.post(url, param);
        // Id	区服ID	string
        // Name	区服名称	string
    },
    GetGameRoleInfos(data = {}) { // 获取游戏角色信息列表
        let url = '/api/Game/GetGameRoleInfos'
        let param = {
            username: data['username'] || '' //账号
        }
        return axios.post(url, param);
        //serverId	区服ID	string
        // roleInfos	角色信息列表	array	RoleInfo
        // rId	角色ID	integer(int32)
        // rName	角色名称	string
        // rBLv	转生等级	integer(int32)
        // rLv	等级	integer(int32)
        // rType	角色类型	integer(int32)
    },
    GetGameUserAssetInfo(data = {}) { // 获取用户角色资产信息
        let url = '/api/Game/GetGameUserAssetInfo'
        let param = {
            AccId   : data['AccId'] || '',//账号		falsestring
            ServerId: data['ServerId'] || '',//区服ID		falsestring
            RId     : data['RId'] || '',//角色ID		falseinteger(int32)

        }
        return axios.post(url, param);
        // Fuc	Fuc余额	integer(int32)	integer(int32)
        // Crystal	浮晶余额	integer(int32)	integer(int32)
        // Coin	金币余额	integer(int32)	integer(int32)
    },
    WithdrawalToGameRole(data = {}) { //          * 资产提现到游戏角色
        let url = '/api/Game/WithdrawalToGameRole'
        let param = {
            AccId   : data['AccId'],	//账号		falsestring
            ServerId: data['ServerId'],	//区服ID		falsestring
            RId     : data['RId'],	//角色ID		falseinteger(int32)
            ItemId  : data['ItemId'],	//提现物品ID		falseinteger(int32)
            Num     : data['Num'] || 0,	//提现物品数量		falseinteger(int32)
        }
        return axios.get(url, param);
    },
    GetFUCToURate(data = {}) { //          * 获取FUC兑换USDT比例
        let url = '/api/Game/GetFUCToURate'
        let param = data
        return axios.get(url, param);
    },
}

export default game
