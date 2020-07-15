const CryptoJS = require('crypto-js')
const config = require('./config')
const request = require('request')
const querystring = require('querystring')
const URLSafeBase64 = require('./URLSafeBase64')
const format = require('date-format')
const { type } = require('os')

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
    decContent = CryptoJS.enc.Utf8.stringify(decContent)

    if (decContent.indexOf('{') == 0) { //  解密结果字符串含'{}'标识 直接序列化
        return JSON.parse(CryptoJS.enc.Utf8.stringify(decContent))
    } else {    //  解密结果字符串不含'{}'标识 加上后再序列化
        return JSON.parse('{' + decContent + '}')
    }
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

        }, (err, res, body) => { // 发送POST请求

            let bodyObj = JSON.parse(body)

            //  判断bodyObj是否是对象
            let objFlag = !(bodyObj instanceof Array) && typeof bodyObj == 'object'

            //  如果bodyObj不是对象 且 存在返回code(code成功为0 所有取反为真) 且 code为0时 才是请求成功
            if (!objFlag && !JSON.parse(bodyObj).code && JSON.parse(bodyObj).code === 0) { //  POST请求成功

                //  由于跨域问题 返回的字符串带转义符 需序列化2次才能得到 body 对象
                resObject = JSON.parse(bodyObj)

                let decContent = decryptContent(resObject.content)

                console.log('success---')
                console.log(decContent)
                resolve(decContent)

            } else {    // POST请求失败

                console.log('fail---')
                console.log(bodyObj)
                reject(bodyObj.Message || reject(JSON.parse(bodyObj).msg))

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
