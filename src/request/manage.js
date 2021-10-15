import { axios } from './http';

export function getAction(url, params) {
    return axios({
        url,
        method: 'get',
        params: params
    })
}

export function postAction(url, params) {
    return axios({
        url,
        method: 'post',
        data: params
    })
}

export function putAction(url, params) {
    return axios({
        url,
        method: 'put',
        data: params
    })
}

export function deleteAction(url, params) {
    return axios({
        url,
        method: 'delete',
        data: params
    })
}

export function httpAction(url, params, method, headers) {
    return axios({
        url,
        method,
        data: params,
        headers
    })
}

export function formDataAction(url, data) {
    return axios({
        url,
        method: 'post',
        headers: {
            'content-type': 'multipart/form-data'
        },
        data,
    })
}


