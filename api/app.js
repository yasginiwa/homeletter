const Koa = require('koa')
const router = require('koa-router')()
const routes = require('./routes/index')
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors')
const https = require('https')
const fs = require('fs')
const request = require('request')
const { setInterval } = require('core-js')

//  https密钥配置选项
let options = {
    key: fs.readFileSync('certs/express.hgsp.cn.key', 'utf-8'),
    cert: fs.readFileSync('certs/express.hgsp.cn.pem', 'utf-8')
}
    
let app = new Koa()

app.use(cors())

app.use(bodyParser())

router.use('/', routes)

app.use(router.routes())
    .use(router.allowedMethods())

//  由于接口长时间不调用 首次调用时卡顿
setInterval(() => {
    request.post({
        headers: 'application/json',
        url: 'https://express.hgsp.cn:10447/postinfoquery',
        json: true,
        body: {
            postid: 'R20190003513077487'
        }
    }, (err, res) => {
        console.log('keepAlive--- 1分钟1次')
    })
}, 60 * 1000)




//  http服务
// app.listen(10447)

//  https服务
https.createServer(options, app.callback()).listen(10447);