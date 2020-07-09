const router = require('koa-router')()
const netbake = require('../modules/netbake')


/**
 * 一网烘焙查询邮寄信息请求
 */
router.post('postinfoquery', async (ctx, next) => {

    //  利用bodyParser中间件 获取请求体中的参数 content
    let content = ctx.request.body

    let url = ctx.request.url

    ctx.response.body = await netbake.netbakeRequest(url, content).catch(err => ctx.response.body = err)

    next()
})

/**
 * 一网烘焙虚拟券查询接口
 */
router.post('tmticketquery', async(ctx, next) => {

    let content = ctx.request.body

    let url = ctx.request.url

    ctx.response.body = await netbake.netbakeRequest(url, content).catch(err => ctx.response.body = err)

    next()
})


/**
 * 一网烘焙更新邮寄信息请求
 */
router.post('postinfoupdate', async (ctx, next) => {

    let content = ctx.request.body

    let url = ctx.request.url

    ctx.response.body = await netbake.netbakeRequest(url, content).catch(err => ctx.response.body = err)

    next()
})



module.exports = router.routes()