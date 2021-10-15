//将hash路由 转换为分级数组 '/demo/demoList' -> ['/demo', '/demo/demoList']
export const transUrlToList = (url) => {
    const urlList = url.split("/").filter(item => item)
    return urlList.map((item, index) => `/${urlList.slice(0, index + 1).join('/')}`)
}