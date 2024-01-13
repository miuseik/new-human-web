export const debounce = (fn, delay) => {
    let timer = null;
    return function () {
        let context = this;
        let args    = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    };
};
export default debounce;

//封装节流
//新建文件后将以下代码放入
export const throttle     = (fn, delay) => {
    let valid = true;
    return function () {
        let context = this;
        let args    = arguments;
        if (!valid) {
            return false;
        }
        valid = false;
        setTimeout(() => {
            fn.apply(context, args);
            valid = true;
        }, delay);
    };
};
export const createRandom = ( max,min=0) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

//使用递归的方式实现数组、对象的深拷贝
export function cloneDeep(obj) {
    let objClone = Array.isArray(obj) ?
        [] :
        {};
    if (obj && typeof obj === "object") {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                //判断ojb子元素是否为对象，如果是，递归复制
                if (obj[key] && typeof obj[key] === "object") {
                    objClone[key] = cloneDeep(obj[key]);
                } else {
                    //如果不是，简单复制
                    objClone[key] = obj[key];
                }
            }
        }
    }
    return objClone;
}
