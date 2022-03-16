//将hash路由 转换为分级数组 '/demo/demoList' -> ['/demo', '/demo/demoList']
export const transUrlToList = (url) => {
    const urlList = url.split("/").filter(item => item)
    return urlList.map((item, index) => `/${urlList.slice(0, index + 1).join('/')}`)
}

//获取url链接参数
export const getQueryVariable = (variable, url = '') => {
    const urlParams = url.split("?")?.[1]
    const vars = urlParams.split("&");
    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}

//url链接参数转为对象
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