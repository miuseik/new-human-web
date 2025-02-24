export default {
    helpDescription: [
        {title_: "骨骼绑定说明"},
        {text__: "每个骨骼都有一个实际的模型,外壳也是模型,关节轴是mash"},
        {text__: "model_type字段"},
        {text__: "模型都是从动的"},
        {text__: "关节轴都是对主动的"},
        {text__: "每个关节轴就是一个实际的关节"},
        {text__: "肢体运动与的方向还有幅度都受限于关节轴的参数"},
        {text__: "关节轴是一个Mash,可以设置关节轴的大小,关节轴不导入模型"},
        // {text__: "root字段时跟字段,表示所有关节的起点,一个body只有一个root"},
        {text__: "parent为0的节点为根节点"},
    ],
    itemTpl: {
        id: 0, //新增时 id为负数,
        field: "D", // 用来标记做特殊处理的字段名
        root: null, // 保留字段
        name: '', // 显示的名称
        model_name: '.stl', //模型后缀名
        model_type: '0', // 0:被动,1:主动
        master_slave: '0', // 主从
        option: {
            x: {
                open: false, // 是否开启
                server_reverse: false, // 服务器是否反向
                model_reverse: false, // 模型是否反向
                max: parseFloat((Math.PI / 2).toFixed(4)), // 最大角度
                min: parseFloat((-Math.PI / 2).toFixed(4)), // 最小角度
                value: 0
            },
            y: {
                open: false,
                server_reverse: false,
                model_reverse: false,
                max: parseFloat((Math.PI / 2).toFixed(4)),
                min: parseFloat((-Math.PI / 2).toFixed(4)),
                value: 0
            },
            z: {
                open: false,
                server_reverse: false,
                model_reverse: false,
                max: parseFloat((Math.PI / 2).toFixed(4)),
                min: parseFloat((-Math.PI / 2).toFixed(4)),
                value: 0
            }
        },
        size: 0, // 模型大小(仅对关节起效)
        position: { // 默认位置
            x: 0,
            y: 0,
            z: 0
        },
        rotate: { // 默认旋转
            x: 0,
            y: 0,
            z: 0
        },
        parent: 0, // 父节点
    },
    actions: {
        D1: {
            times: [],
            values: {},
            action: {},
            key: 1,
            direction: {
                "x": true,
                "y": true,
                "z": true,
            },
            index: 0
        },
        D2: {
            times: [],
            values: {},
            action: {},
            key: 45,
            direction: {
                "x": true,
                "y": true,
                "z": true,
            },
            index: 0
        },
        D3: {
            times: [],
            values: {},
            action: {},
            key: 46,
            direction: {
                "x": true,
                "y": false,
                "z": false,
            },
            index: 0
        },
        D4: {
            times: [],
            values: {},
            action: {},
            key: 49,
            direction: {
                "x": true,
                "y": true,
                "z": true,
            },
            index: 0
        },
        D5: {
            times: [],
            values: {},
            action: {},
            key: 50,
            direction: {
                "x": true,
                "y": false,
                "z": false,
            },
            index: 0
        },
        D6: {
            times: [],
            values: {},
            action: {},
            key: 51,
            direction: {
                "x": true,
                "y": false,
                "z": false,
            },
            index: 0
        },
        D7: {
            times: [],
            values: {},
            action: {},
            key: 47,
            direction: {
                "x": true,
                "y": false,
                "z": false,
            },
            index: 0
        },
        D8: {
            times: [],
            values: {},
            action: {},
            key: 47,
            direction: {
                "x": false,
                "y": false,
                "z": true,
            },
            index: 0
        },
        D9: {
            times: [],
            values: {},
            action: {},
            key: 51,
            direction: {
                "x": false,
                "y": false,
                "z": true,
            },
            index: 0
        },
        D10: {
            times: [],
            values: {},
            action: {},
            key: 48,
            direction: {
                "x": true,
                "y": false,
                "z": false,
            },
            index: 0
        },
        D11: {
            times: [],
            values: {},
            action: {},
            key: 48,
            direction: {
                "x": true,
                "y": false,
                "z": false,
            },
            index: 0
        },
        D12: {
            times: [],
            values: {},
            action: {},
            key: 48,
            direction: {
                "x": true,
                "y": false,
                "z": false,
            },
            index: 0
        },
        D13: {
            times: [],
            values: {},
            action: {},
            key: 48,
            direction: {
                "x": true,
                "y": false,
                "z": false,
            },
            index: 0
        },
        D14: {
            times: [],
            values: {},
            action: {},
            key: 48,
            direction: {
                "x": true,
                "y": false,
                "z": false,
            },
            index: 0
        },
        D15: {
            times: [],
            values: {},
            action: {},
            key: 52,
            direction: {
                "x": true,
                "y": false,
                "z": false,
            },
            index: 0
        },
        D16: {
            times: [],
            values: {},
            action: {},
            key: 52,
            direction: {
                "x": true,
                "y": false,
                "z": false,
            },
            index: 0
        },
        D17: {
            times: [],
            values: {},
            action: {},
            key: 52,
            direction: {
                "x": true,
                "y": false,
                "z": false,
            },
            index: 0
        },
        D18: {
            times: [],
            values: {},
            action: {},
            key: 52,
            direction: {
                "x": true,
                "y": false,
                "z": false,
            },
            index: 0
        },
        D19: {
            times: [],
            values: {},
            action: {},
            key: 52,
            direction: {
                "x": true,
                "y": false,
                "z": false,
            },
            index: 0
        },
    },
}