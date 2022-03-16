/**
 * 将hash路由 转换为分级数组 '/demo/demoList' -> ['/demo', '/demo/demoList']
 * @param {*} url 
 * @returns 
 */
export const transUrlToList = (url) => {
    const urlList = url.split("/").filter(item => item)
    return urlList.map((item, index) => `/${urlList.slice(0, index + 1).join('/')}`)
}

/**
 * 获取url链接参数
 * @param {*} variable 获取的参数值
 * @param {*} url 链接地址
 * @returns 
 */
export const getQueryVariable = (variable, url = '') => {
    const urlParams = url.split("?")?.[1]
    const vars = urlParams.split("&");
    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}

/**
 * url链接参数转为对象
 * @param {*} url 链接地址
 * @returns 
 */
export const urlToJson = (url = '') => {
    let obj = {},
        index = url.indexOf('?'),
        params = url.substring(index + 1);

    if (index != -1) {
        let parr = params.split('&');
        for (let i of parr) {
            let arr = i.split('=');
            obj[arr[0]] = arr[1];
        }
    }
    return obj;
}


/**
 * 随机生成数字
 *
 * 示例：生成长度为 12 的随机数：randomNumber(12)
 * 示例：生成 3~23 之间的随机数：randomNumber(3, 23)
 *
 * @param1 最小值 | 长度
 * @param2 最大值
 * @return int 生成后的数字
 */
export function randomNumber() {
    // 生成 最小值 到 最大值 区间的随机数
    const random = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
    if (arguments.length === 1) {
        let [length] = arguments
        // 生成指定长度的随机数字，首位一定不是 0
        let nums = [...Array(length).keys()].map((i) => (i > 0 ? random(0, 9) : random(1, 9)))
        return parseInt(nums.join(''))
    } else if (arguments.length >= 2) {
        let [min, max] = arguments
        return random(min, max)
    } else {
        return Number.NaN
    }
}

/**
 * 随机生成字符串
 * @param length 字符串的长度
 * @param chats 可选字符串区间（只会生成传入的字符串中的字符）
 * @return string 生成的字符串
 */
export function randomString(length, chats) {
    if (!length) length = 1
    if (!chats) chats = '0123456789qwertyuioplkjhgfdsazxcvbnm'
    let str = ''
    for (let i = 0; i < length; i++) {
        let num = randomNumber(0, chats.length - 1)
        str += chats[num]
    }
    return str
}

/**
 * 随机生成uuid
 * @return string 生成的uuid
 */
export function randomUUID() {
    let chats = '0123456789abcdef'
    return randomString(32, chats)
}