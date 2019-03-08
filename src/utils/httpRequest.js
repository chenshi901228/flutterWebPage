import axios from 'axios'

const baseUrl = "http://localhost:3001"


/**
 * @param {string} url 接口地址
 * @param {string} method 请求方法：get、post
 * @param {string} token 请求token
 * @param {Object} [params={}] body的请求参数，默认为空
 * @return 返回Promise
 */

export async function httpRequest(url, method, params = {}, token = "") {
    return await axios({
        method: method,
        url: baseUrl + url,
        data: params,
        headers: { "Authorization": "Bearer " + token }
    })
        .then(res => { return res })
        .catch(error => { return error.response })
}