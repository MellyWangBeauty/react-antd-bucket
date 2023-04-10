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
    return timestampToTime(date.toDateString(), true)
}

export function getNowMonthLast() {
    const date = new Date()
    return timestampToTime(new Date(date.getFullYear(), date.getMonth() + 1, 0).toDateString(), true)
}

export function arrayBufferToBase64(array) {
    array = new Uint8Array(array);
    var length = array.byteLength;
    var table = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/'];
    var base64Str = "";
    for (var i = 0; length - i >= 3; i += 3) {
        var num1 = array[i];
        var num2 = array[i + 1];
        var num3 = array[i + 2];
        base64Str +=
            table[num1 >>> 2] +
            table[((num1 & 0b11) << 4) | (num2 >>> 4)] +
            table[((num2 & 0b1111) << 2) | (num3 >>> 6)] +
            table[num3 & 0b111111];
    }
    var lastByte = length - i;
    if (lastByte === 1) {
        var lastNum1 = array[i];
        base64Str +=
            table[lastNum1 >>> 2] + table[(lastNum1 & 0b11) << 4] + "==";
    } else if (lastByte === 2) {
        // eslint-disable-next-line no-redeclare
        var lastNum1 = array[i];
        var lastNum2 = array[i + 1];
        base64Str +=
            table[lastNum1 >>> 2] +
            table[((lastNum1 & 0b11) << 4) | (lastNum2 >>> 4)] +
            table[(lastNum2 & 0b1111) << 2] +
            "=";
    }
    return base64Str;
}

//日期字符串转成时间戳
export function dateStrChangeTimeTamp(dateStr) {
    dateStr = dateStr.substring(0, 23);
    dateStr = dateStr.replace(/-/g, '/');
    return new Date(dateStr).getTime()
}

// 精准到毫秒
export function getNowTime(val) {
    const date = new Date(val)
    const hour = (date.getHours() - 8) < 10 ? '0' + (date.getHours() - 8) : date.getHours() - 8
    const minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    const second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    const milliSeconds = date.getMilliseconds() //毫秒
    const currentTime = hour + ':' + minute + ':' + second + '.' + milliSeconds
    // console.log(currentTime, val)
    return currentTime
}

export function getGcd(a, b) {
    let n1, n2;
    if (a > b) {
        n1 = a;
        n2 = b;
    } else {
        n1 = b;
        n2 = a;
    }
    let remainder = n1 % n2;
    if (remainder === 0) {
        return n2;
    } else {
        return getGcd(n2, remainder)
    }
}

/**
 * 秒数格式化成时分秒毫秒
 * @param value
 * @returns {string}
 */
export function formatSeconds(value) {
    let _strValue = String(value);
    let second = parseInt(value);
    let point = _strValue.split('.')[1];
    //  分
    let minute = 0
    //  小时
    let hour = 0
    if (second > 60) {
        //  获取分钟，除以60取整数，得到整数分钟
        minute = parseInt(second / 60)
        //  获取秒数，秒数取佘，得到整数秒数
        second = parseInt(second % 60)
        //  如果分钟大于60，将分钟转换成小时
        if (minute > 60) {
            hour = parseInt(minute / 60)
            minute = parseInt(minute % 60)
        }
    }

    if (point === '' || point === undefined || point === null) {
        point = '00';
    }

    if (String(point).length < 2) {
        second = '0' + second
    }

    if (String(second).length < 2) {
        second = '0' + second
    }

    if (minute > 0) {
        if (String(minute).length < 2) {
            minute = '0' + minute
        }
    } else {
        minute = "00";
    }

    if (hour > 0) {
        if (String(hour).length < 2) {
            hour = '0' + hour
        }
    } else {
        hour = "00";
    }
    return hour + ':' + minute + ':' + second + ':' + point;
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
