export function debounce(func, wait, immediate) {
    let timeout, args, context, timestamp, result;

    const later = function () {
        // 据上一次触发时间间隔
        const last = +new Date() - timestamp;

        // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
        if (last < wait && last > 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            timeout = null;
            // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
            if (!immediate) {
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            }
        }
    };

    return function (...args) {
        context = this;
        timestamp = +new Date();
        const callNow = immediate && !timeout;
        // 如果延时不存在，重新设定延时
        if (!timeout) timeout = setTimeout(later, wait);
        if (callNow) {
            result = func.apply(context, args);
            context = args = null;
        }

        return result;
    };
}

// 根据某个属性值从MenuList查找拥有该属性值的menuItem
export function getMenuItemInMenuListByProperty(menuList, key, value) {
    let stack = [];
    stack = stack.concat(menuList);
    let res;
    while (stack.length) {
        let cur = stack.shift();
        if (cur.children && cur.children.length > 0) {
            stack = cur.children.concat(stack);
        }
        if (value === cur[key]) {
            res = cur;
        }
    }
    return res;
}

/**
 * @description 将时间戳转换为年-月-日-时-分-秒格式
 * @param {String} timestamp
 * @returns {String} 年-月-日-时-分-秒
 */

export function timestampToTime(timestamp, isDay = false) {
    isDay = isDay || false;
    var date = new Date(timestamp);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());

    let strDate = Y + M + D + h + m + s;
    if (isDay) {
        strDate = Y + M + D;
    }
    return strDate;
}

export function getNowMonthFirst() {
    const date = new Date()
    date.setDate(1)
    return timestampToTime(date.toDateString(),true)
}

export function getNowMonthLast() {
    const date = new Date()
    return timestampToTime(new Date(date.getFullYear(), date.getMonth() + 1, 0).toDateString(),true)
}

/**
 * 解析url参数
 * @param url
 * @returns {{}}
 */
export function getParams(url) {
    let u = url.split("?");
    if (typeof (u[1]) == "string") {
        u = u[1].split("&");
        const get = {};
        for (const i in u) {
            const j = u[i].split("=");
            get[j[0]] = j[1];
        }
        return get;
    } else {
        return {};
    }
}