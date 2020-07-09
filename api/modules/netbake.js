const CryptoJS = require('crypto-js')
const config = require('./config')
const request = require('request')
const querystring = require('querystring')
const URLSafeBase64 = require('./URLSafeBase64')
const format = require('date-format')

/**
 * 返回加盐后签名
 */
let encSign = (content) => {
    return CryptoJS.MD5(config.signKey + 'token' + config.token + 'content' + JSON.stringify(content) + config.signKey).toString()
}

//  AppKey从base64还原为字符串
let appKeyStr = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(config.appKey))
appKeyStr = appKeyStr.substring(0, 16)

let options = {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
}

/**
 * AES加密
 */
let encryptContent = (content) => {
    let encContent = (CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(JSON.stringify(content)), CryptoJS.enc.Utf8.parse(appKeyStr), options)).toString()
    return encContent
}

/**
 * AES解密
 */
let decryptContent = (content) => {
    let decContent = (CryptoJS.AES.decrypt(URLSafeBase64.decode(content), CryptoJS.enc.Utf8.parse(appKeyStr), options))
    return JSON.parse(CryptoJS.enc.Utf8.stringify(decContent))
}


/**
 * 一网烘焙加密接口请求函数封装
 */
let _req = (url, content) => {
    return new Promise((resolve, reject) => {
        //  组合url
        url = config.baseUrl + url

        //  判断内容
        content = content || {}

        //  给内容添加时间戳
        content.timestamp = format('yyyy-MM-dd hh:mm:ss', new Date())

        //  加密后的请求内容
        let encContent = URLSafeBase64.encode(encryptContent(content))

        //  加盐后的签名+内容
        let sign = encSign(content)

        //  请求参数
        let params = {
            token: config.token,
            sign: sign,
            content: encContent
        }

        //  请求参数反序列化
        let paramStrings = querystring.stringify(params)

        //  设置请求头
        let headers = {
            "Content-length": paramStrings.length,
            "Content-Type": "application/x-www-form-urlencoded"
        }

        //  向一网烘焙服务器发起请求 并讲结果通过Promise传出
        request.post({
            url,
            headers, 
            body: paramStrings

        }, (err, res, body) => { // POST请求成功

            let bodyObj = JSON.parse(JSON.parse(body))

            if (!err && res.statusCode == 200 && bodyObj.code === 0) {

                let decContent = decryptContent(bodyObj.content)

                resolve(decContent)

            } else {    // POST请求失败

                reject(bodyObj.msg)
            }
        })


    })
}

/**
 * 请求过程封装
 */
let netbakeRequest = (url, content) => {
    return new Promise((resolve, reject) => {
        _req(url, content)
            .then(res => {
                resolve({ code: 200, msg: 'ok', data: { result: res } })
            })
            .catch(err => {
                reject({ code: 400, msg: 'error', data: { result: err } })
            })
    })
}

module.exports = {
    netbakeRequest
}
