/**axios封装
 * 请求拦截、相应拦截、错误统一处理
 */
import { message, Modal } from "antd"
import axios from "axios"
import Cookies from "js-cookie"

const service = axios.create({
    baseURL: "/ajax/v1.0",
    timeout: 30000
})

// 请求拦截器
service.interceptors.request.use(
    (config) => {
        let csrftoken = Cookies.get("csrftoken")
        csrftoken && (config.headers["X-CSRFToken"] = csrftoken)
        return config
    },
    (error) => {
        switch (error.code) {
            default:
                message.error(error.msg)
        }
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    (response) => {
        // console.log('响应response', response)
        const data = response.data
        if (response.status === 200) {
            switch (data.code) {
                case 200:
                    return Promise.resolve(data)
                default:
                    message.error(data.msg)
                    return Promise.reject(data)
            }
        } else {
            message.error(data.msg)
            return Promise.reject(data)
        }
    },
    // 服务器状态码不是200的情况
    (error) => {
        // console.log('响应error', error, '响应error response', error.response)
        message.error(error.response.data)
        return Promise.reject(error.response.data)
    }
)

export { service as axios }
